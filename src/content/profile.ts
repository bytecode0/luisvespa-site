/**
 * Single source of truth for everything the site states about Luis.
 * Only verified facts live here. Anything unknown is an explicit placeholder.
 */

export type Role = {
  company: string;
  title: string;
  period: string;
  domain: string;
  points: string[];
  tags: string[];
};

export const summary = {
  years: "13+ years",
  headline: "I build secure Android systems — and the agents that build them.",
  tagline: "Secure Android. Intelligent automation. Agentic SDLC.",
  short:
    "Senior Android Engineer building secure, regulated mobile products in digital identity, medtech, banking and telecom.",
  industries: ["Digital identity", "Medtech", "Banking", "Telecom", "IoT"],
  languages: ["Spanish (native)", "English (C1)"],
  eligibility: "EU citizen — no visa required",
};

export const roles: Role[] = [
  {
    company: "Digidentity",
    title: "Senior Android Engineer",
    period: "Jan 2025 – Present",
    domain: "Digital identity and trust services",
    tags: ["Agentic SDLC", "Claude Code", "MCP", "X.509", "DexGuard", "Passwordless login"],
    points: [
      "Designed and run an AI-agentic development and testing system on a server with Android emulators and physical devices.",
      "Agents built on Claude Code, connected to Jira, Figma and GitLab through MCP servers.",
      "Android SDK and decentralized identity wallet: identity verification, onboarding, secure authentication and passwordless login (PLS).",
      "Digital signatures with X.509 certificates; app hardening with DexGuard.",
    ],
  },
  {
    company: "InnoIT — Ypsomed project",
    title: "Android Tech Lead",
    period: "Jun 2022 – Dec 2024",
    domain: "Medtech",
    tags: ["PKI", "mTLS", "Android + iOS SDKs", "TDD", "CI/CD"],
    points: [
      "Android Tech Lead for the SDKs (Android and iOS) of the YpsoPump insulin pump at Ypsomed.",
      "Encrypted communication channel between the Android device and the medical device, authenticated with PKI and certificate-based mTLS.",
      "High-reliability architecture with TDD, Coroutines, XP and CI/CD pipelines.",
    ],
  },
  {
    company: "Vodafone",
    title: "Android Engineer",
    period: "Sep 2019 – Jun 2022",
    domain: "Telecom e-commerce",
    tags: ["Android", "E-commerce", "UX & stability"],
    points: ["Core features for Vodafone's e-commerce mobile app, improving UX and stability."],
  },
  {
    company: "Unisys",
    title: "Android Engineer",
    period: "Feb 2019 – Sep 2019",
    domain: "Airport operations",
    tags: ["Java", "Clean Architecture", "MDM"],
    points: ["ENIRE airport operations app: Java, Clean Architecture, MDM, unit tests."],
  },
  {
    company: "EVO Banco",
    title: "Software Engineer",
    period: "Jun 2018 – Dec 2018",
    domain: "Banking",
    tags: ["Java 8", "Spring Boot", "Angular"],
    points: ["CRM system with Java 8, Spring Boot, SQL Server and Angular."],
  },
  {
    company: "Wallbox",
    title: "Android & iOS Developer",
    period: "Jan 2018 – Jun 2018",
    domain: "EV charging / IoT",
    tags: ["Bluetooth", "Wi-Fi", "IoT"],
    points: ["EV charger control over Bluetooth and Wi-Fi."],
  },
  {
    company: "PICKUP",
    title: "Backend & Mobile Developer",
    period: "Feb 2016 – Dec 2017",
    domain: "Food delivery",
    tags: ["PCI-DSS", "Backend", "Mobile"],
    points: ["Backend and mobile apps, including PCI-DSS compliant payments."],
  },
];

/**
 * Public apps from companies Luis worked at. Images are taken from the public Google Play listings
 * (promotional screenshots, credited to their owners). `role` must match a `roles[].company`.
 */
export type ShippedApp = {
  slug: string;
  name: string;
  company: string;
  role: string;
  period: string;
  domain: string;
  storeUrl: string;
  /** How Luis relates to the app, shown under its name. Default: "Android app I worked on". */
  relation?: string;
  /** What Luis did, phrased from the verified role facts only. */
  contribution: string;
  /** Shown under the gallery; honest about current listings vs. his time there. */
  credit: string;
  screens: { src: string; alt: string }[];
};

