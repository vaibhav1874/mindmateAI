"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="text-center p-8 max-w-2xl mx-auto bg-slate-900/70 backdrop-blur-lg border border-slate-700/50 rounded-3xl shadow-2xl">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-4xl md:text-5xl text-cyan-300 font-bold mb-3">Welcome to MindMate</h1>
          <p className="text-gray-300 mb-2">{greeting()}, take a moment for your mental wellness</p>
          <p className="text-gray-400 mb-6">A gentle space to check-in, get mood-lifting content, and connect if you need help.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black rounded-xl font-semibold transition transform hover:scale-105 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
            <span>🔐</span>
            <span>Login</span>
          </Link>
          <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl font-semibold transition transform hover:scale-105 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
            <span>✨</span>
            <span>Explore Demo</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: '💬', label: 'AI Chat' },
            { icon: '📷', label: 'Emotion Scan' },
            { icon: '📺', label: 'Relax Videos' },
            { icon: '🏥', label: 'Support' }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-sm text-gray-300">{feature.label}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Your mental wellness journey starts here</p>
        </div>
      </div>
    </main>
  );
}
