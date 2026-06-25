"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import type { Movie } from "@/lib/types";

interface GenreData {
  label: string;
  movies: Movie[];
  mediaType?: "movie" | "tv";
}

interface Props {
  genres: GenreData[];
}

export default function GenreGrid({ genres }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const active = genres[activeIdx];

  function scrollTabs(dir: "left" | "right") {
    tabsRef.current?.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
  }

  return (
    <div className="px-6 pb-8">
      {/* Genre tabs */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => scrollTabs("left")}
          className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <FiChevronLeft size={14} />
        </button>

        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
        >
          {genres.map((genre, i) => (
            <button
              key={genre.label}
              onClick={() => setActiveIdx(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                i === activeIdx
                  ? "bg-white text-black"
                  : "bg-white/8 text-gray-300 hover:bg-white/15 hover:text-white border border-white/10"
              }`}
            >
              {genre.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTabs("right")}
          className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <FiChevronRight size={14} />
        </button>
      </div>

      {/* Poster grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
        {active?.movies.slice(0, 18).map((movie) => {
          const type = active.mediaType || movie.media_type || "movie";
          const title = movie.title || movie.name || "";
          const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
          const score = movie.vote_average && movie.vote_average > 0
            ? movie.vote_average.toFixed(1)
            : null;

          return (
            <Link key={movie.id} href={`/${type}/${movie.id}`} className="group block">
              <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800 mb-2">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 17vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs text-center p-2 leading-tight">
                    {title}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-white text-xs font-semibold line-clamp-1 leading-tight">{title}</p>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                {year && <span>{year}</span>}
                {score && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                      <FaStar size={9} />
                      {score}
                    </span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
