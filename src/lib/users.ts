import { connectDB } from "@/lib/db";
import { User, type UserDocument } from "@/models/User";

export async function getUserByMail(mail: string): Promise<UserDocument | null> {
  await connectDB();
  const user = await User.findOne({ mail: mail.toLowerCase() }).lean();
  return user as UserDocument | null;
}

export async function upsertUserFromAuth({
  mail,
  name,
}: {
  mail: string;
  name?: string | null;
}): Promise<UserDocument> {
  await connectDB();

  const existing = await User.findOne({ mail: mail.toLowerCase() });

  if (existing) {
    if (name && !existing.name) {
      existing.name = name;
    }

    if (existing.level === "NoPay") {
      existing.level = "1.1";
    }

    await existing.save();
    return existing.toObject() as UserDocument;
  }

  const created = await User.create({
    mail: mail.toLowerCase(),
    name: name ?? undefined,
    level: "1.1",
    transactions: [],
  });

  return created.toObject() as UserDocument;
}

export function hasDashboardAccess(user: UserDocument | null): boolean {
  return Boolean(user && user.level !== "NoPay");
}

/** @deprecated Use hasDashboardAccess instead */
export function isPaidUser(user: UserDocument | null): boolean {
  return hasDashboardAccess(user);
}
