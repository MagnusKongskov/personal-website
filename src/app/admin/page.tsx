import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import AdminAddMeetingSlots from "@/components/admin/AdminAddMeetingSlots";
import AdminScheduledMeetings from "@/components/admin/AdminScheduledMeetings";
import AdminUserData from "@/components/admin/AdminUserData";
import { AdminContainer } from "@/components/admin/AdminSection";
import { isAdminEmail } from "@/lib/admin";
import {
  getAllUsersForAdmin,
  getScheduledMeetingsForAdmin,
} from "@/lib/admin-data";
import { getAdminOpenSlots } from "@/lib/meetings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage meetings and users.",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login?callbackUrl=/admin");
  }

  if (!isAdminEmail(session.user.email)) {
    redirect("/admin/login?callbackUrl=/admin&error=AccessDenied");
  }

  const [meetings, users, availableSlots] = await Promise.all([
    getScheduledMeetingsForAdmin(),
    getAllUsersForAdmin(),
    getAdminOpenSlots(),
  ]);

  return (
    <AdminContainer>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Admin
          </h1>
          <p className="mt-2 text-sm text-muted">
            Signed in as {session.user.email}
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <AdminScheduledMeetings meetings={meetings} />
        <AdminAddMeetingSlots
          slots={availableSlots.map((slot) => ({
            id: String(slot._id),
            startTime: new Date(slot.startTime).toISOString(),
            hidden: Boolean(slot.hidden),
            slotType: slot.slotType ?? "normal",
          }))}
        />
        <AdminUserData users={users} />
      </div>
    </AdminContainer>
  );
}
