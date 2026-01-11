"use client";

import { useState, useCallback ,useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, Loader2, AlertCircle, Headphones, PauseCircle } from 'lucide-react';
import api from '@/lib/api';
import KnowledgeGraph from './KnowledgeGraph';
import SmartLensWrapper from './SmartLensWrapper';
import CitationGenerator from './CitationGenerator';
import QuizGenerator from './QuizGenerator';
import { useAuth } from '@clerk/nextjs'; // <--- Import useAuth
import ReferenceHighlighter from './ReferenceHighlighter';

interface PDFResponse {
  id: number;
  filename: string;
  summary: string;
}

export default function PDFUploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PDFResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [references, setReferences] = useState<Record<string, string>>({});
  // Get the current user's ID from Clerk
  const { userId } = useAuth(); 

    useEffect(() => {
    if (result?.id) {
      api.post('/api/references/extract', { doc_id: result.id })
         .then(res => setReferences(res.data))
         .catch(err => console.error("Ref extract failed", err));
    }
    }, [result]);
    
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // 1. Check Authentication
    if (!userId) {
        setError("Please sign in to upload papers.");
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    // 2. Attach User ID to the request
    formData.append('user_id', userId);

    try {
      const response = await api.post('/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to upload PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]); // Add userId to dependency array

  const handlePlayAudio = async () => {
    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    if (!result?.summary) return;

    try {
      setIsPlaying(true);

      const response = await api.post('/api/audio/generate', 
        { text: result.summary },
        { responseType: 'blob' }
      );

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setAudioElement(audio);

    } catch (err) {
      console.error("Audio failed", err);
      setIsPlaying(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <div className="w-full max-w-4xl mx-auto my-8 space-y-6">
      
      {/* 1. Upload Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            <div>
                <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
                    {loading ? "Analyzing Paper..." : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    PDF Research Papers only (Max 10MB)
                </p>
            </div>
        </div>
      </div>

      {/* 2. Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
        </div>
      )}

      {/* 3. Result Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* The Summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                
                {/* Header with Title and Audio Button */}
                <div className="flex items-center gap-3 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <FileText className="w-6 h-6 text-indigo-500" />
                    <h3 className="font-semibold text-lg text-zinc-800 dark:text-zinc-100 truncate max-w-[300px]">
                        {result.filename}
                    </h3>
                    
                    <div className="ml-auto flex items-center gap-2">
                        {/* Audio Button */}
                        <button 
                            onClick={handlePlayAudio}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                isPlaying 
                                ? 'bg-indigo-100 text-indigo-700 animate-pulse' 
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                        >
                            {isPlaying ? <PauseCircle className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                            {isPlaying ? "Playing..." : "Listen"}
                        </button>

                        <span className="hidden sm:flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4" /> Analyzed
                        </span>
                    </div>
                </div>
                
                {/* Summary Text wrapped in Smart Lens */}
                <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300">
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">AI Summary & Key Takeaways:</h4>
                    <SmartLensWrapper>
                        <div className="whitespace-pre-wrap leading-relaxed bg-zinc-50 dark:bg-black/30 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 cursor-text">
                            <ReferenceHighlighter text={result.summary} references={references} />
                        </div>
                    </SmartLensWrapper>
                </div>

                {/* Citation Generator */}
                <CitationGenerator filename={result.filename} summary={result.summary} />
            </div>

            {/* Knowledge Graph */}
            <KnowledgeGraph summary={result.summary} />

            {/* Quiz Generator */}
            <QuizGenerator summary={result.summary} />
            
        </div>
      )}
    </div>
  );
}