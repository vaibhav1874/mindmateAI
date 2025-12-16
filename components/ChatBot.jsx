"use client";

import { useState, useEffect, useRef } from "react";
import FullscreenAvatar from "./FullscreenAvatar";

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  function speak(text) {
    if (typeof window === "undefined" || !text) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.2;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }

  async function sendMessage(customText) {
    const message = customText || input;
    if (!message.trim()) return;

    setError(null);
    
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        const errorMsg = data.error || data.reply || "Failed to get response from SIFRA";
        throw new Error(errorMsg);
      }

      const reply = data.reply || "I'm here to listen and support you.";
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: reply },
      ]);

      speak(reply);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = err.message || "Sorry, I'm having trouble connecting. Please try again.";
      setError(errorMessage);
      
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: errorMessage },
      ]);
      
      speak(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function toggleListening() {
    const SpeechRecognition =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    if (listening) {
      try {
        recognitionRef.current && recognitionRef.current.stop();
      } catch (e) {}
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (ev) => {
      const transcript = Array.from(ev.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setInput(transcript);

      const last = ev.results[ev.results.length - 1];
      if (last.isFinal) {
        setListening(false);
        try {
          recognition.stop();
        } catch (e) {}
        sendMessage(transcript);
      }
    };

    recognition.onerror = (e) => {
      console.error("Recognition error", e);
      setError("Speech recognition error");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch (e) {
      console.error(e);
      setError("Could not start speech recognition");
    }
  }

  function talkToSifra() {
    const intros = [
      "Hi, I am SIFRA. I am here with you. You are safe. Tell me what you are feeling.",
      "Hello there! I'm SIFRA, your mental wellness companion. How are you doing today?",
      "Welcome back! I'm here to listen without judgment. What's on your mind?",
      "Greetings! I'm SIFRA, and I care about your wellbeing. Would you like to share how you're feeling?"
    ];
    
    const intro = intros[Math.floor(Math.random() * intros.length)];
    setMessages((prev) => [...prev, { role: "ai", text: intro }]);
    setError(null);
    setOpen(true);
    speak(intro);
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-full">
        <h2 className="text-cyan-300 text-xl font-semibold mb-3">💬 Chat with SIFRA — I'm listening</h2>

        {error && (
          <div className="mb-3 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] ${
                  m.role === "user"
                    ? "bg-cyan-500 text-black ml-auto"
                    : "bg-slate-800 text-cyan-200"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && <p className="text-sm text-gray-400">SIFRA is typing…</p>}
          </div>

          <div className="mt-2 pt-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me how you're feeling…"
                className="flex-1 bg-slate-800 p-3 rounded-xl text-white outline-none"
                disabled={loading}
              />
              <button
                onClick={toggleListening}
                disabled={loading}
                title={listening ? "Stop listening" : "Speak to SIFRA"}
                className={`px-3 rounded-xl font-semibold mr-1 transition transform hover:scale-105 ${listening ? 'bg-red-500 hover:bg-red-400 text-white animate-pulse' : 'bg-emerald-400 hover:bg-emerald-300 text-black'}`}
              >
                {listening ? '●' : '🎙'}
              </button>

              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className={`px-4 rounded-2xl font-semibold transition transform hover:scale-105 ${loading ? 'bg-pink-500/50 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-400 text-black'}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send →'}
              </button>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={talkToSifra}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-300 hover:to-pink-300 text-black py-2 rounded-xl font-bold transition transform hover:scale-[1.02]"
              >
                🎧 Talk to SIFRA
              </button>
              <button
                onClick={() => {
                  const wellnessPrompts = [
                    "I'm feeling overwhelmed today",
                    "I need some motivation",
                    "I'm struggling with anxiety",
                    "Tell me something uplifting",
                    "I need a breathing exercise"
                  ];
                  const prompt = wellnessPrompts[Math.floor(Math.random() * wellnessPrompts.length)];
                  setInput(prompt);
                }}
                className="px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"
                title="Get a suggestion"
              >
                💡
              </button>
            </div>
          </div>
        </div>
      </div>
      <FullscreenAvatar open={open} onClose={() => setOpen(false)} text={"Hi, I'm SIFRA — I'm here with you. You are safe."} />
    </>
  );
}
