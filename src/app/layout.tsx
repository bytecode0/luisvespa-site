import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { isPlaceholder, isPreproduction, siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { CommandPalette } from "@/components/command-palette";
import { ContactSection, SiteFooter } from "@/components/contact";
import { viewModeBootScript } from "@/components/view-mode";
import { InteractionLayer } from "@/components/interaction-layer";

const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const title = `${siteConfig.name} — Senior Android Engineer · Security · SDKs · AI Agents`;
const description =
  "Senior Android Engineer specializing in secure mobile systems, SDK engineering, authentication, PKI, mTLS, application hardening and AI-agentic software engineering.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s · ${siteConfig.name}` },
  description,
  keywords: [
    "Senior Android Engineer",
    "Android Security",
    "Mobile Security",
    "Android SDK",
    "mTLS",
    "PKI",
    "Certificate Authentication",
    "DexGuard",
    "Application Hardening",
    "AI Agents",
    "MCP",
    "Agentic SDLC",
  ],
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: isPreproduction ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.fullName,
  alternateName: siteConfig.name,
  jobTitle: siteConfig.role,
  url: siteConfig.url,
  email: `mailto:${siteConfig.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" },
  knowsAbout: ["Android", "Kotlin", "Mobile security", "PKI", "mTLS", "DexGuard", "Android SDK", "AI agents", "Model Context Protocol"],
  sameAs: [siteConfig.linkedin, siteConfig.github].filter((u) => !isPlaceholder(u)),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-view="engineer" suppressHydrationWarning className={`${plexSans.variable} ${plexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: viewModeBootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <div className="dot-field" aria-hidden />
        <div className="dot-radar" aria-hidden />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <ContactSection />
        <SiteFooter />
        <CommandPalette />
        <InteractionLayer />
        {isPreproduction ? (
          <div
            aria-hidden
            className="pointer-events-none fixed bottom-3 left-3 z-50 border border-human/50 bg-bg/90 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-human"
          >
            PRE-PRODUCTION
          </div>
        ) : null}
      </body>
    </html>
  );
}
