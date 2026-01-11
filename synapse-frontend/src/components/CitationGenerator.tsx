"use client";

import { useState } from "react";
import { Quote, Copy, Check, Loader2, BookMarked } from "lucide-react";
import api from "@/lib/api";

interface Props {
  filename: string;
  summary: string;
}

export default function CitationGenerator({ filename, summary }: Props) {
  const [format, setFormat] = useState("APA");
  const [citation, setCitation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!summary) return;
    setLoading(true);
    setCitation("");
    try {
      const res = await api.post("/api/citation/generate", {
        filename,
        text_snippet: summary,
        format,
      });
      setCitation(res.data.citation);
    } catch {
      setCitation("Error generating citation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 rounded-3xl bg-zinc-900/40 border border-white/10 p-6 space-y-4 shadow-lg shadow-black/20">

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Quote className="w-4 h-4 text-indigo-400" />
        <h4 className="text-sm font-semibold text-white">
          Citation Generator
        </h4>
        <span className="text-[10px] text-zinc-500">
          Academic formats
        </span>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="bg-black/40 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="APA">APA 7th</option>
          <option value="MLA">MLA 9th</option>
          <option value="Chicago">Chicago</option>
          <option value="Harvard">Harvard</option>
          <option value="BibTeX">BibTeX</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading || !summary}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 px-5 py-2 rounded-xl text-white text-sm font-medium transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <BookMarked className="w-4 h-4" />
              Generate Citation
            </>
          )}
        </button>
      </div>

      {/* EMPTY STATE */}
      {!citation && !loading && (
        <p className="text-xs text-zinc-500">
          Generate a properly formatted citation from the selected document.
        </p>
      )}

      {/* OUTPUT */}
      {citation && (
        <div className="relative rounded-2xl bg-black/40 border border-white/5 p-4 animate-in fade-in">
          <pre className="text-sm font-mono text-zinc-200 whitespace-pre-wrap">
            {citation}
          </pre>

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
            title="Copy citation"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
