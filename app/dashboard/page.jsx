"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import SifraAvatar from "@/components/SifraAvatar";
import EmotionCamera from "@/components/EmotionCamera";
import YoutubeFun from "@/components/YoutubeFun";
import Motivation from "@/components/Motivation";
import TherapistList from "@/components/TherapistList";
import { useUserState } from "@/context/UserState";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUserState();
  const router = useRouter();
  
  // Redirect to login if no user is logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  const [layout, setLayout] = useState({
    chatExpanded: false,
    videoExpanded: false,
    motivationExpanded: false,
    sifraExpanded: false,
    cameraExpanded: false,
    therapistExpanded: false
  });

  const [dimensions, setDimensions] = useState({
    chatWidth: 100,
    chatHeight: 400,
    sifraWidth: 100,
    sifraHeight: 400
  });

  useEffect(() => {
    // Load layout preferences from localStorage
    try {
      const savedLayout = localStorage.getItem('mindmate_layout');
      const savedDimensions = localStorage.getItem('mindmate_dimensions');
      
      if (savedLayout) setLayout(JSON.parse(savedLayout));
      if (savedDimensions) setDimensions(JSON.parse(savedDimensions));
    } catch (e) {
      console.log('Could not load layout preferences');
    }
  }, []);

  const toggleExpand = (component) => {
    const newLayout = { ...layout, [component]: !layout[component] };
    setLayout(newLayout);
    
    // Save to localStorage
    try {
      localStorage.setItem('mindmate_layout', JSON.stringify(newLayout));
    } catch (e) {
      console.log('Could not save layout');
    }
  };

  const updateDimension = (key, value) => {
    const newDimensions = { ...dimensions, [key]: value };
    setDimensions(newDimensions);
    
    // Save to localStorage
    try {
      localStorage.setItem('mindmate_dimensions', JSON.stringify(newDimensions));
    } catch (e) {
      console.log('Could not save dimensions');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="mb-6 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cyan-300">Welcome to Your Mindful Space</h1>
              <p className="text-gray-400 mt-1">Take a deep breath and explore your wellness journey</p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
              <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm transition">
                Daily Check-in
              </button>
              <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition">
                View Insights
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Chat Bot Section */}
            <div className={`${layout.chatExpanded ? 'lg:col-span-2' : ''} transition-all duration-300`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                  <h2 className="text-cyan-300 font-semibold">💬 Chat with SIFRA</h2>
                  <button 
                    onClick={() => toggleExpand('chatExpanded')}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {layout.chatExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className={`${layout.chatExpanded ? 'h-[600px]' : 'h-[400px]'} transition-all duration-300`}>
                  <ChatBot />
                </div>
              </div>
            </div>

            {/* YouTube Fun Section */}
            <div className={`${layout.videoExpanded ? 'lg:col-span-2' : ''} transition-all duration-300`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                  <h2 className="text-cyan-300 font-semibold">📺 Relax & Laugh</h2>
                  <button 
                    onClick={() => toggleExpand('videoExpanded')}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {layout.videoExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className="p-1">
                  <YoutubeFun />
                </div>
              </div>
            </div>

            {/* Motivation Section */}
            <div className={`${layout.motivationExpanded ? 'lg:col-span-2' : ''} transition-all duration-300`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                  <h2 className="text-cyan-300 font-semibold">🌟 Motivation Booster</h2>
                  <button 
                    onClick={() => toggleExpand('motivationExpanded')}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {layout.motivationExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className="p-1">
                  <Motivation />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* SIFRA Avatar Section */}
            <div className={`${layout.sifraExpanded ? 'lg:col-span-2' : ''} transition-all duration-300`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                  <h2 className="text-cyan-300 font-semibold">🤍 SIFRA - Your AI Companion</h2>
                  <button 
                    onClick={() => toggleExpand('sifraExpanded')}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {layout.sifraExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className={`${layout.sifraExpanded ? 'h-[600px]' : 'h-[400px]'} transition-all duration-300`}>
                  <SifraAvatar />
                </div>
              </div>
            </div>

            {/* Emotion Camera Section */}
            <div className={`${layout.cameraExpanded ? 'lg:col-span-2' : ''} transition-all duration-300`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                  <h2 className="text-cyan-300 font-semibold">📷 Emotion Detector</h2>
                  <button 
                    onClick={() => toggleExpand('cameraExpanded')}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {layout.cameraExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className="p-4">
                  <EmotionCamera />
                </div>
              </div>
            </div>

            {/* Therapist Section */}
            <div className={`${layout.therapistExpanded ? 'lg:col-span-2' : ''} transition-all duration-300`}>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                  <h2 className="text-cyan-300 font-semibold">🏥 Mental Health Support</h2>
                  <button 
                    onClick={() => toggleExpand('therapistExpanded')}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {layout.therapistExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                <div className="p-1">
                  <TherapistList />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension Controls */}
        <div className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <h3 className="text-cyan-300 font-semibold mb-3">🎛️ Adjust Component Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Chat Width: {dimensions.chatWidth}%</label>
              <input 
                type="range" 
                min="50" 
                max="100" 
                value={dimensions.chatWidth}
                onChange={(e) => updateDimension('chatWidth', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Chat Height: {dimensions.chatHeight}px</label>
              <input 
                type="range" 
                min="300" 
                max="700" 
                value={dimensions.chatHeight}
                onChange={(e) => updateDimension('chatHeight', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">SIFRA Width: {dimensions.sifraWidth}%</label>
              <input 
                type="range" 
                min="50" 
                max="100" 
                value={dimensions.sifraWidth}
                onChange={(e) => updateDimension('sifraWidth', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">SIFRA Height: {dimensions.sifraHeight}px</label>
              <input 
                type="range" 
                min="300" 
                max="700" 
                value={dimensions.sifraHeight}
                onChange={(e) => updateDimension('sifraHeight', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
