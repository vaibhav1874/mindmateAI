export default function YoutubeFun() {
  const YT_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl">
      <h2 className="text-cyan-300 text-xl">Relax & Laugh</h2>

      {/* Static video until API key added */}
      <iframe
        className="w-full h-48 mt-3 rounded"
        src="https://www.youtube.com/embed/1W6lMmhVD3E"
        allowFullScreen
      ></iframe>

      {!YT_KEY && (
        <p className="text-gray-400 mt-2 text-sm">YouTube isn't connected yet — connect to see more feel-good videos.</p>
      )}
    </div>
  );
}
