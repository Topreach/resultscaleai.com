"use client";

import { teamMembers } from "@/lib/data";

const technologies = [
  { name: "React", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Next.js", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  { name: "TypeScript", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Node.js", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { name: "Python", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { name: "Java", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { name: "Flutter", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { name: "AI Technologies", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            We are a team of passionate engineers, designers, and innovators building the future of software.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  ResultScale AI was founded with a simple mission: to make intelligent software accessible to
                  businesses and individuals alike. What started as a small team of developers has grown into a
                  full-service software development company serving clients worldwide.
                </p>
                <p>
                  We combine cutting-edge technology with proven methodologies to deliver solutions that drive
                  real business results. From mobile apps to AI systems, from web platforms to cybersecurity,
                  we bring expertise and passion to every project.
                </p>
                <p>
                  Our team&rsquo;s diverse background spans top technology companies, research institutions, and
                  successful startups. This breadth of experience allows us to approach problems from multiple
                  angles and find innovative solutions.
                </p>
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🚀</div>
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">Our Journey</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To empower businesses and individuals with intelligent software solutions that are secure,
                scalable, and beautifully designed. We believe technology should work for people, not the other way around.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To be the most trusted partner for businesses seeking to leverage AI and modern software
                development to transform their operations and create exceptional user experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The people behind ResultScale AI
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technologies We Use</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Modern tools and frameworks powering our solutions
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech) => (
              <span
                key={tech.name}
                className={`px-6 py-3 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-800 ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Work With Us?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We&rsquo;re always looking for exciting new projects and talented people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-xl shadow-indigo-500/25"
            >
              Contact Us
            </a>
            <a
              href="/portfolio"
              className="px-8 py-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
