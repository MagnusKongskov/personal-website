export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-content px-6 ${className}`.trim()}>
      {children}
    </div>
  );
}
