import { color1 } from "@/components/pw/colors";

type WebpageStatus = "online" | "down" | "not-ready";

const SUBTLE_PANEL_CLASS =
  "rounded-xl border border-white/15 bg-white/[0.04]";

const STATUS_CONFIG: Record<
  WebpageStatus,
  { dotColor: string; label: string }
> = {
  online: {
    dotColor: "#22c55e",
    label: "Your website is online",
  },
  down: {
    dotColor: "#ef4444",
    label: "Your website is temporarily down",
  },
  "not-ready": {
    dotColor: "#f97316",
    label: "Your website is not ready yet",
  },
};

function StatusIndicator({ status }: { status: WebpageStatus }) {
  const { dotColor, label } = STATUS_CONFIG[status];

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 ${SUBTLE_PANEL_CLASS}`}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: dotColor }}
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}

type DashboardWebpageProps = {
  userLevel: string;
};

export default function DashboardWebpage({ userLevel }: DashboardWebpageProps) {
  void userLevel;
  const status: WebpageStatus = "not-ready";

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: color1 }}
        >
          Your webpage
        </h2>
        <StatusIndicator status={status} />
      </div>

      <div
        className={`mx-auto mt-10 w-fit max-w-sm px-4 py-5 sm:px-5 ${SUBTLE_PANEL_CLASS}`}
      >
        <h3 className="text-base font-semibold text-white">
          Your webpage is not ready yet
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          Your webpage will be shown here once you have completed level 1.4.
        </p>
      </div>
    </section>
  );
}
