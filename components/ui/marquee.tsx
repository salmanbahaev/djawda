export function Marquee({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  const line = items.map((item) => item.trim()).filter(Boolean);

  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#18181a] py-4">
      <div className="marquee-track flex w-max items-center gap-8">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className={`flex items-center gap-8 ${copy === 1 ? "marquee-clone" : ""}`}
            aria-hidden={copy === 1}
          >
            {line.map((item) => (
              <li key={`${copy}-${item}`} className="flex items-center gap-8">
                <span className="text-[0.72rem] font-medium tracking-[0.28em] text-[#c8c8ce] uppercase">
                  {item}
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
