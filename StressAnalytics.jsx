"use client";

import { useUserState } from "@/context/UserState";

export default function StressAnalytics() {
  const { emotion, stressLevel } = useUserState();

  const emotionEmojis = {
    happy: "😊",
    sad: "😢",
    anxious: "😰",
    calm: "😌",
    angry: "😠",
    neutral: "😐",
  };

  const stressColor = stressLevel > 7 ? "red" : stressLevel > 4 ? "yellow" : "green";
  const stressText = stressLevel > 7 ? "High - Consider relaxation" : stressLevel > 4 ? "Moderate - Take a break" : "Low - You're doing great!";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Status */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border border-purple-500/20 rounded-2xl p-8 backdrop-blur">
        <h2 className="text-cyan-300 text-2xl font-bold mb-6">📊 Your Status</h2>

        <div className="space-y-6">
          {/* Emotion */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-3">Current Emotion</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{emotionEmojis[emotion] || "😐"}</span>
              <div>
                <p className="text-2xl font-bold text-white">{emotion || "Neutral"}</p>
                <p className="text-gray-400 text-sm">Detected from your expressions</p>
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-3">Stress Level</p>
            <div className="relative">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 bg-slate-700/50 rounded-full h-3 overflow-hidden border border-purple-500/20">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      stressColor === "red"
                        ? "from-red-400 to-red-600"
                        : stressColor === "yellow"
                        ? "from-yellow-400 to-orange-500"
                        : "from-green-400 to-emerald-500"
                    }`}
                    style={{ width: `${(stressLevel || 0) * 10}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold text-white w-12 text-right">{stressLevel || 0}/10</span>
              </div>
              <p className={`text-sm font-medium ${stressColor === "red" ? "text-red-400" : stressColor === "yellow" ? "text-yellow-400" : "text-green-400"}`}>
                {stressText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-slate-800/50 to-cyan-900/30 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur">
        <h2 className="text-purple-300 text-2xl font-bold mb-6">💡 Recommendations</h2>

        <div className="space-y-3">
          {emotion === "sad" && (
            <>
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="font-semibold text-blue-300 mb-2">😢 Feeling Sad?</p>
                <p className="text-gray-300 text-sm">Try a breathing exercise or watch something fun to lift your mood.</p>
              </div>
            </>
          )}

          {emotion === "anxious" && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="font-semibold text-yellow-300 mb-2">😰 Feeling Anxious?</p>
              <p className="text-gray-300 text-sm">Try grounding techniques: 5-4-3-2-1 sensory exercise or meditation.</p>
            </div>
          )}

          {(stressLevel > 7 || !emotion) && (
            <>
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="font-semibold text-purple-300 mb-2">🧘 Meditation</p>
                <p className="text-gray-300 text-sm">A 5-10 minute guided meditation can reduce stress significantly.</p>
              </div>

              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="font-semibold text-cyan-300 mb-2">💬 Chat with SIFRA</p>
                <p className="text-gray-300 text-sm">Talk to your AI companion about what's bothering you.</p>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="font-semibold text-green-300 mb-2">🎬 Laugh & Relax</p>
                <p className="text-gray-300 text-sm">Watch some funny videos to boost your mood instantly.</p>
              </div>
            </>
          )}

          {stressLevel < 3 && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg animate-pulse">
              <p className="font-semibold text-emerald-300 mb-2">✨ You're Doing Great!</p>
              <p className="text-gray-300 text-sm">Keep up this positive energy and maintain your wellbeing habits.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="md:col-span-2 bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur">
        <h3 className="text-cyan-300 text-lg font-semibold mb-4">📈 Session Analytics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Peak Emotion</p>
            <p className="text-2xl font-bold text-cyan-300 mt-2">{emotion || "—"}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Avg Stress</p>
            <p className="text-2xl font-bold text-purple-300 mt-2">{stressLevel || "—"}/10</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Session Time</p>
            <p className="text-2xl font-bold text-purple-300 mt-2">3m 42s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
