"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  GitCompare,
  Users,
  Brain,
} from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return null;

  const links = [
    { href: "/dashboard", label: "Workspace", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/chat", label: "Research Chat", icon: <MessageSquare className="w-5 h-5" /> },
    { href: "/compare", label: "Analysis Lab", icon: <GitCompare className="w-5 h-5" /> },
    { href: "/brain", label: "Second Brain", icon: <Brain className="w-5 h-5" /> },
    { href: "/community", label: "Global Forum", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <aside className="h-full w-full flex flex-col bg-zinc-950/80 backdrop-blur-xl">

      {/* BRAND */}
      <div className="h-20 px-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-indigo-500/30">
          S
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-zinc-100 tracking-wide">Synapse</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Knowledge Hub
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 pt-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/15 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span
                className={`transition-colors ${
                  isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              >
                {link.icon}
              </span>
              <span className="tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ACCOUNT */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/60 transition">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-zinc-200">
              My Account
            </span>
            <span className="text-[10px] text-zinc-500">
              Research Profile
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}
