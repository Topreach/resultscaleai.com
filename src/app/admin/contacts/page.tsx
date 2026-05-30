"use client";

import { useState, useEffect } from "react";
import { ContactRequest } from "@/types";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await fetch("/api/contacts");
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch {
        // Fallback
      }
      setLoading(false);
    };
    loadContacts();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      if (res.ok) {
        setContacts(contacts.map((c) =>
          c.id === id ? { ...c, status: "read" as const } : c
        ));
      }
    } catch (err) {
      console.error("Failed to update contact", err);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "replied" }),
      });
      if (res.ok) {
        setContacts(contacts.map((c) =>
          c.id === id ? { ...c, status: "replied" as const } : c
        ));
      }
    } catch (err) {
      console.error("Failed to update contact", err);
    }
  };

  const statusColors = {
    new: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    read: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    replied: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contact Requests</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage contact form submissions
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {contacts.filter((c) => c.status === "new").length} new
            </span>
          </div>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">✉️</div>
            <p className="text-lg font-medium mb-2">No contact requests yet</p>
            <p>When users submit the contact form, their messages will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-6 bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-300 cursor-pointer hover:border-indigo-500/50 ${
                  contact.status === "new"
                    ? "border-blue-300 dark:border-blue-700"
                    : "border-gray-200 dark:border-gray-800"
                }`}
                onClick={() => {
                  setSelectedContact(contact);
                  if (contact.status === "new") markAsRead(contact.id);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[contact.status]}`}>
                    {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {contact.service}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {contact.message}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{contact.date}</span>
                  <div className="flex gap-3">
                    {contact.status !== "replied" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReplied(contact.id);
                        }}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        Mark Replied
                      </button>
                    )}
                    <span className="text-indigo-600 dark:text-indigo-400">View Details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedContact && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedContact(null)}
          >
            <div
              className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Contact Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">
                    <a href={`mailto:${selectedContact.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      {selectedContact.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Service</label>
                  <p className="font-medium">{selectedContact.service}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date</label>
                  <p className="font-medium">{selectedContact.date}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className={`ml-2 px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[selectedContact.status]}`}>
                    {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Message</label>
                  <p className="mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.service} Inquiry`}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all"
                >
                  Reply via Email
                </a>
                {selectedContact.status !== "replied" && (
                  <button
                    onClick={() => {
                      markAsReplied(selectedContact.id);
                      setSelectedContact(null);
                    }}
                    className="px-4 py-2.5 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-all"
                  >
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
