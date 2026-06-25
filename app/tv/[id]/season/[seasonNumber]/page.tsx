import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { fetchShowDetails, fetchSeasonDetails, getImageUrl } from "@/lib/tmdb";
import EpisodeList from "@/components/EpisodeList";
import type { Metadata } from "next";
import type { Episode } from "@/lib/types";

interface Props {
  params: Promise<{ id: string; seasonNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id, seasonNumber } = await params;
    const [show, season] = await Promise.all([
      fetchShowDetails(Number(id)),
      fetchSeasonDetails(Number(id), Number(seasonNumber)),
    ]);
    return {
      title: `${show.name} — ${season.name} — StreamVault`,
      description: season.overview || show.overview,
    };
  } catch {
    return { title: "Season — StreamVault" };
  }
}

async function SeasonContent({
  showId,
  seasonNumber,
}: {
  showId: number;
  seasonNumber: number;
}) {
  const [show, season] = await Promise.all([
    fetchShowDetails(showId),
    fetchSeasonDetails(showId, seasonNumber),
  ]);

  if (!season || !show) notFound();

  const episodes: Episode[] = season.episodes || [];
  const airYear = season.air_date?.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0e1520]">
      {/* Backdrop header */}
      <div className="relative h-[30vh] min-h-[200px] overflow-hidden">
        {show.backdrop_path ? (
          <Image
            src={getImageUrl(show.backdrop_path, "original")}
            alt={show.name}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1520] via-[#0e1520]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1520]/60 to-transparent" />

        <Link
          href={`/tv/${showId}`}
          className="absolute top-4 left-4 md:left-12 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm"
        >
          <FaArrowLeft size={12} />
          {show.name}
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 md:px-12 -mt-16 relative z-10 pb-16">
        {/* Season header */}
        <div className="flex gap-5 items-end mb-8 max-w-6xl">
          {season.poster_path && (
            <div className="shrink-0 w-24 md:w-32 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={getImageUrl(season.poster_path, "w300")}
                alt={season.name}
                width={128}
                height={192}
                className="w-full h-auto"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-gray-400 text-sm mb-0.5">{show.name}</p>
            <h1 className="text-2xl md:text-4xl font-black text-white mb-2">{season.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
              {airYear && (
                <span className="flex items-center gap-1">
                  <FiCalendar size={13} />
                  {airYear}
                </span>
              )}
              <span>
                {episodes.length} Episode{episodes.length !== 1 ? "s" : ""}
              </span>
              {season.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <FaStar size={12} />
                  {season.vote_average.toFixed(1)}
                </span>
              )}
            </div>
            {season.overview && (
              <p className="text-gray-300 text-sm leading-relaxed mt-3 max-w-2xl line-clamp-3">
                {season.overview}
              </p>
            )}
          </div>
        </div>

        {/* Episode list with layout toggle */}
        <div className="max-w-6xl">
          <EpisodeList episodes={episodes} showId={showId} seasonNumber={seasonNumber} />
        </div>
      </div>
    </div>
  );
}

export default function SeasonPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e1520] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AsyncSeasonPage params={params} />
    </Suspense>
  );
}

async function AsyncSeasonPage({ params }: Props) {
  const { id, seasonNumber } = await params;
  return <SeasonContent showId={Number(id)} seasonNumber={Number(seasonNumber)} />;
}
