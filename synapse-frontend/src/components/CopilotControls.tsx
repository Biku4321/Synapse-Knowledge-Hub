"use client";

import { useState } from "react";
import { User, GraduationCap, Gavel, Microscope, School } from "lucide-react";

interface Props {
  onModeSelect: (mode: string) => void;
  onAudienceSelect: (audience: string) => void;
}

export default function CopilotControls({ onModeSelect, onAudienceSelect }: Props) {
  const [activeMode, setActiveMode] = useState("Standard");
  const [activeAudience, setActiveAudience] = useState("Undergrad");

  const modes = [
    { id: "Standard", label: "Assistant", icon: <User className="w-4 h-4" /> },
    { id: "Critic", label: "Critical Reviewer", icon: <Gavel className="w-4 h-4" /> },
    { id: "Viva", label: "Viva Examiner", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "Flaws", label: "Find Flaws", icon: <Microscope className="w-4 h-4" /> },
  ];

  const audiences = ["Child", "High School", "Undergrad", "Expert"];

  return (
    <div className="px-6 pb-4 flex flex-col gap-5">

      {/* MODE SELECTOR */}
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id);
                onModeSelect(mode.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive
                  ? "bg-indigo-600/90 text-white shadow shadow-indigo-500/20"
                  : "bg-zinc-900/40 text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              }`}
            >
              <span className={isActive ? "text-white" : "text-zinc-500"}>
                {mode.icon}
              </span>
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* AUDIENCE */}
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
          <School className="w-3 h-3" />
          Explain To
        </span>

        <div className="flex bg-zinc-900/60 rounded-full p-1">
          {audiences.map((aud) => {
            const isActive = activeAudience === aud;

            return (
              <button
                key={aud}
                onClick={() => {
                  setActiveAudience(aud);
                  onAudienceSelect(aud);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {aud}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
