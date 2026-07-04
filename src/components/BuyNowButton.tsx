type BuyNowButtonProps = {
  price: number;
  className?: string;
};

export default function BuyNowButton({ price, className = "" }: BuyNowButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 ${className}`.trim()}
    >
      Buy now ({price}$)
    </button>
  );
}