export const apps: ShippedApp[] = [
  {
    slug: "digidentity",
    name: "Digidentity Wallet",
    company: "Digidentity",
    role: "Digidentity",
    period: "2025 – Present",
    domain: "Digital identity",
    storeUrl: "https://play.google.com/store/apps/details?id=com.digidentity",
    contribution: "Android engineer on the identity wallet and its SDK: identity verification, onboarding, passwordless login, X.509 digital signatures and DexGuard hardening.",
    credit: "Screens from the public Google Play listing · © Digidentity",
    screens: [
      { src: "/apps/digidentity/1.webp", alt: "Digidentity Wallet: secure log in screen" },
      { src: "/apps/digidentity/2.webp", alt: "Digidentity Wallet: proving your identity with a passport scan" },
      { src: "/apps/digidentity/3.webp", alt: "Digidentity Wallet: signing a document with a qualified e-signature" },
    ],
  },
  {
    slug: "ypsopump",
    name: "YpsoPump Explorer",
    company: "Ypsomed (via InnoIT)",
    role: "InnoIT — Ypsomed project",
    period: "2022 – 2024",
    domain: "Medtech",
    storeUrl: "https://play.google.com/store/apps/details?id=com.ypsomed.ypu.demo",
    contribution: "Android Tech Lead for the YpsoPump SDKs at Ypsomed (Android and iOS), including the PKI / certificate-based mTLS channel between the phone and the insulin pump.",
    relation: "Android Tech Lead · YpsoPump SDKs",
    credit: "Screens from the current public Google Play listing · © Ypsomed",
    screens: [
      { src: "/apps/ypsopump/1.webp", alt: "YpsoPump Explorer: 3D pump simulator" },
      { src: "/apps/ypsopump/2.webp", alt: "YpsoPump Explorer: guided tours of the pump" },
      { src: "/apps/ypsopump/3.webp", alt: "YpsoPump Explorer: overview of the pump icons" },
    ],
  },
  {
    slug: "mivodafone",
    name: "Mi Vodafone",
    company: "Vodafone",
    role: "Vodafone",
    period: "2019 – 2022",
    domain: "Telecom e-commerce",
    storeUrl: "https://play.google.com/store/apps/details?id=es.vodafone.mobile.mivodafone",
    contribution: "Android engineer building core features of Vodafone's e-commerce app, improving UX and stability.",
    credit: "Current public Google Play listing (the app has evolved since 2022) · © Vodafone",
    screens: [
      { src: "/apps/mivodafone/1.webp", alt: "Mi Vodafone: home screen" },
      { src: "/apps/mivodafone/2.webp", alt: "Mi Vodafone: bills overview" },
      { src: "/apps/mivodafone/3.webp", alt: "Mi Vodafone: managing your products" },
    ],
  },
];

export const appForRole = (company: string) => apps.find((a) => a.role === company);

/** Engineering domains. `evidence` names where the work was done. */
export const domains = [
  {
    id: "android",
    label: "Android",
    href: "/engineering#android",
    responsibility: "Architecture, modularization and delivery of production Android apps.",
    evidence: "Digidentity · Vodafone · Unisys",
  },
  {
    id: "security",
    label: "Mobile security",
    href: "/security",
    responsibility: "Trust boundaries, secure storage, secure networking and app hardening.",
    evidence: "Digidentity · Ypsomed",
  },
  {
    id: "sdk",
    label: "SDK engineering",
    href: "/engineering#sdk-lab",
    responsibility: "SDKs as products: API design, compatibility, testing and distribution.",
    evidence: "Digidentity · Ypsomed",
  },
  {
    id: "identity",
    label: "Identity / PKI",
    href: "/security#identity",
    responsibility: "Certificates, mTLS, digital signatures and passwordless login.",
    evidence: "Digidentity · Ypsomed",
  },
  {
    id: "agents",
    label: "AI agents",
    href: "/agents",
    responsibility: "Agents that refine, implement, test and review Android work.",
    evidence: "Digidentity, 2026",
  },
  {
    id: "mcp",
    label: "MCP",
    href: "/agents#mcp",
    responsibility: "Connecting agents to Jira, Figma and GitLab with controlled capabilities.",
    evidence: "Digidentity, 2026",
  },
  {
    id: "sdlc",
    label: "Agentic SDLC",
    href: "/agents#pipeline",
    responsibility: "A ticket-to-merge pipeline with on-device testing and human approval gates.",
    evidence: "Digidentity, 2026",
  },
] as const;

export const androidStack = [
  "Kotlin",
  "Jetpack Compose",
  "Jetpack",
  "Coroutines",
  "Flow",
  "RxJava",
  "Dagger 2 / Hilt",
  "Clean Architecture",
  "MVVM / MVI",
  "Modularization",
  "TDD",
  "JUnit / Mockito",
  "Instrumented tests",
  "CI/CD",
  "Bluetooth / BLE",
];

