import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Hero from "@/components/pw/Hero";
import Levels from "@/components/pw/Levels";
import Advantages from "@/components/pw/Advantages";
import Demos from "@/components/pw/Demos";
import BuySection from "@/components/pw/BuySection";
import Contact from "@/components/pw/Contact";
import { getUserByMail, hasDashboardAccess } from "@/lib/users";

export default async function PersonalWebpage() {
  const session = await auth();

  if (session?.user?.email) {
    const user = await getUserByMail(session.user.email);

    if (hasDashboardAccess(user)) {
      redirect("/dashboard");
    }
  }

  return (
    <>
      <Hero />
      <Levels />
      <Advantages />
      <Demos />
      <BuySection />
      <Contact />
    </>
  );
}
