import Link from "next/link";

type BuyButtonProps = {
  color: string;
  label?: React.ReactNode;
  className?: string;
  href?: string;
};

export default function BuyButton({
  color,
  label = "Buy",
  className = "",
  href = "/pw/login?callbackUrl=/dashboard",
}: BuyButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${className}`.trim()}
      style={{ backgroundColor: color }}
    >
      {label}
    </Link>
  );
}
