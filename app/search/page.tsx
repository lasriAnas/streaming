import { Suspense } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import {
  searchMulti,
  searchMovies,
  searchShows,
  fetchPopularMovies,
  fetchPopularShows,
  fetchTrending,
} from "@/lib/tmdb";
import SearchResultsClient from "@/components/SearchResultsClient";
import type { Movie } from "@/lib/types";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} — StreamVault` : "Browse — StreamVault",
  };
}

async function SearchResults({ query, type }: { query?: string; type?: string }) {
  let results: Movie[] = [];
  let totalPages = 1;
  let title = "Trending This Week";

  if (query) {
    if (type === "movie") {
      const data = await searchMovies(query);
      results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" as const }));
      totalPages = data.total_pages || 1;
      title = `Movies matching "${query}"`;
    } else if (type === "tv") {
      const data = await searchShows(query);
      results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" as const }));
      totalPages = data.total_pages || 1;
      title = `TV Shows matching "${query}"`;
    } else {
      const data = await searchMulti(query);
      results = (data.results || []).filter(
        (r: Movie) => r.media_type === "movie" || r.media_type === "tv"
      );
      totalPages = data.total_pages || 1;
      title = `Results for "${query}"`;
    }
  } else if (type === "movie") {
    const data = await fetchPopularMovies();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" as const }));
    totalPages = data.total_pages || 1;
    title = "Popular Movies";
  } else if (type === "tv") {
    const data = await fetchPopularShows();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" as const }));
    totalPages = data.total_pages || 1;
    title = "Popular TV Shows";
  } else {
    const data = await fetchTrending("all", "week");
    results = (data.results || []).filter(
      (r: Movie) => r.media_type === "movie" || r.media_type === "tv"
    );
    totalPages = data.total_pages || 1;
  }

  results = results.filter((r) => r.poster_path || r.backdrop_path);

  return (
    <div>
      <h1 className="text-white font-bold text-xl md:text-2xl mb-6">{title}</h1>
      <SearchResultsClient
        key={`${query ?? ""}-${type ?? ""}`}
        initialResults={results}
        totalPages={totalPages}
        query={query}
        type={type}
      />
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div>
      <div className="h-7 w-48 skeleton mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] skeleton rounded-lg mb-2" />
            <div className="h-3 skeleton mb-1 w-3/4" />
            <div className="h-3 skeleton w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type } = await searchParams;

  const filterTabs = [
    { label: "All", type: undefined },
    { label: "Movies", type: "movie" },
    { label: "TV Shows", type: "tv" },
  ];

  const buildHref = (tabType?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (tabType) params.set("type", tabType);
    const qs = params.toString();
    return `/search${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#0e1520] pt-6 px-4 md:px-8 pb-12">
      <SearchBar initialQuery={q} />

      <div className="flex gap-2 mb-8">
        {filterTabs.map((tab) => {
          const active =
            (tab.type === undefined && !type) ||
            tab.type === type;
          return (
            <Link
              key={tab.label}
              href={buildHref(tab.type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-white text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={q} type={type} />
      </Suspense>
    </div>
  );
}

function SearchBar({ initialQuery }: { initialQuery?: string }) {
  return (
    <form method="GET" action="/search" className="mb-6">
      <div className="relative max-w-2xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Search movies, shows, actors..."
          className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 pl-12 pr-4 py-3 text-base focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
