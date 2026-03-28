"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SAMPLE_JOB_DESCRIPTION, DEMO_RESULTS } from "@/lib/mock-data";
import { MatchScoreRing } from "./match-score-ring";

export function HeroDemo() {
  const [state, setState] = useState<"idle" | "processing" | "result">("idle");
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state === "processing") {
      const timer = setTimeout(() => {
        setState("result");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleSubmit = () => {
    if (!jobDescription.trim()) {
      setError("Paste a job description first");
      return;
    }
    setError("");
    setState("processing");
  };

  const handleReset = () => {
    setState("idle");
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setError("");
  };

  return (
    <div className="glass-card p-6">
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Try it now
            </p>
            <Textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                if (error) setError("");
              }}
              rows={6}
              className="bg-slate-800/50 border-slate-700 text-slate-300 text-sm resize-none"
              placeholder="Paste a job description..."
            />
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white mt-4"
            >
              Tailor My CV &rarr;
            </Button>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </motion.div>
        )}

        {state === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[300px]"
          >
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-400 mt-4">Analyzing job description...</p>
          </motion.div>
        )}

        {state === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div aria-live="polite">
              <span className="sr-only">
                CV match score improved from 42% to 89%
              </span>

              {/* Score section */}
              <div className="flex items-center gap-4">
                <MatchScoreRing score={89} color="#10b981" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-semibold">42%</span>
                    <span className="text-slate-500">&rarr;</span>
                    <span className="text-emerald-400 font-semibold">89%</span>
                  </div>
                  <p className="text-xs text-slate-500">Match Score</p>
                </div>
              </div>

              <div className="border-t border-slate-700/50 my-4" />

              {/* Enhanced bullets */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Key improvements
                </p>
                <div className="space-y-2">
                  {DEMO_RESULTS.bullets.slice(0, 3).map((bullet, i) => (
                    <div
                      key={i}
                      className="border-l-2 border-emerald-500 pl-3 py-1.5 text-sm text-slate-300"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700/50 my-4" />

              {/* Changes made */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  What we changed
                </p>
                <div className="space-y-2">
                  {DEMO_RESULTS.changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="text-emerald-500 w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-400">{change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset link */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Try with your own &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
