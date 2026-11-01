export const brandVisuals = {
  hero: "/images/brand/hero-v1.webp",
  software: "/images/brand/software-v1.webp",
  ai: "/images/brand/ai-v1.webp",
  security: "/images/brand/security-v1.webp",
  social: "/images/brand/social-preview-v1.jpg",
} as const;

export function illustrationFor(subject: string) {
  if (/security|secure|cyber|vault/i.test(subject)) return brandVisuals.security;
  if (/\bai\b|ai-|chat|automation|lingo/i.test(subject)) return brandVisuals.ai;
  return brandVisuals.software;
}

export function usableImageSource(value?: string) {
  if (!value) return undefined;
  const source = value.trim();
  if ((source.startsWith("/") && !source.startsWith("//")) || /^https:\/\//i.test(source)) return source;
  return undefined;
}
