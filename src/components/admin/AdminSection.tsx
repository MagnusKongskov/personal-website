import Container from "@/components/Container";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent";

export function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-foreground/[0.03] p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-muted">{description}</p>
      ) : null}
      {children}
    </section>
  );
}

export function AdminField({
  id,
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block pl-1 text-sm font-medium">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={
          onChange
            ? (event) => onChange(event.target.value)
            : undefined
        }
        className={inputClassName}
      />
    </label>
  );
}

export function AdminContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-8 sm:py-12 ${className}`.trim()}>
      <Container>{children}</Container>
    </section>
  );
}

export { inputClassName };
