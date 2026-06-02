import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Sectop Security | ResultScale AI",
  description:
    "Privacy Policy for Sectop Security mobile application. Learn how we collect, use, and protect your personal data including location, camera, microphone, and SMS information.",
  openGraph: {
    title: "Privacy Policy — Sectop Security",
    description:
      "Privacy Policy for Sectop Security mobile application. Learn how we collect, use, and protect your personal data.",
    type: "website",
  },
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          Sectop Security (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you use our mobile application (&ldquo;Sectop Security&rdquo; or the &ldquo;App&rdquo;).
          By using the App, you agree to the collection and use of information in accordance with this policy.
        </p>
        <p className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 font-medium">
          If you do not agree with this policy, do not use the App.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: (
      <>
        {/* 2.1 Location Data */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2.1 Location Data (Precise GPS)</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">What we collect:</strong> Real-time GPS
              coordinates (latitude, longitude), altitude, speed, and heading.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">How we collect it:</strong> Via the device&rsquo;s
              GPS and network location services, both in the foreground and background.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Why we need it:</strong> Location is the core
              functionality of the App. It is used for:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Activating SOS/Emergency alerts with your precise location</li>
                <li>Sharing your location with emergency contacts during an incident</li>
                <li>Broadcasting your location to nearby Sectop users via mesh network</li>
                <li>Route safety analysis (Safe Zone Finder, Route Safety AI)</li>
                <li>Tracking breadcrumb trails during emergencies</li>
                <li>Displaying nearby incidents on the Community Map</li>
                <li>Geo-fencing alerts to warn nearby users of danger</li>
              </ul>
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Retention:</strong> Location data is stored
              locally on your device and is only transmitted to other users during an active emergency.
              Breadcrumb trails are retained for up to 7 days and then automatically deleted.
            </li>
          </ul>
        </div>

        {/* 2.2 Personal Profile */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2.2 Personal Profile Information</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">What we collect:</strong> Name, phone number,
              email address, profile photo, emergency contact names and phone numbers, blood type, allergies,
              medical conditions, home address.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">How we collect it:</strong> You voluntarily
              provide this information during registration and profile setup.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Why we need it:</strong> To identify you to
              emergency contacts and nearby users during an incident, and to provide first responders with
              critical medical information.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Retention:</strong> Stored locally on your
              device until you delete your account or reset the app.
            </li>
          </ul>
        </div>

        {/* 2.3 Camera and Microphone */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2.3 Camera and Microphone</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">What we collect:</strong> Video recordings,
              audio recordings, and photos.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">How we collect it:</strong> Accessed only when
              you explicitly activate recording features (manual or automatic during SOS).
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Why we need it:</strong> To capture video/audio
              evidence during emergencies, which can be shared with emergency contacts and authorities.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Retention:</strong> Evidence files are stored
              locally on your device. You control when they are shared or deleted.
            </li>
          </ul>
        </div>

        {/* 2.4 SMS and Phone */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2.4 SMS and Phone</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">What we collect:</strong> Incoming SMS messages
              (for codeword detection), ability to send SMS (for SOS broadcasts and SMS Guardian
              auto-responses).
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">How we collect it:</strong> Only when you enable
              SMS Guardian or SMS codeword trigger features.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Why we need it:</strong> To detect emergency
              codewords from trusted contacts and to send SOS alerts via SMS when data networks are
              unavailable.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Retention:</strong> SMS content is processed in
              real-time and not stored. Logs of SMS Guardian triggers are stored locally.
            </li>
          </ul>
        </div>

        {/* 2.5 Device Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2.5 Device Information</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">What we collect:</strong> Device model,
              operating system version, unique device identifiers, Bluetooth status, Wi-Fi status.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">How we collect it:</strong> Automatically via
              the device APIs.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Why we need it:</strong> For mesh networking
              (peer-to-peer communication via Bluetooth/Wi-Fi Direct), device admin features, and app
              functionality optimization.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Retention:</strong> Not stored; used only for
              runtime functionality.
            </li>
          </ul>
        </div>

        {/* 2.6 Communications Data */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2.6 Communications Data</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-white">What we collect:</strong> Chat messages,
              incident shares, community broadcast posts, voice/video call metadata (duration, participants,
              timestamps).
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">How we collect it:</strong> You generate this
              content through your use of the App&rsquo;s communication features.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Why we need it:</strong> To enable
              peer-to-peer messaging, community incident sharing, and emergency communications.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Retention:</strong> Stored locally on your
              device. Messages are relayed through the mesh network and are not stored on any central server.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We use the collected information for the following purposes:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Purpose</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Data Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {[
                ["Emergency SOS Activation", "Location, camera, microphone, contacts"],
                ["Alerting Nearby Users", "Location, profile name, profile photo"],
                ["Notifying Emergency Contacts", "Location, profile info, emergency contact list"],
                ["Route Safety Analysis", "Location (origin/destination), incident data"],
                ["Safe Zone Finder", "Location, incident data"],
                ["Community Map", "Location, incident reports"],
                ["Mesh Networking", "Device identifiers, Bluetooth/Wi-Fi status"],
                ["SMS Guardian", "SMS content (codeword detection only)"],
                ["Covert Activation", "Accelerometer data (shake detection), power/volume button presses"],
                ["Evidence Recording", "Camera, microphone"],
                ["Chat & Messaging", "Text, location shares, incident shares"],
                ["Medical Info Sharing", "Blood type, allergies, conditions (shared only during active emergency)"],
              ].map(([purpose, data]) => (
                <tr key={purpose as string}>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{purpose}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "how-we-share",
    title: "4. How We Share Your Information",
    content: (
      <>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">4.1 With Emergency Contacts</h3>
          <p className="text-gray-600 dark:text-gray-400">
            During an active emergency, your name, location, and profile photo are shared with your
            designated emergency contacts via SMS, mesh network, or in-app notification.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">4.2 With Nearby Users</h3>
          <p className="text-gray-600 dark:text-gray-400">
            During an active emergency, your name, location, and profile photo may be broadcast to other
            Sectop users within the geo-fenced alert zone (up to 50km radius) so they can be aware of
            danger in their area and potentially assist.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">4.3 With First Responders</h3>
          <p className="text-gray-600 dark:text-gray-400">
            If you choose to share evidence (video, audio, photos) with authorities, that data is
            transmitted directly from your device. We do not have access to this data.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">4.4 Third-Party Services</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-6">
            <li>
              <strong>Google Maps</strong> — Used for map display and location visualization. Subject to{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Google&rsquo;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Expo</strong> — The framework used to build the App. See{" "}
              <a
                href="https://expo.dev/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Expo Privacy Policy
              </a>
              .
            </li>
          </ul>
        </div>

        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-400">
            4.5 What We Do NOT Share
          </h3>
          <ul className="space-y-2 text-green-700 dark:text-green-300">
            <li>✓ We do <strong>NOT</strong> sell your personal information to third parties.</li>
            <li>✓ We do <strong>NOT</strong> use your data for advertising or marketing.</li>
            <li>✓ We do <strong>NOT</strong> upload your data to any central server (all data is peer-to-peer or stored locally).</li>
            <li>✓ We do <strong>NOT</strong> share your medical information except during an active emergency.</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "data-storage",
    title: "5. Data Storage and Security",
    content: (
      <>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">5.1 Local Storage</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            All user data is stored locally on your device using:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-6">
            <li><strong>AsyncStorage</strong> — For general app data (profile, settings, contacts)</li>
            <li><strong>expo-secure-store</strong> — For sensitive data (auth tokens, device IDs)</li>
            <li><strong>expo-file-system</strong> — For evidence files (video, audio, photos)</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">5.2 Data Transmission</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-6">
            <li>Emergency alerts are transmitted via <strong>mesh network</strong> (Bluetooth/Wi-Fi Direct) and <strong>SMS</strong>.</li>
            <li>No data is transmitted to or stored on any central server owned by us.</li>
            <li>Mesh network communications are peer-to-peer and ephemeral.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">5.3 Data Retention</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Data Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[
                  ["Profile & Settings", "Until you delete your account or reset the app"],
                  ["Emergency Contacts", "Until you delete or modify them"],
                  ["Evidence Files", "Until you delete them"],
                  ["Breadcrumb Trails", "7 days (auto-deleted)"],
                  ["Chat Messages", "Until you delete the conversation"],
                  ["Call History", "Until you delete it"],
                  ["SMS Guardian Logs", "Until you clear them"],
                ].map(([type, period]) => (
                  <tr key={type as string}>
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{type}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">5.4 Data Deletion</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            You can delete all your data at any time by:
          </p>
          <ol className="space-y-2 text-gray-600 dark:text-gray-400 list-decimal pl-6">
            <li>Going to <strong>Profile → Danger Zone → Reset App</strong></li>
            <li>Going to <strong>Profile → Danger Zone → Delete Account</strong></li>
            <li>Uninstalling the App (note: some data may persist in device storage)</li>
          </ol>
        </div>
      </>
    ),
  },
  {
    id: "permissions",
    title: "6. Permissions",
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The App requires the following permissions. You can revoke any permission at any time through
          your device settings.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Permission</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Required</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {[
                ["Location (Foreground)", "✅ Yes", "Core SOS and map functionality"],
                ["Location (Background)", "✅ Yes", "Continuous GPS tracking during emergencies"],
                ["Camera", "✅ Yes", "Video evidence recording"],
                ["Microphone", "✅ Yes", "Audio evidence recording"],
                ["Notifications", "✅ Yes", "Emergency alerts from nearby users"],
                ["Storage/Photos", "✅ Yes", "Saving and sharing evidence files"],
                ["SMS (Receive)", "Optional", "SMS codeword trigger detection"],
                ["SMS (Send)", "Optional", "SMS fallback for SOS broadcasts"],
                ["Bluetooth", "Optional", "Mesh network peer discovery"],
                ["Phone", "Optional", "Emergency calling"],
              ].map(([perm, required, purpose]) => (
                <tr key={perm as string}>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{perm}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                      required === "✅ Yes"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {required}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "children-privacy",
    title: "7. Children's Privacy",
    content: (
      <p className="text-gray-600 dark:text-gray-400">
        The App is not intended for use by children under the age of 13. We do not knowingly collect
        personal information from children under 13. If we discover that a child under 13 has provided
        us with personal information, we will delete it immediately.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: (
      <>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Depending on your jurisdiction, you may have the following rights:
        </p>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
          {[
            ["Right to Access", "Request information about the data we hold about you."],
            ["Right to Rectification", "Correct inaccurate data."],
            ["Right to Deletion", "Delete your data (use the in-app reset/delete functions)."],
            ["Right to Restrict Processing", "Limit how we use your data."],
            ["Right to Data Portability", "Receive your data in a structured format."],
            ["Right to Withdraw Consent", "Revoke permissions at any time via device settings."],
          ].map(([right, desc]) => (
            <li key={right as string}>
              <strong className="text-gray-900 dark:text-white">{right}</strong> — {desc}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          To exercise any of these rights, contact us at the email address below.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "9. Changes to This Privacy Policy",
    content: (
      <p className="text-gray-600 dark:text-gray-400">
        We may update this Privacy Policy from time to time. We will notify you of any changes by
        posting the new Privacy Policy in the App and updating the &ldquo;Last Updated&rdquo; date at
        the top. You are advised to review this Privacy Policy periodically for any changes.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "10. Contact Us",
    content: (
      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
        </p>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong className="text-gray-900 dark:text-white">Email:</strong>{" "}
            <a
              href="mailto:privacy@resultscaleai.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              privacy@resultscaleai.com
            </a>
          </li>
          <li>
            <strong className="text-gray-900 dark:text-white">Website:</strong>{" "}
            <a
              href="https://sectopsecurity.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              https://sectopsecurity.com/privacy
            </a>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "governing-law",
    title: "11. Governing Law",
    content: (
      <p className="text-gray-600 dark:text-gray-400">
        This Privacy Policy shall be governed by and construed in accordance with the laws of the
        Federal Republic of Nigeria. Any disputes arising under this policy shall be subject to the
        exclusive jurisdiction of the courts of Nigeria.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="py-16 bg-gray-50 dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sectop Security — Your Silent Guardian
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last Updated: May 24, 2026
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0f] sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer font-semibold text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span>Table of Contents</span>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <nav className="mt-4 space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Google Play Console Info */}
          <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Google Play Console Entry
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Field</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {[
                    ["Privacy Policy URL", "https://resultscaleai.com/privacy-policy"],
                    ["App Name", "Sectop Security"],
                    ["Contact Email", "privacy@resultscaleai.com"],
                  ].map(([field, value]) => (
                    <tr key={field as string}>
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{field}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
