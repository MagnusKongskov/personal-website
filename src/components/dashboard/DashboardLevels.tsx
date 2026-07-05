import CalendlyBookButton from "@/components/CalendlyBookButton";
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
}: {
  sublevel: SublevelDefinition;
  status: SublevelStatus;
  color: string;
}) {
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  return (
    <div
      className={[
        "relative rounded-2xl border p-5 transition-all sm:p-6",
        isCompleted ? "opacity-70 blur-[0.4px]" : "",
        isLocked ? "pointer-events-none opacity-40 blur-[1px]" : "",
        status === "current" ? "ring-1 ring-white/20" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderColor: color,
        backgroundColor: `${color}14`,
      }}
    >
      {isCompleted ? (
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
      {sublevel.showBookMeetingButton && status === "current" ? (
        <div className="mt-4 flex justify-center">
          <CalendlyBookButton color={color} />
        </div>
      ) : null}
    </div>
  );
}

type DashboardLevelsProps = {
  userLevel: string;
};

export default function DashboardLevels({ userLevel }: DashboardLevelsProps) {
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
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
