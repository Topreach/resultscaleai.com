import type { App, BlogPost, MonetizationConfig } from "@/types";
type RecordValue = Record<string, unknown>;
export const isRecord = (value: unknown): value is RecordValue => !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown, max = 20000): value is string => typeof value === "string" && value.length <= max;
const texts = (value: unknown): value is string[] => Array.isArray(value) && value.length <= 100 && value.every((s) => text(s, 2000));
const number = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
export function validApp(value: unknown): value is App {
  if (!isRecord(value)) return false;
  return ["id", "name", "shortDescription", "description", "category", "icon", "version", "size", "updatedDate", "developer"].every((key) => text(value[key])) &&
    !!value.id && !!value.name && /^[a-zA-Z0-9_-]+$/.test(String(value.id)) &&
    ["Productivity", "Business", "Finance", "Education", "AI Tools", "Security", "Utilities", "Entertainment"].includes(String(value.category)) &&
    ["screenshots", "features", "requirements"].every((key) => texts(value[key])) && number(value.downloads) && number(value.rating) && value.rating <= 5 &&
    Array.isArray(value.changelog) && value.changelog.every((item) => isRecord(item) && text(item.version) && text(item.date) && texts(item.changes)) &&
    Array.isArray(value.faq) && value.faq.every((item) => isRecord(item) && text(item.question) && text(item.answer)) &&
    isRecord(value.safety) && typeof value.safety.virusScanned === "boolean" && typeof value.safety.secureDownload === "boolean" && text(value.safety.sha256Hash, 64) &&
    (value.apkUrl === undefined || value.apkUrl === "" || (text(value.apkUrl, 2000) && (/^\/apks\/[a-zA-Z0-9_-][a-zA-Z0-9._-]*\.apk$/.test(value.apkUrl) || /^https:\/\/[^\s]+\.apk(?:\?[^\s]*)?$/.test(value.apkUrl))));
}
export function validPost(value: unknown): value is BlogPost {
  return isRecord(value) && ["id", "slug", "title", "excerpt", "content", "category", "author", "date", "readTime", "image"].every((key) => text(value[key], key === "content" ? 200000 : 2000)) &&
    !!value.id && !!value.title && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value.slug)) && texts(value.tags);
}
export function validMonetization(value: unknown): value is MonetizationConfig {
  if (!isRecord(value) || !isRecord(value.adsense) || !isRecord(value.adsense.slots) || typeof value.adsense.enabled !== "boolean" || !text(value.adsense.publisherId, 100)) return false;
  if (value.adsense.publisherId && !/^ca-pub-\d+$/.test(value.adsense.publisherId)) return false;
  const slots = value.adsense.slots;
  if (value.adsense.unitIds !== undefined && (!isRecord(value.adsense.unitIds) || Object.values(value.adsense.unitIds).some((id) => typeof id !== "string" || (id !== "" && !/^\d{1,30}$/.test(id))))) return false;
  if (!["homepage", "blogSidebar", "blogInline", "appDetail", "downloads"].every((key) => typeof slots[key] === "boolean")) return false;
  if (!Array.isArray(value.subscriptions) || !value.subscriptions.every((p) => isRecord(p) && text(p.id) && text(p.name) && number(p.price) && ["month", "year"].includes(String(p.interval)) && texts(p.features) && text(p.description) && text(p.cta) && typeof p.highlighted === "boolean")) return false;
  if (!Array.isArray(value.servicePackages) || !value.servicePackages.every((p) => isRecord(p) && text(p.id) && text(p.name) && number(p.price) && texts(p.features) && text(p.description) && text(p.cta) && ["development", "security", "consulting"].includes(String(p.category)))) return false;
  if (!isRecord(value.premiumApps) || typeof value.premiumApps.enabled !== "boolean" || !number(value.premiumApps.price) || !text(value.premiumApps.currency, 3)) return false;
  if (!isRecord(value.affiliate) || typeof value.affiliate.enabled !== "boolean" || !Array.isArray(value.affiliate.items) || !value.affiliate.items.every((p) => isRecord(p) && ["id", "name", "description", "url", "commission", "logo"].every((key) => text(p[key])) && /^https:\/\//.test(String(p.url)))) return false;
  if (!isRecord(value.membership) || typeof value.membership.enabled !== "boolean") return false;
  return [value.membership.free, value.membership.premium].every((p) => isRecord(p) && text(p.name) && number(p.price) && texts(p.features));
}
