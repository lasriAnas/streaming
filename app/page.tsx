export const dynamic = "force-dynamic";

import { Suspense } from "react";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularShows,
  fetchTopRatedMovies,
  fetchTopRatedShows,
  fetchMoviesByGenre,
  fetchShowsByGenre,
} from "@/lib/tmdb";
import ApiKeyBanner from "@/components/ApiKeyBanner";
import type { Movie } from "@/lib/types";

async function HomeContent() {
  const [
    trending,
    popularMovies,
    popularTV,
    topRatedMovies,
    topRatedTV,
    action,
    comedy,
    horror,
    drama,
    sciFi,
  ] = await Promise.all([
    fetchTrending("all", "week").then((r) => r.results || []),
    fetchPopularMovies().then((r) => r.results || []),
    fetchPopularShows().then((r) => r.results || []),
    fetchTopRatedMovies().then((r) => r.results || []),
    fetchTopRatedShows().then((r) => r.results || []),
    fetchMoviesByGenre(28).then((r) => r.results || []),
    fetchMoviesByGenre(35).then((r) => r.results || []),
    fetchMoviesByGenre(27).then((r) => r.results || []),
    fetchMoviesByGenre(18).then((r) => r.results || []),
    fetchMoviesByGenre(878).then((r) => r.results || []),
  ]);

  const noApiKey = !process.env.TMDB_API_KEY && !process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const tag = (arr: Movie[], type: "movie" | "tv") =>
    arr.map((m) => ({ ...m, media_type: type }));

  return (
    <>
      {noApiKey && <ApiKeyBanner />}
      {trending.length > 0 ? (
        <HeroBanner movies={trending} />
      ) : (
        <div className="mx-6 mt-4 rounded-2xl h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <p className="text-gray-400">Add your TMDB API key to get started</p>
        </div>
      )}
      <div className="mt-6 pb-8">
        <MovieRow
          title="Trending This Week"
          movies={trending}
          seeMoreHref="/browse?category=trending"
        />
        <MovieRow
          title="Popular Movies"
          movies={tag(popularMovies, "movie")}
          mediaType="movie"
          seeMoreHref="/browse?category=popular-movies"
        />
        <MovieRow
          title="Popular TV Shows"
          movies={tag(popularTV, "tv")}
          mediaType="tv"
          seeMoreHref="/browse?category=popular-tv"
        />
        <MovieRow
          title="Top Rated Movies"
          movies={tag(topRatedMovies, "movie")}
          mediaType="movie"
          seeMoreHref="/browse?category=top-rated-movies"
        />
        <MovieRow
          title="Top Rated TV Shows"
          movies={tag(topRatedTV, "tv")}
          mediaType="tv"
          seeMoreHref="/browse?category=top-rated-tv"
        />
        <MovieRow
          title="Action"
          movies={tag(action, "movie")}
          mediaType="movie"
          seeMoreHref="/browse?category=genre&genreId=28&mediaType=movie&name=Action+Movies"
        />
        <MovieRow
          title="Comedy"
          movies={tag(comedy, "movie")}
          mediaType="movie"
          seeMoreHref="/browse?category=genre&genreId=35&mediaType=movie&name=Comedy+Movies"
        />
        <MovieRow
          title="Horror"
          movies={tag(horror, "movie")}
          mediaType="movie"
          seeMoreHref="/browse?category=genre&genreId=27&mediaType=movie&name=Horror+Movies"
        />
        <MovieRow
          title="Drama"
          movies={tag(drama, "movie")}
          mediaType="movie"
          seeMoreHref="/browse?category=genre&genreId=18&mediaType=movie&name=Drama"
        />
        <MovieRow
          title="Sci-Fi"
          movies={tag(sciFi, "movie")}
          mediaType="movie"
          seeMoreHref="/browse?category=genre&genreId=878&mediaType=movie&name=Sci-Fi+Movies"
        />
      </div>
    </>
  );
}

function HomeLoading() {
  return (
    <div className="p-4 space-y-8">
      <div className="rounded-2xl skeleton" style={{ height: "clamp(300px, 50vh, 460px)" }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-5 w-40 skeleton rounded" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="aspect-[2/3] skeleton rounded-lg shrink-0" style={{ width: "clamp(140px, 18vw, 220px)" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
