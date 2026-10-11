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

/** Points are fractions of the frame, so the same curves fill a phone and a desktop. */
const ribbons: Ribbon[] = [
  {
    from: [
      [0.02, 0.92],
      [0.18, 0.08],
      [0.42, 0.16],
      [0.58, 0.78],
    ],
    to: [
      [-0.02, 0.78],
      [0.24, 0.02],
      [0.5, 0.28],
      [0.66, 0.62],
    ],
    color: heroMotion.colors.silver,
    width: 10,
  },
  {
    from: [
      [0.62, 0.04],
      [0.84, 0.22],
      [0.78, 0.62],
      [0.98, 0.96],
    ],
    to: [
      [0.54, 0.0],
      [0.92, 0.14],
      [0.86, 0.5],
      [1.04, 0.84],
    ],
    color: heroMotion.colors.gold,
    width: 7,
  },
  {
    from: [
      [0.08, 0.22],
      [0.28, 0.02],
      [0.4, 0.34],
      [0.22, 0.58],
    ],
    to: [
      [0.04, 0.32],
      [0.34, 0.0],
      [0.48, 0.28],
      [0.16, 0.5],
    ],
    color: heroMotion.colors.silver,
    width: 6,
  },
  {
    from: [
      [0.48, 0.88],
      [0.7, 0.58],
      [0.86, 0.66],
      [1.02, 0.38],
    ],
    to: [
      [0.4, 0.96],
      [0.74, 0.48],
      [0.92, 0.56],
      [1.06, 0.28],
    ],
    color: heroMotion.colors.gold,
    width: 5,
  },
  {
    from: [
      [0.0, 0.48],
      [0.16, 0.3],
      [0.12, 0.7],
      [0.0, 0.9],
    ],
    to: [
      [-0.04, 0.4],
      [0.2, 0.22],
      [0.18, 0.64],
      [0.06, 0.96],
    ],
    color: heroMotion.colors.silver,
    width: 5,
  },
];

const orbits = [
  { cx: 0.78, cy: 0.28, rx: 0.12, ry: 0.1, size: 11 },
  { cx: 0.78, cy: 0.28, rx: 0.18, ry: 0.14, size: 7 },
  { cx: 0.78, cy: 0.28, rx: 0.07, ry: 0.16, size: 8 },
  { cx: 0.28, cy: 0.72, rx: 0.1, ry: 0.08, size: 8 },
  { cx: 0.28, cy: 0.72, rx: 0.16, ry: 0.11, size: 6 },
  { cx: 0.16, cy: 0.18, rx: 0.06, ry: 0.12, size: 7 },
  { cx: 0.9, cy: 0.7, rx: 0.08, ry: 0.07, size: 6 },
  { cx: 0.48, cy: 0.14, rx: 0.07, ry: 0.05, size: 6 },
  { cx: 0.62, cy: 0.52, rx: 0.05, ry: 0.09, size: 5 },
  { cx: 0.38, cy: 0.46, rx: 0.04, ry: 0.08, size: 5 },
  { cx: 0.94, cy: 0.16, rx: 0.04, ry: 0.08, size: 6 },
  { cx: 0.1, cy: 0.8, rx: 0.08, ry: 0.04, size: 5 },
  { cx: 0.55, cy: 0.86, rx: 0.09, ry: 0.04, size: 5 },
  { cx: 0.84, cy: 0.1, rx: 0.035, ry: 0.045, size: 6 },
] as const;

function mixPoint(a: Point, b: Point, amount: number): Point {
  return [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount];
}

function ribbonPath(ribbon: Ribbon, amount: number, width: number, height: number) {
  const points = ribbon.from.map((point, index) => {
    const mixed = mixPoint(point, ribbon.to[index], amount);
    return [mixed[0] * width, mixed[1] * height] as Point;
  });
  const [start, c1, c2, end] = points;
  return `M ${start[0]} ${start[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${end[0]} ${end[1]}`;
}

