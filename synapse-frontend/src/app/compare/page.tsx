"use client";

import dynamic from "next/dynamic";
import { GitCompare, Clock } from "lucide-react";

const ComparePapers = dynamic(() => import("@/components/ComparePapers"), { ssr: false });
const TimelineView = dynamic(() => import("@/components/TimelineView"), { ssr: false });

export default function AnalysisPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Analysis Lab
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Compare methodologies, uncover contradictions, and trace how ideas evolve over time.
        </p>
      </div>

      {/* Comparison Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5 text-indigo-400" />
          <h2 className="text-2xl font-semibold text-white">
            Side-by-Side Comparison
          </h2>
        </div>

        <div className="rounded-3xl bg-zinc-900/40 p-6 shadow-lg shadow-black/20">
          <ComparePapers />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h2 className="text-2xl font-semibold text-white">
            Timeline of Understanding
          </h2>
        </div>

        {/* This is where grid-bg SHOULD be used */}
        <div className="relative rounded-3xl bg-zinc-950 p-6 overflow-hidden grid-bg">
          <TimelineView />
        </div>
      </section>

    </div>
  );
}
