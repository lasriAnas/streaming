"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaPlay, FaList, FaTh, FaThLarge } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";
import type { Episode } from "@/lib/types";

type Layout = "list" | "grid" | "grid-lg";

interface Props {
  episodes: Episode[];
  showId: number;
  seasonNumber: number;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p";

export default function EpisodeList({ episodes, showId, seasonNumber }: Props) {
  const [layout, setLayout] = useState<Layout>("list");

  const layoutButtons: { key: Layout; Icon: typeof FaList; label: string }[] = [
    { key: "list", Icon: FaList, label: "List" },
    { key: "grid", Icon: FaTh, label: "Grid" },
    { key: "grid-lg", Icon: FaThLarge, label: "Large grid" },
  ];

  return (
    <div>
      {/* Layout toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm">{episodes.length} episodes</p>
        <div className="flex gap-1.5">
          {layoutButtons.map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setLayout(key)}
              title={label}
              className={`p-2 rounded-lg transition-colors ${
                layout === key
                  ? "bg-red-600 text-white"
                  : "bg-white/8 text-gray-400 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* List layout */}
      {layout === "list" && (
        <div className="space-y-3">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/tv/${showId}/season/${seasonNumber}/episode/${ep.episode_number}`}
              className="flex gap-0 bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden border border-white/5 group"
            >
              <div className="shrink-0 w-36 md:w-48 aspect-video relative bg-gray-800 overflow-hidden">
                {ep.still_path ? (
                  <Image
                    src={`${IMAGE_BASE}/w300${ep.still_path}`}
                    alt={ep.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="192px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaPlay size={18} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FaPlay size={12} className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  E{ep.episode_number}
                </div>
              </div>
              <div className="flex-1 p-3 md:p-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1">
                    {ep.name}
                  </h3>
                  <div className="shrink-0 flex items-center gap-2 text-xs text-gray-400">
                    {ep.runtime && (
                      <span className="flex items-center gap-1">
                        <FiClock size={11} />
                        {ep.runtime}m
                      </span>
                    )}
                    {ep.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400 font-medium">
                        <FaStar size={10} />
                        {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                {ep.air_date && (
                  <p className="text-gray-500 text-xs mb-1.5 flex items-center gap-1">
                    <FiCalendar size={11} />
                    {ep.air_date}
                  </p>
                )}
                {ep.overview && (
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {ep.overview}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Compact grid layout */}
      {layout === "grid" && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/tv/${showId}/season/${seasonNumber}/episode/${ep.episode_number}`}
              className="group block"
            >
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-800 mb-2">
                {ep.still_path ? (
                  <Image
                    src={`${IMAGE_BASE}/w300${ep.still_path}`}
                    alt={ep.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 17vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaPlay size={14} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                    <FaPlay size={10} className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  E{ep.episode_number}
                </div>
              </div>
              <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                {ep.name}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Large grid layout */}
      {layout === "grid-lg" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/tv/${showId}/season/${seasonNumber}/episode/${ep.episode_number}`}
              className="group bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden border border-white/5 block"
            >
              <div className="aspect-video relative bg-gray-800 overflow-hidden">
                {ep.still_path ? (
                  <Image
                    src={`${IMAGE_BASE}/w300${ep.still_path}`}
                    alt={ep.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaPlay size={22} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FaPlay size={16} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded">
                  E{ep.episode_number}
                </div>
                {ep.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <FaStar size={9} />
                    {ep.vote_average.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{ep.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  {ep.air_date && (
                    <span className="flex items-center gap-1">
                      <FiCalendar size={11} />
                      {ep.air_date}
                    </span>
                  )}
                  {ep.runtime && (
                    <span className="flex items-center gap-1">
                      <FiClock size={11} />
                      {ep.runtime}m
                    </span>
                  )}
                </div>
                {ep.overview && (
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {ep.overview}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
