"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Sparkles, KanbanSquare } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: ClipboardPaste,
    title: "Paste",
    description:
      "Drop a job URL or paste the description. We extract requirements, skills, and keywords automatically.",
  },
  {
    number: "2",
    icon: Sparkles,
    title: "Tailor",
    description:
      "Our AI rewrites your CV to match the role — highlighting relevant experience and adding missing keywords.",
  },
  {
    number: "3",
    icon: KanbanSquare,
    title: "Track",
    description:
      "Your application lands on your Kanban board. Set reminders, track progress, never lose an opportunity.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-[#1e293b] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2
          id="how-it-works-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          How It Works
        </h2>
        <p className="text-[#94a3b8] text-center mb-16 max-w-2xl mx-auto">
          Three steps from job listing to tailored application
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Desktop connector line */}
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] border-t-2 border-dashed border-slate-600" />

          {steps.map((step, index) => (
            <div key={step.number}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Gradient circle with step number */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">{step.number}</span>
                </div>

                {/* Lucide icon */}
                <step.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />

                {/* Title */}
                <h3 className="text-xl font-semibold text-white text-center mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#94a3b8] text-center leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Mobile connector line (not after last step) */}
              {index < steps.length - 1 && (
                <div className="md:hidden w-px h-8 border-l-2 border-dashed border-slate-600 mx-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
