"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [emotion, setEmotion] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [user, setUser] = useState(null);

  function login(u) {
    setUser(u);
    try { localStorage.setItem('mindmate_user', JSON.stringify(u)); } catch (e) {}
  }

  function logout() {
    setUser(null);
    try { localStorage.removeItem('mindmate_user'); } catch (e) {}
  }

  // hydrate from localStorage on client
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mindmate_user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {}
  }, []);

  return (
    <UserContext.Provider
      value={{ emotion, setEmotion, stressLevel, setStressLevel, user, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserState = () => useContext(UserContext);
