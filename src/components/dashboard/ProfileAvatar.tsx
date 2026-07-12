import Image from "next/image";

type ProfileAvatarProps = {
  name?: string | null;
  profilePicture?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function PersonSilhouette({ size }: { size: number }) {
  const iconSize = Math.round(size * 0.55);

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={iconSize}
      height={iconSize}
      fill="currentColor"
      className="text-white/55"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export default function ProfileAvatar({
  name,
  profilePicture,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  const dimension = size === "sm" ? 36 : size === "lg" ? 56 : 40;

  if (profilePicture) {
    return (
      <Image
        src={profilePicture}
        alt={name?.trim() || "Profile picture"}
        width={dimension}
        height={dimension}
        className={`rounded-full object-cover ${className}`.trim()}
        unoptimized
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white/10 ${className}`.trim()}
      style={{ width: dimension, height: dimension }}
      aria-hidden
    >
      <PersonSilhouette size={dimension} />
    </span>
  );
}
