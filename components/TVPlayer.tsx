"use client";

import { useState } from "react";

interface TVPlayerProps {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
}

export default function TVPlayer({ showId, seasonNumber, episodeNumber, title }: TVPlayerProps) {
  const [player, setPlayer] = useState<number>(1);

  // return (
  //   <div className="flex flex-col gap-4">
  //     <div className="flex space-x-3 justify-center items-center">
  //       <button
  //         className={`font-bold rounded-lg px-4 py-2 text-sm transition-colors ${
  //           player === 1
  //             ? "bg-red-600 text-white"
  //             : "bg-white/10 text-white/70 hover:bg-white/20"
  //         }`}
  //         onClick={() => setPlayer(1)}
  //       >
  //         Player 1
  //       </button>
  //       <button
  //         className={`font-bold rounded-lg px-4 py-2 text-sm transition-colors ${
  //           player === 2
  //             ? "bg-red-600 text-white"
  //             : "bg-white/10 text-white/70 hover:bg-white/20"
  //         }`}
  //         onClick={() => setPlayer(2)}
  //       >
  //         Player 2
  //       </button>
  //     </div>

  //     <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
  //       {player === 1 && (
  //         <iframe
  //           allowFullScreen
  //           className="absolute inset-0 w-full h-full"
  //           src={`https://vidsrc-embed.ru/embed/tv?tmdb=${showId}&season=${seasonNumber}&episode=${episodeNumber}`}
  //           title={title}
  //         />
  //       )}
  //       {player === 2 && (
  //         <iframe
  //           allowFullScreen
  //           className="absolute inset-0 w-full h-full"
  //           src={`https://www.2embed.cc/embedtv/${showId}&s=${seasonNumber}&e=${episodeNumber}`}
  //           title={title}
  //         />
  //       )}
  //     </div>
  //   </div>
  // );
  return (
  <div className="flex flex-col gap-6">
    <div>
      <h3 className="mb-2 text-sm font-semibold text-white/80">
        Player 1
      </h3>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
        <iframe
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          src={`https://vidsrc-embed.ru/embed/tv?tmdb=${showId}&season=${seasonNumber}&episode=${episodeNumber}`}
          title={`${title} - Player 1`}
        />
      </div>
    </div>

    <div>
      <h3 className="mb-2 text-sm font-semibold text-white/80">
        Player 2
      </h3>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
        <iframe
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          src={`https://www.2embed.cc/embedtv/${showId}&s=${seasonNumber}&e=${episodeNumber}`}
          title={`${title} - Player 2`}
        />
      </div>
    </div>
  </div>
);
}
