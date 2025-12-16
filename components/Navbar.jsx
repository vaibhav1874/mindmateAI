"use client";

import Link from "next/link";
import { useUserState } from "@/context/UserState";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useUserState();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/login');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-slate-800/60 backdrop-blur px-4 md:px-6 py-3 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-cyan-300 font-bold text-lg flex items-center gap-2">
            <span>🧠</span>
            <span>MindMate</span>
          </Link>
          <nav className="hidden md:flex gap-4 text-sm text-gray-300">
            <button 
              onClick={() => scrollToSection('chat-section')} 
              className="hover:text-cyan-300 transition-colors"
            >
              💬 Chat
            </button>
            <button 
              onClick={() => scrollToSection('sifra-section')} 
              className="hover:text-cyan-300 transition-colors"
            >
              🤍 SIFRA
            </button>
            <button 
              onClick={() => scrollToSection('video-section')} 
              className="hover:text-cyan-300 transition-colors"
            >
              📺 Videos
            </button>
            <button 
              onClick={() => scrollToSection('motivation-section')} 
              className="hover:text-cyan-300 transition-colors"
            >
              🌟 Motivation
            </button>
            <button 
              onClick={() => scrollToSection('support-section')} 
              className="hover:text-cyan-300 transition-colors"
            >
              🏥 Support
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300 hidden md:inline-block max-w-[150px] truncate">{user?.email || 'Guest'}</span>
          {user ? (
            <button 
              onClick={handleLogout} 
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors flex items-center gap-1"
            >
              <span className="hidden md:inline">Logout</span>
              <span className="md:hidden">🚪</span>
            </button>
          ) : (
            <Link href="/login" className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-black rounded-lg text-sm transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