export const androidLayers = [
  {
    id: "app",
    name: "Application",
    detail: "Entry points, navigation and app-level wiring. Thin by design: features own their behaviour.",
    tags: ["Compose", "Navigation", "DI graph"],
  },
  {
    id: "features",
    name: "Feature modules",
    detail: "Independent modules per user flow: onboarding, verification, authentication. Each testable in isolation.",
    tags: ["MVVM / MVI", "Compose UI", "UI tests"],
  },
  {
    id: "domain",
    name: "Domain / core",
    detail: "Use cases and models with no Android dependency. Where TDD pays off the most.",
    tags: ["Kotlin", "Coroutines", "Flow", "TDD"],
  },
  {
    id: "sdk",
    name: "SDK / platform",
    detail: "Reusable SDKs with a stable public API, consumed by apps and external teams.",
    tags: ["API design", "Versioning", "Compatibility"],
  },
  {
    id: "security",
    name: "Security",
    detail: "Keys, certificates and trust: Android Keystore, mTLS, pinning, signatures, hardening.",
    tags: ["Keystore", "mTLS", "DexGuard / R8"],
  },
  {
    id: "os",
    name: "Android OS",
    detail: "Platform APIs and hardware: Bluetooth / BLE, biometrics, background work, device constraints.",
    tags: ["Platform APIs", "BLE", "Devices"],
  },
] as const;

export const securityAreas = [
  {
    id: "identity",
    label: "Identity & authentication",
    items: [
      "Certificate-based authentication",
      "PKI and X.509 certificates",
      "Digital signatures with certificates",
      "Passwordless login (PLS)",
      "Device binding",
      "Identity verification and onboarding",
    ],
    evidence: "Digidentity · Ypsomed",
  },
  {
    id: "network",
    label: "Network security",
    items: [
      "mTLS with client certificates",
      "Certificate pinning",
      "Encrypted device-to-device channels",
      "Secure API communication",
    ],
    evidence: "Ypsomed · Digidentity",
  },
  {
    id: "crypto",
    label: "Cryptography & storage",
    items: [
      "Android Keystore",
      "Key management",
      "Signing and encryption",
      "Secure secret handling",
    ],
    evidence: "Digidentity · Ypsomed",
  },
  {
    id: "hardening",
    label: "Application hardening",
    items: [
      "DexGuard obfuscation and hardening",
      "R8 / ProGuard shrinking and obfuscation",
      "Reverse-engineering resistance",
      "Attack-surface reduction",
    ],
    evidence: "Digidentity",
  },
] as const;

/** The real pipeline running at Digidentity in 2026. */
export const pipeline = [
  { id: "refine", n: "01", name: "Refinement", actor: "agent", detail: "Agent reads the Jira ticket and Figma designs and proposes a plan." },
  { id: "gate-plan", n: "02", name: "Human approval", actor: "human", detail: "An engineer approves or rejects the plan before any code is written." },
  { id: "develop", n: "03", name: "Development", actor: "agent", detail: "Agent writes Kotlin / Compose code and tests against the approved plan." },
  { id: "test", n: "04", name: "Testing", actor: "agent", detail: "Tests run on Android emulators and physical devices on a dedicated server." },
  { id: "review", n: "05", name: "Review", actor: "agent", detail: "Agent reviews the change against the project's architecture and conventions." },
  { id: "gate-merge", n: "06", name: "Human approval", actor: "human", detail: "An engineer approves the merge request. Accountability stays human." },
] as const;

export const mcpConnections = {
  connected: [
    { name: "Jira", role: "Tickets, acceptance criteria, status" },
    { name: "Figma", role: "Designs and components" },
    { name: "GitLab", role: "Branches and merge requests" },
  ],
  environment: [
    { name: "Android emulators", role: "Instrumented and UI tests" },
    { name: "Physical devices", role: "Real-hardware validation" },
  ],
  exploring: ["Gradle", "Logcat", "Static analysis", "Security scanning", "Documentation"],
};

export const agentBoundaries = [
  { name: "Context", detail: "Agents work from the ticket, the designs and the codebase — nothing implicit." },
  { name: "Permissions", detail: "Least privilege: each tool exposes only the actions a stage needs." },
  { name: "Tools", detail: "Capabilities arrive through MCP servers, not ad-hoc scripts." },
  { name: "Policies", detail: "Architecture and coding conventions are part of the agent's instructions." },
  { name: "Evaluations", detail: "Tests on emulators and real devices decide, not the agent's own claims." },
] as const;

export type CaseStudy = {
  id: string;
  title: string;
  context: string;
  tags: string[];
  sections: { label: string; body: string | null }[];
};

