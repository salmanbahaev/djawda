/**
 * Тонкая цветная полоска карточки в каталоге.
 * Новое значение: допишите пункт сюда — оно появится в Keystatic.
 * Золото кнопки заявки сюда не входит: у карточек свои спокойные цвета.
 */
export const COURSE_ACCENTS = [
  { value: "teal", label: "Бирюза", color: "#1b6e78" },
  { value: "slate", label: "Серебро", color: "#5e7384" },
  { value: "bronze", label: "Бронза", color: "#8a6240" },
  { value: "ink", label: "Глубокий синий", color: "#23425c" },
] as const;

export type CourseAccentValue = (typeof COURSE_ACCENTS)[number]["value"];

export function courseAccent(value: string | null | undefined, index = 0) {
  return (
    COURSE_ACCENTS.find((item) => item.value === value) ??
    COURSE_ACCENTS[index % COURSE_ACCENTS.length]
  );
}
