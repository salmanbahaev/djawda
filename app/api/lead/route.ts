import { getServerEnv } from "@/lib/env";
import { getCourses, getFormCopy } from "@/lib/cms/content";
import { formatMoscow } from "@/lib/datetime";
import { createLeadSchema } from "@/lib/forms/lead";
import { displayRuPhone, normalizeRuPhone } from "@/lib/forms/phone";
import { clientIp, rateLimit } from "@/lib/forms/rate-limit";
import {
  appendLeadRow,
  DEFAULT_PAYMENT_STATUS,
  isSheetsConfigured,
} from "@/lib/integrations/google-sheets";
import { isTelegramConfigured, sendTelegramLead } from "@/lib/integrations/telegram";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Не удалось прочитать заявку" }, { status: 400 });
  }

  const courses = await getCourses();
  const parsed = createLeadSchema(courses.map((course) => course.slug)).safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Проверьте поля формы";
    return Response.json({ ok: false, message }, { status: 400 });
  }

  const data = parsed.data;
  if (data.company.trim()) {
    return Response.json({ ok: true });
  }

  const limit = rateLimit(clientIp(request));
  if (!limit.ok) {
    return Response.json(
      {
        ok: false,
        message: "Слишком много заявок с этого адреса. Подождите немного или напишите в WhatsApp.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const phone = normalizeRuPhone(data.phone);
  const selected = courses.find((course) => course.slug === data.course);
  if (!phone || !selected) {
    return Response.json({ ok: false, message: "Проверьте номер и курс" }, { status: 400 });
  }

  const form = await getFormCopy();
  const formatLabel = form.formats.find((item) => item.value === data.format)?.label ?? data.format;
  const lead = {
    when: formatMoscow(),
    name: data.name.replace(/\s+/g, " ").trim(),
    phone: displayRuPhone(phone),
    course: selected.title,
    format: formatLabel,
  };

  const sheetsOn = isSheetsConfigured();
  const telegramOn = isTelegramConfigured();

  if (!sheetsOn && !telegramOn) {
    const env = getServerEnv();
    console.warn(
      "[djawda-lead] Google Sheets и Telegram не настроены. Заявка принята, но никуда не отправлена.",
      env.NODE_ENV === "production" ? { name: lead.name, course: lead.course } : lead,
    );
    return Response.json({
      ok: true,
      warning:
        env.NODE_ENV === "production"
          ? undefined
          : "Интеграции пока не настроены: заявка не ушла в таблицу и Telegram. Подробности в консоли сервера.",
    });
  }

  const tasks: Promise<void>[] = [];
  if (sheetsOn) tasks.push(appendLeadRow(lead));
  if (telegramOn) tasks.push(sendTelegramLead({ ...lead, payment: DEFAULT_PAYMENT_STATUS }));

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length === results.length) {
    failed.forEach((result) => {
      if (result.status === "rejected") console.error("[djawda-lead]", result.reason);
    });
    return Response.json(
      { ok: false, message: "Не получилось отправить заявку. Напишите, пожалуйста, в WhatsApp." },
      { status: 502 },
    );
  }

  failed.forEach((result) => {
    if (result.status === "rejected")
      console.error("[djawda-lead] часть отправки не удалась", result.reason);
  });

  return Response.json({ ok: true });
}
