import { z } from "zod";
import { isFormatValue } from "@/lib/formats";
import { normalizeRuPhone } from "@/lib/forms/phone";

export function createLeadSchema(courseSlugs: readonly string[]) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Укажите имя и фамилию")
      .max(120, "Слишком длинное имя")
      .refine((value) => value.split(/\s+/).length >= 2, "Напишите имя и фамилию"),
    phone: z
      .string()
      .trim()
      .refine((value) => normalizeRuPhone(value) !== null, "Введите номер WhatsApp в формате +7"),
    course: z
      .string()
      .trim()
      .refine((value) => courseSlugs.includes(value), "Выберите курс"),
    format: z
      .string()
      .trim()
      .refine((value) => isFormatValue(value), "Выберите формат"),
    consent: z.literal(true, { error: "Нужно согласие на обработку заявки" }),
    company: z.string().optional().default(""),
  });
}

export type LeadPayload = z.infer<ReturnType<typeof createLeadSchema>>;
