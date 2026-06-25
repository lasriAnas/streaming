"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiHeart,
  FiCalendar,
  FiTrendingUp,
  FiSettings,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaPlay } from "react-icons/fa";

const mainNav = [
  { href: "/", icon: FiHome, label: "Home" },
  { href: "/search?type=favorites", icon: FiHeart, label: "Favorites" },
  { href: "/search?type=movie&sort=upcoming", icon: FiCalendar, label: "Coming Soon" },
  { href: "/search?q=trending", icon: FiTrendingUp, label: "Trending" },
];

const bottomNav = [
  { href: "/", icon: FiSettings, label: "Settings" },
  { href: "/", icon: FiHelpCircle, label: "Support" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname === base;
  }

  return (
    <aside
      className={`relative hidden md:flex flex-col bg-[#0d1526] border-r border-white/5 shrink-0 transition-[width] duration-300 h-screen sticky top-0 overflow-hidden ${
        collapsed ? "w-[68px]" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
          <FaPlay className="text-black text-[11px] ml-0.5" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
            StreamVault
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 py-2">
        {mainNav.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                active
                  ? "text-white bg-white/10"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col gap-0.5 px-3 py-4 border-t border-white/5">
        {bottomNav.map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </Link>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a2540] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-20"
      >
        {collapsed ? <FiChevronRight size={11} /> : <FiChevronLeft size={11} />}
      </button>
    </aside>
  );
}
