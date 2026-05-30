"use client";

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Download Analytics</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-4">Downloads by App</h3>
            <div className="space-y-4">
              {[
                { name: "FinWise", downloads: 42100, color: "bg-indigo-500" },
                { name: "AIDesigner", downloads: 32100, color: "bg-cyan-500" },
                { name: "SecureVault", downloads: 28450, color: "bg-green-500" },
                { name: "FitPulse", downloads: 25600, color: "bg-orange-500" },
                { name: "LingoAI", downloads: 18900, color: "bg-purple-500" },
                { name: "TaskFlow Pro", downloads: 15230, color: "bg-pink-500" },
              ].map((item) => {
                const maxDownloads = 42100;
                const width = (item.downloads / maxDownloads) * 100;
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="text-gray-500">{item.downloads.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-4">Monthly Downloads</h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 dark:text-gray-400">Chart integration coming soon</p>
              <p className="text-sm text-gray-400 mt-2">Connect your analytics provider</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: "New download", app: "FinWise", user: "Anonymous", time: "2 minutes ago" },
              { action: "New download", app: "AIDesigner", user: "Anonymous", time: "15 minutes ago" },
              { action: "New download", app: "SecureVault", user: "john@example.com", time: "1 hour ago" },
              { action: "New download", app: "TaskFlow Pro", user: "Anonymous", time: "2 hours ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong>{activity.action}</strong> - {activity.app}
                </span>
                <span className="text-gray-400 ml-auto">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
