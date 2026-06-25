"use client";

import { useState } from "react";

export default function MoviePlayer({ movieId, title }: { movieId: number; title: string }) {
  const [player, setPlayer] = useState<number>(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex space-x-3 justify-center items-center">
        <button
          className={`font-bold rounded-lg px-4 py-2 text-sm transition-colors ${
            player === 1
              ? "bg-red-600 text-white"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setPlayer(1)}
        >
          Player 1
        </button>
        <button
          className={`font-bold rounded-lg px-4 py-2 text-sm transition-colors ${
            player === 2
              ? "bg-red-600 text-white"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setPlayer(2)}
        >
          Player 2
        </button>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
        {player === 1 && (
          <iframe
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            src={`https://vidsrc-embed.ru/embed/movie?tmdb=${movieId}`}
            title={title}
          />
        )}
        {player === 2 && (
          <iframe
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            src={`https://www.2embed.cc/embed/${movieId}`}
            title={title}
          />
        )}
      </div>
    </div>
  );
}
