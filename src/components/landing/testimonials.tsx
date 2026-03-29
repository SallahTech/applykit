"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          id="testimonials-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          What Job Seekers Are Saying
        </h2>
        <p className="text-[#94a3b8] text-center mb-12">
          Real results from real job seekers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="glass-card p-5 sm:p-6 relative">
                <span
                  aria-hidden="true"
                  className="text-4xl font-serif gradient-text absolute top-4 right-4 opacity-50"
                >
                  "
                </span>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 relative z-10">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      {testimonial.name}
                    </span>
                    <span className="text-xs text-[#7c8db5]">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
