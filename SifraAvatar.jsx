"use client";

import { useState, useEffect } from "react";

export default function SifraAvatar({ active = true }) {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("I'm here with you 💙");
  const [isTyping, setIsTyping] = useState(false);

  const greetings = [
    "I'm here with you 💙",
    "How are you feeling today?",
    "Remember, you're stronger than you think 💪",
    "Let's talk about what's on your mind...",
    "Your wellbeing matters to me 🌟",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(greetings[Math.floor(Math.random() * greetings.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSpeak = () => {
    setIsListening(true);
    setMessage("I'm listening... 👂");
    
    setTimeout(() => {
      setIsListening(false);
      setIsTyping(true);
      setMessage("Processing your emotions... ✨");
      
      setTimeout(() => {
        setIsTyping(false);
        setMessage("I understand how you feel. Tell me more...");
      }, 2000);
    }, 3000);
  };

  if (!active) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      {/* Animated Avatar */}
      <div className="relative mb-8">
        <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-blue-600 flex items-center justify-center shadow-2xl ${isListening ? "animate-pulse" : ""}`}>
          <span className={`text-6xl transition-transform duration-500 ${isListening ? "scale-110" : "scale-100"}`}>
            {isListening ? "👂" : isTyping ? "🤔" : "😊"}
          </span>
        </div>
        
        {/* Aura effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-20 blur-2xl animate-pulse"></div>
      </div>

      {/* Name */}
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
        SIFRA
      </h2>
      <p className="text-gray-400 text-sm mb-6">Your AI Stress Relief Companion</p>

      {/* Message Display */}
      <div className="max-w-md bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6 mb-8 text-center min-h-20 flex items-center justify-center backdrop-blur">
        <p className="text-lg text-white font-medium">{message}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={handleSpeak}
          disabled={isListening || isTyping}
          className={`px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-50 ${
            isListening
              ? "bg-red-500/50 border border-red-400 animate-pulse"
              : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
          }`}
        >
          {isListening ? "🎤 Listening..." : "🎤 Talk to Me"}
        </button>

        <button
          onClick={() => setMessage("Let's take a deep breath together... Breathe in... Hold... Breathe out... 🧘")}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg font-semibold transition transform hover:scale-105"
        >
          🧘 Breathing Exercise
        </button>

        <button
          onClick={() => setMessage("That's wonderful! Keep taking care of yourself. You deserve happiness! ✨")}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-lg font-semibold transition transform hover:scale-105"
        >
          💬 Start Conversation
        </button>
      </div>

      {/* Quick Tips */}
      <div className="mt-10 max-w-2xl">
        <p className="text-gray-400 text-center text-sm mb-4">Quick Tips for Today:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { emoji: "💧", text: "Drink water" },
            { emoji: "🚶", text: "Take a walk" },
            { emoji: "🎵", text: "Listen to music" },
          ].map((tip, idx) => (
            <button
              key={idx}
              onClick={() => setMessage(`Great idea! ${tip.text} will help you feel better. 🌟`)}
              className="px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition flex items-center justify-center gap-2"
            >
              <span className="text-xl">{tip.emoji}</span>
              <span className="text-sm font-medium">{tip.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
