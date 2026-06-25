"use client";

export default function ApiKeyBanner() {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-[#1a1a1a] border border-yellow-500/40 rounded-xl p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="text-yellow-400 text-lg mt-0.5">⚠</div>
        <div>
          <p className="text-white font-semibold text-sm mb-1">API Key Required</p>
          <p className="text-gray-400 text-xs leading-relaxed mb-2">
            Add your TMDB and OMDB keys to <code className="text-yellow-300 bg-black/40 px-1 rounded">.env.local</code> to load movies and IMDB data.
          </p>
          <div className="text-gray-500 text-[11px] space-y-0.5">
            <p><span className="text-gray-300">NEXT_PUBLIC_TMDB_API_KEY</span>=your_key</p>
            <p><span className="text-gray-300">NEXT_PUBLIC_OMDB_API_KEY</span>=your_key</p>
          </div>
        </div>
      </div>
    </div>
  );
}
