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

  // 🔊 SPEAK FUNCTION (SIFRA VOICE)
  function speak(text) {
    if (typeof window === "undefined" || !text) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.2;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }

  // 🤖 SEND MESSAGE TO AI
  async function sendMessage(customText) {
    const message = customText || input;
    if (!message.trim()) return;

    // Clear any previous errors
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
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: errorMessage },
      ]);
      
      // Still try to speak the error message
      speak(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // 🎤 Speech recognition (mic) - uses Web Speech API where available
  function toggleListening() {
    const SpeechRecognition =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    if (listening) {
      // stop
      try {
        recognitionRef.current && recognitionRef.current.stop();
      } catch (e) {}
      setListening(false);
      return;
    }

    // start
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (ev) => {
      const transcript = Array.from(ev.results)
        .map((r) => r[0].transcript)
        .join(" ");
      // show interim/final transcript in input
      setInput(transcript);

      // if final, send automatically
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

  // 🩷 TALK TO SIFRA BUTTON
  function talkToSifra() {
    const intro =
      "Hi, I am SIFRA. I am here with you. You are safe. Tell me what you are feeling.";
    setMessages((prev) => [...prev, { role: "ai", text: intro }]);
    setError(null); // Clear any previous errors
    setOpen(true);
    // speak is handled by the fullscreen modal as well, but keep local speak for message list
    speak(intro);
  }

  // Handle Enter key press
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

        {/* Error message display */}
        {error && (
          <div className="mb-3 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* CHAT AREA */}
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

          {/* INPUT - sticky to bottom of card */}
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
                className={`px-3 rounded-xl font-semibold mr-1 ${listening ? 'bg-red-500 text-white' : 'bg-emerald-400 text-black'}`}
              >
                {listening ? '● Listening' : '🎙'}
              </button>

              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className={`px-4 rounded-xl font-semibold ${loading ? 'bg-pink-500/50' : 'bg-pink-500 text-black'}`}
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>

            <button
              onClick={talkToSifra}
              className="mt-3 w-full bg-gradient-to-r from-cyan-400 to-pink-400 text-black py-2 rounded-xl font-bold"
            >
              🎧 Talk to SIFRA
            </button>
          </div>
        </div>
      </div>
      <FullscreenAvatar open={open} onClose={() => setOpen(false)} text={"Hi, I'm SIFRA — I'm here with you. You are safe."} />
    </>
  );
}