/** Case studies: known facts filled in, everything else left as an explicit placeholder (null). */
export const caseStudies: CaseStudy[] = [
  {
    id: "agentic-sdlc",
    title: "An agentic SDLC for Android",
    context: "Digidentity · 2026",
    tags: ["AI", "MCP", "ANDROID", "ARCHITECTURE"],
    sections: [
      { label: "Problem", body: null },
      { label: "Constraints", body: "Regulated identity product: every change needs human accountability and real-device validation." },
      { label: "Architecture", body: "Six stages — refinement, approval, development, testing, review, approval — with Claude Code agents connected to Jira, Figma and GitLab via MCP." },
      { label: "Decisions", body: "Two human gates: one before code is written, one before merge." },
      { label: "Implementation", body: "Runs on a dedicated server with Android emulators and physical devices." },
      { label: "Security", body: null },
      { label: "Result", body: null },
      { label: "Lessons", body: null },
    ],
  },
  {
    id: "medical-device-channel",
    title: "Secure channel to a medical device",
    context: "InnoIT — Ypsomed · 2022–2024",
    tags: ["SECURITY", "mTLS", "PKI", "SDK"],
    sections: [
      { label: "Problem", body: null },
      { label: "Constraints", body: "EU medical device: high reliability and secure communication between phone and device." },
      { label: "Architecture", body: "Android and iOS SDKs with an encrypted channel authenticated by PKI and certificate-based mTLS." },
      { label: "Decisions", body: null },
      { label: "Implementation", body: "TDD, Coroutines, XP practices and CI/CD pipelines." },
      { label: "Security", body: null },
      { label: "Result", body: null },
      { label: "Lessons", body: null },
    ],
  },
  {
    id: "identity-wallet",
    title: "Identity SDK and wallet",
    context: "Digidentity · 2025",
    tags: ["ANDROID", "SDK", "SECURITY", "PKI"],
    sections: [
      { label: "Problem", body: null },
      { label: "Constraints", body: null },
      { label: "Architecture", body: "Android SDK and decentralized identity wallet." },
      { label: "Decisions", body: null },
      { label: "Implementation", body: "Identity verification, onboarding, secure authentication, passwordless login and certificate-based digital signatures." },
      { label: "Security", body: "App hardened with DexGuard." },
      { label: "Result", body: null },
      { label: "Lessons", body: null },
    ],
  },
];

/** Knowledge base for "Ask Luis". Answers are written from the facts above only. */
export const askLuis = [
  {
    q: "What is Luis's Android experience?",
    keywords: ["android", "experience", "kotlin", "compose", "years"],
    a: "13+ years in software, most of it on Android: Digidentity (2025–present), Android Tech Lead for the Ypsomed YpsoPump SDKs, medical-device project (2022–2024), Vodafone (2019–2022) and Unisys (2019). Stack: Kotlin, Jetpack Compose, Coroutines, Flow, Clean Architecture, MVVM/MVI, TDD and CI/CD.",
  },
  {
    q: "Tell me about his security experience.",
    keywords: ["security", "secure", "hardening", "keystore", "pinning"],
    a: "At Ypsomed he built an encrypted channel between Android and a medical device, authenticated with PKI and certificate-based mTLS. At Digidentity he works on identity: digital signatures with X.509 certificates, passwordless login and DexGuard hardening. He has also used Android Keystore, R8/ProGuard, certificate pinning and device binding.",
  },
  {
    q: "What does he know about mTLS?",
    keywords: ["mtls", "tls", "certificate", "pki", "x.509"],
    a: "He implemented PKI and certificate-based mTLS authentication for the encrypted channel between an Android device and the YpsoPump insulin pump (Ypsomed, 2022–2024).",
  },
  {
    q: "How does he approach SDK architecture?",
    keywords: ["sdk", "api", "library", "architecture"],
    a: "He treats SDKs as products: a stable public API, versioning and compatibility, tests and documentation. He led the Android and iOS SDKs for the Ypsomed device and develops the Android identity SDK at Digidentity.",
  },
  {
    q: "What is his vision for agentic SDLC?",
    keywords: ["agent", "agentic", "sdlc", "ai", "mcp", "claude", "automation"],
    a: "At Digidentity he designed and runs a pipeline where Claude Code agents, connected to Jira, Figma and GitLab via MCP, take a ticket through refinement, development, testing on emulators and physical devices, and review — with human approval before coding and before merge.",
  },
  {
    q: "What is his experience with application hardening?",
    keywords: ["dexguard", "r8", "proguard", "obfuscation", "reverse"],
    a: "He applies DexGuard obfuscation and hardening at Digidentity and has used R8/ProGuard. He sees obfuscation as one layer of defense in depth, not a replacement for secure architecture.",
  },
];
