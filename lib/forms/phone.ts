/** Нормализует российский номер к +7 и 10 цифрам. Иначе null. */
export function normalizeRuPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7"))) {
    digits = digits.slice(1);
  }
  if (digits.length !== 10) return null;
  if (!/^[349]/.test(digits)) return null;
  return `+7${digits}`;
}

/** Маска +7 (XXX) XXX-XX-XX по мере ввода. */
export function formatRuPhoneInput(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("8") || digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return input.trim() === "" ? "" : "+7";

  let out = "+7";
  out += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) out += ")";
  if (digits.length > 3) out += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;
  return out;
}

export function displayRuPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "").replace(/^7/, "");
  if (digits.length !== 10) return e164;
  return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
}
