import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/pw/LoginForm";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { hasDashboardAccess, getUserByMail } from "@/lib/users";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for your personal trainer website package.",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    verify?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";

  if (session?.user?.email) {
    const user = await getUserByMail(session.user.email);

    if (hasDashboardAccess(user)) {
      redirect("/dashboard");
    }

    redirect(callbackUrl);
  }

  return (
    <LoginForm
      callbackUrl={callbackUrl}
      showVerifyMessage={params.verify === "1"}
      authError={getAuthErrorMessage(params.error)}
    />
  );
}
