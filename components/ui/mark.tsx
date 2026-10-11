import Image from "next/image";

const FALLBACK = "/brand/mark.svg";
const RATIO = "300 / 572";

export function Mark({
  src,
  alt = "",
  height,
  priority = false,
  tone = "metal",
  className = "",
}: {
  src?: string | null;
  alt?: string;
  height?: number;
  priority?: boolean;
  tone?: "metal" | "flat";
  className?: string;
}) {
  const url = src || FALLBACK;
  const frame = {
    height,
    aspectRatio: RATIO,
  };

  if (tone === "flat") {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`inline-block shrink-0 bg-silver ${className}`}
        style={{
          ...frame,
          maskImage: `url("${url}")`,
          WebkitMaskImage: `url("${url}")`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskMode: "alpha",
        }}
      />
    );
  }

  return (
    <span className={`inline-block shrink-0 ${className}`} style={frame}>
      <Image
        src={url}
        alt={alt}
        width={300}
        height={572}
        priority={priority}
        className="h-full w-full"
      />
    </span>
  );
}
