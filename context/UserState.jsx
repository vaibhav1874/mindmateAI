"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [emotion, setEmotion] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [user, setUser] = useState(null);

  function login(u) {
    const userData = { ...u, id: Date.now(), timestamp: new Date().toISOString() };
    setUser(userData);
    try { 
      localStorage.setItem('mindmate_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save user data to localStorage:', e);
    }
  }

  function logout() {
    setUser(null);
    try { localStorage.removeItem('mindmate_user'); } catch (e) {}
  }

  useEffect(() => {
    // Only run localStorage code on the client side
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('mindmate_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
        }
      } catch (e) {
        console.error('Error loading user from localStorage:', e);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ emotion, setEmotion, stressLevel, setStressLevel, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserState = () => useContext(UserContext);
