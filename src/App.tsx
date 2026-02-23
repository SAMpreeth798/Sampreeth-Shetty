/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Mail, 
  Coffee, 
  Briefcase, 
  Smile,
  X,
  Plus,
  AlertCircle,
  ShieldCheck,
  Zap,
  Sun,
  Target,
  Users,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tone = 'professional' | 'fun' | 'casual' | 'authoritative';

interface ToneConfig {
  id: Tone;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
  description: string;
}

const TONES: ToneConfig[] = [
  { 
    id: 'authoritative', 
    label: 'Authoritative', 
    icon: <Target className="w-4 h-4" />, 
    activeClass: 'bg-amber-600 text-white shadow-lg shadow-amber-200',
    description: 'Decisive, strategic, and high-impact for PM leadership.'
  },
  { 
    id: 'professional', 
    label: 'Professional', 
    icon: <Briefcase className="w-4 h-4" />, 
    activeClass: 'bg-indigo-600 text-white shadow-lg shadow-indigo-200',
    description: 'Polished, clear, and stakeholder-ready.'
  },
  { 
    id: 'casual', 
    label: 'Casual', 
    icon: <Coffee className="w-4 h-4" />, 
    activeClass: 'bg-emerald-500 text-white shadow-lg shadow-emerald-100',
    description: 'Warm, approachable, and team-friendly.'
  },
  { 
    id: 'fun', 
    label: 'Fun', 
    icon: <Smile className="w-4 h-4" />, 
    activeClass: 'bg-orange-500 text-white shadow-lg shadow-orange-100',
    description: 'Quirky, energetic, and full of personality.'
  },
];

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Words to avoid
  const [avoidWords, setAvoidWords] = useState<string[]>(['please']);
  const [newAvoidWord, setNewAvoidWord] = useState('');

  const addAvoidWord = () => {
    if (newAvoidWord.trim() && !avoidWords.includes(newAvoidWord.trim().toLowerCase())) {
      setAvoidWords([...avoidWords, newAvoidWord.trim().toLowerCase()]);
      setNewAvoidWord('');
    }
  };

  const removeAvoidWord = (word: string) => {
    setAvoidWords(avoidWords.filter(w => w !== word));
  };

  const handleRefine = useCallback(async (action: 'rephrase' | 'refine' | 'improve') => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const tonePrompt = {
        authoritative: "Make it authoritative, decisive, and strategic. Focus on outcomes, clarity, and leadership. Perfect for high-stakes PM communication.",
        professional: "Make it professional, clear, and business-appropriate. Focus on stakeholder alignment and clarity.",
        casual: "Make it casual and friendly, like a message to a direct team or close collaborator. Use a warm, collaborative tone.",
        fun: "Make it fun and full of personality! Use expressive language while remaining effective."
      }[selectedTone];

      const actionPrompt = {
        rephrase: "Rephrase the following draft to improve flow and wording while keeping the core message identical.",
        refine: "Refine the following draft to improve clarity, tone, and professional impact.",
        improve: "Substantially improve the following draft by adding structure, better vocabulary, and strategic depth."
      }[action];

      const avoidPrompt = avoidWords.length > 0 
        ? `CRITICAL: Do NOT use any of the following words or phrases in your response: ${avoidWords.join(', ')}.`
        : '';

      const prompt = `
        You are SolDraft, a senior Product Management communications coach.
        Your task is to ${action} the following email draft for a Product Manager.
        
        Context: The user is a Product Manager communicating with stakeholders, engineering teams, or leadership.
        Tone Requirement: ${tonePrompt}
        Action Requirement: ${actionPrompt}
        ${avoidPrompt}
        
        CRITICAL: Keep the response CONCISE and to the point. Product Managers value brevity. Do not exceed the length of the original draft unless absolutely necessary for clarity.
        
        Original Draft:
        """
        ${input}
        """
        
        Please provide only the ${action}d email text. Focus on PM-specific needs: clarity of requirements, alignment on goals, and decisive action. Do not include subject lines unless specifically asked. Do not include meta-commentary.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setOutput(response.text || 'No response generated.');
    } catch (err) {
      console.error('Refinement error:', err);
      setError('The sun went behind a cloud for a moment. Please try again!');
    } finally {
      setIsLoading(false);
    }
  }, [input, selectedTone, avoidWords]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-amber-200 relative overflow-x-hidden">
      {/* Sunny Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-amber-50 to-orange-50 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-50/40 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-yellow-50/50 rounded-full blur-[100px]" />
      </div>

      {/* Interactive Fun Sun Animation */}
      <div className="fixed top-8 right-8 z-50 pointer-events-auto">
        <motion.div
          drag
          dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-grab active:cursor-grabbing"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.4)] flex items-center justify-center border-4 border-white relative group"
          >
            <Sun className="w-12 h-12 text-white fill-white/20" />
            
            {/* Happy Face */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="flex flex-col items-center gap-1 mt-1">
                 <div className="flex gap-3">
                   <div className="w-1.5 h-1.5 bg-white rounded-full" />
                   <div className="w-1.5 h-1.5 bg-white rounded-full" />
                 </div>
                 <div className="w-4 h-2 border-b-2 border-white rounded-full" />
               </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-amber-100 text-[10px] font-bold text-amber-600 whitespace-nowrap pointer-events-none"
            >
              I'm SolDraft! Happy Drafting! ☀️
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-20">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white border-2 border-amber-100 rounded-[2rem] flex items-center justify-center shadow-xl shadow-amber-200/20">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                  SolDraft
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest">PM Edition</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium mt-1">Strategic communication for Product Management.</p>
              </div>
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-8">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              <Users className="w-4 h-4 text-amber-500" />
              Stakeholder_Ready
            </div>
            <div className="h-8 w-px bg-amber-100" />
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Privacy_Secured
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Main Workspace */}
          <div className="space-y-10">
            {/* Input Section */}
            <section className="bg-white border border-amber-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-amber-200/20">
              <div className="px-10 py-6 border-b border-amber-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-50/20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-600/60">Drafting_Core</span>
                </div>
                <div className="flex flex-wrap gap-2 bg-white/80 p-1.5 rounded-2xl border border-amber-100 shadow-sm">
                  {TONES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                        selectedTone === tone.id 
                          ? tone.activeClass 
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {tone.icon}
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-10">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your PRD update, stakeholder mail, or team announcement here..."
                  className="w-full h-80 p-8 bg-amber-50/10 border border-amber-50 rounded-[2rem] focus:ring-[12px] focus:ring-amber-500/5 focus:border-amber-400/50 outline-none resize-none text-slate-800 placeholder:text-slate-300 transition-all leading-relaxed text-2xl font-semibold"
                />
                
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Impact_Analysis_Active</span>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {(['rephrase', 'refine', 'improve'] as const).map((action) => (
                      <button
                        key={action}
                        onClick={() => handleRefine(action)}
                        disabled={isLoading || !input.trim()}
                        className={cn(
                          "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 group",
                          action === 'rephrase' ? "bg-slate-100 text-slate-900 hover:bg-slate-200" :
                          action === 'refine' ? "bg-slate-900 text-white hover:bg-slate-800" :
                          "bg-amber-500 text-white hover:bg-amber-600 shadow-xl shadow-amber-100"
                        )}
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        )}
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Output Section */}
            <AnimatePresence mode="wait">
              {(output || isLoading) && (
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="bg-white border-4 border-amber-100 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(251,191,36,0.15)]"
                >
                  <div className="px-10 py-6 border-b border-amber-100 flex items-center justify-between bg-amber-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Optimized_Communication</span>
                    </div>
                    {output && !isLoading && (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 text-xs font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-6 py-3 rounded-2xl transition-all border border-amber-200 shadow-sm"
                      >
                        {copied ? (
                          <><Check className="w-5 h-5 text-emerald-600" /> Copied!</>
                        ) : (
                          <><Copy className="w-5 h-5" /> Copy Result</>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="p-12 min-h-[300px] bg-gradient-to-b from-transparent to-amber-50/10">
                    {isLoading ? (
                      <div className="space-y-6">
                        <div className="h-6 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                        <div className="h-6 bg-slate-100 rounded-full w-full animate-pulse" />
                        <div className="h-6 bg-slate-100 rounded-full w-5/6 animate-pulse" />
                        <div className="h-6 bg-slate-100 rounded-full w-2/3 animate-pulse" />
                      </div>
                    ) : error ? (
                      <div className="flex items-center gap-4 text-orange-600 bg-orange-50 p-8 rounded-[2rem] border-2 border-orange-100">
                        <AlertCircle className="w-8 h-8" />
                        <span className="font-black text-lg">{error}</span>
                      </div>
                    ) : (
                      <div className="prose prose-slate max-w-none text-slate-800 text-2xl leading-relaxed font-bold">
                        <Markdown>{output}</Markdown>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="space-y-10">
            <div className="bg-white border border-amber-100 rounded-[2.5rem] p-10 shadow-2xl shadow-amber-200/10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3">
                <X className="w-6 h-6 text-amber-500" />
                PM_Guardrails
              </h3>
              
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Avoid Keywords</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAvoidWord}
                      onChange={(e) => setNewAvoidWord(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addAvoidWord()}
                      placeholder="e.g. 'just', 'sorry'..."
                      className="flex-1 bg-amber-50/50 border border-amber-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-8 focus:ring-amber-500/5 focus:border-amber-400/50 outline-none transition-all text-slate-700"
                    />
                    <button 
                      onClick={addAvoidWord}
                      className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <AnimatePresence>
                    {avoidWords.map((word) => (
                      <motion.span
                        key={word}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 border border-amber-200 rounded-2xl text-xs font-black text-amber-700 group hover:bg-amber-200 transition-all"
                      >
                        {word}
                        <button 
                          onClick={() => removeAvoidWord(word)}
                          className="text-amber-300 hover:text-amber-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {avoidWords.length === 0 && (
                    <div className="w-full py-16 border-4 border-dashed border-amber-50 rounded-[2rem] flex flex-col items-center justify-center text-amber-200">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Restrictions</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-orange-200/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-80 flex items-center gap-3">
                <Target className="w-5 h-5 fill-current" />
                PM_Insight
              </h4>
              <p className="text-lg font-bold leading-relaxed">
                Stakeholders value <span className="bg-white/20 px-2 py-0.5 rounded">Decisiveness</span>. Use the <span className="text-white underline decoration-white/50 underline-offset-4">Authoritative</span> tone for roadmap updates.
              </p>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t-2 border-amber-100 flex flex-col md:flex-row items-center justify-between gap-10 text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          <div className="flex items-center gap-12">
            <span>© 2026 SolDraft PM Edition</span>
            <span className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Privacy_First
            </span>
          </div>
          <div className="flex items-center gap-8">
            <span className="px-4 py-1.5 bg-white rounded-full border-2 border-amber-50 text-amber-600 shadow-sm">Build_5.0.0</span>
            <span className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              Status_Optimal
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}





