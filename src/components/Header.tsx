import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-center px-4 py-4 sm:fixed sm:left-0 sm:right-0 sm:top-4 sm:z-50 sm:py-0">
      <Link
        href="/"
        className="flex items-center gap-0 rounded-full border border-border bg-white px-5 py-2.5 shadow-md transition-opacity hover:opacity-90"
      >
        <Image
          src="/cl.png"
          alt="Kongskov Web Services logo"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 object-contain"
        />
        <span className="-ml-1 text-lg font-semibold tracking-tight">
          ngskov Web Services
        </span>
      </Link>
    </header>
  );
}
