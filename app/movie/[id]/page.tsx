import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaPlay, FaPlus, FaArrowLeft, FaStar } from "react-icons/fa";
import { FiClock, FiCalendar, FiGlobe } from "react-icons/fi";
import { fetchMovieDetails, fetchOmdbData, fetchSimilar, getImageUrl } from "@/lib/tmdb";
import ImdbBadge from "@/components/ImdbBadge";
import MovieRow from "@/components/MovieRow";
import CastSection from "@/components/CastSection";
import type { Metadata } from "next";
import type { CastMember, Video } from "@/lib/types";
import MoviePlayer from "@/components/VideoPlayer";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const movie = await fetchMovieDetails(Number(id));
    return {
      title: `${movie.title} — StreamVault`,
      description: movie.overview,
    };
  } catch {
    return { title: "Movie — StreamVault" };
  }
}

async function MovieContent({ id }: { id: number }) {
  const [movie, similar] = await Promise.all([
    fetchMovieDetails(id),
    fetchSimilar("movie", id).then((r) => r.results || []),
  ]);

  if (!movie || movie.status_code === 34) notFound();

  const imdbId = movie.external_ids?.imdb_id || movie.imdb_id;
  const omdb = imdbId ? await fetchOmdbData(imdbId) : null;

  const trailer = movie.videos?.results?.find(
    (v: Video) => v.type === "Trailer" && v.site === "YouTube" && v.official
  ) || movie.videos?.results?.find(
    (v: Video) => v.type === "Trailer" && v.site === "YouTube"
  );

  const cast: CastMember[] = movie.credits?.cast || [];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const releaseYear = movie.release_date?.slice(0, 4);
  const score = movie.vote_average?.toFixed(1);

  return (
    <div className="min-h-screen bg-[#0e1520]">
      {/* Backdrop */}
      <div className="relative h-[55vh] md:h-[70vh] min-h-[320px] overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
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

        {/* Back button */}
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
            {movie.poster_path ? (
              <Image
                src={getImageUrl(movie.poster_path, "w780")}
                alt={movie.title}
                width={384}
                height={576}
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center text-gray-500 text-sm text-center p-4">
                {movie.title}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-gray-400 italic mb-4 text-sm md:text-base">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Meta row */}
            <div className="flex items-center flex-wrap gap-3 mb-4 text-sm text-gray-300">
              {releaseYear && (
                <span className="flex items-center gap-1">
                  <FiCalendar size={13} />
                  {releaseYear}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <FiClock size={13} />
                  {runtime}
                </span>
              )}
              {score && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <FaStar size={12} />
                  {score} <span className="text-gray-500 font-normal">({movie.vote_count?.toLocaleString()})</span>
                </span>
              )}
              {movie.adult && (
                <span className="border border-white/30 px-1.5 py-0.5 rounded text-xs">18+</span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g: { id: number; name: string }) => (
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

            {/* Overview */}
            <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base max-w-2xl">
              {movie.overview}
            </p>

            {/* IMDB Badge */}
            {omdb && <ImdbBadge omdb={omdb} imdbId={imdbId} />}
          </div>
        </div>

        {/* OMDB Extra Info */}
        {omdb && (
          <div className="mt-8 max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {omdb.Director && omdb.Director !== "N/A" && (
              <InfoCard label="Director" value={omdb.Director} />
            )}
            {omdb.Writer && omdb.Writer !== "N/A" && (
              <InfoCard label="Writer" value={omdb.Writer} />
            )}
            {omdb.Awards && omdb.Awards !== "N/A" && (
              <InfoCard label="Awards" value={omdb.Awards} />
            )}
            {omdb.Country && omdb.Country !== "N/A" && (
              <InfoCard label="Country" value={omdb.Country} icon={<FiGlobe size={14} />} />
            )}
            {omdb.Language && omdb.Language !== "N/A" && (
              <InfoCard label="Language" value={omdb.Language} />
            )}
            {omdb.BoxOffice && omdb.BoxOffice !== "N/A" && (
              <InfoCard label="Box Office" value={omdb.BoxOffice} />
            )}
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10 max-w-6xl">
            <CastSection cast={cast} />
          </div>
        )}

        <MoviePlayer movieId={movie.id} title={movie.title} />

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-10">
            <MovieRow title="More Like This" movies={similar} mediaType="movie" />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-white text-sm leading-snug">{value}</p>
    </div>
  );
}

export default function MoviePage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e1520] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AsyncMoviePage params={params} />
    </Suspense>
  );
}

async function AsyncMoviePage({ params }: Props) {
  const { id } = await params;
  return <MovieContent id={Number(id)} />;
}
