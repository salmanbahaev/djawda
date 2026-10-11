import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { heroMotion, type HeroDensity } from "@/remotion/hero-config";

type Point = readonly [number, number];

type Ribbon = {
  from: readonly [Point, Point, Point, Point];
  to: readonly [Point, Point, Point, Point];
  color: string;
  width: number;
};

const ribbons: Ribbon[] = [
  {
    from: [
      [80, 760],
      [280, 80],
      [620, 120],
      [860, 640],
    ],
    to: [
      [40, 680],
      [340, 40],
      [700, 220],
      [920, 560],
    ],
    color: heroMotion.colors.silver,
    width: 2.4,
  },
  {
    from: [
      [1040, 80],
      [1280, 260],
      [1180, 620],
      [1480, 820],
    ],
    to: [
      [980, 40],
      [1360, 180],
      [1240, 540],
      [1540, 760],
    ],
    color: heroMotion.colors.gold,
    width: 1.8,
  },
  {
    from: [
      [180, 180],
      [420, 40],
      [560, 320],
      [360, 520],
    ],
    to: [
      [140, 240],
      [480, 20],
      [620, 280],
      [300, 480],
    ],
    color: heroMotion.colors.silver,
    width: 1.6,
  },
  {
    from: [
      [900, 700],
      [1100, 480],
      [1320, 560],
      [1500, 360],
    ],
    to: [
      [860, 760],
      [1140, 420],
      [1380, 500],
      [1560, 280],
    ],
    color: heroMotion.colors.gold,
    width: 1.4,
  },
  {
    from: [
      [40, 420],
      [220, 300],
      [180, 640],
      [40, 780],
    ],
    to: [
      [20, 360],
      [260, 240],
      [240, 600],
      [80, 820],
    ],
    color: heroMotion.colors.silver,
    width: 1.5,
  },
];

const orbits = [
  { cx: 1180, cy: 280, rx: 150, ry: 90, size: 7 },
  { cx: 1180, cy: 280, rx: 210, ry: 120, size: 4 },
  { cx: 1180, cy: 280, rx: 90, ry: 150, size: 5 },
  { cx: 420, cy: 620, rx: 120, ry: 70, size: 5 },
  { cx: 420, cy: 620, rx: 180, ry: 100, size: 3.5 },
  { cx: 250, cy: 180, rx: 70, ry: 110, size: 4 },
  { cx: 1380, cy: 640, rx: 100, ry: 60, size: 4 },
  { cx: 700, cy: 160, rx: 80, ry: 46, size: 3.5 },
  { cx: 980, cy: 480, rx: 60, ry: 90, size: 3 },
  { cx: 560, cy: 400, rx: 40, ry: 70, size: 3 },
  { cx: 1500, cy: 180, rx: 50, ry: 80, size: 3.5 },
  { cx: 160, cy: 700, rx: 90, ry: 40, size: 3 },
  { cx: 820, cy: 760, rx: 110, ry: 36, size: 3 },
  { cx: 1280, cy: 120, rx: 40, ry: 40, size: 4 },
] as const;

function mixPoint(a: Point, b: Point, amount: number): Point {
  return [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount];
}

function ribbonPath(ribbon: Ribbon, amount: number) {
  const points = ribbon.from.map((point, index) => mixPoint(point, ribbon.to[index], amount));
  const [start, c1, c2, end] = points;
  return `M ${start[0]} ${start[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${end[0]} ${end[1]}`;
}

function Curves({ count }: { count: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const mix = interpolate(frame, [0, durationInFrames / 2, durationInFrames], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const draw = interpolate(
    frame,
    [0, 1.4 * fps, durationInFrames * 0.72, durationInFrames],
    [1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const enter = spring({ frame, fps, config: { damping: 200 } });

  return (
    <g opacity={enter}>
      {ribbons.slice(0, count).map((ribbon) => (
        <path
          key={ribbonPath(ribbon, 0)}
          d={ribbonPath(ribbon, mix)}
          fill="none"
          stroke={ribbon.color}
          strokeWidth={ribbon.width}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={draw}
          opacity={0.85}
        />
      ))}
    </g>
  );
}

function Orbits({ count }: { count: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const turn = interpolate(frame, [0, durationInFrames], [0, Math.PI * 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      {orbits.slice(0, count).map((orbit, index) => {
        const angle = turn + (index / count) * Math.PI * 2;
        const x = orbit.cx + Math.cos(angle) * orbit.rx;
        const y = orbit.cy + Math.sin(angle) * orbit.ry;
        const diamond = index % 4 === 0;
        return diamond ? (
          <rect
            key={`${orbit.cx}-${index}`}
            x={x - orbit.size}
            y={y - orbit.size}
            width={orbit.size * 2}
            height={orbit.size * 2}
            transform={`rotate(45 ${x} ${y})`}
            fill={index % 2 === 0 ? heroMotion.colors.gold : heroMotion.colors.silver}
          />
        ) : (
          <circle
            key={`${orbit.cx}-${index}`}
            cx={x}
            cy={y}
            r={orbit.size}
            fill={index % 3 === 0 ? heroMotion.colors.gold : heroMotion.colors.silver}
          />
        );
      })}
    </g>
  );
}

function Sweeps({ count }: { count: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const streaks = Array.from({ length: count }, (_, index) => index);

  return (
    <g>
      {streaks.map((index) => {
        const shift = (index / count) * durationInFrames;
        const local = (frame + shift) % durationInFrames;
        const x = interpolate(local, [0, durationInFrames], [-280, 1760], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = 80 + index * (count === 3 ? 240 : 140);
        const opacity = interpolate(
          local,
          [0, 18, durationInFrames - 24, durationInFrames],
          [0, 0.9, 0.9, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={220}
            height={2}
            rx={1}
            fill={`url(#hero-sweep-${index})`}
            opacity={opacity}
            transform={`rotate(-28 ${x} ${y})`}
          />
        );
      })}
    </g>
  );
}

export function HeroMotion({ density = "full" }: { density?: HeroDensity }) {
  const { fps, durationInFrames } = useVideoConfig();
  const lite = density === "lite";
  const curveCount = lite ? 3 : ribbons.length;
  const orbitCount = lite ? 7 : orbits.length;
  const sweepCount = lite ? 3 : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <Sequence from={0} durationInFrames={durationInFrames} premountFor={fps}>
        <svg viewBox="0 0 1600 900" width="100%" height="100%" style={{ overflow: "visible" }}>
          <defs>
            {Array.from({ length: sweepCount }, (_, index) => (
              <linearGradient key={index} id={`hero-sweep-${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={heroMotion.colors.silver} stopOpacity="0" />
                <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="1" stopColor={heroMotion.colors.gold} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          <Curves count={curveCount} />
          <Orbits count={orbitCount} />
          <Sweeps count={sweepCount} />
        </svg>
      </Sequence>
    </AbsoluteFill>
  );
}
