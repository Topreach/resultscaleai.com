import { hashPassword } from "@/lib/passwords";
import fs from "fs";
import path from "path";
import { App, BlogPost, ContactRequest, MonetizationConfig, GoogleConfig } from "@/types";
import { apps as seedApps, blogPosts as seedBlogPosts } from "@/lib/data";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string, fallback: T): T {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    writeJSON(filename, fallback);
    return fallback;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`Cannot read ${filename}; restore the data file before making changes.`, { cause: error });
  }
}

function writeJSON<T>(filename: string, data: T): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  const temporary = `${filePath}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2), { encoding: "utf-8", mode: 0o600 });
  fs.renameSync(temporary, filePath);
}

export interface AdminSession { hash: string; email: string; expiresAt: number }
export const getSessions = () => readJSON<AdminSession[]>("sessions.json", []);
export const saveSessions = (sessions: AdminSession[]) => writeJSON("sessions.json", sessions);

export interface AccountUser {
  id: string; name: string; email: string; passwordHash: string;
  downloads: string[]; favorites: string[]; createdAt: string; active: boolean;
}
export interface AccountSession { hash: string; userId: string; expiresAt: number }
export const getUsers = () => readJSON<AccountUser[]>("users.json", []);
export const saveUsers = (users: AccountUser[]) => writeJSON("users.json", users);
export const getAccountSessions = () => readJSON<AccountSession[]>("account-sessions.json", []);
export const saveAccountSessions = (sessions: AccountSession[]) => writeJSON("account-sessions.json", sessions);

export interface SecurityReport {
  id: string; client: string; type: string; date: string;
  status: "In Progress" | "Completed"; findings: number; critical: number; summary: string;
}
export const getReports = () => readJSON<SecurityReport[]>("reports.json", []);
export const saveReports = (reports: SecurityReport[]) => writeJSON("reports.json", reports);

export interface PaymentOrder {
  reference: string;
  productId: string;
  kind: "subscription" | "service";
  name: string;
  email: string;
  amount: number;
  currency: string;
  interval?: "month" | "year";
  status: "pending" | "paid";
  createdAt: string;
  transactionId?: string;
  transactionIds?: string[];
}
export const getOrders = () => readJSON<PaymentOrder[]>("orders.json", []);
export function createOrder(order: PaymentOrder) { writeJSON("orders.json", [...getOrders(), order]); }
export function markOrderPaid(reference: string, transactionId: string) {
  const orders = getOrders();
  const order = orders.find((o) => o.reference === reference);
  if (!order) throw new Error("Order not found");
  if (orders.some((o) => o.reference !== reference && (o.transactionId === transactionId || o.transactionIds?.includes(transactionId)))) throw new Error("Transaction already used");
  if (order.status === "paid" && order.transactionId !== transactionId && order.kind !== "subscription") throw new Error("Order already paid");
  order.status = "paid";
  order.transactionId ||= transactionId;
  order.transactionIds = [...new Set([...(order.transactionIds || []), transactionId])];
  writeJSON("orders.json", orders);
  return order;
}

// ===== APPS =====
export function getApps(): App[] {
  return readJSON<App[]>("apps.json", []);
}

export function getApp(id: string): App | undefined {
  return getApps().find((a) => a.id === id);
}

export function createApp(app: App): App {
  const apps = getApps();
  apps.push(app);
  writeJSON("apps.json", apps);
  return app;
}

export function updateApp(id: string, updates: Partial<App>): App | null {
  const apps = getApps();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;
  apps[index] = { ...apps[index], ...updates };
  writeJSON("apps.json", apps);
  return apps[index];
}

export function deleteApp(id: string): boolean {
  const apps = getApps();
  const filtered = apps.filter((a) => a.id !== id);
  if (filtered.length === apps.length) return false;
  writeJSON("apps.json", filtered);
  return true;
}

// ===== BLOG POSTS =====
export function getBlogPosts(): BlogPost[] {
  return readJSON<BlogPost[]>("blog.json", []);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

export function createBlogPost(post: BlogPost): BlogPost {
  const posts = getBlogPosts();
  posts.push(post);
  writeJSON("blog.json", posts);
  return post;
}

export function updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const posts = getBlogPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  posts[index] = { ...posts[index], ...updates };
  writeJSON("blog.json", posts);
  return posts[index];
}

export function deleteBlogPost(id: string): boolean {
  const posts = getBlogPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  writeJSON("blog.json", filtered);
  return true;
}

// ===== CONTACT REQUESTS =====
export function getContactRequests(): ContactRequest[] {
  return readJSON<ContactRequest[]>("contacts.json", []);
}

export function createContactRequest(request: ContactRequest): ContactRequest {
  const requests = getContactRequests();
  requests.push(request);
  writeJSON("contacts.json", requests);
  return request;
}

export function updateContactRequest(id: string, updates: Partial<ContactRequest>): ContactRequest | null {
  const requests = getContactRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return null;
  requests[index] = { ...requests[index], ...updates };
  writeJSON("contacts.json", requests);
  return requests[index];
}
// ===== SEED DATA =====
let seeded = false;

export function seedInitialData(): void {
  if (seeded) return;
  seeded = true;

  const existingApps = getApps();
  if (existingApps.length > 0) return; // already seeded

  writeJSON("apps.json", seedApps);
  writeJSON("blog.json", seedBlogPosts);
}

// ===== ADMIN SETTINGS =====
export interface AdminSettings {
  email: string;
  passwordHash: string;
  google: GoogleConfig;
}

const DEFAULT_SETTINGS: AdminSettings = {
  email: "admin@resultscaleai.com",
  passwordHash: hashPassword(process.env.ADMIN_PASSWORD || crypto.randomUUID()),
  google: {
    searchConsoleVerification: "",
    recaptchaSiteKey: "",
    recaptchaSecretKey: "",
    analyticsMeasurementId: "",
    tagManagerId: "",
  },
};
export function getAdminSettings(): AdminSettings {
  const settings = readJSON<AdminSettings>("admin.json", DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...settings, google: { ...DEFAULT_SETTINGS.google, ...settings.google } };
}

export function updateAdminPassword(newPassword: string): void {
  const settings = getAdminSettings();
  settings.passwordHash = newPassword;
  writeJSON("admin.json", settings);
}

export function updateGoogleConfig(google: GoogleConfig): void {
  const settings = getAdminSettings();
  settings.google = google;
  writeJSON("admin.json", settings);
}

// ===== MONETIZATION =====

const DEFAULT_MONETIZATION: MonetizationConfig = {
  adsense: {
    enabled: false,
    publisherId: "",
    slots: {
      homepage: true,
      blogSidebar: true,
      blogInline: true,
      appDetail: true,
      downloads: true,
    },
  },
  subscriptions: [
    {
      id: "starter",
      name: "Starter",
      price: 5,
      interval: "month",
      description: "Perfect for getting started with basic AI tools",
      features: ["Access to basic AI tools", "5 downloads per month", "Email support", "Community access"],
      highlighted: false,
      cta: "Get Started",
    },
    {
      id: "professional",
      name: "Professional",
      price: 15,
      interval: "month",
      description: "For professionals who need advanced features",
      features: ["All Starter features", "Unlimited downloads", "Premium AI tools", "Priority support", "Early access to new apps"],
      highlighted: true,
      cta: "Go Pro",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 49,
      interval: "month",
      description: "For teams and organizations",
      features: ["All Professional features", "Team collaboration", "Custom integrations", "Dedicated support", "SLA guarantee", "White-label options"],
      highlighted: false,
      cta: "Contact Us",
    },
  ],
  premiumApps: {
    enabled: true,
    price: 4.99,
    currency: "USD",
  },
  affiliate: {
    enabled: false,
    items: [
      {
        id: "cloudflare",
        name: "Cloudflare",
        description: "CDN, security, and performance",
        url: "https://www.cloudflare.com",
        commission: "Up to 20% recurring",
        logo: "/affiliates/cloudflare.svg",
      },
      {
        id: "hostinger",
        name: "Hostinger",
        description: "Affordable web hosting",
        url: "https://www.hostinger.com",
        commission: "Up to 60% commission",
        logo: "/affiliates/hostinger.svg",
      },
    ],
  },
  servicePackages: [
    {
      id: "web-scan",
      name: "Website Security Scan",
      price: 99,
      description: "Comprehensive security audit for your website",
      features: ["Vulnerability scanning", "Malware detection", "SSL/TLS check", "Detailed report", "Remediation recommendations"],
      category: "security",
      cta: "Order Now",
    },
    {
      id: "web-assessment",
      name: "Web Application Assessment",
      price: 499,
      description: "In-depth security assessment for web applications",
      features: ["OWASP Top 10 testing", "Authentication testing", "API security review", "Code review", "Penetration testing", "Comprehensive report"],
      category: "security",
      cta: "Get Assessment",
    },
    {
      id: "web-dev",
      name: "Website Development",
      price: 0,
      description: "Custom website development tailored to your needs",
      features: ["Responsive design", "SEO optimization", "CMS integration", "Performance optimization", "1 year maintenance"],
      category: "development",
      cta: "Request Quote",
    },
    {
      id: "ai-chatbot",
      name: "AI Chatbot Development",
      price: 0,
      description: "Custom AI chatbot solutions for your business",
      features: ["Natural language processing", "Multi-platform deployment", "Custom training", "Analytics dashboard", "Ongoing support"],
      category: "development",
      cta: "Get a Quote",
    },
    {
      id: "security-consulting",
      name: "Security Consulting",
      price: 0,
      description: "Expert cybersecurity consulting for your organization",
      features: ["Risk assessment", "Security architecture review", "Compliance guidance", "Incident response planning", "Security training"],
      category: "consulting",
      cta: "Contact Us",
    },
  ],
  membership: {
    enabled: false,
    free: {
      name: "Free",
      price: 0,
      features: ["Standard downloads", "Basic support", "Community access"],
    },
    premium: {
      name: "Premium",
      price: 5,
      features: ["Early access to apps", "Beta versions", "Private releases", "Priority support", "No ads"],
    },
  },
};

export function getMonetizationConfig(): MonetizationConfig {
  return readJSON<MonetizationConfig>("monetization.json", DEFAULT_MONETIZATION);
}

export function updateMonetizationConfig(config: MonetizationConfig): void {
  writeJSON("monetization.json", config);
}