function Curves({ count }: { count: number }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const mix = interpolate(
    frame,
    [0, durationInFrames * 0.25, durationInFrames * 0.5, durationInFrames * 0.75, durationInFrames],
    [0, 1, 0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const draw = interpolate(
    frame,
    [0, 0.65 * fps, durationInFrames - 12, durationInFrames],
    [1, 0, 0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const unit = Math.max(1, width / 900);
  const gleamCycle = fps * 2.2;

  return (
    <g opacity={enter}>
      {ribbons.slice(0, count).map((ribbon, index) => {
        const d = ribbonPath(ribbon, mix, width, height);
        const gleam = ((frame + index * 16) % gleamCycle) / gleamCycle;
        const gleamOffset = interpolate(gleam, [0, 1], [1, -0.18]);
        return (
          <g key={index}>
            <path
              d={d}
              fill="none"
              stroke={ribbon.color}
              strokeWidth={ribbon.width * unit * 2.4}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={draw}
              opacity={0.22}
            />
            <path
              d={d}
              fill="none"
              stroke={ribbon.color}
              strokeWidth={ribbon.width * unit}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={draw}
            />
            <path
              d={d}
              fill="none"
              stroke="#ffffff"
              strokeWidth={Math.max(2, ribbon.width * unit * 0.42)}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.16 0.84"
              strokeDashoffset={gleamOffset}
              opacity={1 - draw}
            />
          </g>
        );
      })}
    </g>
  );
}

function Orbits({ count }: { count: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const unit = Math.max(1, width / 900);
  const turn = interpolate(frame, [0, durationInFrames], [0, Math.PI * 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      {orbits.slice(0, count).map((orbit, index) => {
        const angle = turn * (index % 2 === 0 ? 1 : -1) + (index / count) * Math.PI * 2;
        const x = orbit.cx * width + Math.cos(angle) * orbit.rx * width;
        const y = orbit.cy * height + Math.sin(angle) * orbit.ry * height;
        const pulse = 0.72 + 0.28 * Math.sin(turn * 2 + index);
        const diamond = index % 4 === 0;
        const fill = index % 2 === 0 ? heroMotion.colors.gold : heroMotion.colors.silver;
        const size = orbit.size * unit * pulse;
        return diamond ? (
          <rect
            key={`${orbit.cx}-${index}`}
            x={x - size}
            y={y - size}
            width={size * 2}
            height={size * 2}
            transform={`rotate(45 ${x} ${y})`}
            fill={fill}
          />
        ) : (
          <circle key={`${orbit.cx}-${index}`} cx={x} cy={y} r={size} fill={fill} />
        );
      })}
    </g>
  );
}

function Sweeps({ count }: { count: number }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.max(1, width / 900);
  const cycle = Math.round(fps * 1.7);
  const streaks = Array.from({ length: count }, (_, index) => index);

  return (
    <g>
      {streaks.map((index) => {
        const local = (frame + Math.round((index * cycle) / count)) % cycle;
        const x = interpolate(local, [0, cycle], [-0.35 * width, 1.2 * width], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = height * (0.1 + index * (count === 3 ? 0.28 : 0.16));
        const opacity = interpolate(local, [0, 6, cycle - 8, cycle], [0, 0.95, 0.95, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width * 0.42}
            height={10 * unit}
            rx={4}
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
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const lite = density === "lite";
  const curveCount = lite ? 3 : ribbons.length;
  const orbitCount = lite ? 7 : orbits.length;
  const sweepCount = lite ? 3 : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <Sequence from={0} durationInFrames={durationInFrames} premountFor={fps}>
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
          <defs>
            {Array.from({ length: sweepCount }, (_, index) => (
              <linearGradient key={index} id={`hero-sweep-${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={heroMotion.colors.silver} stopOpacity="0" />
                <stop offset="0.35" stopColor="#ffffff" stopOpacity="1" />
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
