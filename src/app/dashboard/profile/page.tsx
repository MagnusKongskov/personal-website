import Link from "next/link";
import { auth } from "@/auth";
import Container from "@/components/Container";
import DeleteAccountSection from "@/components/dashboard/DeleteAccountSection";
import LogoutButton from "@/components/dashboard/LogoutButton";
import ProfileAvatar from "@/components/dashboard/ProfileAvatar";
import ProfileTransactions from "@/components/dashboard/ProfileTransactions";
import {
  getUserByMail,
  hasActiveHostingAgreement,
} from "@/lib/users";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Account",
  description: "Manage your account, view transactions, and log out.",
};

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const user = email ? await getUserByMail(email) : null;
  const transactions = user?.transactions ?? [];
  const hasActiveHosting = hasActiveHostingAgreement(user);

  return (
    <>
      <section className="py-10 sm:py-12">
        <Container>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span>
            Back to dashboard
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <ProfileAvatar
                name={user?.name}
                profilePicture={user?.profilePicture ?? session?.user?.image}
                size="lg"
              />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Manage account
                </h1>
                <p className="mt-1 text-sm text-white/60">{email}</p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </Container>
      </section>

      <section className="pb-12 sm:pb-16">
        <Container className="space-y-6">
          <ProfileTransactions transactions={transactions} />

          {user?.userAgreedToWebpageDate ? (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">
                Webpage agreement
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Agreed on{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(user.userAgreedToWebpageDate))}
              </p>
            </section>
          ) : null}

          <DeleteAccountSection hasActiveHosting={hasActiveHosting} />
        </Container>
      </section>
    </>
  );
}
