"use client";

import { useState, useEffect, useRef } from "react";

export default function SifraAvatar({ active = true }) {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("I'm here with you 💙");
  const [isTyping, setIsTyping] = useState(false);
  const [emotion, setEmotion] = useState("happy");
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const breathIntervalRef = useRef(null);

  const greetings = [
    "I'm here with you 💙",
    "How are you feeling today?",
    "Remember, you're stronger than you think 💪",
    "Let's talk about what's on your mind...",
    "Your wellbeing matters to me 🌟",
    "Take a deep breath... you've got this  breathe...",
    "I'm here to listen without judgment ❤️",
    "You are not alone in this journey 🤝"
  ];

  const breathingPhases = [
    { phase: "inhale", text: "Breathe in slowly... 🌬️", duration: 4000 },
    { phase: "hold", text: "Hold your breath... 🤐", duration: 2000 },
    { phase: "exhale", text: "Now exhale completely... 😮‍💨", duration: 6000 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(greetings[Math.floor(Math.random() * greetings.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setMessage("Let's begin the breathing exercise together...");
    
    let phaseIndex = 0;
    
    const updateBreathPhase = () => {
      const phase = breathingPhases[phaseIndex];
      setBreathPhase(phase.phase);
      setMessage(phase.text);
      
      phaseIndex = (phaseIndex + 1) % breathingPhases.length;
      
      breathIntervalRef.current = setTimeout(updateBreathPhase, phase.duration);
    };
    
    updateBreathPhase();
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      stopBreathingExercise();
      setMessage("Great job! How do you feel now? 😊");
    }, 30000);
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    setBreathPhase("inhale");
    if (breathIntervalRef.current) {
      clearTimeout(breathIntervalRef.current);
    }
  };

  const handleSpeak = () => {
    setIsListening(true);
    setMessage("I'm listening... 👂");
    
    setTimeout(() => {
      setIsListening(false);
      setIsTyping(true);
      setMessage("Processing your emotions... ✨");
      
      setTimeout(() => {
        setIsTyping(false);
        // Simulate emotion detection
        const emotions = ["happy", "calm", "thoughtful", "concerned"];
        const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setEmotion(detectedEmotion);
        
        const responses = {
          happy: "I sense joy in your voice! That's wonderful to hear! ✨",
          calm: "You sound peaceful and centered. That's great! 🧘",
          thoughtful: "I can hear you're thinking deeply. That's okay too. 🤔",
          concerned: "I hear concern in your voice. Would you like to talk about it? 💙"
        };
        
        setMessage(responses[detectedEmotion] || "I'm here with you. Tell me more...");
      }, 2000);
    }, 3000);
  };

  const getAvatarExpression = () => {
    if (isListening) return "👂";
    if (isTyping) return "🤔";
    if (breathingActive) {
      if (breathPhase === "inhale") return "😮";
      if (breathPhase === "hold") return "🤐";
      if (breathPhase === "exhale") return "😮‍💨";
    }
    
    const expressions = {
      happy: "😊",
      calm: "😌",
      thoughtful: "🤔",
      concerned: "🥺"
    };
    
    return expressions[emotion] || "😊";
  };

  const getAvatarAnimation = () => {
    if (isListening) return "animate-pulse";
    if (breathingActive) return "animate-bounce";
    return "";
  };

  if (!active) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <div className="relative mb-6">
        {/* 3D-like avatar with gradient and glow effect */}
        <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-blue-600 flex items-center justify-center shadow-2xl transform transition-all duration-500 ${getAvatarAnimation()} ${breathingActive ? 'scale-110' : ''}`}>
          <span className={`text-7xl transition-transform duration-500`}>
            {getAvatarExpression()}
          </span>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-30 blur-3xl animate-pulse"></div>
        
        {/* Floating particles effect */}
        <div className="absolute -inset-4 rounded-full bg-cyan-400 opacity-10 blur-xl animate-pulse"></div>
      </div>

      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
        SIFRA
      </h2>
      <p className="text-gray-400 text-sm mb-6">Your AI Stress Relief Companion</p>

      <div className="max-w-md bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6 mb-8 text-center min-h-20 flex items-center justify-center backdrop-blur">
        <p className="text-lg text-white font-medium">{message}</p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center mb-8">
        <button
          onClick={handleSpeak}
          disabled={isListening || isTyping || breathingActive}
          className={`px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-50 ${
            isListening
              ? "bg-red-500/50 border border-red-400 animate-pulse"
              : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
          }`}
        >
          {isListening ? "🎤 Listening..." : "🎤 Talk to Me"}
        </button>

        <button
          onClick={breathingActive ? stopBreathingExercise : startBreathingExercise}
          disabled={isListening || isTyping}
          className={`px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 ${
            breathingActive
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          }`}
        >
          {breathingActive ? "⏹️ Stop Exercise" : "🧘 Breathing Exercise"}
        </button>

        <button
          onClick={() => setMessage("I'm glad you reached out! Remember, taking care of your mental health is important. You're doing great! ✨")}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-lg font-semibold transition transform hover:scale-105"
        >
          💬 Comfort Message
        </button>
      </div>

      <div className="mt-6 max-w-2xl w-full">
        <p className="text-gray-400 text-center text-sm mb-4">Quick Wellness Tips:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { emoji: "💧", text: "Stay hydrated", color: "from-blue-400 to-cyan-400" },
            { emoji: "🚶", text: "Take a walk", color: "from-green-400 to-emerald-400" },
            { emoji: "🎵", text: "Listen to music", color: "from-purple-400 to-pink-400" },
            { emoji: "🌙", text: "Get good sleep", color: "from-indigo-400 to-purple-400" },
            { emoji: "🥗", text: "Eat healthy", color: "from-green-500 to-teal-400" },
            { emoji: "🧘", text: "Practice mindfulness", color: "from-orange-400 to-amber-400" },
          ].map((tip, idx) => (
            <button
              key={idx}
              onClick={() => setMessage(`Great wellness choice! ${tip.text} is excellent for your wellbeing. 🌟`)}
              className={`px-4 py-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition flex items-center justify-center gap-2 bg-gradient-to-r ${tip.color} hover:scale-105 transform transition-all`}
            >
              <span className="text-xl">{tip.emoji}</span>
              <span className="text-sm font-medium text-white">{tip.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
