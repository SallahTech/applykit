"use client";

import { motion } from "framer-motion";
import { Sparkles, KanbanSquare, Target, Bell, FileDown, BarChart3, LucideIcon } from "lucide-react";
import { FEATURES } from "@/lib/mock-data";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  KanbanSquare,
  Target,
  Bell,
  FileDown,
  BarChart3,
};

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          Everything You Need to Land the Job
        </h2>
        <p className="text-[#94a3b8] text-center mb-12 max-w-2xl mx-auto">
          From AI-powered CV tailoring to full pipeline tracking
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass-card p-6 hover:scale-[1.02] hover:border-blue-500/30 transition-all duration-200 cursor-default"
              >
                {Icon && <Icon className="w-8 h-8 text-blue-400 mb-4" />}
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
