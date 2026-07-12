import { color2 } from "@/components/pw/colors";
import { getUserLevelIndex } from "@/lib/pw-levels";

const SUBTLE_PANEL_CLASS =
  "rounded-xl border border-white/15 bg-white/[0.04]";

const ANALYTICS_STATS = [
  { label: "Total visitors", value: 0 },
  { label: "Visits this week", value: 0 },
  { label: "Google ad spend", value: 0 },
  { label: "Clicks by google ads", value: 0 },
] as const;

type DashboardAnalyticsProps = {
  userLevel: string;
};

export default function DashboardAnalytics({ userLevel }: DashboardAnalyticsProps) {
  const analyticsUnlocked =
    getUserLevelIndex(userLevel) >= getUserLevelIndex("2.1");

  return (
    <section>
      <h2
        className="text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: color2 }}
      >
        Analytics
      </h2>

      <div className="mt-6 flex gap-3 overflow-x-auto">
        {ANALYTICS_STATS.map((stat) => (
          <div
            key={stat.label}
            className={[
              "min-w-0 flex-1 px-4 py-4",
              SUBTLE_PANEL_CLASS,
              analyticsUnlocked ? "" : "pointer-events-none select-none blur-xs",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <p className="text-sm font-medium text-white/70">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
