export interface App {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  category: AppCategory;
  icon: string;
  screenshots: string[];
  version: string;
  size: string;
  updatedDate: string;
  downloads: number;
  features: string[];
  requirements: string[];
  changelog: ChangelogEntry[];
  faq: FAQEntry[];
  safety: SafetyInfo;
  rating: number;
  developer: string;
  apkUrl?: string;
}

export type AppCategory =
  | "Productivity"
  | "Business"
  | "Finance"
  | "Education"
  | "AI Tools"
  | "Security"
  | "Utilities"
  | "Entertainment";

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface FAQEntry {
  question: string;
  answer: string;
}

export interface SafetyInfo {
  virusScanned: boolean;
  secureDownload: boolean;
  sha256Hash: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  cta: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  images: string[];
  features: string[];
  technologies: string[];
  clientIndustry: string;
  results: string[];
  link?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export type BlogCategory =
  | "Mobile Development"
  | "AI"
  | "Web Development"
  | "Cybersecurity"
  | "Software Engineering"
  | "Tutorials";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  downloads: string[];
  favorites: string[];
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

export interface Stat {
  value: string;
  label: string;
}

// ===== MONETIZATION =====
export interface MonetizationConfig {
  adsense: AdSenseConfig;
  subscriptions: SubscriptionTier[];
  premiumApps: PremiumAppConfig;
  affiliate: AffiliateConfig;
  servicePackages: ServicePackage[];
  membership: MembershipConfig;
}

export interface AdSenseConfig {
  enabled: boolean;
  publisherId: string;
  slots: {
    homepage: boolean;
    blogSidebar: boolean;
    blogInline: boolean;
    appDetail: boolean;
    downloads: boolean;
  };
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface PremiumAppConfig {
  enabled: boolean;
  price: number;
  currency: string;
}

export interface AffiliateConfig {
  enabled: boolean;
  items: AffiliateItem[];
}

export interface AffiliateItem {
  id: string;
  name: string;
  description: string;
  url: string;
  commission: string;
  logo: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  category: "development" | "security" | "consulting";
  cta: string;
}

export interface MembershipConfig {
  enabled: boolean;
  free: MembershipTier;
  premium: MembershipTier;
}

export interface MembershipTier {
  name: string;
  price: number;
  features: string[];
}

// ===== GOOGLE CONFIG =====
export interface GoogleConfig {
  searchConsoleVerification: string;   // Google Search Console meta tag content
  recaptchaSiteKey: string;            // reCAPTCHA v2/v3 site key
  recaptchaSecretKey: string;          // reCAPTCHA v2/v3 secret key
  analyticsMeasurementId: string;      // Google Analytics G-XXXXXXXXXX
  tagManagerId: string;                // Google Tag Manager GTM-XXXXXXX
}
