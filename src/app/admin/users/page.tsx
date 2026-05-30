"use client";

export default function AdminUsersPage() {
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com", downloads: 12, joined: "2025-01-15", status: "Active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", downloads: 8, joined: "2025-02-20", status: "Active" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", downloads: 5, joined: "2025-03-01", status: "Inactive" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Downloads</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.downloads}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Manage</button>
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
