import Stripe from "stripe";

export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function getCheckoutInvoiceUrl(
  stripeSessionId: string,
): Promise<string | null> {
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
    expand: ["invoice", "payment_intent.latest_charge"],
  });

  if (session.invoice && typeof session.invoice !== "string") {
    return (
      session.invoice.invoice_pdf ??
      session.invoice.hosted_invoice_url ??
      null
    );
  }

  const paymentIntent = session.payment_intent;

  if (paymentIntent && typeof paymentIntent !== "string") {
    const charge = paymentIntent.latest_charge;

    if (charge && typeof charge !== "string" && charge.receipt_url) {
      return charge.receipt_url;
    }
  }

  return null;
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

export async function createPwCheckoutSession({
  email,
  userId,
  origin,
}: {
  email: string;
  userId?: string;
  origin: string;
}): Promise<string> {
  const productId = process.env.STRIPE_PRODUCT_ID_PW;

  if (!productId) {
    throw new Error("STRIPE_PRODUCT_ID_PW is not configured.");
  }

  const stripe = getStripeClient();
  const priceId = await getDefaultPriceId(stripe, productId);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    invoice_creation: { enabled: true },
    success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard`,
    metadata: {
      productType: "pw",
      userId: userId ?? "",
      email,
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session.");
  }

  return checkoutSession.url;
}
