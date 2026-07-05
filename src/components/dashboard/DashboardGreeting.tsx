"use client";

function getTimeOfDayGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardGreeting({ name }: { name?: string }) {
  const greeting = getTimeOfDayGreeting(new Date().getHours());

  return (
    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
      {greeting}
      {name ? `, ${name}` : ""}
    </h1>
  );
}
