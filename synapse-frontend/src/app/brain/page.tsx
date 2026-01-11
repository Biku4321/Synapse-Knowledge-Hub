"use client";

import dynamic from "next/dynamic";

const KnowledgeMemory = dynamic(() => import("@/components/KnowledgeMemory"), { ssr: false });

export default function BrainPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">
          Second Brain
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          A living memory of your research — insights, ideas, and connections
          captured automatically and refined over time.
        </p>
      </div>

      <KnowledgeMemory />
    </div>
  );
}
