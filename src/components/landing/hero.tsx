"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SOCIAL_PROOF } from "@/lib/mock-data";
import { HeroDemo } from "./hero-demo";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/[0.08] rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-indigo-500/[0.06] rounded-full blur-[80px]" />

      <div className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-white">
                Your Resume Gets{" "}
                <span className="gradient-text">Filtered Out</span>.
                <br />
                Fix That in 10 Seconds.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-lg text-[#94a3b8] max-w-xl mt-6 leading-relaxed">
                Paste any job description. Our AI rewrites your CV to match —
                instantly. Track every application in one place.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex gap-4 mt-8">
                <Link href="/tailor">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-base rounded-lg font-semibold">
                    Start Free &rarr;
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="border border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-base rounded-lg"
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Watch How It Works
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mt-8 text-sm text-[#7c8db5]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{SOCIAL_PROOF.cvsTailored} CVs tailored</span>
                <span>·</span>
                <span>No credit card</span>
                <span>·</span>
                <span>One-time payment</span>
              </div>
            </motion.div>
          </div>

          {/* Right column - interactive demo */}
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
