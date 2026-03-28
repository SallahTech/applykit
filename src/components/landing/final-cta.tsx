"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SOCIAL_PROOF } from "@/lib/mock-data";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="py-20 px-4 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[300px] bg-purple-500/8 rounded-full blur-[100px]" />

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          id="final-cta-heading"
          className="text-3xl md:text-5xl font-extrabold text-white mb-6"
        >
          Your Next Interview Starts Here.
        </h2>

        <div className="flex items-center justify-center gap-4 text-sm text-[#7c8db5] mb-8 flex-wrap">
          <span>{SOCIAL_PROOF.cvsTailored} CVs tailored</span>
          <span>·</span>
          <span>{SOCIAL_PROOF.avgMatchScore} avg match score</span>
          <span>·</span>
          <span>{SOCIAL_PROOF.subscriptions} subscriptions</span>
        </div>

        <Link href="/tailor">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-6 text-lg rounded-lg font-semibold">
            Get Started Free →
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
