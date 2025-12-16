"use client";

import { useState, useEffect } from "react";

export default function Motivation() {
  const [currentCard, setCurrentCard] = useState(0);
  const [favorites, setFavorites] = useState([]);

  // Enhanced motivational content with categories
  const motivationContent = [
    // Self-compassion
    { 
      id: 1, 
      title: "You are doing enough", 
      text: "Take a breath and be gentle with yourself. Progress isn't always linear.", 
      category: "self-compassion",
      emoji: "💙"
    },
    { 
      id: 2, 
      title: "Be kind to you", 
      text: "You deserve patience and care. Treat yourself like someone you love.", 
      category: "self-compassion",
      emoji: "🤗"
    },
    // Growth mindset
    { 
      id: 3, 
      title: "Small steps matter", 
      text: "A single small action can change your day. Celebrate tiny victories.", 
      category: "growth",
      emoji: "👣"
    },
    { 
      id: 4, 
      title: "Growth through challenges", 
      text: "Every challenge you face builds resilience. You're stronger than you know.", 
      category: "growth",
      emoji: "🌱"
    },
    // Mindfulness
    { 
      id: 5, 
      title: "Present moment peace", 
      text: "This moment is all we truly have. Breathe into the now.", 
      category: "mindfulness",
      emoji: "🧘"
    },
    { 
      id: 6, 
      title: "Gratitude practice", 
      text: "Even in difficult times, there are things to be grateful for. Notice them.", 
      category: "mindfulness",
      emoji: "🙏"
    },
    // Positivity
    { 
      id: 7, 
      title: "Hope is powerful", 
      text: "Tomorrow brings new possibilities. This difficult moment will pass.", 
      category: "positivity",
      emoji: "✨"
    },
    { 
      id: 8, 
      title: "You are not alone", 
      text: "Many people care about you and want to support you. Reach out when needed.", 
      category: "positivity",
      emoji: "🤝"
    }
  ];

  useEffect(() => {
    // Load favorites from localStorage
    try {
      const saved = localStorage.getItem('motivation_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Could not load favorites');
    }
    
    // Rotate cards automatically
    const interval = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % motivationContent.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
      
    setFavorites(newFavorites);
    
    // Save to localStorage
    try {
      localStorage.setItem('motivation_favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.log('Could not save favorites');
    }
  };

  const getRandomCards = () => {
    // Get 3 random cards, ensuring no duplicates
    const shuffled = [...motivationContent].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const displayedCards = getRandomCards();
  const currentCardData = motivationContent[currentCard];

  return (
    <div className="bg-slate-800 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-cyan-300 text-xl">Motivation Booster</h2>
        <span className="text-sm text-gray-400">Auto-refreshes</span>
      </div>
      
      {/* Featured card */}
      <div className="p-5 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-xl border border-purple-500/30 mb-5 relative">
        <button 
          onClick={() => toggleFavorite(currentCardData.id)}
          className={`absolute top-3 right-3 text-xl ${favorites.includes(currentCardData.id) ? 'text-yellow-400' : 'text-gray-500'}`}
        >
          {favorites.includes(currentCardData.id) ? '★' : '☆'}
        </button>
        <div className="text-3xl mb-2">{currentCardData.emoji}</div>
        <h3 className="font-bold text-white text-lg mb-2">{currentCardData.title}</h3>
        <p className="text-gray-300 text-sm">{currentCardData.text}</p>
        <div className="mt-3 text-xs text-gray-500 capitalize">Category: {currentCardData.category}</div>
      </div>
      
      {/* Additional cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {displayedCards.map((card) => (
          <div key={card.id} className="p-4 bg-slate-900 rounded-lg relative group">
            <button 
              onClick={() => toggleFavorite(card.id)}
              className={`absolute top-2 right-2 text-sm ${favorites.includes(card.id) ? 'text-yellow-400' : 'text-gray-600 group-hover:text-gray-400'}`}
            >
              {favorites.includes(card.id) ? '★' : '☆'}
            </button>
            <div className="text-xl mb-1">{card.emoji}</div>
            <div className="font-semibold text-white text-sm">{card.title}</div>
            <div className="text-gray-400 text-xs mt-1 line-clamp-2">{card.text}</div>
          </div>
        ))}
      </div>
      
      {/* Favorites indicator */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button 
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * motivationContent.length);
            setCurrentCard(randomIndex);
          }}
          className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1 rounded transition"
        >
          🎲 New Inspiration
        </button>
        <button 
          onClick={() => {
            const shuffled = [...motivationContent].sort(() => 0.5 - Math.random());
            setDisplayedCards(shuffled.slice(0, 3));
          }}
          className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded transition"
        >
          🔀 Shuffle Cards
        </button>
        {favorites.length > 0 && (
          <button 
            onClick={() => {
              const favoriteItems = motivationContent.filter(item => favorites.includes(item.id));
              const randomFavorite = favoriteItems[Math.floor(Math.random() * favoriteItems.length)];
              setCurrentCard(motivationContent.findIndex(item => item.id === randomFavorite.id));
            }}
            className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded transition"
          >
            ⭐ Show Favorite
          </button>
        )}
      </div>
      {favorites.length > 0 && (
        <div className="mt-3 text-center text-sm text-gray-500">
          You have {favorites.length} favorite inspiration{favorites.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
