"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { ArrowRightLeft, Loader2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Doc {
  id: number;
  filename: string;
}

export default function ComparePapers() {
  const { userId } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [doc1, setDoc1] = useState<number | null>(null);
  const [doc2, setDoc2] = useState<number | null>(null);
  const [comparison, setComparison] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      api.get(`/api/pdf/list?user_id=${userId}`).then(res => setDocs(res.data));
    }
  }, [userId]);

  const handleCompare = async () => {
    if (!doc1 || !doc2) return;
    setLoading(true);
    try {
      const res = await api.post("/api/pdf/compare", {
        doc1_id: doc1,
        doc2_id: doc2,
      });
      setComparison(res.data.comparison);
    } catch {
      setComparison("Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  const isReady = doc1 && doc2;
  const showEmpty = docs.length < 2;

  return (
    <div className="rounded-3xl bg-zinc-900/40 p-8 shadow-lg shadow-black/20">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <ArrowRightLeft className="text-indigo-400 w-5 h-5" />
        <div>
          <h2 className="text-lg font-semibold text-white">
            Paper Comparison
          </h2>
          <p className="text-sm text-zinc-500">
            Contrast methodology, assumptions, and conclusions.
          </p>
        </div>
      </div>

      {/* EMPTY STATE (NOT ENOUGH PAPERS) */}
      {showEmpty && (
        <div className="mb-10 rounded-2xl border border-white/10 bg-black/30 p-6 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-lg bg-indigo-600/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-sm text-zinc-300">
            Upload at least <span className="font-semibold text-white">two papers</span>{" "}
            to compare methods, results, and conclusions.
          </p>
        </div>
      )}

      {/* SELECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end mb-8">
        <select
          className="bg-black/40 text-sm text-zinc-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setDoc1(Number(e.target.value))}
        >
          <option>Select Paper A</option>
          {docs.map(d => (
            <option key={d.id} value={d.id}>
              {d.filename}
            </option>
          ))}
        </select>

        <span className="hidden md:block text-zinc-500 font-medium text-center">
          vs
        </span>

        <select
          className="bg-black/40 text-sm text-zinc-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setDoc2(Number(e.target.value))}
        >
          <option>Select Paper B</option>
          {docs.map(d => (
            <option key={d.id} value={d.id}>
              {d.filename}
            </option>
          ))}
        </select>

        <button
          onClick={handleCompare}
          disabled={!isReady || loading}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
            isReady
              ? "bg-indigo-600 hover:bg-indigo-500 text-white"
              : "bg-zinc-700/40 text-zinc-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing
            </>
          ) : (
            "Compare"
          )}
        </button>
      </div>

      {/* RESULT */}
      {comparison && (
        <div className="prose prose-invert max-w-none bg-black/30 p-6 rounded-2xl">
          <ReactMarkdown>{comparison}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
