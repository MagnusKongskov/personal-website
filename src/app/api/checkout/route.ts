import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY);

type CheckoutRequestBody = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  url?: string;
  message?: string;
  phoneIncluded?: boolean;
  agreedToTerms?: boolean;
};

function formatField(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "blank";
}

function buildEmailBody(data: CheckoutRequestBody): string {
  return [
    "Type: BuyButtonPressed",
    `Name: ${formatField(data.name)}`,
    `Email: ${formatField(data.email)}`,
    `Company Name: ${formatField(data.company)}`,
    `Phone: ${formatField(data.phone)}`,
    `URL: ${formatField(data.url)}`,
    `Message: ${formatField(data.message)}`,
    `Phone included: ${data.phoneIncluded ?? false}`,
    `Agreed to terms: ${data.agreedToTerms ?? false}`,
  ].join("\n");
}

async function getDefaultPriceId(
  stripe: Stripe,
  productId: string,
): Promise<string> {
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 1,
  });

  const price = prices.data[0];

  if (!price) {
    throw new Error(`No active price found for product ${productId}`);
  }

  return price.id;
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payment service is not configured." },
      { status: 500 },
    );
  }

  let body: CheckoutRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const url = body.url?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "Please add your name." },
      { status: 400 },
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "Please add an email." },
      { status: 400 },
    );
  }

  if (!url) {
    return NextResponse.json(
      { error: "Please add your webpage link." },
      { status: 400 },
    );
  }

  if (!body.agreedToTerms) {
    return NextResponse.json(
      {
        error:
          "Please agree to the terms & privacy before making a purchase.",
      },
      { status: 400 },
    );
  }

  const { error: notificationError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "contactform@magnuskongskov.dk",
    to: "primary@magnuskongskov.dk",
    subject: "Buy Button Pressed",
    text: buildEmailBody(body),
  });

  if (notificationError) {
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 },
    );
  }

  const productId = body.phoneIncluded
    ? process.env.STRIPE_PRODUCT_ID_REVIEW_PHONE
    : process.env.STRIPE_PRODUCT_ID_REVIEW;

  if (!productId) {
    return NextResponse.json(
      { error: "Payment product is not configured." },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const priceId = await getDefaultPriceId(stripe, productId);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/ty?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#contact`,
      metadata: {
        name,
        email,
        url,
        company: body.company?.trim() ?? "",
        phone: body.phone?.trim() ?? "",
        message: body.message?.trim() ?? "",
        phoneIncluded: String(body.phoneIncluded ?? false),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Failed to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
