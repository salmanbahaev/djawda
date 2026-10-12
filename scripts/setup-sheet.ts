import "dotenv/config";
import { config as loadEnv } from "dotenv";
import { setupSheet } from "../lib/integrations/google-sheets";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

setupSheet()
  .then(() => {
    console.log("Готово: вкладка «Заявки», заголовки и список статусов оплаты.");
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
