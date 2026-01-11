"use client";

import { useEffect, useState } from "react";
import { FileText, Upload, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

interface Doc {
  id: number;
  filename: string;
  summary: string;
  upload_date: string;
}

export default function RecentUploads() {
  const { userId, isLoaded } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    if (isLoaded && userId) {
      api.get(`/api/pdf/list?user_id=${userId}`).then(res => setDocs(res.data));
    }
  }, [userId, isLoaded]);

  if (!userId) return null;

  /* EMPTY STATE */
  if (docs.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-10 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600/20 flex items-center justify-center">
          <Upload className="w-6 h-6 text-indigo-400" />
        </div>

        <h3 className="font-semibold text-white">
          Start your research workspace
        </h3>

        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Upload your first research paper to unlock summaries, citations,
          comparisons, and AI-powered discussions.
        </p>

        <div className="inline-flex items-center gap-2 text-xs text-indigo-300 justify-center pt-2">
          <Sparkles className="w-3 h-3" />
          Supports PDF · Context-aware AI · No hallucinations
        </div>
      </div>
    );
  }

  /* NORMAL STATE */
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-200">
        Your Research Library
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-indigo-400 transition cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-medium text-zinc-200 truncate max-w-[200px]">
                  {doc.filename}
                </span>
              </div>

              <span className="text-xs text-zinc-500">
                {new Date(doc.upload_date).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-zinc-400 line-clamp-2">
              {doc.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

