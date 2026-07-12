"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { createPwCheckoutSession } from "@/lib/stripe";
import { getUserByMail, hasWebpageAgreementPdf } from "@/lib/users";
import { User, type UserDocument } from "@/models/User";

async function getOrigin(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}

export async function agreeAndCheckoutAction() {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in." };
  }

  const user = await getUserByMail(session.user.email);

  if (!user || user.level !== "1.3.1") {
    return { error: "You cannot accept the agreement at this stage." };
  }

  await connectDB();

  const pdfUser = await User.findOne({
    mail: session.user.email.toLowerCase(),
  })
    .select({ webpageAgreementPdf: 1 })
    .lean();

  if (!hasWebpageAgreementPdf(pdfUser as UserDocument | null)) {
    return { error: "No webpage agreement is available yet." };
  }

  await User.updateOne(
    { mail: session.user.email.toLowerCase() },
    {
      $set: {
        level: "1.3.2",
        levelUpdatedAt: new Date(),
        userAgreedToWebpageDate: new Date(),
      },
    },
  );

  try {
    const url = await createPwCheckoutSession({
      email: session.user.email,
      userId: session.user.id,
      origin: await getOrigin(),
    });

    revalidatePath("/dashboard");
    return { url };
  } catch {
    return { error: "Failed to start checkout. Please try again." };
  }
}

export async function startPaymentAction() {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in." };
  }

  const user = await getUserByMail(session.user.email);

  if (!user || user.level !== "1.3.2") {
    return { error: "You cannot complete payment at this stage." };
  }

  try {
    const url = await createPwCheckoutSession({
      email: session.user.email,
      userId: session.user.id,
      origin: await getOrigin(),
    });

    return { url };
  } catch {
    return { error: "Failed to start checkout. Please try again." };
  }
}
