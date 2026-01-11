"use client";

import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

const PDFUploader = dynamic(() => import("@/components/PDFUploader"), { ssr: false });
const RecentUploads = dynamic(() => import("@/components/RecentUploads"), { ssr: false });

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-0 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Research Workspace
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Upload papers, extract insights, and build understanding — all in one place.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT: Primary Workspace */}
        <div className="lg:col-span-2 space-y-10">

          {/* Upload Card */}
          <div className="bg-zinc-900/40 rounded-3xl p-6 shadow-lg shadow-black/20">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Upload Research Paper
              </h2>
              <p className="text-sm text-zinc-500">
                PDF only · Max 10MB · AI-ready
              </p>
            </div>
            <PDFUploader />
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-900/30 rounded-3xl p-6 shadow-md shadow-black/10">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Recent Activity
            </h2>
            <RecentUploads />
          </div>
        </div>

        {/* RIGHT: Intelligence Panel */}
        <div className="lg:col-span-1 space-y-6">

          {/* Pro Tip */}
          <div className="rounded-2xl p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-indigo-300 mb-1">
              💡 Pro Tip
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Use <span className="text-white font-medium">Compare</span> to detect contradictions
              and methodological differences between papers.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-4 bg-zinc-900/40 text-center">
              <div className="text-2xl font-bold text-white">—</div>
              <div className="text-xs text-zinc-500 mt-1">Papers Read</div>
            </div>
            <div className="rounded-2xl p-4 bg-zinc-900/40 text-center">
              <div className="text-2xl font-bold text-white">AI</div>
              <div className="text-xs text-zinc-500 mt-1">Assistant Active</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
