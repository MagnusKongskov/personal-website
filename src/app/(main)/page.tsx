import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HomeHero from "@/components/HomeHero";
import Products from "@/components/Products";
import Contact from "@/components/Contact";
import { getUserByMail, hasDashboardAccess } from "@/lib/users";

export default async function Home() {
  const session = await auth();

  if (session?.user?.email) {
    const user = await getUserByMail(session.user.email);

    if (hasDashboardAccess(user)) {
      redirect("/dashboard");
    }
  }

  return (
    <>
      <HomeHero />
      <Products />
      <Contact />
    </>
  );
}
