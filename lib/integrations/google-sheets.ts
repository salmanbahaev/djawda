import { google, type sheets_v4 } from "googleapis";
import { getServerEnv } from "@/lib/env";

export const SHEET_TAB = "Заявки";

export const SHEET_HEADERS = [
  "Дата и время заявки (Europe/Moscow)",
  "Имя и фамилия",
  "WhatsApp",
  "Интересующий курс",
  "Формат обучения",
  "Статус оплаты",
] as const;

export const PAYMENT_STATUSES = ["Не оплачено", "Предоплата 50%", "Оплачено полностью"] as const;

export const DEFAULT_PAYMENT_STATUS = "Не оплачено";

type ServiceAccount = { clientEmail: string; privateKey: string };

function isServiceAccountJson(
  value: unknown,
): value is { client_email: string; private_key: string } {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.client_email === "string" && typeof record.private_key === "string";
}

export function readServiceAccount(): ServiceAccount | null {
  const env = getServerEnv();
  const raw = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isServiceAccountJson(parsed)) {
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key.replace(/\\n/g, "\n"),
        };
      }
      console.error("[djawda] GOOGLE_SERVICE_ACCOUNT_JSON без client_email или private_key");
      return null;
    } catch (error) {
      console.error("[djawda] GOOGLE_SERVICE_ACCOUNT_JSON не разбирается как JSON", error);
      return null;
    }
  }

  const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) return null;
  return { clientEmail, privateKey };
}

export function sheetsConfig() {
  const account = readServiceAccount();
  const spreadsheetId = getServerEnv().GOOGLE_SHEET_ID;
  if (!account || !spreadsheetId) return null;
  return { account, spreadsheetId };
}

export function isSheetsConfigured(): boolean {
  return sheetsConfig() !== null;
}

async function sheetsClient(): Promise<{ sheets: sheets_v4.Sheets; spreadsheetId: string } | null> {
  const config = sheetsConfig();
  if (!config) return null;
  const auth = new google.auth.JWT({
    email: config.account.clientEmail,
    key: config.account.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId: config.spreadsheetId };
}

export type LeadRow = {
  when: string;
  name: string;
  phone: string;
  course: string;
  format: string;
};

export async function appendLeadRow(row: LeadRow): Promise<void> {
  const client = await sheetsClient();
  if (!client) throw new Error("Google Sheets не настроен");
  await client.sheets.spreadsheets.values.append({
    spreadsheetId: client.spreadsheetId,
    range: `${SHEET_TAB}!A:F`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[row.when, row.name, row.phone, row.course, row.format, DEFAULT_PAYMENT_STATUS]],
    },
  });
}

export async function setupSheet(): Promise<void> {
  const client = await sheetsClient();
  if (!client) {
    throw new Error(
      "Нет данных сервисного аккаунта или GOOGLE_SHEET_ID. Заполните .env.local — см. README.",
    );
  }
  const { sheets, spreadsheetId } = client;
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  let sheetId = meta.data.sheets?.find((sheet) => sheet.properties?.title === SHEET_TAB)?.properties
    ?.sheetId;

  if (sheetId === undefined || sheetId === null) {
    const created = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_TAB } } }],
      },
    });
    sheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId ?? undefined;
  }

  if (sheetId === undefined || sheetId === null) {
    throw new Error("Не удалось создать вкладку «Заявки»");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_TAB}!A1:F1`,
    valueInputOption: "RAW",
    requestBody: { values: [[...SHEET_HEADERS]] },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: "gridProperties.frozenRowCount",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 6,
            },
            cell: { userEnteredFormat: { textFormat: { bold: true } } },
            fields: "userEnteredFormat.textFormat.bold",
          },
        },
        {
          setDataValidation: {
            range: {
              sheetId,
              startRowIndex: 1,
              endRowIndex: 500,
              startColumnIndex: 5,
              endColumnIndex: 6,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: PAYMENT_STATUSES.map((value) => ({ userEnteredValue: value })),
              },
              showCustomUi: true,
              strict: true,
            },
          },
        },
      ],
    },
  });
}
