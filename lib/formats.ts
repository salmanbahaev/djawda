export const FORMAT_OPTIONS = [
  { value: "online", label: "онлайн" },
  { value: "offline", label: "офлайн" },
  { value: "undecided", label: "пока не определилась" },
] as const;

export type FormatValue = (typeof FORMAT_OPTIONS)[number]["value"];

export function isFormatValue(value: string): value is FormatValue {
  return FORMAT_OPTIONS.some((item) => item.value === value);
}
