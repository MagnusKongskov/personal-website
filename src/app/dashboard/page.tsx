import Link from "next/link";
import { auth } from "@/auth";
import Container from "@/components/Container";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardLevels from "@/components/dashboard/DashboardLevels";
import ProfileAvatar from "@/components/dashboard/ProfileAvatar";
import Contact from "@/components/pw/Contact";
import { resolveMeetingJoinUrl } from "@/lib/meetings";
import { getUserByMail } from "@/lib/users";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user?.email
    ? await getUserByMail(session.user.email)
    : null;
  const userLevel = user?.level ?? "NoPay";
  const greetingName = user?.name?.trim();
  const scheduledMeetingAt = user?.scheduledMeetingAt?.toISOString();
  const profilePicture = user?.profilePicture ?? session?.user?.image;

  return (
    <>
      <section className="py-12 sm:py-16">
        <Container>
          <div className="relative flex items-center justify-center">
            <DashboardGreeting name={greetingName} />
            <Link
              href="/dashboard/profile"
              className="absolute right-0 shrink-0 transition-opacity hover:opacity-80"
              aria-label="Manage account"
            >
              <ProfileAvatar
                name={greetingName}
                profilePicture={profilePicture}
                size="sm"
              />
            </Link>
          </div>
        </Container>
      </section>

      <section className="pb-12 sm:pb-16">
        <Container>
          <DashboardLevels
            userLevel={userLevel}
            scheduledMeetingAt={scheduledMeetingAt}
            joinUrl={resolveMeetingJoinUrl(user)}
          />
        </Container>
      </section>

      <Contact
        title="Questions?"
        description="Reach out anytime if you have questions about your package or next steps."
      />
    </>
  );
}
