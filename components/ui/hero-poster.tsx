export function HeroPoster() {
  return (
    <div className="absolute inset-0 bg-teal-950">
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="poster-glow" cx="68%" cy="42%" r="42%">
            <stop offset="0%" stopColor="#f7f4ee" stopOpacity="0.85" />
            <stop offset="42%" stopColor="#9eb4c0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#021920" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="poster-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#c5d0d8" />
            <stop offset="100%" stopColor="#6e8794" />
          </linearGradient>
          <radialGradient id="poster-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e6d3a4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e6d3a4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="800" fill="#021920" />
        <circle cx="820" cy="360" r="280" fill="url(#poster-glow)" />
        <circle cx="860" cy="300" r="90" fill="url(#poster-gold)" />
        <g fill="none" stroke="url(#poster-metal)" strokeLinecap="round">
          <ellipse
            cx="820"
            cy="380"
            rx="210"
            ry="78"
            strokeWidth="10"
            transform="rotate(-18 820 380)"
          />
          <ellipse
            cx="820"
            cy="380"
            rx="150"
            ry="210"
            strokeWidth="8"
            transform="rotate(24 820 380)"
          />
          <path
            d="M690 430C760 250 900 250 960 390C1020 530 860 590 760 500C680 430 700 340 820 330C940 320 980 430 900 480"
            strokeWidth="16"
          />
        </g>
        <g fill="#e7ebef">
          <circle cx="640" cy="210" r="2" opacity="0.7" />
          <circle cx="980" cy="180" r="1.5" opacity="0.5" />
          <circle cx="1040" cy="460" r="2" opacity="0.45" />
          <circle cx="700" cy="560" r="1.6" opacity="0.4" />
          <circle cx="900" cy="600" r="1.4" opacity="0.35" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,25,32,0.45)_100%)]" />
    </div>
  );
}
