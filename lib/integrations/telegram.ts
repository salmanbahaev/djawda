import { getServerEnv, isTelegramEnvReady } from "@/lib/env";

export function isTelegramConfigured(): boolean {
  return isTelegramEnvReady();
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export async function sendTelegramLead(input: {
  when: string;
  name: string;
  phone: string;
  course: string;
  format: string;
  payment: string;
}): Promise<void> {
  const env = getServerEnv();
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram не настроен");

  const text = [
    "<b>Новая заявка — Джавда</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(input.name)}`,
    `<b>WhatsApp:</b> ${escapeHtml(input.phone)}`,
    `<b>Курс:</b> ${escapeHtml(input.course)}`,
    `<b>Формат:</b> ${escapeHtml(input.format)}`,
    `<b>Время (МСК):</b> ${escapeHtml(input.when)}`,
    `<b>Статус оплаты:</b> ${escapeHtml(input.payment)}`,
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram ответил ${response.status}: ${body.slice(0, 300)}`);
  }
}
