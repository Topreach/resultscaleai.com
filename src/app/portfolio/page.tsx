"use client";

import { portfolioProjects } from "@/lib/data";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Showcasing our best work across industries
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {portfolioProjects.map((project, index) => (
            <div
              key={project.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-16`}
            >
              {/* Project Images */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`aspect-video bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center ${
                        imgIndex === 0 ? "col-span-2" : ""
                      }`}
                    >
                      <div className="text-center">
                        <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-400 mt-2 block">Project Image</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div className="flex-1">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
                  {project.clientIndustry}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-200 dark:border-indigo-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div>
                  <h3 className="font-semibold mb-3">Results</h3>
                  <div className="space-y-2">
                    {project.results.map((result) => (
                      <div key={result} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Be Our Next Success Story?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Let&rsquo;s discuss your project and create something amazing together.
          </p>
          <a
            href="/contact"
            className="inline-flex px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-xl shadow-indigo-500/25"
          >
            Start Your Project
          </a>
        </div>
      </section>
    </div>
  );
}
