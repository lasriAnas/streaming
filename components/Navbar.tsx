"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiBell, FiChevronDown } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-3 transition-all duration-500 ${
        scrolled
          ? "bg-[#141414]"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded">
            <FaPlay className="text-white text-xs ml-0.5" />
          </div>
          <span className="text-white font-black text-xl tracking-tight hidden sm:block">
            Stream<span className="text-red-500">Vault</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5 text-sm text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/search?type=movie" className="hover:text-white transition-colors">Movies</Link>
          <Link href="/search?type=tv" className="hover:text-white transition-colors">TV Shows</Link>
          <Link href="/search?q=trending" className="hover:text-white transition-colors">Trending</Link>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center">
          {searchOpen ? (
            <div className="flex items-center bg-black/80 border border-white/30 rounded px-3 py-1.5 gap-2">
              <FiSearch className="text-white shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-sm outline-none w-40 md:w-56 placeholder:text-gray-400"
                onBlur={() => !query && setSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-white hover:text-gray-300 transition-colors p-1"
            >
              <FiSearch size={20} />
            </button>
          )}
        </form>

        {/* Bell */}
        <button className="text-white hover:text-gray-300 transition-colors p-1 hidden sm:block">
          <FiBell size={20} />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1"
          >
            <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <FiChevronDown
              className={`text-white transition-transform duration-200 hidden sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 bg-[#1a1a1a] border border-white/10 rounded shadow-xl py-2 w-44 text-sm">
              <div className="px-4 py-2 text-white font-medium border-b border-white/10 mb-1">My Account</div>
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                Manage Profiles
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                My List
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                Settings
              </button>
              <div className="border-t border-white/10 mt-1 pt-1">
                <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
