"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiBell, FiSliders, FiChevronDown } from "react-icons/fi";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 shrink-0">

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 relative max-w-lg">
        <FiSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          size={16}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Movies, series, shows..."
          className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-white/20 transition-colors"
        />
      
      </form>

      <div className="flex items-center gap-2 ml-auto">
        {/* Bell */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <FiBell size={18} />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
            U
          </div>
          <div className="hidden lg:block leading-none">
            <p className="text-white text-sm font-semibold">User</p>
            <p className="text-amber-400 text-xs mt-0.5">Premium</p>
          </div>
          <FiChevronDown size={14} className="text-gray-400 hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
