import Link from "next/link";
import { AdminSection } from "@/components/admin/AdminSection";
import AdminMeetingActions from "@/components/admin/AdminMeetingActions";
import { formatMeetingTimeAdmin } from "@/lib/meeting-format";
import type { AdminScheduledMeeting } from "@/lib/admin-data";

type AdminScheduledMeetingsProps = {
  meetings: AdminScheduledMeeting[];
};

export default function AdminScheduledMeetings({
  meetings,
}: AdminScheduledMeetingsProps) {
  return (
    <AdminSection
      title="Scheduled meetings"
      description="All meetings booked by customers."
    >
      {meetings.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No scheduled meetings.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {meetings.map((meeting) => (
            <li
              key={`${meeting.email}-${meeting.meetingTime.toISOString()}`}
              className="rounded-xl border border-border bg-background px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium">{meeting.email}</p>
                  <p className="text-sm text-muted">{meeting.name}</p>
                  <p className="text-sm text-muted">
                    {formatMeetingTimeAdmin(new Date(meeting.meetingTime))}
                  </p>
                </div>
                <Link
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 rounded-full border border-transparent bg-secondary px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Join
                </Link>
              </div>
              <p className="mt-3 truncate text-xs text-muted">
                <Link
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors hover:text-foreground"
                >
                  {meeting.meetingLink}
                </Link>
              </p>
              <AdminMeetingActions meeting={meeting} />
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  );
}
