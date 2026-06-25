import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getApiKey() {
  return process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const page = Math.max(1, Math.min(500, Number(searchParams.get("page") || "1")));

  const apiKey = getApiKey();
  if (!apiKey) return NextResponse.json({ results: [], total_pages: 0 });

  const base = new URLSearchParams({ api_key: apiKey, page: String(page), include_adult: "false" });

  let endpoint: string;
  if (q) {
    base.set("query", q);
    if (type === "movie") endpoint = "/search/movie";
    else if (type === "tv") endpoint = "/search/tv";
    else endpoint = "/search/multi";
  } else if (type === "movie") {
    endpoint = "/movie/popular";
  } else if (type === "tv") {
    endpoint = "/tv/popular";
  } else {
    endpoint = "/trending/all/week";
  }

  try {
    const res = await fetch(`${TMDB_BASE}${endpoint}?${base.toString()}`);
    if (!res.ok) return NextResponse.json({ results: [], total_pages: 0 });
    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results: any[] = data.results || [];

    if (type === "movie") {
      results = results.map((r) => ({ ...r, media_type: "movie" }));
    } else if (type === "tv") {
      results = results.map((r) => ({ ...r, media_type: "tv" }));
    } else if (q) {
      results = results.filter((r) => r.media_type === "movie" || r.media_type === "tv");
    }

    results = results.filter((r) => r.poster_path || r.backdrop_path);

    return NextResponse.json({
      results,
      total_pages: Math.min(data.total_pages || 1, 500),
    });
  } catch {
    return NextResponse.json({ results: [], total_pages: 0 });
  }
}
