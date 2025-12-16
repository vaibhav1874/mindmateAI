"use client";

import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    soundEnabled: true,
    autoReminders: true,
    language: "English",
    theme: "Dark Purple",
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">👤 Account</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Profile Name</label>
            <input
              type="text"
              defaultValue="Your Name"
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue="your@email.com"
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">🎨 Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option>Dark Purple</option>
              <option>Dark Blue</option>
              <option>Dark Green</option>
              <option>Light Mode</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Dark Mode</label>
            <button
              onClick={() => handleToggle("darkMode")}
              className={`w-12 h-6 rounded-full transition ${
                settings.darkMode ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.darkMode ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">🔔 Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Push Notifications</label>
            <button
              onClick={() => handleToggle("notifications")}
              className={`w-12 h-6 rounded-full transition ${
                settings.notifications ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.notifications ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Sound Effects</label>
            <button
              onClick={() => handleToggle("soundEnabled")}
              className={`w-12 h-6 rounded-full transition ${
                settings.soundEnabled ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.soundEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Daily Reminders</label>
            <button
              onClick={() => handleToggle("autoReminders")}
              className={`w-12 h-6 rounded-full transition ${
                settings.autoReminders ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.autoReminders ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">🔒 Privacy & Security</h3>
        <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition text-gray-300">
          🔐 Change Password
        </button>
        <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition text-gray-300 mt-2">
          🗑️ Clear Data & History
        </button>
      </div>

      {/* Save */}
      <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105">
        💾 Save Changes
      </button>
    </div>
  );
}
