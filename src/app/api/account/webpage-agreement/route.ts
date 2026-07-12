import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({
    mail: session.user.email.toLowerCase(),
  }).select({ webpageAgreementPdf: 1 });

  if (!user?.webpageAgreementPdf?.length) {
    return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(user.webpageAgreementPdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="webpage-agreement.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
