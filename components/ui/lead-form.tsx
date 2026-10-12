"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COURSE_SELECT_EVENT } from "@/lib/forms/course-event";
import { createLeadSchema } from "@/lib/forms/lead";
import { formatRuPhoneInput } from "@/lib/forms/phone";

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
  "field-control w-full rounded-2xl border border-[#3c3c42] bg-[#141416] px-4 py-3.5 text-base text-[#f4f4f5] outline-none transition duration-200 placeholder:text-transparent focus:border-[#d6d6db] focus:placeholder:text-[#8d8d93]";

const labelBase =
  "float-label pointer-events-none absolute left-4 z-10 max-w-[calc(100%-2.75rem)] origin-left truncate transition-all duration-200 ease-out";

const peerLabel = `${labelBase} top-1/2 -translate-y-1/2 text-base text-[#b4b4ba] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-[#2a2a2e] peer-focus:px-1 peer-focus:text-xs peer-focus:font-medium peer-focus:text-[#f4f4f5] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-[#2a2a2e] peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-[#f4f4f5]`;

export function LeadForm({
  copy,
  courses,
  whatsappUrl,
  presetSlug,
  id = "lead-form",
}: {
  copy: LeadFormCopy;
  courses: CourseOption[];
  whatsappUrl: string;
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

  const leadSchema = useMemo(() => createLeadSchema(courses.map((item) => item.slug)), [courses]);

  useEffect(() => {
    function onSelect(event: Event) {
      const slug = (event as CustomEvent<string>).detail;
      if (typeof slug === "string" && courses.some((item) => item.slug === slug)) {
        setCourse(slug);
      }
    }
    document.addEventListener(COURSE_SELECT_EVENT, onSelect);
    return () => document.removeEventListener(COURSE_SELECT_EVENT, onSelect);
  }, [courses]);

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
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, course, format, consent, company }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string; warning?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message || copy.errorText);
        return;
      }
      setStatus("success");
      setMessage(data.warning || copy.successText);
    } catch {
      setStatus("error");
      setMessage(copy.errorText);
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-3xl border border-[#3c3c42] bg-[#2a2a2e] p-6 text-[#f4f4f5] sm:p-8"
        role="status"
      >
        <h3 className="text-2xl font-medium tracking-tight">{copy.successTitle}</h3>
        <p className="mt-3 leading-relaxed text-[#c8c8ce]">{message}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#f4f4f5] px-5 py-3 text-sm font-medium text-[#141416] transition duration-200 hover:bg-white"
        >
          {copy.whatsappCta}
        </a>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className="relative rounded-3xl border border-[#3c3c42] bg-[#2a2a2e] p-6 text-[#f4f4f5] scheme-dark sm:p-8"
      noValidate
    >
      <div className="grid gap-5">
        <TextField
          id={`${id}-name`}
          label={copy.nameLabel}
          error={fieldErrors.name}
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
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
          onChange={(event) => setPhone(formatRuPhoneInput(event.target.value))}
        />
        <SelectField
          id={`${id}-course`}
          label={copy.courseLabel}
          error={fieldErrors.course}
          value={course}
          onChange={setCourse}
          placeholder={copy.coursePlaceholder}
          options={courses.map((item) => ({ value: item.slug, label: item.title }))}
        />
        <SelectField
          id={`${id}-format`}
          name={`${id}-format`}
          label={copy.formatLabel}
          error={fieldErrors.format}
          value={format}
          onChange={setFormat}
          placeholder="Выберите формат"
          options={copy.formats}
        />
        <div>
          <div className="flex items-start gap-3">
            <input
              id={`${id}-consent`}
              type="checkbox"
              className="field-control mt-1 h-4 w-4 accent-[#f4f4f5]"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={fieldErrors.consent ? `${id}-consent-error` : undefined}
            />
            <label htmlFor={`${id}-consent`} className="text-sm leading-relaxed text-[#f4f4f5]">
              {copy.consentLabel}
            </label>
          </div>
          <p className="mt-2 pl-7 text-sm">
            <Link
              href="/privacy"
              className="font-medium text-[#f4f4f5] underline decoration-white/35 underline-offset-4"
            >
              {copy.privacyLinkLabel}
            </Link>
          </p>
          {fieldErrors.consent ? (
            <p id={`${id}-consent-error`} className="mt-2 text-sm font-medium text-red-300">
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
          <p role="alert" className="text-sm font-medium text-red-300">
            {message}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-[#f4f4f5] px-5 py-3 text-sm font-medium text-[#141416] transition duration-200 hover:bg-white disabled:opacity-60"
          >
            {status === "sending" ? copy.submittingLabel : copy.submitLabel}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 px-5 py-3 text-center text-sm font-medium text-[#f4f4f5] transition duration-200 hover:border-white/70"
          >
            {copy.whatsappCta}
          </a>
        </div>
        <p className="text-sm text-[#b4b4ba]">{copy.hint}</p>
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
      <div className="relative">
        <input
          id={id}
          required
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${controlClass} peer ${error ? "border-red-400" : ""}`}
          {...props}
        />
        <label htmlFor={id} className={peerLabel}>
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-300">
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
  const [focused, setFocused] = useState(false);
  const floated = focused || value !== "";

  return (
    <div>
      <div className="relative">
        <select
          id={id}
          name={name}
          required
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${controlClass} appearance-none pr-12 ${error ? "border-red-400" : ""}`}
        >
          <option value="">{floated ? placeholder : "\u00a0"}</option>
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#d6d6db]">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M5 7.5 10 12.5 15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <label
          htmlFor={id}
          className={`${labelBase} ${
            floated
              ? "top-0 -translate-y-1/2 bg-[#2a2a2e] px-1 text-xs font-medium text-[#f4f4f5]"
              : "top-1/2 -translate-y-1/2 text-base text-[#b4b4ba]"
          }`}
        >
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
