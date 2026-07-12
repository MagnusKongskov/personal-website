import MeetingScheduler from "@/components/dashboard/MeetingScheduler";
import PaymentButton from "@/components/dashboard/PaymentButton";
import ScheduledMeetingInfo from "@/components/dashboard/ScheduledMeetingInfo";
import WebpageAgreementButton from "@/components/dashboard/WebpageAgreementButton";
import {
  PW_LEVEL_GROUPS,
  getSublevelStatus,
  type SublevelDefinition,
  type SublevelStatus,
} from "@/lib/pw-levels";

function CheckmarkIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SublevelCard({
  sublevel,
  status,
  color,
  userLevel,
  scheduledMeetingAt,
  joinUrl,
}: {
  sublevel: SublevelDefinition;
  status: SublevelStatus;
  color: string;
  userLevel: string;
  scheduledMeetingAt?: string;
  joinUrl: string;
}) {
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const showBookMeeting =
    sublevel.id === "1.2" &&
    (userLevel === "1.1" || userLevel === "1.2") &&
    !scheduledMeetingAt;
  const showScheduledMeeting =
    sublevel.id === "1.3" &&
    userLevel === "1.3" &&
    Boolean(scheduledMeetingAt);
  const showWebpageAgreement =
    sublevel.id === "1.3.1" && userLevel === "1.3.1";
  const showPayment = sublevel.id === "1.3.2" && userLevel === "1.3.2";
  const isActiveStep =
    status === "current" || showBookMeeting || showScheduledMeeting || showWebpageAgreement || showPayment;

  return (
    <div
      className={[
        "relative rounded-2xl border p-5 transition-all sm:p-6",
        isCompleted && !showScheduledMeeting && !showWebpageAgreement && !showPayment ? "opacity-70 blur-[0.4px]" : "",
        isLocked ? "pointer-events-none opacity-40 blur-[1px]" : "",
        isActiveStep
          ? "ring-1 ring-white/20"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderColor: color,
        backgroundColor: `${color}14`,
      }}
    >
      {isCompleted && !showScheduledMeeting && !showWebpageAgreement && !showPayment ? (
        <div className="absolute right-4 top-4">
          <CheckmarkIcon color={color} />
        </div>
      ) : null}

      <p className="text-sm font-medium" style={{ color }}>
        Level {sublevel.id}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">{sublevel.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-base">
        {sublevel.content}
      </p>

      {showBookMeeting ? (
        <MeetingScheduler color={color} mode="schedule" />
      ) : null}

      {showScheduledMeeting && scheduledMeetingAt ? (
        <ScheduledMeetingInfo
          color={color}
          meetingAt={scheduledMeetingAt}
          joinUrl={joinUrl}
        />
      ) : null}

      {showWebpageAgreement ? <WebpageAgreementButton color={color} /> : null}

      {showPayment ? <PaymentButton color={color} /> : null}
    </div>
  );
}

type DashboardLevelsProps = {
  userLevel: string;
  scheduledMeetingAt?: string;
  joinUrl: string;
};

export default function DashboardLevels({
  userLevel,
  scheduledMeetingAt,
  joinUrl,
}: DashboardLevelsProps) {
  return (
    <div className="space-y-12">
      {PW_LEVEL_GROUPS.map((group) => (
        <section key={group.id}>
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: group.color }}
          >
            {group.title}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {group.sublevels.map((sublevel) => (
              <SublevelCard
                key={sublevel.id}
                sublevel={sublevel}
                status={getSublevelStatus(userLevel, sublevel.id)}
                color={group.color}
                userLevel={userLevel}
                scheduledMeetingAt={scheduledMeetingAt}
                joinUrl={joinUrl}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
