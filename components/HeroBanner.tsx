"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { Movie } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

const FEATURED_COUNT = 5;
const AUTO_CYCLE_MS = 7000;

interface Props {
  movies: Movie[];
}

export default function HeroBanner({ movies }: Props) {
  const featured = movies.slice(0, FEATURED_COUNT).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function scrollDown() {
    const next = containerRef.current?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
      setLiked(false);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(t);
  }, [featured.length]);

  const movie = featured[index];
  if (!movie) return null;

  const title = movie.title || movie.name || "Unknown";
  const mediaType = movie.media_type || "movie";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const score =
    movie.vote_average && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : null;

  return (
    <div ref={containerRef} className="px-4 pt-4 pb-2">
      <div
        className="relative rounded-2xl overflow-hidden w-full"
        style={{ height: "calc(100vh - 5.5rem)" }}
      >
        {/* Backdrop */}
        {movie.backdrop_path ? (
          <Image
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Tags — top left */}
        <div className="absolute top-4 left-5 flex items-center gap-2">
          <Tag>{mediaType === "tv" ? "Series" : "Movie"}</Tag>
          {year && <Tag>{year}</Tag>}
          {score && (
            <Tag>
              <FaStar size={18} className="inline mr-1 text-yellow-400" />
              {score}
            </Tag>
          )}
        </div>

        {/* Pagination dots — top right */}
        {featured.length > 1 && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  setLiked(false);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/30 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom row */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-28"
          style={{ paddingRight: "calc(88px + 28px)" }}
        >
          <Link
            href={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-black/70 transition-colors shrink-0">
              <FaPlay size={11} className="text-white ml-0.5" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-white font-bold text-4xl md:text-5xl line-clamp-1">
                {title}
              </p>
              <p className="text-gray-400 text-base md:text-lg mt-0.5">Play trailer</p>
            </div>
          </Link>

          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 rounded-full border backdrop-blur-sm flex items-center justify-center transition-colors shrink-0 ml-3 ${
              liked
                ? "bg-red-600/40 border-red-400 text-red-400"
                : "bg-black/40 border-white/20 text-white/70 hover:text-white hover:border-white/50"
            }`}
          >
            {liked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
          </button>
        </div>

        {/* Scroll-down arrow */}
        <button
          onClick={scrollDown}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-colors animate-bounce z-10"
          aria-label="Scroll to content"
        >
          <FiChevronDown size={48} />
        </button>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-black/55 backdrop-blur-md text-white text-xl font-medium px-4 py-2 rounded-full border border-white/10 flex items-center gap-1">
      {children}
    </span>
  );
}
