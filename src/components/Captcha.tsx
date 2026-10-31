"use client";
import Script from "next/script";
import { useRef } from "react";
declare global {
  interface Window { grecaptcha?: { ready: (callback: () => void) => void; render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => number } }
}
export default function Captcha({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  return <><Script id="recaptcha" src="https://www.google.com/recaptcha/api.js?render=explicit" onReady={() => { if (container.current && window.grecaptcha && !rendered.current) { window.grecaptcha.ready(() => { if (!container.current || !window.grecaptcha) return; window.grecaptcha.render(container.current, { sitekey: siteKey, callback: onToken, "expired-callback": () => onToken(""), "error-callback": () => onToken("") }); rendered.current = true; }); } }} /><div ref={container} /><p className="text-xs text-gray-500">Protected by reCAPTCHA. Google&apos;s <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms</a> apply.</p></>;
}
