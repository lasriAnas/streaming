import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaPlay, FaPlus, FaArrowLeft, FaStar } from "react-icons/fa";
import { FiCalendar, FiTv } from "react-icons/fi";
import { fetchShowDetails, fetchOmdbData, fetchSimilar, getImageUrl } from "@/lib/tmdb";
import ImdbBadge from "@/components/ImdbBadge";
import MovieRow from "@/components/MovieRow";
import CastSection from "@/components/CastSection";
import type { Metadata } from "next";
import type { CastMember, Video, ShowSeason } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const show = await fetchShowDetails(Number(id));
    return {
      title: `${show.name} — StreamVault`,
      description: show.overview,
    };
  } catch {
    return { title: "TV Show — StreamVault" };
  }
}

async function ShowContent({ id }: { id: number }) {
  const [show, similar] = await Promise.all([
    fetchShowDetails(id),
    fetchSimilar("tv", id).then((r) => r.results || []),
  ]);

  if (!show || show.status_code === 34) notFound();

  const imdbId = show.external_ids?.imdb_id || show.imdb_id;
  const omdb = imdbId ? await fetchOmdbData(imdbId) : null;

  const trailer =
    show.videos?.results?.find(
      (v: Video) => v.type === "Trailer" && v.site === "YouTube" && v.official
    ) ||
    show.videos?.results?.find(
      (v: Video) => v.type === "Trailer" && v.site === "YouTube"
    );

  const cast: CastMember[] = show.credits?.cast || [];
  const seasons: ShowSeason[] = (show.seasons || []).filter(
    (s: ShowSeason) => s.season_number > 0
  );
  const startYear = show.first_air_date?.slice(0, 4);
  const score = show.vote_average?.toFixed(1);

  return (
    <div className="min-h-screen bg-[#0e1520]">
      {/* Backdrop */}
      <div className="relative h-[55vh] md:h-[70vh] min-h-[320px] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1520] via-[#0e1520]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1520]/60 to-transparent" />

        <Link
          href="/"
          className="absolute top-4 left-4 md:left-12 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm"
        >
          <FaArrowLeft size={12} />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 md:px-12 -mt-56 md:-mt-120 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-6xl">
          {/* Poster */}
          <div className="shrink-0 w-52 md:w-72 lg:w-96 self-start rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {show.poster_path ? (
              <Image
                src={getImageUrl(show.poster_path, "w780")}
                alt={show.name}
                width={384}
                height={576}
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center text-gray-500 text-sm text-center p-4">
                {show.name}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                TV Series
              </span>
              {show.status && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    show.status === "Returning Series"
                      ? "bg-green-600/20 text-green-400"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {show.status}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
              {show.name}
            </h1>
            {show.tagline && (
              <p className="text-gray-400 italic mb-4 text-sm md:text-base">
                &ldquo;{show.tagline}&rdquo;
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center flex-wrap gap-3 mb-4 text-sm text-gray-300">
              {startYear && (
                <span className="flex items-center gap-1">
                  <FiCalendar size={13} />
                  {startYear}
                </span>
              )}
              {show.number_of_seasons && (
                <span className="flex items-center gap-1">
                  <FiTv size={13} />
                  {show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}
                </span>
              )}
              {show.number_of_episodes && (
                <span className="text-gray-500">{show.number_of_episodes} episodes</span>
              )}
              {score && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <FaStar size={12} />
                  {score}
                  <span className="text-gray-500 font-normal">
                    ({show.vote_count?.toLocaleString()})
                  </span>
                </span>
              )}
            </div>

            {/* Genres */}
            {show.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map((g: { id: number; name: string }) => (
                  <span
                    key={g.id}
                    className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full border border-white/10"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {trailer ? (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaPlay size={13} />
                  Watch Trailer
                </a>
              ) : (
                <button className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
                  <FaPlay size={13} />
                  Play
                </button>
              )}
              <button className="flex items-center gap-2 bg-white/10 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors border border-white/10">
                <FaPlus size={13} />
                My List
              </button>
              {imdbId && (
                <a
                  href={`https://www.imdb.com/title/${imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f5c518] text-black font-black text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  IMDb ↗
                </a>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base max-w-2xl">
              {show.overview}
            </p>

            {omdb && <ImdbBadge omdb={omdb} imdbId={imdbId} />}
          </div>
        </div>

        {/* OMDB details */}
        {omdb && (
          <div className="mt-8 max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {omdb.totalSeasons && omdb.totalSeasons !== "N/A" && (
              <InfoCard label="Total Seasons" value={omdb.totalSeasons} />
            )}
            {omdb.Actors && omdb.Actors !== "N/A" && (
              <InfoCard label="Starring" value={omdb.Actors} />
            )}
            {omdb.Awards && omdb.Awards !== "N/A" && (
              <InfoCard label="Awards" value={omdb.Awards} />
            )}
            {omdb.Country && omdb.Country !== "N/A" && (
              <InfoCard label="Country" value={omdb.Country} />
            )}
            {omdb.Language && omdb.Language !== "N/A" && (
              <InfoCard label="Language" value={omdb.Language} />
            )}
            {omdb.Rated && omdb.Rated !== "N/A" && (
              <InfoCard label="Rated" value={omdb.Rated} />
            )}
          </div>
        )}

        {/* Seasons */}
        {seasons.length > 0 && (
          <div className="mt-10 max-w-6xl">
            <h2 className="text-white font-bold text-lg mb-4">Seasons</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {seasons.map((season) => (
                <Link
                  key={season.id}
                  href={`/tv/${id}/season/${season.season_number}`}
                  className="group bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden border border-white/5"
                >
                  <div className="aspect-[2/3] relative bg-gray-800 overflow-hidden">
                    {season.poster_path ? (
                      <Image
                        src={getImageUrl(season.poster_path, "w300")}
                        alt={season.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 17vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm text-center p-2">
                        {season.name}
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-white text-xs font-semibold line-clamp-1">{season.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {season.episode_count} ep{season.episode_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10 max-w-6xl">
            <CastSection cast={cast} />
          </div>
        )}

        {similar.length > 0 && (
          <div className="mt-10">
            <MovieRow title="You May Also Like" movies={similar} mediaType="tv" />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className="text-white text-sm leading-snug">{value}</p>
    </div>
  );
}

export default function TVPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e1520] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AsyncTVPage params={params} />
    </Suspense>
  );
}

async function AsyncTVPage({ params }: Props) {
  const { id } = await params;
  return <ShowContent id={Number(id)} />;
}
