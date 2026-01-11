"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { Clock, History } from "lucide-react";

interface Event {
  year: string;
  title: string;
  description: string;
  doc_id: number;
}

export default function TimelineView() {
  const { userId } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) loadTimeline();
  }, [userId]);

  const loadTimeline = async () => {
    setLoading(true);
    const res = await api.get(`/api/timeline/generate?user_id=${userId}`);
    setEvents(res.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-10 animate-pulse" />
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-10 text-center">
        <History className="w-10 h-10 mx-auto mb-3 text-zinc-600" />
        <p className="text-sm text-zinc-400">
          Upload multiple papers to see how ideas evolve over time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-8">
      <div className="flex items-center gap-2 mb-8">
        <Clock className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">
          Evolution of Understanding
        </h2>
      </div>

      <div className="relative ml-4 space-y-10 border-l border-indigo-500/20">
        {events.map((e, i) => (
          <div key={i} className="pl-8 relative">
            <div className="absolute -left-[7px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-black" />
            <div className="rounded-xl bg-white/5 p-4 hover:bg-white/10 transition">
              <span className="text-xs font-semibold text-indigo-400">
                {e.year}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {e.title}
              </h3>
              <p className="text-sm text-zinc-400">
                {e.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
