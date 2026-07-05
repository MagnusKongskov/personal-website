import { DELIVERY_TIME_HIGH, DELIVERY_TIME_LOW } from "@/lib/constants";
import FeedbackBubble from "@/components/FeedbackBubble";

type BuyNowButtonProps = {
  price: number;
  className?: string;
  errorMessage?: string;
  onErrorDismiss?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function BuyNowButton({
  price,
  className = "",
  errorMessage,
  onErrorDismiss,
  onClick,
  disabled = false,
  isLoading = false,
}: BuyNowButtonProps) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`.trim()}>
      <div className="relative">
        {errorMessage ? (
          <FeedbackBubble message={errorMessage} onDismiss={onErrorDismiss} />
        ) : null}
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || isLoading}
          className="inline-flex w-44 shrink-0 items-center justify-center rounded-full border border-transparent bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Redirecting..." : `Buy now (${price}$)`}
        </button>
      </div>
      <p className="text-xs text-muted">
        Delivery time: {DELIVERY_TIME_LOW} - {DELIVERY_TIME_HIGH} days
      </p>
    </div>
  );
}
