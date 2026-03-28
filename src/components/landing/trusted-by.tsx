"use client";

import { motion } from "framer-motion";
import { TRUSTED_COMPANIES } from "@/lib/mock-data";

export function TrustedBy() {
  return (
    <section aria-label="Trusted by job seekers" className="py-12 border-t border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-sm text-[#7c8db5] mb-8">
            Trusted by job seekers who landed roles at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {TRUSTED_COMPANIES.map((company) => (
              <span
                key={company}
                className="text-xl font-bold text-slate-500/30 tracking-wider"
                aria-label={`${company} logo`}
              >
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
