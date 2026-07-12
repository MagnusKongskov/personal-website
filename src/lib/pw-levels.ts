import { color1, color2, color3 } from "@/components/pw/colors";

export type SublevelDefinition = {
  id: string;
  timing: string;
  title: string;
  content: string;
  /** Only shown on the marketing /pw page */
  showOnMarketingPage?: boolean;
  /** Horizontal anchor for arrows on the marketing page (0–100). */
  anchor?: number;
  /** Left margin for the box on the marketing page, as % of container width. */
  shift?: number;
  showSignUpButton?: boolean;
  showBookMeetingButton?: boolean;
};

export type LevelGroupDefinition = {
  id: string;
  title: string;
  color: string;
  sublevels: SublevelDefinition[];
};

export const SUBLEVEL_ORDER = [
  "1.1",
  "1.2",
  "1.3",
  "1.3.1",
  "1.3.2",
  "1.3.9",
  "1.4",
  "2.1",
  "2.2",
  "2.3",
  "3.1",
] as const;

export type SublevelId = (typeof SUBLEVEL_ORDER)[number];

export const PW_LEVEL_GROUPS: LevelGroupDefinition[] = [
  {
    id: "1",
    title: "Level 1",
    color: color1,
    sublevels: [
      {
        id: "1.1",
        timing: "Today",
        title: "Sign up",
        content:
          "Take the first step towards your website by creating an account.",
        anchor: 26,
        shift: 0,
        showOnMarketingPage: true,
        showSignUpButton: true,
      },
      {
        id: "1.2",
        timing: "3 minutes away",
        title: "Book meeting",
        content:
          "Find room in your calendar for a 30 minute meeting.",
        anchor: 74,
        shift: 28,
        showOnMarketingPage: true,
        showBookMeetingButton: true,
      },
      {
        id: "1.3",
        timing: "2-3 days away",
        title: "Design call",
        content:
          "30 minute call where we discuss the design and features of your website.",
        anchor: 48,
        shift: 16,
        showOnMarketingPage: true,
      },
      {
        id: "1.3.1",
        timing: "After design call",
        title: "Accept webpage agreement",
        content:
          "Accept the webpage agreement to get your webpage online.",
        showOnMarketingPage: false,
      },
      {
        id: "1.3.2",
        timing: "After design call",
        title: "Payment",
        content: "Complete your payment to lock in your package and move forward.",
        showOnMarketingPage: false,
      },
      {
        id: "1.4",
        timing: "5-7 days away",
        title: "Website is online",
        content:
          "Your website is now online and you can start leaving an online footprint.",
        showOnMarketingPage: true,
      },
    ],
  },
  {
    id: "2",
    title: "Level 2",
    color: color2,
    sublevels: [
      {
        id: "2.1",
        timing: "7-10 days away",
        title: "Start running Google ads",
        content:
          "We will start to run ads to get even more customers to your website.",
        anchor: 84,
        shift: 36,
        showOnMarketingPage: true,
      },
      {
        id: "2.2",
        timing: "14-28 days away",
        title: "First customer from ads",
        content: "You will get your first customer from Google ads.",
        anchor: 16,
        shift: 0,
        showOnMarketingPage: true,
      },
      {
        id: "2.3",
        timing: "1-2 months away",
        title: "Ads optimization",
        content:
          "Google ads have now figured out how to target your exact customer. Getting customers via Google ads will be even cheaper.",
        anchor: 62,
        shift: 22,
        showOnMarketingPage: true,
      },
    ],
  },
  {
    id: "3",
    title: "Level 3",
    color: color3,
    sublevels: [
      {
        id: "3.1",
        timing: "2-3 months away",
        title: "Organic search visibility",
        content:
          "You will now automatically show up in Google searches, and may even be shown in AI searches.",
        anchor: 36,
        shift: 8,
        showOnMarketingPage: true,
      },
    ],
  },
];

export const MARKETING_LEVELS = PW_LEVEL_GROUPS.flatMap((group) =>
  group.sublevels.filter((sublevel) => sublevel.showOnMarketingPage !== false),
);

export function getSublevelIndex(sublevelId: string): number {
  return SUBLEVEL_ORDER.indexOf(sublevelId as SublevelId);
}

export function getUserLevelIndex(level: string): number {
  if (level === "NoPay") {
    return -1;
  }

  const index = getSublevelIndex(level);
  return index === -1 ? -1 : index;
}

export type SublevelStatus = "completed" | "current" | "locked";

export const LEVEL_1_4_PENDING_DISPLAY = {
  title: "Your website is being made",
  content: "I will reach out to you when your webpage is ready to go online.",
};

export function getSublevelDisplay(
  sublevel: SublevelDefinition,
  userLevel: string,
): Pick<SublevelDefinition, "title" | "content"> {
  if (sublevel.id === "1.4" && userLevel === "1.3.9") {
    return LEVEL_1_4_PENDING_DISPLAY;
  }

  return { title: sublevel.title, content: sublevel.content };
}

export function getSublevelStatus(
  userLevel: string,
  sublevelId: string,
): SublevelStatus {
  const userIndex = getUserLevelIndex(userLevel);
  const sublevelIndex = getSublevelIndex(sublevelId);

  const usesExactLevelMatch =
    sublevelId === "1.3" ||
    sublevelId.startsWith("1.3.") ||
    userLevel === "1.3" ||
    userLevel.startsWith("1.3.");

  if (userLevel === "1.3.9" && sublevelId === "1.4") {
    return "current";
  }

  if (usesExactLevelMatch) {
    if (sublevelIndex < userIndex) {
      return "completed";
    }

    if (sublevelIndex === userIndex) {
      return "current";
    }

    return "locked";
  }

  if (sublevelIndex <= userIndex) {
    return "completed";
  }

  if (sublevelIndex === userIndex + 1) {
    return "current";
  }

  return "locked";
}

export function findSublevel(sublevelId: string): SublevelDefinition | undefined {
  for (const group of PW_LEVEL_GROUPS) {
    const sublevel = group.sublevels.find((item) => item.id === sublevelId);
    if (sublevel) {
      return sublevel;
    }
  }

  return undefined;
}
