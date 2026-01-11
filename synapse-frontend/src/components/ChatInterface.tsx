"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2, Sparkles, ChevronDown, FileText } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import CopilotControls from "./CopilotControls";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface DocOption {
  id: number;
  filename: string;
}

export default function ChatInterface() {
  const { userId } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I’m your research copilot. Choose a mode above and let’s begin." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocOption[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  const [mode, setMode] = useState("Standard");
  const [audience, setAudience] = useState("Undergrad");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      if (!userId) return;
      try {
        const res = await api.get("/api/pdf/list", { params: { user_id: userId } });
        setDocuments(res.data);
        if (res.data.length > 0) setSelectedDocId(res.data[0].id);
      } catch (err) {
        console.error("Failed to load docs", err);
      }
    };
    fetchDocs();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (prefill?: string) => {
    const question = prefill ?? input;
    if (!question.trim()) return;

    const userMessage = { role: "user" as const, content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/chat/ask", {
        question,
        doc_id: selectedDocId,
        mode,
        audience
      });

      setMessages(prev => [...prev, { role: "ai", content: response.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry — something interrupted my reasoning." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedDocName = () => {
    if (!selectedDocId) return "General Knowledge";
    const doc = documents.find(d => d.id === selectedDocId);
    return doc ? doc.filename : "Unknown Paper";
  };

  const showEmptyState = messages.length === 1 && !selectedDocId;

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900/40 rounded-3xl overflow-hidden">

      {/* HEADER */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 bg-zinc-950/60 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-200">
              Synapse Copilot
            </h2>
          </div>

          <div className="relative">
            <select
              value={selectedDocId || ""}
              onChange={(e) =>
                setSelectedDocId(e.target.value ? Number(e.target.value) : null)
              }
              className="appearance-none bg-zinc-900 text-zinc-300 py-2 pl-3 pr-9 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[220px]"
            >
              <option value="">🌐 General Knowledge</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.filename.substring(0, 24)}…
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        <CopilotControls onModeSelect={setMode} onAudienceSelect={setAudience} />
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-black/10">

        {/* EMPTY STATE */}
        {showEmptyState && (
          <div className="max-w-xl mx-auto mt-10 text-center space-y-6 animate-in fade-in duration-500">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>

            <h3 className="text-lg font-semibold text-white">
              Start a grounded research conversation
            </h3>

            <p className="text-sm text-zinc-400">
              Select a paper from the top-right to unlock document-aware answers,
              comparisons, and critical reasoning.
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                "Summarize the core contribution of this paper",
                "Explain this paper like I’m an undergrad",
                "What are the main weaknesses in this study?"
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-indigo-300 pt-2">
              <FileText className="w-3 h-3" />
              Upload or select a paper to continue
            </div>
          </div>
        )}

        {/* NORMAL CHAT */}
        {!showEmptyState &&
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-indigo-950/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-zinc-800/70 text-zinc-200 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-950/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking…
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex-shrink-0 px-6 py-4 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Ask about ${getSelectedDocName()}…`}
            className="flex-1 px-4 py-3 bg-zinc-900 rounded-xl outline-none text-sm text-zinc-200 placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
