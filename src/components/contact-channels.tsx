"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { isPlaceholder, siteConfig } from "@/config/site";
import { stagger } from "@/components/ui";
import { sound } from "@/lib/sound";

/** The number only exists in the page after a click, so HTML scrapers never see it. */
function decodePhone() {
  return atob(siteConfig.phoneObfuscated).split("").reverse().join("");
}

const rowClass =
  "group flex w-full items-center gap-4 border border-line bg-bg/40 px-4 py-3.5 text-left transition-colors hover:border-accent/60 hover:bg-surface-2";
const iconClass = "size-4 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110";

function Row({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{label}</span>
        <span className="block truncate text-sm text-ink">{value}</span>
      </span>
      {children}
    </>
  );
}

/** Direct channels: email (copy), LinkedIn, GitHub, WhatsApp and call (revealed on click), CV. */
export function ContactChannels() {
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      sound().click();
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  const openWhatsApp = () => {
    const number = decodePhone();
    setPhone(number);
    const text = encodeURIComponent("Hi Luis, I found your website and I'd like to talk.");
    window.open(`https://wa.me/${number.replace(/\D/g, "")}?text=${text}`, "_blank", "noopener");
  };

  const call = () => {
    const number = decodePhone();
    setPhone(number);
    window.location.href = `tel:${number}`;
  };

  const pretty = (n: string) => n.replace(/^\+(\d{2})(\d{3})(\d{3})(\d{3})$/, "+$1 $2 $3 $4");
  const links = [
    { label: "LinkedIn", value: "luis-vespa", href: siteConfig.linkedin },
    { label: "GitHub", value: "bytecode0", href: siteConfig.github },
  ].filter((l) => !isPlaceholder(l.href));

  return (
    <ul className="space-y-2.5" aria-label="Other ways to reach me">
      <li {...stagger(0, 70)}>
        <button type="button" onClick={copyEmail} className={rowClass} aria-label={`Copy email address ${siteConfig.email}`}>
          <Mail className={iconClass} aria-hidden />
          <Row label="Email" value={siteConfig.email}>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted" aria-live="polite">
              {copied ? <Check className="size-3.5 text-ok" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </span>
          </Row>
        </button>
      </li>
      {links.map((l, i) => (
        <li key={l.label} {...stagger(i + 1, 70)}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
            <ArrowUpRight className={iconClass} aria-hidden />
            <Row label={l.label} value={l.value} />
          </a>
        </li>
      ))}
      <li {...stagger(3, 70)}>
        <button type="button" onClick={openWhatsApp} className={rowClass}>
          <MessageCircle className={iconClass} aria-hidden />
          <Row label="WhatsApp" value={phone ? pretty(phone) : "Open a chat"} />
        </button>
      </li>
      <li {...stagger(4, 70)}>
        <button type="button" onClick={call} className={rowClass}>
          <Phone className={iconClass} aria-hidden />
          <Row label="Phone" value={phone ? pretty(phone) : "Call me"} />
        </button>
      </li>
      <li {...stagger(5, 70)}>
        <a href={siteConfig.cvPath} download className={rowClass}>
          <FileText className={iconClass} aria-hidden />
          <Row label="CV" value="Download PDF" />
        </a>
      </li>
    </ul>
  );
}
