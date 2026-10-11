/**
 * Статусы набора. Чтобы добавить новый, допишите пункт сюда —
 * он появится в Keystatic и на карточках.
 */
export const COURSE_STATUSES = [
  { label: "Идёт набор", value: "open" },
  { label: "Скоро набор", value: "soon" },
] as const;

export type CourseStatus = (typeof COURSE_STATUSES)[number]["value"];

export function courseStatusLabel(value: string): string {
  return COURSE_STATUSES.find((item) => item.value === value)?.label ?? value;
}
