"use client";

import Link from "next/link";

const securityServices = [
  {
    title: "Security Consulting",
    description: "Expert guidance on security strategy, compliance, and risk management for your organization.",
    icon: "🛡️",
    features: ["Security Strategy Development", "Compliance Assessment", "Risk Management", "Security Architecture Review"],
  },
  {
    title: "Application Security",
    description: "Comprehensive security testing and hardening for your software applications.",
    icon: "🔒",
    features: ["Secure Code Review", "SAST & DAST Analysis", "API Security Testing", "Security Hardening"],
  },
  {
    title: "Website Security Assessment",
    description: "Thorough security evaluation of web applications and infrastructure.",
    icon: "🌐",
    features: ["Vulnerability Scanning", "Web Application Firewall", "SSL/TLS Audit", "DDoS Protection Assessment"],
  },
  {
    title: "Security Best Practices",
    description: "Implement industry-standard security practices across your development lifecycle.",
    icon: "📋",
    features: ["DevSecOps Implementation", "Security Training", "Incident Response Planning", "Security Policies"],
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🛡️</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Cybersecurity Hub</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Protecting your digital assets with expert security solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {securityServices.map((service) => (
              <div
                key={service.title}
                className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Research */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Security Research & Articles</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay informed with the latest cybersecurity research and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Cybersecurity Best Practices for 2025", category: "Best Practices", date: "Mar 5, 2025" },
              { title: "Understanding Zero Trust Architecture", category: "Research", date: "Feb 28, 2025" },
              { title: "Secure Coding Guidelines for Developers", category: "Tutorial", date: "Feb 20, 2025" },
            ].map((article) => (
              <Link
                key={article.title}
                href="/blog"
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
              >
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {article.category}
                </span>
                <h3 className="font-semibold mt-2 mb-2">{article.title}</h3>
                <span className="text-sm text-gray-400">{article.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Security Review?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Our cybersecurity experts will assess your systems and provide actionable recommendations.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-xl shadow-indigo-500/25"
          >
            Request Security Review
          </Link>
        </div>
      </section>
    </div>
  );
}
