import getMongoClientPromise from "@/lib/mongodb";
import { connectDB } from "@/lib/db";
import { sendAccountDeletedEmail } from "@/lib/emails/send-meeting-email";
import { cancelScheduledMeetingSilently } from "@/lib/meetings";
import { User, type UserDocument } from "@/models/User";

const HOSTING_AGREEMENT_WINDOW_MS = 365 * 24 * 60 * 60 * 1000;

export async function getUserByMail(mail: string): Promise<UserDocument | null> {
  await connectDB();
  const user = await User.findOne({ mail: mail.toLowerCase() })
    .select("-webpageAgreementPdf")
    .lean();
  return user as UserDocument | null;
}

export async function updateUserTimezone(
  mail: string,
  timezone: string,
): Promise<void> {
  await connectDB();
  await User.updateOne({ mail: mail.toLowerCase() }, { $set: { timezone } });
}

export async function upsertUserFromAuth({
  mail,
  name,
  profilePicture,
}: {
  mail: string;
  name?: string | null;
  profilePicture?: string | null;
}): Promise<UserDocument> {
  await connectDB();

  const existing = await User.findOne({ mail: mail.toLowerCase() });

  if (existing) {
    if (name && !existing.name) {
      existing.name = name;
    }

    if (profilePicture) {
      existing.profilePicture = profilePicture;
    }

    if (existing.level === "NoPay") {
      existing.level = "1.1";
      existing.levelUpdatedAt = new Date();
    }

    await existing.save();
    return existing.toObject() as UserDocument;
  }

  const created = await User.create({
    mail: mail.toLowerCase(),
    name: name ?? undefined,
    profilePicture: profilePicture ?? undefined,
    level: "1.1",
    levelUpdatedAt: new Date(),
    transactions: [],
  });

  return created.toObject() as UserDocument;
}

export function hasDashboardAccess(user: UserDocument | null): boolean {
  return Boolean(user && user.level !== "NoPay");
}

function getPdfByteLength(pdf: unknown): number {
  if (!pdf) {
    return 0;
  }

  if (Buffer.isBuffer(pdf)) {
    return pdf.length;
  }

  if (pdf instanceof Uint8Array) {
    return pdf.byteLength;
  }

  if (typeof pdf === "object") {
    const binary = pdf as { buffer?: unknown; length?: number };

    if (Buffer.isBuffer(binary.buffer)) {
      return binary.buffer.length;
    }

    if (binary.buffer instanceof Uint8Array) {
      return binary.buffer.byteLength;
    }

    if (typeof binary.length === "number") {
      return binary.length;
    }
  }

  return 0;
}

export function hasWebpageAgreementPdf(user: UserDocument | null): boolean {
  return getPdfByteLength(user?.webpageAgreementPdf) > 0;
}

/** @deprecated Use hasDashboardAccess instead */
export function isPaidUser(user: UserDocument | null): boolean {
  return hasDashboardAccess(user);
}

export function hasSuccessfulPurchase(user: UserDocument | null): boolean {
  return Boolean(
    user?.transactions.some((transaction) => transaction.successful),
  );
}

export function hasActiveHostingAgreement(user: UserDocument | null): boolean {
  if (!user) {
    return false;
  }

  const cutoff = Date.now() - HOSTING_AGREEMENT_WINDOW_MS;

  return user.transactions.some(
    (transaction) =>
      transaction.successful && new Date(transaction.time).getTime() >= cutoff,
  );
}

export async function deleteUserAccount(mail: string): Promise<void> {
  await connectDB();

  const user = await User.findOne({ mail: mail.toLowerCase() });
  const normalizedMail = mail.toLowerCase();

  if (user?.meetingSlotId || user?.scheduledMeetingAt) {
    await cancelScheduledMeetingSilently(normalizedMail);
  }

  try {
    await sendAccountDeletedEmail({ to: normalizedMail });
  } catch (error) {
    console.error("Failed to send account deleted email:", error);
  }

  await User.deleteOne({ mail: normalizedMail });

  const client = await getMongoClientPromise();
  const db = client.db();
  const authUser = await db
    .collection("auth_users")
    .findOne({ email: normalizedMail });

  if (!authUser) {
    return;
  }

  await db.collection("auth_accounts").deleteMany({ userId: authUser._id });
  await db.collection("auth_sessions").deleteMany({ userId: authUser._id });
  await db.collection("auth_users").deleteOne({ _id: authUser._id });
}
