"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Share2, Loader2, Maximize2, Network } from "lucide-react";
import api from "@/lib/api";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="py-20 text-center text-zinc-400">
      Loading visualization engine…
    </div>
  ),
});

interface GraphData {
  nodes: { id: string; group: number }[];
  links: { source: string; target: string }[];
}

export default function KnowledgeGraph({ summary }: { summary: string }) {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!summary) return;

    const fetchGraph = async () => {
      setLoading(true);
      try {
        const res = await api.post("/api/graph/generate", { summary });
        setData(res.data);
      } catch (err) {
        console.error("Graph Gen Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [summary]);

  /* EMPTY STATE */
  if (!summary) {
    return (
      <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-10 text-center">
        <Network className="w-10 h-10 mx-auto mb-4 text-indigo-400" />
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          A concept map will appear here once a document is analyzed.
          Relationships between key ideas will be visualized automatically.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-72 rounded-3xl bg-zinc-900/40 border border-white/10 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm text-zinc-400">
          Building knowledge graph…
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-3xl bg-zinc-900/40 border border-white/10 shadow-lg overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-400" />
          Knowledge Graph
        </h3>

        <button className="text-xs text-zinc-400 hover:text-indigo-400 flex items-center gap-1 transition">
          <Maximize2 className="w-3 h-3" />
          Expand
        </button>
      </div>

      {/* GRAPH */}
      <div ref={containerRef} className="h-[420px] w-full bg-black relative">
        <ForceGraph2D
          graphData={data}
          width={containerRef.current?.clientWidth || 800}
          height={420}
          nodeLabel="id"
          nodeColor={(node) =>
            (node as any).group === 1 ? "#6366f1" : "#a855f7"
          }
          linkColor={() => "#334155"}
          nodeRelSize={6}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>
    </div>
  );
}
