import Image from "next/image";

const FALLBACK = "/brand/mark.png";

export function Mark({
  src,
  alt = "",
  height = 56,
  priority = false,
}: {
  src?: string | null;
  alt?: string;
  height?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={src || FALLBACK}
      alt={alt}
      width={186}
      height={364}
      priority={priority}
      style={{ width: "auto", height }}
    />
  );
}
