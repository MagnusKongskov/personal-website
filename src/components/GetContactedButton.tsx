type GetContactedButtonProps = {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function GetContactedButton({
  className = "",
  onClick,
  disabled = false,
  isLoading = false,
}: GetContactedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
    >
      {isLoading ? "Sending..." : "Get contacted"}
    </button>
  );
}
