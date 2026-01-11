"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { Brain, Plus, Hash, Loader2, Lightbulb, ArrowRight } from "lucide-react";
import { CardSkeleton } from "./ui/Skeleton";

interface Memory {
  id: number;
  content: string;
  tags: string;
  timestamp: string;
}

export default function KnowledgeMemory() {
  const { userId } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (userId) fetchMemories();
  }, [userId]);

  const fetchMemories = async () => {
    setInitialLoad(true);
    const res = await api.get(`/api/memory/list?user_id=${userId}`);
    setMemories(res.data);
    setInitialLoad(false);
  };

  const handleSave = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    await api.post("/api/memory/add", {
      user_id: userId,
      content: newNote,
    });
    setNewNote("");
    setLoading(false);
    fetchMemories();
  };

  return (
    <div className="bg-zinc-900/40 rounded-3xl p-8 backdrop-blur-md shadow-lg shadow-black/20">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <Brain className="text-pink-400 w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold text-white">Knowledge Memory</h2>
          <p className="text-sm text-zinc-400">
            Your personal research memory, curated by AI.
          </p>
        </div>
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mb-10">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="Save an insight, idea, or realization…"
          className="flex-1 bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-200 outline-none focus:border-pink-500 transition"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-pink-600 hover:bg-pink-500 text-white px-4 rounded-xl flex items-center justify-center transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* LOADING */}
        {initialLoad && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}

        {/* DATA */}
        {!initialLoad && memories.map((mem) => (
          <div
            key={mem.id}
            className="bg-white/5 border border-white/5 p-5 rounded-xl hover:bg-white/10 transition group animate-in fade-in zoom-in-95"
          >
            <p className="text-zinc-300 mb-4 leading-relaxed font-medium">
              “{mem.content}”
            </p>
            <div className="flex flex-wrap gap-2">
              {mem.tags.split(",").map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold text-pink-400 bg-pink-900/20 px-2 py-1 rounded"
                >
                  <Hash className="w-3 h-3" />
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* ONBOARDING EMPTY STATE */}
        {!initialLoad && memories.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center space-y-6 animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-600/20 flex items-center justify-center">
              <Lightbulb className="w-7 h-7 text-pink-400" />
            </div>

            <h3 className="text-lg font-semibold text-white">
              Your Second Brain starts here
            </h3>

            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              This space evolves into a long-term memory of everything you learn —
              insights extracted from papers, chats, and your own thoughts.
            </p>

            <div className="grid md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-4">
              <Step
                title="Capture"
                desc="Save insights manually or let AI extract them from research."
              />
              <Step
                title="Connect"
                desc="Concepts are auto-tagged and linked across papers."
              />
              <Step
                title="Recall"
                desc="Revisit ideas instantly when preparing exams or research."
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-pink-300 pt-4">
              Start by saving your first insight above <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 border border-white/5">
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-zinc-400">{desc}</p>
    </div>
  );
}
