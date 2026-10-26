"use client";

import { COURSE_SELECT_EVENT } from "@/lib/forms/course-event";
import { createLeadSchema } from "@/lib/forms/lead";
import { formatRuPhoneInput } from "@/lib/forms/phone";
import * as Select from "@radix-ui/react-select";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type LeadFormCopy = {
  nameLabel: string;
  phoneLabel: string;
  courseLabel: string;
  coursePlaceholder: string;
  formatLabel: string;
  formats: { value: string; label: string }[];
  consentLabel: string;
  privacyLinkLabel: string;
  hint: string;
  submitLabel: string;
  submittingLabel: string;
  whatsappCta: string;
  successTitle: string;
  successText: string;
  errorText: string;
};

type CourseOption = { slug: string; title: string };

const controlClass =
  "field-control min-h-11 w-full rounded-lg border border-[#8a8478] bg-white px-4 text-base text-[#17171a] transition-[border-color,background-color] duration-300 ease-brand data-[placeholder]:text-[#5c6570]";

const fieldLabel = "mb-2 block text-sm font-semibold text-[#17171a]";

const summaryFields = [
  ["name", "name"],
  ["phone", "phone"],
  ["course", "course"],
  ["format", "format"],
  ["consent", "consent"],
] as const;

export function LeadForm({
  copy,
  courses,
  whatsappUrl,
  phoneDisplay = "",
  secondary,
  presetSlug,
  id = "lead-form",
}: {
  copy: LeadFormCopy;
  courses: CourseOption[];
  whatsappUrl: string;
  phoneDisplay?: string;
  secondary?: { href: string; label: string };
  presetSlug?: string;
  id?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(presetSlug ?? "");
  const [format, setFormat] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<"summary" | "alert" | null>(null);

  const leadSchema = useMemo(() => createLeadSchema(courses.map((item) => item.slug)), [courses]);
  const summary = summaryFields.flatMap(([key]) => {
    const error = fieldErrors[key];
    return error ? [{ key, error }] : [];
  });

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    const node = target === "summary" ? summaryRef.current : alertRef.current;
    if (!node) return;
    pendingFocus.current = null;
    node.focus();
  });

  useEffect(() => {
    function onSelect(event: Event) {
      const slug = (event as CustomEvent<string>).detail;
      if (typeof slug === "string" && courses.some((item) => item.slug === slug)) {
        setCourse(slug);
        setFieldErrors((prev) => {
          if (!prev.course) return prev;
          const next = { ...prev };
          delete next.course;
          return next;
        });
      }
    }
    document.addEventListener(COURSE_SELECT_EVENT, onSelect);
    return () => document.removeEventListener(COURSE_SELECT_EVENT, onSelect);
  }, [courses]);

  function clearError(key: string) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = leadSchema.safeParse({ name, phone, course, format, consent, company });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      setStatus("idle");
      pendingFocus.current = "summary";
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, course, format, consent, company }),
      });
      let data: { ok?: boolean; message?: string; warning?: string; fallback?: string } = {};
      try {
        data = (await response.json()) as typeof data;
      } catch {
        data = {};
      }
      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message || copy.errorText);
        pendingFocus.current = "alert";
        return;
      }
      setStatus("success");
      setMessage(data.warning || copy.successText);
    } catch {
      setStatus("error");
      setMessage(copy.errorText);
      pendingFocus.current = "alert";
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-3xl border border-[#d4cbbd] bg-white p-4 text-[#17171a] sm:p-6"
        role="status"
      >
        <h3 className="text-2xl font-medium tracking-tight">{copy.successTitle}</h3>
        <p className="mt-4 leading-relaxed text-[#3e4450]">{message}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="press mt-6 inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-4 text-base font-semibold text-[var(--paper)] hover:bg-[var(--accent-hover)]"
        >
          {copy.whatsappCta}
          {phoneDisplay ? ` · ${phoneDisplay}` : ""}
        </a>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className="relative rounded-3xl border border-[#d4cbbd] bg-white p-4 text-[#17171a] scheme-light sm:p-6"
      noValidate
    >
      <div className="grid gap-6">
        {summary.length > 0 ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-red-800/30 bg-red-50 p-4"
          >
            <p className="text-sm font-semibold text-red-800">Проверьте поля формы</p>
            <ul className="mt-2 grid gap-2">
              {summary.map((item) => (
                <li key={item.key}>
                  <a
                    href={`#${id}-${item.key}`}
                    className="text-sm font-medium text-red-800 underline underline-offset-4"
                  >
                    {item.error}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <TextField
          id={`${id}-name`}
          label={copy.nameLabel}
          error={fieldErrors.name}
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearError("name");
          }}
        />
        <TextField
          id={`${id}-phone`}
          label={copy.phoneLabel}
          error={fieldErrors.phone}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (900) 000-00-00"
          value={phone}
          onChange={(event) => {
            setPhone(formatRuPhoneInput(event.target.value));
            clearError("phone");
          }}
        />
        <SelectField
          id={`${id}-course`}
          label={copy.courseLabel}
          error={fieldErrors.course}
          value={course}
          onChange={(value) => {
            setCourse(value);
            clearError("course");
          }}
          placeholder={copy.coursePlaceholder}
          options={courses.map((item) => ({ value: item.slug, label: item.title }))}
        />
        <SelectField
          id={`${id}-format`}
          name={`${id}-format`}
          label={copy.formatLabel}
          error={fieldErrors.format}
          value={format}
          onChange={(value) => {
            setFormat(value);
            clearError("format");
          }}
          placeholder="Выберите формат"
          options={copy.formats}
        />
        <div>
          <label htmlFor={`${id}-consent`} className="flex min-h-11 items-center gap-3">
            <input
              id={`${id}-consent`}
              type="checkbox"
              className="field-control h-6 w-6 shrink-0 accent-[var(--accent)]"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                clearError("consent");
              }}
              aria-required="true"
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={fieldErrors.consent ? `${id}-consent-error` : undefined}
            />
            <span className="text-sm leading-relaxed text-[#17171a]">{copy.consentLabel}</span>
          </label>
          <p className="mt-2 pl-8 text-sm">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-4"
            >
              {copy.privacyLinkLabel}
            </Link>
          </p>
          {fieldErrors.consent ? (
            <p id={`${id}-consent-error`} className="mt-2 text-sm font-medium text-red-800">
              {fieldErrors.consent}
            </p>
          ) : null}
        </div>
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label>
            Компания
            <input
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </label>
        </div>
        {status === "error" ? (
          <div
            ref={alertRef}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-red-800/30 bg-red-50 p-4"
          >
            <p className="text-sm font-semibold text-red-800">{message}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] underline underline-offset-4"
            >
              {copy.whatsappCta}
              {phoneDisplay ? ` · ${phoneDisplay}` : ""}
            </a>
          </div>
        ) : null}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "sending"}
            className="press inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] px-4 text-base font-semibold text-[var(--paper)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--accent-muted)] sm:w-auto"
          >
            {status === "sending" ? copy.submittingLabel : copy.submitLabel}
          </button>
          {secondary ? (
            <a
              href={secondary.href}
              className="press inline-flex min-h-11 items-center text-base font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-4"
            >
              {secondary.label}
            </a>
          ) : null}
        </div>
        <p className="text-sm text-[#3e4450]">{copy.hint}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="press inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-4"
        >
          {copy.whatsappCta}
          {phoneDisplay ? ` · ${phoneDisplay}` : ""}
        </a>
      </div>
    </form>
  );
}

