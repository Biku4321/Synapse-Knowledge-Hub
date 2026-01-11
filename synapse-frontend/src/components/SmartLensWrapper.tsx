"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Loader2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

export default function SmartLensWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Detect Text Selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || !containerRef.current?.contains(selection.anchorNode)) {
        if (!explanation) setCoords(null); 
        return;
      }

      const text = selection.toString().trim();
      if (text.length > 0 && text.length < 50) { 
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // --- FIX IS HERE: Prevent popup from going off-screen ---
        // We ensure 'x' is at least 160px (half popup width + padding)
        // We also ensure it doesn't go off the right side
        const screenWidth = window.innerWidth;
        let safeX = rect.left + window.scrollX + rect.width / 2;
        
        // Left boundary check
        safeX = Math.max(160, safeX);
        // Right boundary check
        safeX = Math.min(screenWidth - 160, safeX);

        setCoords({
          x: safeX,
          y: rect.top + window.scrollY - 10
        });
        setSelectedText(text);
        
        if (!explanation) setExplanation(null); 
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [explanation]);

  // 2. Fetch Definition
  const handleExplain = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await api.post('/api/lens/explain', { 
        text: selectedText,
        context: "User is reading a research summary."
      });
      setExplanation(res.data.explanation);
    } catch (err) {
      setExplanation("Limit reached or Network error.");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoords(null);
    setExplanation(null);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full"> 
      {children}

      {/* Floating Popup */}
      {coords && (
        <div 
          className="absolute z-[9999]" 
          style={{ 
            left: coords.x, 
            top: coords.y, 
            transform: 'translate(-50%, -100%)', // Centered based on safeX
            marginTop: '-12px' 
          }}
        >
            {/* BUTTON MODE */}
            {!explanation && !loading && (
              <button 
                onClick={handleExplain}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-xl hover:bg-indigo-700 transition-transform hover:scale-105 border border-indigo-400"
              >
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-semibold">Explain</span>
              </button>
            )}

            {/* LOADING MODE */}
            {loading && (
               <div className="bg-white p-2 rounded-full shadow-xl border border-zinc-200">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
               </div>
            )}

            {/* RESULT MODE */}
            {explanation && (
              <div 
                className="w-72 p-4 rounded-xl shadow-2xl border border-zinc-200 animate-in fade-in slide-in-from-bottom-2"
                style={{ backgroundColor: 'white', color: 'black' }} 
              >
                 <div className="flex justify-between items-start mb-2 border-b border-zinc-100 pb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider truncate max-w-[200px]">
                      {selectedText}
                    </span>
                    <button onClick={closePopup} className="text-zinc-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                    </button>
                 </div>
                 
                 {/* Error Handling UI: Check if the text is the Google Error */}
                 {explanation.includes("quota") || explanation.includes("Limit") ? (
                    <div className="text-red-500 text-xs flex items-center gap-2 bg-red-50 p-2 rounded">
                        <AlertTriangle className="w-4 h-4" />
                        <span>AI Limit Reached. Try again in 1 min.</span>
                    </div>
                 ) : (
                    <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                        {explanation}
                    </p>
                 )}

                 <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white transform rotate-45 border-b border-r border-zinc-200"></div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}