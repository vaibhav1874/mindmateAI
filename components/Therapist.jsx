"use client";

import { useState } from "react";

export default function Therapist() {
  const [location, setLocation] = useState("");
  const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const dummyTherapists = [
    { id: 1, name: "Dr. Sarah Johnson", speciality: "Anxiety & Stress", phone: "555-0101", rating: 4.8 },
    { id: 2, name: "Dr. Michael Chen", speciality: "Depression & Mood", phone: "555-0102", rating: 4.9 },
    { id: 3, name: "Dr. Emma Wilson", speciality: "CBT & Talk Therapy", phone: "555-0103", rating: 4.7 },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border border-purple-500/20 rounded-2xl p-8 backdrop-blur">
      <h2 className="text-cyan-300 text-2xl font-bold mb-6">👨‍⚕️ Find Nearby Therapists</h2>

      {!MAPS_KEY ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your location or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
          />
          <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg font-semibold transition transform hover:scale-105">
            🔍 Search Therapists
          </button>
        </div>
      ) : (
        <p className="text-cyan-400 mb-6">Maps integration ready! Fetching nearby therapists...</p>
      )}

      <div className="mt-8">
        <h3 className="text-purple-300 text-lg font-semibold mb-4">Available Therapists</h3>
        <div className="space-y-3">
          {dummyTherapists.map((therapist) => (
            <div key={therapist.id} className="p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-purple-500/20 rounded-lg transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-white">{therapist.name}</p>
                  <p className="text-gray-400 text-sm">{therapist.speciality}</p>
                </div>
                <p className="text-yellow-400 font-semibold">⭐ {therapist.rating}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-cyan-300 font-mono">{therapist.phone}</p>
                <button className="px-4 py-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded-lg transition text-cyan-300 font-medium text-sm">
                  📞 Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-purple-500/20">
        <h3 className="text-red-300 text-lg font-semibold mb-4">🆘 Emergency Resources</h3>
        <div className="space-y-2">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-300 font-semibold">National Crisis Hotline</p>
            <p className="text-white text-xl font-bold">1-800-273-8255</p>
            <p className="text-gray-400 text-xs mt-1">24/7 Free & Confidential</p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 font-semibold">Crisis Text Line</p>
            <p className="text-white font-bold">Text HOME to 741741</p>
            <p className="text-gray-400 text-xs mt-1">Available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
