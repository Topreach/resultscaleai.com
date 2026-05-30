"use client";

export default function AdminSecurityReportsPage() {
  const reports = [
    { id: "1", client: "TechVentures Inc.", type: "Security Audit", date: "2025-03-10", status: "Completed", findings: 12, critical: 2 },
    { id: "2", client: "DataFlow Systems", type: "Penetration Test", date: "2025-03-05", status: "In Progress", findings: 8, critical: 1 },
    { id: "3", client: "StartupLab", type: "Code Review", date: "2025-02-28", status: "Completed", findings: 5, critical: 0 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Security Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Review security assessment findings</p>
          </div>
          <button className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200">
            + New Report
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Client</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Findings</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Critical</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-6 py-4 font-medium">{report.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.date}</td>
                  <td className="px-6 py-4 text-sm">{report.findings}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      report.critical > 0
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    }`}>
                      {report.critical}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      report.status === "Completed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
