"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardPaste,
  Sparkles,
  CheckCircle,
  FileDown,
  TrendingUp,
  Briefcase,
} from "lucide-react";

interface DemoStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  duration: number; // ms before auto-advancing
}

const STEP_DURATIONS = [4000, 3500, 4500, 4000];
const TOTAL_STEPS = STEP_DURATIONS.length;

export function AnimatedDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const steps: DemoStep[] = [
    {
      id: 0,
      label: "Paste Job URL",
      icon: <ClipboardPaste className="w-4 h-4" />,
      duration: STEP_DURATIONS[0],
      content: <PasteStep />,
    },
    {
      id: 1,
      label: "AI Extracts Details",
      icon: <Sparkles className="w-4 h-4" />,
      duration: STEP_DURATIONS[1],
      content: <ExtractStep />,
    },
    {
      id: 2,
      label: "CV Gets Tailored",
      icon: <TrendingUp className="w-4 h-4" />,
      duration: STEP_DURATIONS[2],
      content: <TailorStep />,
    },
    {
      id: 3,
      label: "Download & Track",
      icon: <Briefcase className="w-4 h-4" />,
      duration: STEP_DURATIONS[3],
      content: <TrackStep />,
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % TOTAL_STEPS);
    }, STEP_DURATIONS[activeStep]);
    return () => clearTimeout(timer);
  }, [activeStep, isPaused]);

  return (
    <div
      className="max-w-3xl mx-auto mt-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Browser chrome */}
      <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-slate-700/60 rounded-md px-4 py-1 text-xs text-slate-400 font-mono">
              applykit.app/tailor
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 px-4 pt-4 pb-2">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === activeStep
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-1 pb-0">
          <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              key={activeStep}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: steps[activeStep].duration / 1000,
                ease: "linear",
              }}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 min-h-[320px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              {steps[activeStep].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center mt-3">
        Hover to pause &middot; Click a step to jump
      </p>
    </div>
  );
}

/* ---------- Step content components ---------- */

function PasteStep() {
  const [typed, setTyped] = useState("");
  const fullUrl = "https://greenhouse.io/jobs/senior-frontend-eng";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullUrl.length) {
        setTyped(fullUrl.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-medium text-slate-400 mb-1.5">
          Job posting URL
        </p>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 font-mono">
            {typed}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-blue-400"
            >
              |
            </motion.span>
          </div>
          <motion.div
            initial={{ scale: 1 }}
            animate={typed.length === fullUrl.length ? { scale: [1, 0.95, 1] } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all ${
              typed.length === fullUrl.length
                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                : "bg-slate-700 text-slate-400"
            }`}>
              Extract
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-500/8 border border-blue-500/15 rounded-lg p-3 flex gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-300/70 leading-relaxed">
          Works with LinkedIn, Indeed, Greenhouse, Lever, and any job board.
        </p>
      </div>
    </div>
  );
}

function ExtractStep() {
  const fields = [
    { label: "Company", value: "Acme Corp" },
    { label: "Position", value: "Senior Frontend Engineer" },
    { label: "Location", value: "Remote (US)" },
    { label: "Salary", value: "$140k - $180k" },
  ];

  const skills = [
    { text: "React / Next.js", type: "required" },
    { text: "TypeScript", type: "required" },
    { text: "GraphQL", type: "required" },
    { text: "Design Systems", type: "nice" },
    { text: "AWS", type: "nice" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <p className="text-[10px] text-slate-500 mb-1">{f.label}</p>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200">
              {f.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <p className="text-[10px] text-slate-500 mb-2">Key Requirements</p>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s, i) => (
            <motion.span
              key={s.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                s.type === "required"
                  ? "bg-blue-500/15 text-blue-300"
                  : "bg-amber-500/15 text-amber-300"
              }`}
            >
              {s.text}
              {s.type === "nice" && (
                <span className="text-amber-500/50 ml-1">(nice to have)</span>
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TailorStep() {
  return (
    <div className="space-y-4">
      {/* Score improvement */}
      <div className="flex items-center justify-center gap-4">
        <ScoreCircle label="Before" score={42} color="text-amber-400" />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        </motion.div>
        <ScoreCircle label="After" score={87} color="text-emerald-400" delay={0.3} />
      </div>

      {/* Changes */}
      <div className="space-y-2">
        <p className="text-[10px] text-slate-500 mb-1">Changes Made</p>
        {[
          "Rewrote summary to target frontend engineering role",
          "Added React, Next.js, TypeScript keywords to experience bullets",
          "Reordered skills to front-load matching technologies",
          "Enhanced project bullet with performance metrics",
        ].map((change, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.2 }}
            className="flex items-start gap-2"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">{change}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScoreCircle({
  label,
  score,
  color,
  delay = 0,
}: {
  label: string;
  score: number;
  color: string;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= score) {
          setDisplayed(score);
          clearInterval(interval);
        } else {
          setDisplayed(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [score, delay]);

  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full border-2 border-slate-700 flex items-center justify-center relative">
        <motion.div
          className={`text-2xl font-bold ${color}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay }}
        >
          {displayed}%
        </motion.div>
      </div>
      <p className="text-[11px] text-slate-500 mt-1.5">{label}</p>
    </div>
  );
}

function TrackStep() {
  const columns = [
    { name: "Applied", color: "bg-blue-500", cards: ["Acme Corp"] },
    { name: "Interview", color: "bg-purple-500", cards: ["StartupXYZ"] },
    { name: "Offer", color: "bg-emerald-500", cards: [] },
  ];

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium"
        >
          <FileDown className="w-4 h-4" />
          Download PDF
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm font-medium border border-blue-500/20"
        >
          <Briefcase className="w-4 h-4" />
          Save to Board
        </motion.div>
      </div>

      {/* Mini Kanban */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-3 gap-3"
      >
        {columns.map((col) => (
          <div key={col.name} className="bg-slate-800/60 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <span className="text-[11px] font-medium text-slate-400">{col.name}</span>
            </div>
            {col.cards.map((card) => (
              <motion.div
                key={card}
                initial={card === "Acme Corp" ? { opacity: 0, scale: 0.9 } : {}}
                animate={card === "Acme Corp" ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.2 }}
                className="bg-slate-700/60 rounded-md p-2 text-xs text-slate-300 border border-slate-600/50"
              >
                <p className="font-medium">{card}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sr. Frontend Eng</p>
              </motion.div>
            ))}
            {col.cards.length === 0 && (
              <div className="h-8 border border-dashed border-slate-700 rounded-md" />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
