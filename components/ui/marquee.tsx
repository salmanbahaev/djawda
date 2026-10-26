export function Marquee({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  const line = items.map((item) => item.trim()).filter(Boolean);

  return (
    <div
      data-surface="light"
      className="surface-paper raised overflow-hidden border-b border-[var(--color-line)] py-4"
    >
      <div className="marquee-track flex w-max items-center gap-8">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className={`flex items-center gap-8 ${copy === 1 ? "marquee-clone" : ""}`}
            aria-hidden={copy === 1}
          >
            {line.map((item) => (
              <li key={`${copy}-${item}`} className="flex items-center gap-8">
                <span className="text-xs font-semibold tracking-[0.18em] text-[#244552] uppercase">
                  {item}
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--accent)]" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
