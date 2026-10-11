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
  "field-control w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-base text-ink outline-none transition duration-200 placeholder:text-transparent focus:border-teal-900 focus:placeholder:text-[#3a5560]";

const labelBase =
  "float-label pointer-events-none absolute left-4 z-10 max-w-[calc(100%-2.75rem)] origin-left truncate transition-all duration-200 ease-out";

const peerLabel = `${labelBase} top-1/2 -translate-y-1/2 text-base text-[#3a5560] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs peer-focus:font-medium peer-focus:text-ink peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-ink`;

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
      <div className="rounded-3xl border border-line bg-paper-2 p-6 text-ink sm:p-8" role="status">
        <h3 className="text-2xl font-medium tracking-tight">{copy.successTitle}</h3>
        <p className="mt-3 leading-relaxed text-[#3a5560]">{message}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-teal-900 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-teal-800"
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
      className="relative rounded-3xl border border-line bg-paper-2 p-6 text-ink scheme-light sm:p-8"
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
        <fieldset>
          <legend className="text-sm font-medium text-ink">{copy.formatLabel}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {copy.formats.map((item) => {
              const selected = format === item.value;
              return (
                <label
                  key={item.value}
                  className={`pill cursor-pointer rounded-2xl border px-3 py-3 text-sm font-medium transition duration-200 ${
                    selected
                      ? "border-teal-900 bg-teal-900 text-white"
                      : "border-line bg-white text-ink hover:border-teal-800"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name={`${id}-format`}
                    value={item.value}
                    checked={selected}
                    onChange={() => setFormat(item.value)}
                    required
                  />
                  {item.label}
                </label>
              );
            })}
          </div>
          {fieldErrors.format ? (
            <p className="mt-2 text-sm font-medium text-red-800">{fieldErrors.format}</p>
          ) : null}
        </fieldset>
        <div>
          <div className="flex items-start gap-3">
            <input
              id={`${id}-consent`}
              type="checkbox"
              className="field-control mt-1 h-4 w-4 accent-teal-900"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={fieldErrors.consent ? `${id}-consent-error` : undefined}
            />
            <label htmlFor={`${id}-consent`} className="text-sm leading-relaxed text-ink">
              {copy.consentLabel}
            </label>
          </div>
          <p className="mt-2 pl-7 text-sm">
            <Link
              href="/privacy"
              className="font-medium text-teal-900 underline decoration-teal-900/40 underline-offset-4"
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
          <p role="alert" className="text-sm font-medium text-red-800">
            {message}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-teal-900 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-teal-800 disabled:opacity-60"
          >
            {status === "sending" ? copy.submittingLabel : copy.submitLabel}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-teal-900/30 px-5 py-3 text-center text-sm font-medium text-teal-900 transition duration-200 hover:border-teal-900"
          >
            {copy.whatsappCta}
          </a>
        </div>
        <p className="text-sm text-[#3a5560]">{copy.hint}</p>
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
          className={`${controlClass} peer ${error ? "border-red-800" : ""}`}
          {...props}
        />
        <label htmlFor={id} className={peerLabel}>
          {label}
        </label>
      </div>
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
  label,
  error,
  value,
  onChange,
  placeholder,
  options,
}: {
  id: string;
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
          name="course"
          required
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${controlClass} appearance-none pr-12 ${error ? "border-red-800" : ""}`}
        >
          <option value="">{floated ? placeholder : "\u00a0"}</option>
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink">
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
              ? "top-0 -translate-y-1/2 bg-white px-1 text-xs font-medium text-ink"
              : "top-1/2 -translate-y-1/2 text-base text-[#3a5560]"
          }`}
        >
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
