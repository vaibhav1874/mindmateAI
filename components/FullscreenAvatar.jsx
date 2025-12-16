"use client";

import { useEffect, useState, useRef } from "react";

export default function FullscreenAvatar({ open, onClose, text }) {
  const [speaking, setSpeaking] = useState(false);
  const [mouthLevel, setMouthLevel] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const utterRef = useRef(null);
  const lipIntervalRef = useRef(null);
  const camRef = useRef(null);
  const camStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [talkative, setTalkative] = useState(false);
  const [aiReply, setAiReply] = useState("");

  useEffect(() => {
    fetch("/sifra.glb", { method: "HEAD" })
      .then((r) => {
        if (r.ok) setHasModel(true);
      })
      .catch(() => {
        setHasModel(false);
      });

    const img = new Image();
    img.src = "/sifra-girl.jpg";
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgError(true);
  }, []);

  useEffect(() => {
    if (!hasModel) return;
    if (typeof window === "undefined") return;
    if (window.customElements && window.customElements.get("model-viewer")) return;

    const s = document.createElement("script");
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    s.async = true;
    document.head.appendChild(s);
    return () => {};
  }, [hasModel]);

  useEffect(() => {
    if (!open) {
      if (utterRef.current) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
      try {
        recognitionRef.current && recognitionRef.current.abort && recognitionRef.current.abort();
        recognitionRef.current && recognitionRef.current.stop && recognitionRef.current.stop();
      } catch (e) {}
      setSpeaking(false);
      return;
    }

    if (typeof window === "undefined") return;

    const utter = new SpeechSynthesisUtterance(text || "Hi, I'm SIFRA — I'm here with you.");
    utter.rate = 0.95;
    utter.pitch = 1.15;
    utter.lang = "en-US";

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      const femaleMatch = voices.find((v) => /female|zira|samantha|alloy|google uk female|google us english female|amelia|arya/i.test(v.name));
      if (femaleMatch) return femaleMatch;
      const en = voices.find((v) => /^en/i.test(v.lang));
      return en || voices[0] || null;
    };

    let chosen = pickVoice();
    if (!chosen) {
      const onVoicesChanged = () => {
        chosen = pickVoice();
        if (chosen) utter.voice = chosen;
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    } else {
      utter.voice = chosen;
    }

    utter.onstart = () => {
      setSpeaking(true);
      if (!lipIntervalRef.current) {
        lipIntervalRef.current = setInterval(() => {
          setMouthLevel(() => Math.random());
        }, 120);
      }
    };

    utter.onend = () => {
      setSpeaking(false);
      setMouthLevel(0);
      if (lipIntervalRef.current) {
        clearInterval(lipIntervalRef.current);
        lipIntervalRef.current = null;
      }
    };

    utter.onerror = () => {
      setSpeaking(false);
      setMouthLevel(0);
    };

    utter.onboundary = (ev) => {
      setMouthLevel(0.85 + Math.random() * 0.15);
      setTimeout(() => setMouthLevel(Math.random() * 0.4), 90);
    };

    utterRef.current = utter;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error("Speech failed", e);
    }

    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      setSpeaking(false);
      setMouthLevel(0);
      if (lipIntervalRef.current) {
        clearInterval(lipIntervalRef.current);
        lipIntervalRef.current = null;
      }
    };
  }, [open, text]);

  async function humanSpeak(textToSay) {
    if (typeof window === "undefined" || !textToSay) return;

    const escapeXml = (s) =>
      String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");

    function buildSSML(text, profile = "warm") {
      const t = escapeXml(text.trim());
      const profiles = {
        warm: { rate: "92%", pitch: "+6%", breakAfterSentence: "450ms", breakAfterComma: "250ms" },
        gentle: { rate: "95%", pitch: "+4%", breakAfterSentence: "400ms", breakAfterComma: "200ms" },
        lively: { rate: "100%", pitch: "+8%", breakAfterSentence: "300ms", breakAfterComma: "150ms" },
      };

      const p = profiles[profile] || profiles.warm;

      const withBreaks = t
        .replace(/,\s*/g, `, <break time="${p.breakAfterComma}"/> `)
        .replace(/([.!?])\s+/g, `$1 <break time="${p.breakAfterSentence}"/> `);

      const emphasized = withBreaks
        .replace(/(I'm here for you|You are safe|Take a deep breath|Thank you for sharing that)/gi, (m) => `<emphasis level="moderate">${m}</emphasis>`);

      return `<speak><prosody rate="${p.rate}" pitch="${p.pitch}">${emphasized}</prosody></speak>`;
    }

    const ssml = buildSSML(textToSay, "warm");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ssml, voice: "female", ssml: true }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onplay = () => setSpeaking(true);
        audio.onended = () => {
          setSpeaking(false);
          try { URL.revokeObjectURL(url); } catch (e) {}
        };
        audio.play().catch((e) => {
          console.warn("Audio playback failed, falling back to SpeechSynthesis", e);
          try { URL.revokeObjectURL(url); } catch (e) {}
        });
        return;
      }
    } catch (e) {
      console.warn("Server TTS failed, falling back to SpeechSynthesis", e);
    }

    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    const sentences = String(textToSay).split(/(?<=[.!?])\s+/).filter(Boolean);

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      const femaleMatch = voices.find((v) => /female|zira|samantha|google us english female|google uk female|amelia|aria/i.test(v.name));
      if (femaleMatch) return femaleMatch;
      const en = voices.find((v) => /^en/i.test(v.lang));
      return en || voices[0] || null;
    };

    let delay = 0;
    sentences.forEach((s) => {
      const u = new SpeechSynthesisUtterance(s);
      const chosen = pickVoice();
      if (chosen) u.voice = chosen;
      u.pitch = 1.05 + (Math.random() - 0.5) * 0.2;
      u.rate = 0.95 + (Math.random() - 0.5) * 0.1;
      u.lang = "en-US";

      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);

      setTimeout(() => {
        try { window.speechSynthesis.speak(u); } catch (e) {}
      }, delay);

      delay += Math.max(500, s.length * 30) + 150;
    });
  }

  function toggleListening() {
    const SpeechRecognition =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setTranscript("(Speech recognition not supported in this browser)");
      return;
    }

    if (listening) {
      try { recognitionRef.current && recognitionRef.current.stop(); } catch (e) {}
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (ev) => {
      const interim = Array.from(ev.results).map((r) => r[0].transcript).join(" ");
      setTranscript(interim);
      const last = ev.results[ev.results.length - 1];
      if (last.isFinal) {
        setListening(false);
        try { rec.stop(); } catch (e) {}
        const userText = last[0].transcript;
        (async () => {
          try {
            setTranscript(userText);
            setAiReply("...");
            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: userText }),
            });
            const data = await res.json();
            const reply = (data && data.reply) ? data.reply : data?.error || "Sorry, I couldn't process that.";
            setAiReply(reply);
            humanSpeak(reply);

            if (talkative) {
              setTimeout(() => {
                try { rec.start(); setListening(true); } catch (e) {}
              }, 800);
            }
          } catch (e) {
            console.error("Chat API error", e);
            setAiReply("(Error getting reply)");
            humanSpeak("I'm sorry, I couldn't reach my helper service right now.");
          }
        })();
      }
    };

    rec.onerror = (e) => {
      console.error("Recognition error", e);
      setTranscript("(Speech recognition error)");
      setListening(false);
    };

    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      console.error(e);
      setTranscript("(Could not start speech recognition)");
    }
  }

  useEffect(() => {
    if (!open) return;
    let mounted = true;

    async function startCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camStreamRef.current = stream;
        if (mounted && camRef.current) {
          camRef.current.srcObject = stream;
          try { camRef.current.play(); } catch (e) {}
        }
      } catch (e) {
        console.warn("Camera preview not available", e);
      }
    }

    startCam();

    return () => {
      mounted = false;
      if (camStreamRef.current) {
        camStreamRef.current.getTracks().forEach((t) => t.stop());
        camStreamRef.current = null;
      }
      if (camRef.current) {
        try { camRef.current.srcObject = null; } catch (e) {}
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-60 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="w-full h-full flex items-center justify-center relative">
        <video ref={camRef} autoPlay muted playsInline className="absolute top-6 left-6 w-28 h-28 rounded-full object-cover border-2 border-white/30 z-60" />
        {hasModel ? (
          <model-viewer
            src="/sifra.glb"
            alt="SIFRA 3D"
            ar
            camera-controls
            autoplay
            style={{ width: "100%", height: "100%" }}
          ></model-viewer>
        ) : imgLoaded && !imgError ? (
          <img src="/sifra-girl.jpg" alt="SIFRA portrait" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-2xl max-h-[80vh]">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#0ea5a4" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" rx="24" fill="url(#g)" opacity="0.06" />

              <g transform="translate(50,40)">
                <circle cx="150" cy="130" r="110" fill="#111827" stroke="#0f172a" strokeWidth="4" />
                <circle cx="110" cy="110" r="12" fill="#fff" />
                <circle cx="190" cy="110" r="12" fill="#fff" />
                <circle cx="112" cy="112" r="5" fill="#000" />
                <circle cx="192" cy="112" r="5" fill="#000" />

                <path d="M150 120 q6 18 0 36" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeLinecap="round" />

                <g transform="translate(150,190)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="36"
                    ry={8 + Math.round(mouthLevel * 20)}
                    fill="#f97316"
                    style={{ transition: "all 100ms linear" }}
                  />
                </g>
              </g>
            </svg>
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/90 bg-black/30 px-4 py-2 rounded-md">
          <p className="text-lg font-medium">SIFRA — I'm here with you</p>
        </div>

        <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-70">
          <div className="flex gap-2">
            <button
              onClick={() => setTalkative((s) => !s)}
              className={`px-3 py-2 rounded-full ${talkative ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'} text-sm font-semibold`}
              title={talkative ? 'Talkative: ON' : 'Talkative: OFF'}
            >
              {talkative ? 'Talkative' : 'Quiet'}
            </button>

            <button
              onClick={toggleListening}
              className={`flex items-center gap-2 px-3 py-2 rounded-full ${listening ? 'bg-red-500 text-white shadow-lg animate-mic-pulse' : 'bg-white/10 text-white'}`}
              aria-pressed={listening}
              title={listening ? 'Stop listening' : 'Speak to SIFRA'}
            >
              <span className="text-sm font-semibold">{listening ? 'Listening…' : 'Speak'}</span>
              <span className="text-lg">🎤</span>
            </button>
          </div>

          {transcript && (
            <div className="max-w-xs bg-black/60 text-white/90 px-3 py-2 rounded-lg text-sm shadow-md backdrop-blur">
              <div className="font-medium text-xs text-gray-300">You:</div>
              <div>{transcript}</div>
              {aiReply && (
                <div className="mt-2 font-medium text-xs text-gray-300">SIFRA:</div>
              )}
              {aiReply && <div className="mt-1 text-sm text-white">{aiReply}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
