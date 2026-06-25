import { OmdbData } from "@/lib/types";

interface Props {
  omdb: OmdbData | null;
  imdbId?: string | null;
  compact?: boolean;
}

export default function ImdbBadge({ omdb, imdbId, compact }: Props) {
  if (!omdb) return null;

  const rating = omdb.imdbRating && omdb.imdbRating !== "N/A" ? omdb.imdbRating : null;
  const votes = omdb.imdbVotes && omdb.imdbVotes !== "N/A" ? omdb.imdbVotes : null;
  const metascore = omdb.Metascore && omdb.Metascore !== "N/A" ? omdb.Metascore : null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {rating && (
          <a
            href={`https://www.imdb.com/title/${imdbId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#f5c518] text-black px-2 py-0.5 rounded text-xs font-black hover:opacity-90 transition-opacity"
          >
            <span className="font-black tracking-tight">IMDb</span>
            <span>{rating}</span>
            <span className="opacity-60 font-normal text-[10px]">/10</span>
          </a>
        )}
        {metascore && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
              Number(metascore) >= 61
                ? "bg-green-600"
                : Number(metascore) >= 40
                ? "bg-yellow-600"
                : "bg-red-700"
            }`}
          >
            {metascore}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 backdrop-blur-sm">
      <h3 className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-3">
        IMDB Info
      </h3>

      <div className="flex items-center flex-wrap gap-4 mb-4">
        {rating && (
          <a
            href={`https://www.imdb.com/title/${imdbId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="bg-[#f5c518] text-black px-3 py-1.5 rounded-lg">
              <span className="font-black text-sm tracking-tight block leading-none">IMDb</span>
            </div>
            <div>
              <p className="text-white font-black text-2xl leading-none">{rating}</p>
              <p className="text-white/40 text-xs">/10 · {votes}</p>
            </div>
          </a>
        )}

        {metascore && (
          <div>
            <p className="text-white/60 text-xs mb-1">Metascore</p>
            <span
              className={`inline-block text-white font-black text-xl px-3 py-1 rounded-lg ${
                Number(metascore) >= 61
                  ? "bg-green-600"
                  : Number(metascore) >= 40
                  ? "bg-yellow-600"
                  : "bg-red-700"
              }`}
            >
              {metascore}
            </span>
          </div>
        )}

        {omdb.Rated && omdb.Rated !== "N/A" && (
          <div>
            <p className="text-white/60 text-xs mb-1">Rating</p>
            <span className="border border-white/30 text-white/80 text-sm px-2 py-1 rounded">
              {omdb.Rated}
            </span>
          </div>
        )}
      </div>

      {/* Extra IMDB ratings (RT, etc.) */}
      {omdb.Ratings && omdb.Ratings.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {omdb.Ratings.filter((r) => r.Source !== "Internet Movie Database").map((r) => (
            <div key={r.Source}>
              <p className="text-white/50 text-[10px] mb-0.5">{r.Source}</p>
              <p className="text-white text-sm font-semibold">{r.Value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
