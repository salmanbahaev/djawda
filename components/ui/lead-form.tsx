"use client";

import * as Select from "@radix-ui/react-select";
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
  "field-control w-full rounded-2xl border border-[#cfcfca] bg-[#f7f7f6] px-4 py-3.5 text-base text-[#17171a] outline-none transition duration-200 placeholder:text-transparent focus:border-[#17171a] focus:placeholder:text-[#6d6d73]";

const labelBase =
  "float-label pointer-events-none absolute left-4 z-10 max-w-[calc(100%-2.75rem)] origin-left truncate transition-all duration-200 ease-out";

const peerLabel = `${labelBase} top-1/2 -translate-y-1/2 text-base text-[#5c5c62] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs peer-focus:font-medium peer-focus:text-[#17171a] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-[#17171a]`;

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
        className="rounded-3xl border border-[#d8d8d4] bg-white p-6 text-[#17171a] shadow-[0_1px_2px_rgba(23,23,26,0.04)] sm:p-8"
        role="status"
      >
        <h3 className="text-2xl font-medium tracking-tight">{copy.successTitle}</h3>
        <p className="mt-3 leading-relaxed text-[#3f3f46]">{message}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#17171a] px-5 py-3 text-sm font-medium text-[#f5f5f4] transition duration-200 hover:bg-[#2c2c30]"
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
      className="relative rounded-3xl border border-[#d8d8d4] bg-white p-6 text-[#17171a] shadow-[0_1px_2px_rgba(23,23,26,0.04)] scheme-light sm:p-8"
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
              className="field-control mt-1 h-4 w-4 accent-[#17171a]"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              required
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={fieldErrors.consent ? `${id}-consent-error` : undefined}
            />
            <label htmlFor={`${id}-consent`} className="text-sm leading-relaxed text-[#17171a]">
              {copy.consentLabel}
            </label>
          </div>
          <p className="mt-2 pl-7 text-sm">
            <Link
              href="/privacy"
              className="font-medium text-[#17171a] underline decoration-[#17171a]/30 underline-offset-4"
            >
              {copy.privacyLinkLabel}
            </Link>
          </p>
          {fieldErrors.consent ? (
            <p id={`${id}-consent-error`} className="mt-2 text-sm font-medium text-red-700">
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
          <p role="alert" className="text-sm font-medium text-red-700">
            {message}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-[#17171a] px-5 py-3 text-sm font-medium text-[#f5f5f4] transition duration-200 hover:bg-[#2c2c30] disabled:opacity-60"
          >
            {status === "sending" ? copy.submittingLabel : copy.submitLabel}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#17171a]/25 px-5 py-3 text-center text-sm font-medium text-[#17171a] transition duration-200 hover:border-[#17171a]/60"
          >
            {copy.whatsappCta}
          </a>
        </div>
        <p className="text-sm text-[#3f3f46]">{copy.hint}</p>
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
          className={`${controlClass} peer ${error ? "border-red-700" : ""}`}
          {...props}
        />
        <label htmlFor={id} className={peerLabel}>
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-700">
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
  const floated = open || value !== "";

  return (
    <div>
      <Select.Root
        name={name}
        value={value}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <div className="relative">
          <Select.Trigger
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${controlClass} flex items-center justify-between gap-3 pr-4 text-left ${
              error ? "border-red-700" : ""
            }`}
          >
            <Select.Value
              placeholder={floated ? placeholder : "\u00a0"}
              className={floated && value === "" ? "text-[#6d6d73]" : undefined}
            />
            <Select.Icon
              className={`shrink-0 text-[#3f3f46] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
          <label
            htmlFor={id}
            className={`${labelBase} ${
              floated
                ? "top-0 -translate-y-1/2 bg-white px-1 text-xs font-medium text-[#17171a]"
                : "top-1/2 -translate-y-1/2 text-base text-[#5c5c62]"
            }`}
          >
            {label}
          </label>
        </div>
        <Select.Portal>
          <Select.Content
            position="popper"
            side="bottom"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            className="select-popover z-[60] w-[var(--radix-select-trigger-width)]"
          >
            <div className="select-popover-panel overflow-hidden rounded-2xl border border-[#d8d8d4] bg-white text-[#17171a] shadow-[0_18px_40px_-24px_rgba(23,23,26,0.45)]">
              <Select.Viewport className="max-h-[min(18rem,var(--radix-select-content-available-height))] overflow-y-auto p-1.5">
                {options.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="relative flex cursor-pointer items-center rounded-xl py-2.5 pr-3 pl-9 text-sm outline-none data-[highlighted]:bg-[#f0f0ee] data-[state=checked]:font-medium"
                  >
                    <Select.ItemIndicator className="absolute left-3 inline-flex text-[#17171a]">
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
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </div>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
