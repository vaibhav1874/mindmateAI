"use client";

import { useState, useEffect } from "react";

export default function YoutubeFun() {
  const YT_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predefined list of relaxing/fun videos for fallback
  const fallbackVideos = [
    { id: "1W6lMmhVD3E", title: "Funny Animals Compilation" },
    { id: "dQw4w9WgXcQ", title: "Motivational Speech" },
    { id: "JGwWNGJdvx8", title: "Calming Nature Sounds" },
    { id: "OPf0YbXqDm0", title: "Meditation Guide" },
    { id: "kJQP7kiw5Fk", title: "Happy Dance Party" },
    { id: "9bZkp7q19f0", title: "Feel-Good Music Video" }
  ];

  useEffect(() => {
    if (YT_KEY) {
      fetchRelaxingVideos();
    } else {
      // Use fallback videos if no API key
      setVideos(fallbackVideos);
    }
  }, []);

  const fetchRelaxingVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Search for stress-relief, relaxation, and funny content
      const searchQuery = encodeURIComponent("funny animals OR relaxation music OR stress relief OR meditation OR comedy OR feel good");
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YT_KEY}&q=${searchQuery}&part=snippet&maxResults=6&type=video&videoEmbeddable=true`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      
      const data = await response.json();
      
      const videoList = data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title
      }));
      
      setVideos(videoList);
    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
      setError("Unable to load videos. Showing curated content instead.");
      setVideos(fallbackVideos);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-cyan-300 text-xl">Relax & Laugh</h2>
        <button 
          onClick={fetchRelaxingVideos}
          disabled={loading}
          className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg transition"
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 text-sm p-2 rounded mb-3">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <button 
          onClick={() => setVideos(videos.filter((_, i) => i < 2))}
          className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded transition"
        >
          🎵 Music
        </button>
        <button 
          onClick={() => setVideos(videos.filter((_, i) => i >= 2))}
          className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-2 py-1 rounded transition"
        >
          😂 Comedy
        </button>
        <button 
          onClick={fetchRelaxingVideos}
          className="text-xs bg-slate-600/50 hover:bg-slate-600/70 text-gray-300 px-2 py-1 rounded transition"
        >
          🔄 All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.slice(0, 4).map((video) => (
          <div key={video.id} className="bg-slate-900 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
            <iframe
              className="w-full h-32"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allowFullScreen
            ></iframe>
            <div className="p-2">
              <p className="text-xs text-gray-300 line-clamp-2">{video.title}</p>
            </div>
          </div>
        ))}
      </div>

      {!YT_KEY && (
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-dashed border-cyan-500/30">
          <p className="text-gray-400 text-sm">
            Want more personalized content? Add your YouTube API key to <code className="bg-slate-700 px-1 rounded">.env.local</code> as <code className="bg-slate-700 px-1 rounded">NEXT_PUBLIC_YOUTUBE_API_KEY</code>
          </p>
        </div>
      )}
    </div>
  );
}
