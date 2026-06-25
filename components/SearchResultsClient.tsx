"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import type { Movie } from "@/lib/types";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

interface Props {
  initialResults: Movie[];
  totalPages: number;
  query?: string;
  type?: string;
}

export default function SearchResultsClient({ initialResults, totalPages, query, type }: Props) {
  const [results, setResults] = useState<Movie[]>(initialResults);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const nextPage = currentPage + 1;
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    params.set("page", String(nextPage));

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("failed");
      const data = await res.json();

      setResults((prev) => {
        const seen = new Set(prev.map((r) => `${r.media_type}-${r.id}`));
        const fresh = (data.results || []).filter(
          (r: Movie) => !seen.has(`${r.media_type}-${r.id}`)
        );
        return [...prev, ...fresh];
      });
      setCurrentPage(nextPage);
      setHasMore(nextPage < (data.total_pages || 1));
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, query, type]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (results.length === 0) {
    return (
      <div className="text-center py-20">
        <FiSearch className="text-gray-600 mx-auto mb-4" size={48} />
        <p className="text-gray-400 text-lg">
          No results found{query ? ` for "${query}"` : ""}
        </p>
        <p className="text-gray-600 text-sm mt-2">Try a different title or keyword</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {results.map((item) => (
          <SearchCard key={`${item.media_type}-${item.id}`} item={item} />
        ))}
      </div>

      <div ref={sentinelRef} className="mt-10 flex items-center justify-center h-16">
        {loading && (
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        )}
        {!hasMore && results.length > 20 && (
          <p className="text-gray-600 text-sm">You&apos;ve reached the end</p>
        )}
      </div>
    </>
  );
}

function SearchCard({ item }: { item: Movie }) {
  const type = item.media_type || "movie";
  const title = item.title || item.name || "Unknown";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const score = item.vote_average?.toFixed(1);

  return (
    <Link href={`/${type}/${item.id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
        {item.poster_path ? (
          <Image
            src={`${IMAGE_BASE}/w300${item.poster_path}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          />
        ) : item.backdrop_path ? (
          <Image
            src={`${IMAGE_BASE}/w500${item.backdrop_path}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 200px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs text-center p-3">
            {title}
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-semibold">
            View Details
          </div>
        </div>

        {type === "tv" && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            Series
          </div>
        )}
      </div>

      <p className="text-white text-xs font-semibold line-clamp-2 leading-snug mb-0.5">{title}</p>
      <div className="flex items-center gap-2 text-[11px] text-gray-500">
        {year && <span>{year}</span>}
        {score && score !== "0.0" && (
          <span className="flex items-center gap-0.5 text-yellow-500">
            <FaStar size={9} />
            {score}
          </span>
        )}
      </div>
    </Link>
  );
}
