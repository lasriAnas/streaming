"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaPlus, FaThumbsUp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { Movie } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

interface Props {
  movie: Movie;
  mediaType?: "movie" | "tv";
}

export default function MovieCard({ movie, mediaType }: Props) {
  const [hovered, setHovered] = useState(false);

  const type = mediaType || movie.media_type || "movie";
  const title = movie.title || movie.name || "Unknown";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const score = movie.vote_average?.toFixed(1);

  return (
    <div
      className="relative rounded overflow-hidden cursor-pointer shrink-0 transition-all duration-300"
      style={{ width: "clamp(140px, 18vw, 220px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/${type}/${movie.id}`}>
        {/* Poster */}
        <div className="aspect-[2/3] relative bg-gray-800">
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path, "w300")}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 150px, 200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500 text-xs text-center px-2">
              {title}
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Info panel on hover */}
        {hovered && (
          <div className="absolute inset-x-0 bottom-0 bg-[#181818] p-3 rounded-b z-10 shadow-2xl">
            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-2">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-gray-200 transition-colors">
                <FaPlay className="text-black text-xs ml-0.5" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/50 hover:border-white transition-colors">
                <FaPlus className="text-white text-xs" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/50 hover:border-white transition-colors">
                <FaThumbsUp className="text-white text-xs" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/50 hover:border-white transition-colors ml-auto">
                <FiChevronDown className="text-white" />
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {score && (
                <span className="text-green-400 font-bold">{score} ★</span>
              )}
              {year && <span className="text-gray-400">{year}</span>}
              {type === "tv" && (
                <span className="border border-white/30 text-white/70 px-1 rounded text-[10px]">SERIES</span>
              )}
            </div>

            {/* Title */}
            <p className="text-white text-xs font-semibold mt-1 line-clamp-1">{title}</p>
          </div>
        )}
      </Link>
    </div>
  );
}
