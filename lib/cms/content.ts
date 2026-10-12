import "server-only";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

async function readSingleton<T>(name: string, value: T | null): Promise<T> {
  if (!value) {
    throw new Error(`В Keystatic нет записи «${name}». Проверьте папку content/.`);
  }
  return value;
}

export async function getSettings() {
  return readSingleton("settings", await reader.singletons.settings.read());
}

export async function getHome() {
  return readSingleton("home", await reader.singletons.home.read());
}

export async function getAbout() {
  return readSingleton("about", await reader.singletons.about.read());
}

export async function getContactsPage() {
  return readSingleton("contactsPage", await reader.singletons.contactsPage.read());
}

export async function getFormCopy() {
  return readSingleton("form", await reader.singletons.form.read());
}

export async function getFooter() {
  return readSingleton("footer", await reader.singletons.footer.read());
}

export async function getPrivacy() {
  return readSingleton("privacy", await reader.singletons.privacy.read());
}

export async function getCourses() {
  const all = await reader.collections.courses.all();
  return all
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title, "ru"));
}

export type SettingsContent = Awaited<ReturnType<typeof getSettings>>;
export type HomeContent = Awaited<ReturnType<typeof getHome>>;
export type AboutContent = Awaited<ReturnType<typeof getAbout>>;
export type FormContent = Awaited<ReturnType<typeof getFormCopy>>;
export type FooterContent = Awaited<ReturnType<typeof getFooter>>;
export type CourseContent = Awaited<ReturnType<typeof getCourses>>[number];
