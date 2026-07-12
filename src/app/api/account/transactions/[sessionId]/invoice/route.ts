import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCheckoutInvoiceUrl } from "@/lib/stripe";
import { getUserByMail } from "@/lib/users";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { sessionId } = await context.params;
  const user = await getUserByMail(session.user.email);

  const ownsTransaction = user?.transactions.some(
    (transaction) =>
      transaction.stripeSessionId === sessionId && transaction.successful,
  );

  if (!ownsTransaction) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  try {
    const invoiceUrl = await getCheckoutInvoiceUrl(sessionId);

    if (!invoiceUrl) {
      return NextResponse.json(
        { error: "Invoice is not available for this transaction." },
        { status: 404 },
      );
    }

    return NextResponse.redirect(invoiceUrl);
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve invoice." },
      { status: 500 },
    );
  }
}
