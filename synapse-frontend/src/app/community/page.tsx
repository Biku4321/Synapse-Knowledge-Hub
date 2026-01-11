"use client";

import dynamic from 'next/dynamic';

const CommunityFeed = dynamic(() => import('@/components/CommunityFeed'), { ssr: false });

export default function CommunityPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Global Forum</h1>
                <p className="text-zinc-400">Debate with 10k+ researchers and AI critics.</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">
                New Topic
            </button>
        </div>

        <CommunityFeed />
    </div>
  );
}