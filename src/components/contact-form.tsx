"use client";

import Link from "next/link";
import Script from "next/script";
import { type CSSProperties, useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, LoaderCircle, Mail, TriangleAlert } from "lucide-react";
import { sendContact } from "@/app/contact/actions";
import { siteConfig } from "@/config/site";
import { type ContactFields, type ContactState, type FieldErrors, LIMITS, REASONS, validateField } from "@/lib/contact";
import { sound } from "@/lib/sound";
import { Scramble } from "@/components/motion";

const EMPTY: ContactFields = { name: "", email: "", company: "", reason: "", message: "", consent: false };
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const LOG = ["validating input", "checking for spam", "encrypting payload", "transmitting"];

const inputBase =
  "w-full rounded-sm border bg-surface p-3 text-sm text-ink placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

function Field({
  id,
  label,
  error,
  hint,
  meta,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-2">
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <Scramble text={label} trigger="view" durationMs={600} delayMs={200} />
        </label>
        {meta ? <span className="font-mono text-[9px] text-faint">{meta}</span> : null}
      </div>
      {children}
      <p id={`${id}-msg`} aria-live="polite" className={`mt-1.5 min-h-4 text-xs ${error ? "text-red-400" : "text-faint"}`}>
        {error ?? hint ?? ""}
      </p>
    </div>
  );
}

