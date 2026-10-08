"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy, Download, ExternalLink, Eye, FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { isPlaceholder, siteConfig } from "@/config/site";
import { stagger } from "@/components/ui";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { sound } from "@/lib/sound";

/** The number only exists in the page after a click, so HTML scrapers never see it. */
function decodePhone() {
  return atob(siteConfig.phoneObfuscated).split("").reverse().join("");
}
const pretty = (n: string) => n.replace(/^\+(\d{2})(\d{3})(\d{3})(\d{3})$/, "+$1 $2 $3 $4");

const rowClass =
  "group flex w-full items-center justify-between gap-4 border-b border-line/40 pb-4 text-left transition-colors";
const trailClass = "size-3.5 shrink-0 text-faint transition-colors group-hover:text-accent";

function RowBody({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center border border-line bg-surface text-accent transition-colors group-hover:border-accent">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{label}</span>
        <span className={`block truncate text-sm transition-colors ${accent ? "text-accent" : "text-muted group-hover:text-ink"}`}>
          {value}
        </span>
      </span>
    </span>
  );
}

/** Direct channels: email (copy), LinkedIn, GitHub, WhatsApp and phone (revealed on click), CV. */
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

  // First click reveals the number; the second one calls it.
  const phoneAction = () => {
    if (!phone) {
      setPhone(decodePhone());
      sound().blip();
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const icon = "size-3.5";
  const showLinkedIn = !isPlaceholder(siteConfig.linkedin);
  const showGitHub = !isPlaceholder(siteConfig.github);

  return (
    <ul className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2" aria-label="Other ways to reach me">
      <li {...stagger(0, 70)}>
        <button type="button" onClick={copyEmail} className={rowClass} aria-label={`Copy email address ${siteConfig.email}`}>
          <RowBody icon={<Mail className={icon} aria-hidden />} label="Email" value={siteConfig.email} />
          <span aria-live="polite" className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-faint">
            {copied ? <Check className="size-3.5 text-ok" aria-hidden /> : <Copy className={trailClass} aria-hidden />}
            {copied ? <span className="text-ok">Copied</span> : null}
          </span>
        </button>
      </li>
      {showLinkedIn ? (
        <li {...stagger(1, 70)}>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className={rowClass}>
            <RowBody icon={<LinkedInIcon className={icon} />} label="LinkedIn" value="/in/luis-vespa" />
            <ExternalLink className={trailClass} aria-hidden />
          </a>
        </li>
      ) : null}
      {showGitHub ? (
        <li {...stagger(2, 70)}>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className={rowClass}>
            <RowBody icon={<GitHubIcon className={icon} />} label="GitHub" value="@bytecode0" />
            <ExternalLink className={trailClass} aria-hidden />
          </a>
        </li>
      ) : null}
      <li {...stagger(3, 70)}>
        <button type="button" onClick={openWhatsApp} className={rowClass}>
          <RowBody icon={<MessageCircle className={icon} aria-hidden />} label="WhatsApp" value="Open a chat" />
          <ExternalLink className={trailClass} aria-hidden />
        </button>
      </li>
      <li {...stagger(4, 70)}>
        <button
          type="button"
          onClick={phoneAction}
          className={rowClass}
          aria-label={phone ? `Call ${pretty(phone)}` : "Show phone number"}
        >
          <RowBody icon={<Phone className={icon} aria-hidden />} label="Phone" value={phone ? pretty(phone) : "Call me"} accent={Boolean(phone)} />
          {phone ? <Phone className={trailClass} aria-hidden /> : <Eye className={trailClass} aria-hidden />}
        </button>
      </li>
      <li {...stagger(5, 70)}>
        <a href={siteConfig.cvPath} download className={rowClass}>
          <RowBody icon={<FileText className={icon} aria-hidden />} label="Curriculum vitae" value="Download PDF" />
          <Download className={trailClass} aria-hidden />
        </a>
      </li>
    </ul>
  );
}
