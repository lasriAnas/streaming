import { NextRequest, NextResponse } from "next/server";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularShows,
  fetchTopRatedMovies,
  fetchTopRatedShows,
  fetchMoviesByGenre,
  fetchShowsByGenre,
} from "@/lib/tmdb";
import type { Movie } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") || "trending";
  const genreId = searchParams.get("genreId");
  const mediaType = searchParams.get("mediaType") || "movie";
  const page = Number(searchParams.get("page") || "1");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: { results?: any[]; total_pages?: number } = { results: [] };

    if (category === "trending") {
      data = await fetchTrending("all", "week", page);
      data = {
        ...data,
        results: (data.results || []).filter(
          (r: Movie) => r.media_type === "movie" || r.media_type === "tv"
        ),
      };
    } else if (category === "popular-movies") {
      data = await fetchPopularMovies(page);
      data = {
        ...data,
        results: (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" })),
      };
    } else if (category === "popular-tv") {
      data = await fetchPopularShows(page);
      data = {
        ...data,
        results: (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" })),
      };
    } else if (category === "top-rated-movies") {
      data = await fetchTopRatedMovies(page);
      data = {
        ...data,
        results: (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" })),
      };
    } else if (category === "top-rated-tv") {
      data = await fetchTopRatedShows(page);
      data = {
        ...data,
        results: (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" })),
      };
    } else if (category === "genre" && genreId) {
      if (mediaType === "tv") {
        data = await fetchShowsByGenre(Number(genreId), page);
        data = {
          ...data,
          results: (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" })),
        };
      } else {
        data = await fetchMoviesByGenre(Number(genreId), page);
        data = {
          ...data,
          results: (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" })),
        };
      }
    }

    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
    });
  } catch {
    return NextResponse.json({ results: [], total_pages: 1 }, { status: 500 });
  }
}
