"use client";

import { useState } from "react";
import Image from "next/image";
import type { CastMember } from "@/lib/types";

interface CastSectionProps {
  cast: CastMember[];
}

const INITIAL_COUNT = 10;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

export default function CastSection({ cast }: CastSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? cast : cast.slice(0, INITIAL_COUNT);
  const hasMore = cast.length > INITIAL_COUNT;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg">Cast</h2>
        {hasMore && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            {expanded ? "View Less" : `View All (${cast.length})`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-5">
        {visible.map((member) => (
          <div key={member.id} className="flex flex-col items-center text-center">
            <div className="w-full aspect-square max-w-[72px] rounded-full overflow-hidden bg-gray-800 mb-2 ring-2 ring-white/10">
              {member.profile_path ? (
                <Image
                  src={`${IMAGE_BASE}${member.profile_path}`}
                  alt={member.name}
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                  {member.name[0]}
                </div>
              )}
            </div>
            <p className="text-white text-xs font-semibold leading-tight line-clamp-2 w-full">
              {member.name}
            </p>
            <p className="text-gray-500 text-xs line-clamp-1 mt-0.5 w-full">{member.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
