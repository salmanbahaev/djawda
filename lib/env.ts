import { z } from "zod";

const blank = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  });

const storageMode = blank.pipe(z.enum(["local", "github"]).optional());

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  KEYSTATIC_STORAGE: storageMode,
  NEXT_PUBLIC_KEYSTATIC_STORAGE: storageMode,
  KEYSTATIC_GITHUB_CLIENT_ID: blank,
  KEYSTATIC_GITHUB_CLIENT_SECRET: blank,
  KEYSTATIC_SECRET: blank,
  NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: blank,
  GOOGLE_SHEET_ID: blank,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: blank,
  GOOGLE_PRIVATE_KEY: blank,
  GOOGLE_SERVICE_ACCOUNT_JSON: blank,
  TELEGRAM_BOT_TOKEN: blank,
  TELEGRAM_CHAT_ID: blank,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    KEYSTATIC_STORAGE: process.env.KEYSTATIC_STORAGE,
    NEXT_PUBLIC_KEYSTATIC_STORAGE: process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE,
    KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET,
    NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  });
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Некорректные переменные окружения: ${message}`);
  }
  cached = parsed.data;
  return cached;
}

export function resolveKeystaticStorage(): "local" | "github" {
  const env = getServerEnv();
  const explicit = env.NEXT_PUBLIC_KEYSTATIC_STORAGE ?? env.KEYSTATIC_STORAGE;
  const githubReady = Boolean(
    env.KEYSTATIC_GITHUB_CLIENT_ID && env.KEYSTATIC_GITHUB_CLIENT_SECRET && env.KEYSTATIC_SECRET,
  );
  if (explicit === "github" || (!explicit && env.NODE_ENV === "production" && githubReady)) {
    return "github";
  }
  if (!explicit && env.NODE_ENV === "production") {
    console.warn(
      "[djawda] Keystatic: ключи GitHub App не заданы, сборка идёт в local. После добавления KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET и KEYSTATIC_SECRET режим станет github.",
    );
  }
  return "local";
}

export function isSheetsEnvReady(env: ServerEnv = getServerEnv()): boolean {
  const account = Boolean(
    env.GOOGLE_SERVICE_ACCOUNT_JSON || (env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY),
  );
  return Boolean(env.GOOGLE_SHEET_ID && account);
}

export function isTelegramEnvReady(env: ServerEnv = getServerEnv()): boolean {
  return Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
}
