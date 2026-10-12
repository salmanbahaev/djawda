/**
 * Тонкая полоска карточки в каталоге: оттенки акцентного синего и серого.
 * Новое значение: допишите пункт сюда — оно появится в Keystatic.
 */
export const COURSE_ACCENTS = [
  { value: "deep", label: "Глубокий синий", color: "#0f2f3a" },
  { value: "slate", label: "Синий", color: "#2f5162" },
  { value: "mist", label: "Серо-синий", color: "#5d7888" },
  { value: "gray", label: "Серый", color: "#8d9499" },
] as const;

export type CourseAccentValue = (typeof COURSE_ACCENTS)[number]["value"];

export function courseAccent(value: string | null | undefined, index = 0) {
  return (
    COURSE_ACCENTS.find((item) => item.value === value) ??
    COURSE_ACCENTS[index % COURSE_ACCENTS.length]
  );
}
