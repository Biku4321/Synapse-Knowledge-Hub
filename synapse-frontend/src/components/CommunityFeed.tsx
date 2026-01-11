"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  MessageSquare,
  ThumbsUp,
  Zap,
  Bot,
  User,
  MessageCircle,
  Sparkles
} from "lucide-react";
import api from "@/lib/api";

interface Question {
  id: number;
  title: string;
  content: string;
  user_id: string;
}

interface Answer {
  id: number;
  content: string;
  user_id: string;
  is_ai: number;
  votes: number;
}

export default function CommunityFeed() {
  const { userId } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQ, setActiveQ] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [debateText, setDebateText] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await api.get("/api/social/questions");
    setQuestions(res.data);
  };

  const openQuestion = async (q: Question) => {
    setActiveQ(q);
    const res = await api.get(`/api/social/questions/${q.id}`);
    setAnswers(res.data.answers);
    setDebateText(null);
  };

  const handlePostQuestion = async () => {
    if (!userId || !newTitle) return;
    setLoading(true);
    await api.post("/api/social/questions", {
      user_id: userId,
      title: newTitle,
      content: newContent,
    });
    setNewTitle("");
    setNewContent("");
    setLoading(false);
    fetchQuestions();
  };

  const handlePostAnswer = async () => {
    if (!userId || !activeQ || !newAnswer) return;
    await api.post("/api/social/answers", {
      user_id: userId,
      question_id: activeQ.id,
      content: newAnswer,
    });
    setNewAnswer("");
    openQuestion(activeQ);
  };

  const handleVote = async (ansId: number) => {
    await api.post(`/api/social/answers/${ansId}/vote`);
    if (activeQ) openQuestion(activeQ);
  };

  const triggerDebate = async (text: string) => {
    setDebateText("Thinking…");
    const res = await api.post("/api/social/debate", { text });
    setDebateText(res.data.counter_argument);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 h-[650px]">

      {/* QUESTIONS LIST */}
      <div className="md:col-span-1 rounded-3xl bg-zinc-900/40 border border-white/10 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Community Discussions
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {questions.length === 0 && (
            <p className="text-xs text-zinc-500 text-center mt-8">
              No discussions yet. Start one.
            </p>
          )}

          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => openQuestion(q)}
              className={`w-full text-left p-3 rounded-xl transition ${
                activeQ?.id === q.id
                  ? "bg-indigo-600/20 text-white"
                  : "hover:bg-white/5 text-zinc-300"
              }`}
            >
              <p className="text-sm font-medium truncate">
                {q.title}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {q.content}
              </p>
            </button>
          ))}
        </div>

        {/* ASK */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <input
            className="w-full bg-black/40 rounded-lg px-3 py-2 text-xs"
            placeholder="Discussion topic"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-black/40 rounded-lg px-3 py-2 text-xs"
            rows={2}
            placeholder="Frame your question clearly…"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button
            onClick={handlePostQuestion}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Posting…" : "Start Discussion"}
          </button>
        </div>
      </div>

      {/* DETAIL VIEW */}
      <div className="md:col-span-2 rounded-3xl bg-zinc-900/40 border border-white/10 flex flex-col overflow-hidden relative">
        {!activeQ ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
            Select a discussion to begin
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white mb-2">
                {activeQ.title}
              </h2>
              <p className="text-sm text-zinc-400">
                {activeQ.content}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {answers.map((ans) => (
                <div
                  key={ans.id}
                  className={`rounded-2xl p-4 border ${
                    ans.is_ai
                      ? "bg-indigo-600/10 border-indigo-500/20"
                      : "bg-black/40 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    {ans.is_ai ? (
                      <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                        <Bot className="w-3 h-3" />
                        Synapse AI
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-zinc-400">
                        <User className="w-3 h-3" />
                        Student
                      </span>
                    )}
                    <span className="ml-auto text-zinc-500">
                      {ans.votes} votes
                    </span>
                  </div>

                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                    {ans.content}
                  </p>

                  <div className="flex gap-4 mt-4 text-xs">
                    <button
                      onClick={() => handleVote(ans.id)}
                      className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Upvote
                    </button>
                    <button
                      onClick={() => triggerDebate(ans.content)}
                      className="flex items-center gap-1 text-zinc-400 hover:text-red-400"
                    >
                      <Zap className="w-3 h-3" />
                      Challenge (AI)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ANSWER */}
            <div className="p-4 border-t border-white/5 flex gap-2">
              <input
                className="flex-1 bg-black/40 rounded-xl px-4 py-2 text-sm"
                placeholder="Add a thoughtful response…"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostAnswer()}
              />
              <button
                onClick={handlePostAnswer}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-xl"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* DEBATE MODAL */}
            {debateText && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Devil’s Advocate
                  </h3>
                  <p className="text-sm text-zinc-300 italic mb-6">
                    {debateText}
                  </p>
                  <button
                    onClick={() => setDebateText(null)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-sm rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