/** Contact form: inline validation, terminal-style sending log, animated delivery confirmation. */
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const [values, setValues] = useState<ContactFields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFields, boolean>>>({});
  const [startedAt, setStartedAt] = useState(0);
  const [lastState, setLastState] = useState(state);
  const formRef = useRef<HTMLFormElement>(null);

  // When the server answers, adopt its values and errors (state derived during render, no effect).
  if (state !== lastState) {
    setLastState(state);
    if (state.status === "invalid" || state.status === "error") {
      setValues(state.values);
      if (state.status === "invalid") setTouched({ name: true, email: true, company: true, reason: true, message: true, consent: true });
    }
  }

  // Start the "time to fill" clock once the form is on screen (a client-only value).
  useEffect(() => {
    const t = window.setTimeout(() => setStartedAt(Date.now()), 0);
    return () => clearTimeout(t);
  }, []);

  // Sound cues for the outcome.
  useEffect(() => {
    if (state.status === "sent") sound().chord();
    else if (state.status === "error" || state.status === "invalid") sound().blip();
  }, [state]);

  const serverErrors: FieldErrors = state.status === "invalid" ? state.errors : {};
  const errorFor = (f: keyof ContactFields) => (touched[f] ? validateField(f, values) ?? serverErrors[f] : undefined);
  const set = <K extends keyof ContactFields>(k: K, v: ContactFields[K]) => setValues((p) => ({ ...p, [k]: v }));
  const blur = (k: keyof ContactFields) => setTouched((p) => ({ ...p, [k]: true }));
  const border = (f: keyof ContactFields) => (errorFor(f) ? "border-red-400/70" : "border-line");

  if (state.status === "sent" && !pending) {
    return (
      <div className="fade-up flex flex-col items-center py-12 text-center" role="status">
        <svg viewBox="0 0 64 64" className="size-20" aria-hidden>
          <circle cx="32" cy="32" r="29" fill="none" stroke="var(--human)" strokeWidth="3" className="draw-stroke" style={{ "--len": 190 } as CSSProperties} />
          <path d="M20 33 l8 8 l16 -18" fill="none" stroke="var(--human)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="draw-stroke" style={{ "--len": 50, "--d": "500ms" } as CSSProperties} />
        </svg>
        <p className="mt-8 font-mono text-2xl font-bold tracking-[0.12em] text-human">MESSAGE DELIVERED</p>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          Thanks{values.name ? `, ${values.name.trim().split(" ")[0]}` : ""}. Your message is in my inbox and I&rsquo;ll reply to the email you gave me.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          [ Send another ]
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      onSubmit={(e) => {
        // Show every inline error before going to the server.
        setTouched({ name: true, email: true, company: true, reason: true, message: true, consent: true });
        const first = (["name", "email", "reason", "message", "consent"] as const).find((f) => validateField(f, values));
        if (first) {
          e.preventDefault();
          sound().blip();
          formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
          return;
        }
        sound().click();
      }}
      className="space-y-2"
    >
      <div className={pending ? "hidden" : "space-y-2"}>
      {/* Anti-spam: humans never see or fill this field. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt || ""} />

      <div className="grid gap-x-6 sm:grid-cols-2">
        <Field id="name" label="Name *" error={errorFor("name")}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errorFor("name"))}
            aria-describedby="name-msg"
            className={`${inputBase} ${border("name")}`}
            placeholder="Your name"
          />
        </Field>
        <Field id="email" label="Email *" error={errorFor("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby="email-msg"
            className={`${inputBase} ${border("email")}`}
            placeholder="you@company.com"
          />
        </Field>
        <Field id="company" label="Company (optional)" error={errorFor("company")}>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            onBlur={() => blur("company")}
            aria-invalid={Boolean(errorFor("company"))}
            aria-describedby="company-msg"
            className={`${inputBase} ${border("company")}`}
            placeholder="Org name"
          />
        </Field>
        <Field id="reason" label="About *" error={errorFor("reason")}>
          <select
            id="reason"
            name="reason"
            value={values.reason}
            onChange={(e) => set("reason", e.target.value)}
            onBlur={() => blur("reason")}
            aria-invalid={Boolean(errorFor("reason"))}
            aria-describedby="reason-msg"
            className={`${inputBase} ${border("reason")} appearance-none`}
          >
            <option value="" disabled>
              Select topic
            </option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label="Message *" error={errorFor("message")} meta={`${values.message.length}/${LIMITS.message.max}`}>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(errorFor("message"))}
          aria-describedby="message-msg"
          className={`${inputBase} ${border("message")} resize-none`}
          placeholder="Details of your request…"
          maxLength={LIMITS.message.max}
        />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => {
              set("consent", e.target.checked);
              blur("consent");
            }}
            aria-invalid={Boolean(errorFor("consent"))}
            aria-describedby="consent-msg"
            className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
          />
          <span>
            I agree that Luis Vespa uses my name and email only to reply to this message. Nothing is stored on this
            site; the message is forwarded to his inbox.{" "}
            <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
              Privacy
            </Link>
          </span>
        </label>
        <p id="consent-msg" aria-live="polite" className="mt-1.5 min-h-4 text-xs text-red-400">
          {errorFor("consent") ?? ""}
        </p>
      </div>

      {TURNSTILE_SITE_KEY ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" data-appearance="interaction-only" />
        </>
      ) : null}
      </div>

      {state.status === "error" && !pending ? (
        <div role="alert" className="fade-up rounded-sm border border-red-500/50 bg-red-500/10 p-6 text-center">
          <TriangleAlert className="mx-auto mb-3 size-6 text-red-400" aria-hidden />
          <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink">Transmission failed</p>
          <p className="mt-2 text-xs text-muted">{state.message} Your text is still in the form below.</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent hover:text-ink"
          >
            <Mail className="size-3.5" aria-hidden /> {siteConfig.email}
          </a>
        </div>
      ) : null}

      {pending ? (
        <ol aria-live="polite" className="mb-6 rounded-sm border border-line bg-black/40 p-6 font-mono text-[11px] leading-6">
          {LOG.map((line, i) => (
            <li key={line} className="fade-up text-muted" style={{ animationDelay: `${i * 260}ms` }}>
              <span className="text-accent">&gt;</span> {line}…
            </li>
          ))}
        </ol>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className={`group inline-flex w-full items-center justify-center gap-3 rounded-sm px-12 py-4 font-mono text-sm font-bold uppercase tracking-[0.14em] transition-colors md:w-auto ${
            pending ? "cursor-wait border border-line bg-surface-2 text-muted" : "bg-accent text-white hover:bg-accent-bright"
          }`}
        >
          {pending ? "Transmitting…" : "Send message"}
          {pending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
          ) : (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          )}
        </button>
      </div>
    </form>
  );
}

