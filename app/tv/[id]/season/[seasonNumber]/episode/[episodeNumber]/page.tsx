import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";
import {
  fetchShowDetails,
  fetchSeasonDetails,
  fetchEpisodeDetails,
  getImageUrl,
} from "@/lib/tmdb";
import TVPlayer from "@/components/TVPlayer";
import type { Metadata } from "next";
import type { CastMember } from "@/lib/types";

interface Props {
  params: Promise<{
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id, seasonNumber, episodeNumber } = await params;
    const [show, episode] = await Promise.all([
      fetchShowDetails(Number(id)),
      fetchEpisodeDetails(Number(id), Number(seasonNumber), Number(episodeNumber)),
    ]);
    return {
      title: `${show.name} S${seasonNumber}E${episodeNumber}: ${episode.name} — StreamVault`,
      description: episode.overview || show.overview,
    };
  } catch {
    return { title: "Episode — StreamVault" };
  }
}

async function EpisodeContent({
  showId,
  seasonNumber,
  episodeNumber,
}: {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
}) {
  const [show, episode, season] = await Promise.all([
    fetchShowDetails(showId),
    fetchEpisodeDetails(showId, seasonNumber, episodeNumber),
    fetchSeasonDetails(showId, seasonNumber),
  ]);

  if (!episode || !show) notFound();

  const guestStars: CastMember[] = episode.guest_stars?.slice(0, 8) || [];
  const totalEpisodes = season?.episodes?.length ?? 0;
  const prevEp = episodeNumber > 1 ? episodeNumber - 1 : null;
  const nextEp = episodeNumber < totalEpisodes ? episodeNumber + 1 : null;

  const sCode = String(seasonNumber).padStart(2, "0");
  const eCode = String(episodeNumber).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#0e1520]">
      {/* Breadcrumb nav */}
      <div className="px-4 md:px-12 pt-4 pb-4 flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <Link href={`/tv/${showId}`} className="hover:text-white transition-colors truncate max-w-[140px]">
          {show.name}
        </Link>
        <span>/</span>
        <Link
          href={`/tv/${showId}/season/${seasonNumber}`}
          className="hover:text-white transition-colors whitespace-nowrap"
        >
          Season {seasonNumber}
        </Link>
        <span>/</span>
        <span className="text-gray-300">Episode {episodeNumber}</span>
      </div>

      <div className="px-4 md:px-12 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Video Player */}
          <TVPlayer
            showId={showId}
            seasonNumber={seasonNumber}
            episodeNumber={episodeNumber}
            title={episode.name}
          />

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between mt-4 mb-6">
            {prevEp ? (
              <Link
                href={`/tv/${showId}/season/${seasonNumber}/episode/${prevEp}`}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg border border-white/5"
              >
                <FaChevronLeft size={11} />
                Ep {prevEp}
              </Link>
            ) : (
              <div />
            )}

            <span className="text-gray-500 text-sm font-mono">
              S{sCode}E{eCode}
            </span>

            {nextEp ? (
              <Link
                href={`/tv/${showId}/season/${seasonNumber}/episode/${nextEp}`}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg border border-white/5"
              >
                Ep {nextEp}
                <FaChevronRight size={11} />
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Episode info */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-white">{episode.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap mt-1.5">
                  {episode.air_date && (
                    <span className="flex items-center gap-1">
                      <FiCalendar size={13} />
                      {episode.air_date}
                    </span>
                  )}
                  {episode.runtime && (
                    <span className="flex items-center gap-1">
                      <FiClock size={13} />
                      {episode.runtime}m
                    </span>
                  )}
                  {episode.vote_average > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                      <FaStar size={12} />
                      {episode.vote_average.toFixed(1)}
                      <span className="text-gray-500 font-normal">
                        ({episode.vote_count?.toLocaleString()})
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/tv/${showId}/season/${seasonNumber}`}
                className="shrink-0 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
              >
                All episodes ↗
              </Link>
            </div>

            {episode.overview && (
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">{episode.overview}</p>
            )}
          </div>

          {/* Guest stars */}
          {guestStars.length > 0 && (
            <div>
              <h2 className="text-white font-bold text-base mb-4">Guest Stars</h2>
              <div className="flex gap-4 flex-wrap">
                {guestStars.map((star) => (
                  <div key={star.id} className="text-center w-20">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 mb-2 ring-2 ring-white/10 mx-auto">
                      {star.profile_path ? (
                        <Image
                          src={getImageUrl(star.profile_path, "w300")}
                          alt={star.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                          {star.name[0]}
                        </div>
                      )}
                    </div>
                    <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                      {star.name}
                    </p>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{star.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EpisodePage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e1520] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AsyncEpisodePage params={params} />
    </Suspense>
  );
}

async function AsyncEpisodePage({ params }: Props) {
  const { id, seasonNumber, episodeNumber } = await params;
  return (
    <EpisodeContent
      showId={Number(id)}
      seasonNumber={Number(seasonNumber)}
      episodeNumber={Number(episodeNumber)}
    />
  );
}
