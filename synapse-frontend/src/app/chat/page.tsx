"use client";

import dynamic from "next/dynamic";

const ChatInterface = dynamic(() => import("@/components/ChatInterface"), { ssr: false });

export default function ChatPage() {
  return (
    <div className="h-[85vh] w-full flex flex-col gap-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex-shrink-0 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Research Assistant
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Ask questions, challenge assumptions, and extract grounded answers from your papers.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 min-h-0 rounded-3xl bg-zinc-900/40 shadow-xl shadow-black/30 overflow-hidden">
        <ChatInterface />
      </div>

    </div>
  );
}
