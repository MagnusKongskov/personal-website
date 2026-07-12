import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPwCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const url = await createPwCheckoutSession({
      email: session.user.email,
      userId: session.user.id,
      origin,
    });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Failed to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
