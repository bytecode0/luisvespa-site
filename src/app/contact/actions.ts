"use server";

import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { type ContactState, LIMITS, readFields, validateAll } from "@/lib/contact";

/**
 * Contact form → email, via Cloudflare Email Service's REST API (no SDK, no database: the message is
 * only forwarded). Sending to a *verified destination address* of Email Routing is free on every plan.
 *
 * Environment (set in Vercel, never committed):
 *   CLOUDFLARE_ACCOUNT_ID   Cloudflare account that owns luisvespa.com
 *   CLOUDFLARE_EMAIL_TOKEN  API token with "Email Sending: Edit". Without it: development logs the
 *                           message; elsewhere the form fails honestly and offers the email address.
 *   CONTACT_TO_EMAIL        the verified Email Routing destination (your real inbox)
 *   CONTACT_FROM_EMAIL      sender on the domain (default: contact@luisvespa.com)
 *   TURNSTILE_SECRET_KEY    Cloudflare Turnstile; when set, every submission must pass it.
 */

const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

/** Best-effort per-instance throttle. The real rate limit belongs in the Vercel Firewall. */
function throttled(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

async function passesTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = readFields(form);

  // Bots: a hidden field humans never fill, and forms submitted faster than a person can type.
  const honeypot = String(form.get("website") ?? "");
  const startedAt = Number(form.get("startedAt") ?? 0);
  if (honeypot || !startedAt || Date.now() - startedAt < LIMITS.minFillMs) {
    return { status: "sent" }; // pretend success; nothing is sent
  }

  const errors = validateAll(values);
  if (Object.keys(errors).length) return { status: "invalid", errors, values };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (throttled(ip)) {
    return { status: "error", values, message: "Too many messages in a short time. Please try again in a few minutes, or email me directly." };
  }
  if (!(await passesTurnstile(String(form.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", values, message: "The spam check didn't pass. Please reload the page and try again." };
  }

  const name = values.name.trim();
  const email = values.email.trim();
  const company = values.company.trim();
  const message = values.message.trim();
  const subject = `[luisvespa.com] ${values.reason} — ${name}${company ? ` (${company})` : ""}`;
  const text = `${message}\n\n—\nName: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\nReason: ${values.reason}\nSent from ${siteConfig.url}/contact`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.55;color:#111">
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
<p style="font-size:13px;color:#555">
<b>Name:</b> ${escapeHtml(name)}<br><b>Email:</b> ${escapeHtml(email)}<br>
<b>Company:</b> ${escapeHtml(company || "—")}<br><b>Reason:</b> ${escapeHtml(values.reason)}<br>
Sent from ${escapeHtml(siteConfig.url)}/contact</p></div>`;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_EMAIL_TOKEN;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!accountId || !token || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Cloudflare email not configured — message NOT sent (dev mode):\n", subject, "\n", text);
      return { status: "sent" };
    }
    console.error("[contact] CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_EMAIL_TOKEN / CONTACT_TO_EMAIL missing");
    return { status: "error", values, message: "The form isn't connected yet. Please email me directly." };
  }

  const failed = { status: "error" as const, values, message: "The message couldn't be delivered. Please try again or email me directly." };
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "contact@luisvespa.com",
        to,
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      errors?: { code?: number; message?: string }[];
      result?: { delivered?: string[]; queued?: string[]; permanent_bounces?: string[] };
    };
    const accepted = (data.result?.delivered?.length ?? 0) + (data.result?.queued?.length ?? 0) > 0;
    if (!res.ok || !data.success || !accepted) {
      console.error("[contact] Cloudflare email error", res.status, JSON.stringify(data.errors ?? data.result ?? {}));
      return failed;
    }
  } catch (err) {
    console.error("[contact] Cloudflare email request failed", err);
    return failed;
  }

  return { status: "sent" };
}
