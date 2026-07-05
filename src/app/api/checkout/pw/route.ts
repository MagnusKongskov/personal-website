import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";

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
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payment service is not configured." },
      { status: 500 },
    );
  }

  const productId = process.env.STRIPE_PRODUCT_ID_PW;

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

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pw/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ta`,
      metadata: {
        productType: "pw",
        userId: session.user.id,
        email: session.user.email,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch {
    return NextResponse.json(
      { error: "Failed to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
