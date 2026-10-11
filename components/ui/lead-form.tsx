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
      <div className="rounded-3xl border border-line bg-paper-2 p-6 sm:p-8" role="status">
        <h3 className="text-2xl font-medium tracking-tight">{copy.successTitle}</h3>
        <p className="mt-3 leading-relaxed text-muted">{message}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-teal-900 px-5 py-3 text-sm font-medium text-white"
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
      className="relative rounded-3xl border border-line bg-paper-2 p-6 sm:p-8"
      noValidate
    >
      <div className="grid gap-5">
        <Field label={copy.nameLabel} htmlFor={`${id}-name`} error={fieldErrors.name}>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Имя Фамилия"
          />
        </Field>
        <Field label={copy.phoneLabel} htmlFor={`${id}-phone`} error={fieldErrors.phone}>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(event) => setPhone(formatRuPhoneInput(event.target.value))}
            className={inputClass}
            placeholder="+7 (900) 000-00-00"
          />
        </Field>
        <Field label={copy.courseLabel} htmlFor={`${id}-course`} error={fieldErrors.course}>
          <select
            id={`${id}-course`}
            name="course"
            required
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            className={inputClass}
          >
            <option value="">{copy.coursePlaceholder}</option>
            {courses.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </Field>
        <fieldset>
          <legend className="text-sm font-medium">{copy.formatLabel}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {copy.formats.map((item) => (
              <label
                key={item.value}
                className={`cursor-pointer rounded-2xl border px-3 py-3 text-sm ${
                  format === item.value
                    ? "border-teal-900 bg-teal-900 text-white"
                    : "border-line bg-white"
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name={`${id}-format`}
                  value={item.value}
                  checked={format === item.value}
                  onChange={() => setFormat(item.value)}
                  required
                />
                {item.label}
              </label>
            ))}
          </div>
          {fieldErrors.format ? (
            <p className="mt-2 text-sm text-red-800">{fieldErrors.format}</p>
          ) : null}
        </fieldset>
        <div>
          <div className="flex items-start gap-3">
            <input
              id={`${id}-consent`}
              type="checkbox"
              className="mt-1 h-4 w-4 accent-teal-900"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
            />
            <label htmlFor={`${id}-consent`} className="text-sm leading-relaxed">
              {copy.consentLabel}
            </label>
          </div>
          <p className="mt-2 pl-7 text-sm">
            <Link href="/privacy" className="underline decoration-gold/70 underline-offset-4">
              {copy.privacyLinkLabel}
            </Link>
          </p>
          {fieldErrors.consent ? (
            <p className="mt-2 text-sm text-red-800">{fieldErrors.consent}</p>
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
          <p role="alert" className="text-sm text-red-800">
            {message}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-teal-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {status === "sending" ? copy.submittingLabel : copy.submitLabel}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-teal-900/20 px-5 py-3 text-center text-sm font-medium text-teal-900"
          >
            {copy.whatsappCta}
          </a>
        </div>
        <p className="text-sm text-muted">{copy.hint}</p>
      </div>
    </form>
  );
}

const inputClass =
  "mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none ring-teal-900/20 focus:ring-2";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-sm text-red-800">{error}</p> : null}
    </div>
  );
}
