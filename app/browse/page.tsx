import { Suspense } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularShows,
  fetchTopRatedMovies,
  fetchTopRatedShows,
  fetchMoviesByGenre,
  fetchShowsByGenre,
} from "@/lib/tmdb";
import BrowseClient from "@/components/BrowseClient";
import type { Movie } from "@/lib/types";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    category?: string;
    genreId?: string;
    mediaType?: string;
    name?: string;
  }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  trending: "Trending This Week",
  "popular-movies": "Popular Movies",
  "popular-tv": "Popular TV Shows",
  "top-rated-movies": "Top Rated Movies",
  "top-rated-tv": "Top Rated TV Shows",
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category = "trending", name } = await searchParams;
  const label = name || CATEGORY_LABELS[category] || "Browse";
  return { title: `${label} — StreamVault` };
}

async function BrowseContent({
  category,
  genreId,
  mediaType,
  name,
}: {
  category: string;
  genreId?: string;
  mediaType?: string;
  name?: string;
}) {
  let results: Movie[] = [];
  let totalPages = 1;
  const mt = mediaType || "movie";

  if (category === "trending") {
    const data = await fetchTrending("all", "week");
    results = (data.results || []).filter(
      (r: Movie) => r.media_type === "movie" || r.media_type === "tv"
    );
    totalPages = data.total_pages || 1;
  } else if (category === "popular-movies") {
    const data = await fetchPopularMovies();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" as const }));
    totalPages = data.total_pages || 1;
  } else if (category === "popular-tv") {
    const data = await fetchPopularShows();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" as const }));
    totalPages = data.total_pages || 1;
  } else if (category === "top-rated-movies") {
    const data = await fetchTopRatedMovies();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" as const }));
    totalPages = data.total_pages || 1;
  } else if (category === "top-rated-tv") {
    const data = await fetchTopRatedShows();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" as const }));
    totalPages = data.total_pages || 1;
  } else if (category === "genre" && genreId) {
    if (mt === "tv") {
      const data = await fetchShowsByGenre(Number(genreId));
      results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" as const }));
      totalPages = data.total_pages || 1;
    } else {
      const data = await fetchMoviesByGenre(Number(genreId));
      results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" as const }));
      totalPages = data.total_pages || 1;
    }
  }

  const label = name || CATEGORY_LABELS[category] || "Browse";

  return (
    <div>
      <h1 className="text-white font-bold text-xl md:text-2xl mb-6">{label}</h1>
      <BrowseClient
        key={`${category}-${genreId ?? ""}-${mt}`}
        initialResults={results}
        totalPages={totalPages}
        category={category}
        genreId={genreId}
        mediaType={mt}
      />
    </div>
  );
}

function BrowseSkeleton() {
  return (
    <div>
      <div className="h-7 w-48 skeleton rounded mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] skeleton rounded-lg mb-2" />
            <div className="h-3 skeleton rounded mb-1 w-3/4" />
            <div className="h-3 skeleton rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function BrowsePage({ searchParams }: Props) {
  const { category = "trending", genreId, mediaType, name } = await searchParams;

  return (
    <div className="min-h-screen bg-[#0e1520] pt-6 px-4 md:px-8 pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <FaArrowLeft size={12} />
        Back to Home
      </Link>
      <Suspense fallback={<BrowseSkeleton />}>
        <BrowseContent
          category={category}
          genreId={genreId}
          mediaType={mediaType}
          name={name}
        />
      </Suspense>
    </div>
  );
}
