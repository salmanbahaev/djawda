export const CLASSROOM_ICONS = [
  { value: "board", label: "Доска" },
  { value: "group", label: "Группа" },
  { value: "room", label: "Класс" },
  { value: "books", label: "Пособия" },
] as const;

export type ClassroomIcon = (typeof CLASSROOM_ICONS)[number]["value"];

export function classroomIcon(value: string): ClassroomIcon | null {
  return CLASSROOM_ICONS.some((item) => item.value === value) ? (value as ClassroomIcon) : null;
}
