import { AdminSection } from "@/components/admin/AdminSection";
import { formatMeetingTimeAdmin } from "@/lib/meeting-format";
import type { AdminUserRow } from "@/lib/admin-data";

type AdminUserDataProps = {
  users: AdminUserRow[];
};

export default function AdminUserData({ users }: AdminUserDataProps) {
  return (
    <AdminSection
      title="User data"
      description="All users registered on the website."
    >
      {users.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No users yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Level</th>
                <th className="pb-3 font-medium">Level last updated</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={`${user.localPart}@${user.domain}`}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-0.5">
                      <span className="select-none blur-[3px]">{user.localPart}</span>
                      <span>@{user.domain}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium">{user.level}</td>
                  <td className="py-3 text-muted">
                    {formatMeetingTimeAdmin(new Date(user.levelUpdatedAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminSection>
  );
}
