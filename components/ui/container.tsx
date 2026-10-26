export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ index, children }: { index?: number; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-4 text-xs font-semibold tracking-[0.18em] text-[var(--eyebrow)] uppercase">
      {index != null ? (
        <span className="tabular-nums">{String(index).padStart(2, "0")}</span>
      ) : null}
      {index != null ? <span aria-hidden className="h-px w-8 bg-current" /> : null}
      <span>{children}</span>
    </p>
  );
}
