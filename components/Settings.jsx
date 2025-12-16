"use client";

import { useState, useEffect } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    soundEnabled: true,
    autoReminders: true,
    reminderTime: "09:00",
    language: "English",
    theme: "Dark Purple",
    fontSize: "medium",
    animations: true,
    stressTracking: true,
    moodLogging: true,
    dataSharing: false,
  });

  const [profile, setProfile] = useState({
    name: "Your Name",
    email: "your@email.com",
    bio: "Mindfulness enthusiast",
  });

  useEffect(() => {
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem('mindmate_settings');
      const savedProfile = localStorage.getItem('mindmate_profile');
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.log('Could not load settings');
    }
  }, []);

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('mindmate_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.log('Could not save settings');
    }
  };

  const handleChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value,
    };
    setSettings(newSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('mindmate_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.log('Could not save settings');
    }
  };

  const handleProfileChange = (key, value) => {
    const newProfile = {
      ...profile,
      [key]: value,
    };
    setProfile(newProfile);
    
    // Save to localStorage
    try {
      localStorage.setItem('mindmate_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.log('Could not save profile');
    }
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const themes = [
    { name: "Dark Purple", class: "from-purple-900 to-indigo-900" },
    { name: "Dark Blue", class: "from-blue-900 to-cyan-900" },
    { name: "Dark Green", class: "from-green-900 to-teal-900" },
    { name: "Midnight", class: "from-slate-900 to-gray-900" },
    { name: "Sunset", class: "from-orange-900 to-rose-900" },
    { name: "Ocean", class: "from-cyan-900 to-blue-900" },
  ];

  const languages = ["English", "Spanish", "French", "German", "Hindi", "Japanese"];
  const fontSizes = [
    { name: "Small", value: "small", class: "text-sm" },
    { name: "Medium", value: "medium", class: "text-base" },
    { name: "Large", value: "large", class: "text-lg" },
    { name: "Extra Large", value: "xl", class: "text-xl" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">👤 Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              rows="3"
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
        </div>
      </div>

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
              {themes.map(theme => (
                <option key={theme.name} value={theme.name}>{theme.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => handleChange("fontSize", e.target.value)}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              {fontSizes.map(size => (
                <option key={size.value} value={size.value}>{size.name}</option>
              ))}
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
          
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Animations</label>
            <button
              onClick={() => handleToggle("animations")}
              className={`w-12 h-6 rounded-full transition ${
                settings.animations ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.animations ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">⏰ Daily Reminders</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Enable Reminders</label>
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
          
          {settings.autoReminders && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Reminder Time</label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleChange("reminderTime", e.target.value)}
                className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <p className="text-gray-400 text-xs mt-1">You'll receive a gentle reminder at this time daily</p>
            </div>
          )}
        </div>
      </div>

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
        </div>
      </div>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">📊 Wellness Tracking</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Stress Tracking</label>
            <button
              onClick={() => handleToggle("stressTracking")}
              className={`w-12 h-6 rounded-full transition ${
                settings.stressTracking ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.stressTracking ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Mood Logging</label>
            <button
              onClick={() => handleToggle("moodLogging")}
              className={`w-12 h-6 rounded-full transition ${
                settings.moodLogging ? "bg-cyan-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition transform ${
                  settings.moodLogging ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">🔒 Privacy & Security</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition text-gray-300">
            🔐 Change Password
          </button>
          <button className="w-full text-left px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition text-gray-300">
            🗑️ Clear Data & History
          </button>
          
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-medium">Share Anonymous Data</label>
              <button
                onClick={() => handleToggle("dataSharing")}
                className={`w-12 h-6 rounded-full transition ${
                  settings.dataSharing ? "bg-cyan-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition transform ${
                    settings.dataSharing ? "translate-x-6" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">Help improve MindMate by sharing anonymous usage data</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
      >
        💾 Save Changes
      </button>
    </div>
  );
}
