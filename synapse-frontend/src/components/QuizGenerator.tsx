"use client";

import { useState } from 'react';
import { BrainCircuit, CheckCircle, XCircle, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export default function QuizGenerator({ summary }: { summary: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    setShowScore(false);
    setScore(0);
    setCurrentQ(0);
    setQuestions([]);
    
    try {
      const res = await api.post('/api/quiz/generate', { text: summary });
      setQuestions(res.data);
    } catch (err) {
      alert("Failed to create quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    
    const isCorrect = option === questions[currentQ].answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Wait 1.5s then move to next question
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedOption(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="mt-6 p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-zinc-600 dark:text-zinc-400">Consulting the Professor...</p>
      </div>
    );
  }

  // Initial State: "Start Quiz" Button
  if (questions.length === 0) {
    return (
      <div className="mt-6 p-6 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600">
             <BrainCircuit className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Test Your Knowledge</h4>
        <p className="text-sm text-zinc-500 max-w-sm">
            Generate an instant AI quiz based on this paper to prepare for exams.
        </p>
        <button 
            onClick={startQuiz}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
            Generate Quiz
        </button>
      </div>
    );
  }

  // Final State: Score Card
  if (showScore) {
    return (
      <div className="mt-6 p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-zinc-950 text-center space-y-4">
        <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Quiz Complete!</h3>
        <div className="text-5xl font-black text-indigo-600">
            {score} / {questions.length}
        </div>
        <p className="text-zinc-500">
            {score === questions.length ? "Perfect Score! 🌟" : "Good effort! Keep studying. 📚"}
        </p>
        <button 
            onClick={startQuiz}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-white border border-zinc-200 shadow-sm rounded-lg text-sm font-medium hover:bg-zinc-50 text-zinc-700"
        >
            <RefreshCw className="w-4 h-4" /> Try Another
        </button>
      </div>
    );
  }

  // Active State: Question Card
  const q = questions[currentQ];
  return (
    <div className="mt-6 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 h-1.5">
            <div 
                className="bg-indigo-500 h-1.5 transition-all duration-300"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            ></div>
        </div>

        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                    Question {currentQ + 1} of {questions.length}
                </span>
                <span className="text-xs text-zinc-400">Score: {score}</span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-6 leading-relaxed">
                {q.question}
            </h3>

            <div className="space-y-3">
                {q.options.map((option, idx) => {
                    // Logic to determine color: 
                    // If selected is correct -> Green
                    // If selected is wrong -> Red
                    // If we didn't select this one but it WAS the answer -> Green (optional hint)
                    let btnClass = "border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800";
                    
                    if (selectedOption) {
                        if (option === q.answer) btnClass = "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
                        else if (option === selectedOption) btnClass = "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
                        else btnClass = "opacity-50 cursor-not-allowed";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => !selectedOption && handleAnswer(option)}
                            disabled={!!selectedOption}
                            className={`w-full text-left p-4 rounded-lg border text-sm font-medium transition-all flex justify-between items-center ${btnClass}`}
                        >
                            <span>{option}</span>
                            {selectedOption && option === q.answer && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {selectedOption && option === selectedOption && option !== q.answer && <XCircle className="w-4 h-4 text-red-600" />}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
  );
}