function TextField({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <input
        id={id}
        aria-required="true"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClass} ${error ? "border-red-800" : ""}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  name = "course",
  label,
  error,
  value,
  onChange,
  placeholder,
  options,
}: {
  id: string;
  name?: string;
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <Select.Root
        name={name}
        value={value}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <Select.Trigger
          id={id}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${controlClass} flex items-center justify-between gap-3 text-left ${
            error ? "border-red-800" : ""
          }`}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon
            className={`shrink-0 text-[#3e4450] transition-transform duration-300 ease-brand ${open ? "rotate-180" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M5 7.5 10 12.5 15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            side="bottom"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            className="select-popover z-[60] w-[var(--radix-select-trigger-width)]"
          >
            <div className="select-popover-panel overflow-hidden rounded-xl border border-[#d4cbbd] bg-white text-[#17171a] shadow-[0_18px_40px_-24px_rgba(23,23,26,0.45)]">
              <Select.Viewport className="max-h-[min(18rem,var(--radix-select-content-available-height))] overflow-y-auto py-2">
                {options.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="relative mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-base outline-none data-[highlighted]:bg-[#f5efe4] data-[state=checked]:font-semibold"
                  >
                    <Select.ItemText className="min-w-0 flex-1">{item.label}</Select.ItemText>
                    <Select.ItemIndicator className="inline-flex shrink-0 text-[#17171a]">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M3.5 8.2 6.4 11.1 12.5 4.8"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </div>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
