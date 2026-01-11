import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Github, Sparkles, FileText, Brain, GitCompare, Users } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative bg-black text-white overflow-hidden isolation-isolate">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" /> Synapse Knowledge Hub
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Research at the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Speed of Thought
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A focused AI-powered workspace for reading, comparing, and reasoning over
            research papers — without hallucinations.
          </p>

          <SignedOut>
            <div className="flex justify-center gap-4 pt-4">
              <SignInButton mode="modal">
                <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
              <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </button>
            </div>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-bold">Built for serious thinking</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Students", desc: "Understand papers deeply and prepare for exams & viva." },
              { title: "Researchers", desc: "Compare methodologies and reason over literature." },
              { title: "Developers", desc: "Explore ML & CS papers with grounded AI assistance." },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold text-center">What Synapse does differently</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Feature icon={<FileText />} title="Document-Grounded AI">
              Answers are generated directly from your uploaded PDFs — not the internet.
            </Feature>
            <Feature icon={<Brain />} title="Research Copilot">
              Ask, challenge, and explain papers at different levels of understanding.
            </Feature>
            <Feature icon={<GitCompare />} title="Paper Comparison">
              Instantly compare methodologies, assumptions, and conclusions.
            </Feature>
            <Feature icon={<Users />} title="Community Reasoning">
              Debate ideas, vote on answers, and learn socially.
            </Feature>
          </div>
        </div>
      </section>

      {/* FOOTER TRUST LINE */}
      <footer className="pb-16 text-center text-xs text-zinc-500">
        Built with Next.js, FastAPI, PostgreSQL & Gemini — focused on correctness, not hype.
      </footer>

    </main>
  );
}

function Feature({ icon, title, children }: any) {
  return (
    <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900/40 border border-white/5">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-zinc-400">{children}</p>
      </div>
    </div>
  );
}
