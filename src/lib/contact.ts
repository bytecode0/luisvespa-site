/**
 * Contact form rules, shared by the browser (inline validation) and the server action (the real check).
 */

export const REASONS = ["Job opportunity", "Freelance project", "Collaboration", "Other"] as const;
export type Reason = (typeof REASONS)[number];

export const LIMITS = {
  name: { min: 2, max: 80 },
  company: { max: 100 },
  message: { min: 20, max: 4000 },
  /** A human needs a few seconds to fill the form; bots submit instantly. */
  minFillMs: 3000,
} as const;

export type ContactFields = {
  name: string;
  email: string;
  company: string;
  reason: string;
  message: string;
  consent: boolean;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors; values: ContactFields }
  | { status: "error"; message: string; values: ContactFields }
  | { status: "sent" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(field: keyof ContactFields, values: ContactFields): string | undefined {
  switch (field) {
    case "name": {
      const v = values.name.trim();
      if (v.length < LIMITS.name.min) return "Please tell me your name.";
      if (v.length > LIMITS.name.max) return `Keep it under ${LIMITS.name.max} characters.`;
      return;
    }
    case "email":
      return EMAIL_RE.test(values.email.trim()) ? undefined : "I need a valid email to reply to you.";
    case "company":
      return values.company.trim().length > LIMITS.company.max ? `Keep it under ${LIMITS.company.max} characters.` : undefined;
    case "reason":
      return (REASONS as readonly string[]).includes(values.reason) ? undefined : "Choose what it's about.";
    case "message": {
      const v = values.message.trim();
      if (v.length < LIMITS.message.min) return `A little more detail, please (at least ${LIMITS.message.min} characters).`;
      if (v.length > LIMITS.message.max) return `Keep it under ${LIMITS.message.max} characters.`;
      return;
    }
    case "consent":
      return values.consent ? undefined : "Please confirm I can use your details to reply.";
  }
}

export function validateAll(values: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of ["name", "email", "company", "reason", "message", "consent"] as const) {
    const e = validateField(f, values);
    if (e) errors[f] = e;
  }
  return errors;
}

export function readFields(form: FormData): ContactFields {
  const s = (k: string) => String(form.get(k) ?? "");
  return {
    name: s("name"),
    email: s("email"),
    company: s("company"),
    reason: s("reason"),
    message: s("message"),
    consent: form.get("consent") === "on",
  };
}
