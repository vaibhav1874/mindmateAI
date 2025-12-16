"use client";

import { useState } from "react";
import SifraAvatar from "./SifraAvatar";

export default function Avatar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-cyan-300 text-xl font-semibold flex items-center gap-2">
          🤍 SIFRA — Your caring companion
        </h2>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white text-sm"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <p className="text-gray-400 mb-4">I'm here to listen and help you feel a little calmer.</p>
      
      <div className={`${expanded ? 'h-[500px]' : 'h-[300px]'} transition-all duration-300`}>
        <SifraAvatar />
      </div>
      
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black rounded-lg font-medium transition transform hover:scale-105"
        >
          {expanded ? 'Show Less' : 'Interact with SIFRA'}
        </button>
      </div>
    </div>
  );
}
