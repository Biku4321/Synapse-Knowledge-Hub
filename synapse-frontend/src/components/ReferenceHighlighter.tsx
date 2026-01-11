"use client";

import { useState } from "react";

interface Props {
  text: string;
  references: Record<string, string>;
}

export default function ReferenceHighlighter({ text, references }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const parts = text.split(/(\[\d+\])/g);

  const handleEnter = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setHoveredId(id);
  };

  return (
    <div className="relative leading-relaxed">
      {parts.map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/);

        if (match && references[match[1]]) {
          const id = match[1];

          return (
            <span
              key={i}
              className="mx-0.5 cursor-help text-indigo-400 font-semibold border-b border-dashed border-indigo-500/60 hover:text-indigo-300 transition"
              onMouseEnter={(e) => handleEnter(e, id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {part}
            </span>
          );
        }

        return <span key={i}>{part}</span>;
      })}

      {/* TOOLTIP */}
      {hoveredId && coords && (
        <div
          className="fixed z-50 w-96 max-w-[90vw] rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl p-4 text-sm animate-in fade-in zoom-in-95"
          style={{
            left: Math.min(
              Math.max(20, coords.x - 200),
              window.innerWidth - 420
            ),
            top: coords.y - 120,
          }}
        >
          <div className="text-xs font-semibold text-indigo-400 mb-1">
            Reference [{hoveredId}]
          </div>
          <p className="text-zinc-300 italic leading-relaxed">
            {references[hoveredId]}
          </p>

          {/* ARROW */}
          <div className="absolute left-1/2 -bottom-2 w-4 h-4 bg-zinc-900 rotate-45 border-r border-b border-white/10" />
        </div>
      )}
    </div>
  );
}
