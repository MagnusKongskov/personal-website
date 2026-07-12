import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { isAdminEmail } from "@/lib/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Sign in to the admin dashboard.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    verify?: string;
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin";

  if (session?.user?.email && isAdminEmail(session.user.email)) {
    redirect(callbackUrl);
  }

  return (
    <AdminLoginForm
      callbackUrl={callbackUrl}
      showVerifyMessage={params.verify === "1"}
      authError={getAuthErrorMessage(params.error)}
    />
  );
}
