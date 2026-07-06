import { auth } from "@/auth";
import Container from "@/components/Container";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardLevels from "@/components/dashboard/DashboardLevels";
import Contact from "@/components/pw/Contact";
import { getUserByMail } from "@/lib/users";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user?.email
    ? await getUserByMail(session.user.email)
    : null;
  const userLevel = user?.level ?? "NoPay";
  const greetingName = user?.name?.trim();

  return (
    <>
      <section className="py-12 sm:py-16">
        <Container className="text-center">
          <DashboardGreeting name={greetingName} />
        </Container>
      </section>

      <section className="pb-12 sm:pb-16">
        <Container>
          <DashboardLevels userLevel={userLevel} />
        </Container>
      </section>

      <Contact
        title="Questions?"
        description="Reach out anytime if you have questions about your package or next steps."
      />
    </>
  );
}
