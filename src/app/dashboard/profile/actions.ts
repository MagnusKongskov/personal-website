"use server";

import { auth, signOut } from "@/auth";
import {
  deleteUserAccount,
  getUserByMail,
  hasActiveHostingAgreement,
} from "@/lib/users";

export async function deleteAccountAction(
  confirmation: string,
): Promise<{ error?: string } | void> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in." };
  }

  if (confirmation !== "DELETE") {
    return { error: 'Please type "DELETE" to confirm.' };
  }

  const user = await getUserByMail(session.user.email);

  if (hasActiveHostingAgreement(user)) {
    return {
      error:
        "Your account has an active hosting agreement. Please contact support to delete your account.",
    };
  }

  await deleteUserAccount(session.user.email);
  await signOut({ redirectTo: "/pw" });
}
