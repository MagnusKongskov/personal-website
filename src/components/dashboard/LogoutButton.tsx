"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/pw" })}
      className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.04]"
    >
      Log out
    </button>
  );
}
