"use client";

import { useState } from "react";
import FullscreenAvatar from "./FullscreenAvatar";

export default function Avatar() {
  const [open, setOpen] = useState(false);

  const speakAndOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-full">
        <h2 className="text-cyan-300 text-xl font-semibold flex items-center gap-2">
          🤍 SIFRA — Your caring companion
        </h2>

        <p className="text-gray-400 mt-2 flex-1">I'm here to listen and help you feel a little calmer.</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={speakAndOpen}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-medium"
          >
            Chat with SIFRA
          </button>
          <button
            onClick={() => alert('Breathing exercise (placeholder)')}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-300"
          >
            🧘‍♀️
          </button>
        </div>
      </div>

      <FullscreenAvatar
        open={open}
        onClose={() => setOpen(false)}
        text={"Hi, I'm SIFRA — I'm here for you. You are safe. Let's take a slow, deep breath together."}
      />
    </>
  );
}
