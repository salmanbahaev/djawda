export function LineIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  if (name === "insight") {
    return (
      <svg {...props}>
        <path d="M2.5 12S6.5 6.5 12 6.5 21.5 12 21.5 12 17.5 17.5 12 17.5 2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="2.25" />
      </svg>
    );
  }

  if (name === "layers") {
    return (
      <svg {...props}>
        <path d="M12 4 20 8 12 12 4 8 12 4Z" />
        <path d="M4 12 12 16 20 12" />
        <path d="M4 16 12 20 20 16" />
      </svg>
    );
  }

  if (name === "practice") {
    return (
      <svg {...props}>
        <path d="M3 12h2.5l2-5 3 10 2.5-6.5L15.5 15l2-3H21" />
      </svg>
    );
  }

  if (name === "rhythm") {
    return (
      <svg {...props}>
        <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
        <path d="M19.5 4.5v4h-4" />
      </svg>
    );
  }

  if (name === "place") {
    return (
      <svg {...props}>
        <path d="M12 21s6.5-5.6 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" />
        <circle cx="12" cy="10.5" r="2" />
      </svg>
    );
  }

  if (name === "screen") {
    return (
      <svg {...props}>
        <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
        <path d="M8 19.5h8" />
        <path d="M12 16.5v3" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M8.5 12.5 11 15l4.5-5" />
    </svg>
  );
}
