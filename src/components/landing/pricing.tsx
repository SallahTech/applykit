"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRICING_TIERS } from "@/lib/mock-data";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2
          id="pricing-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          Simple, One-Time Pricing
        </h2>
        <p className="text-[#94a3b8] text-center mb-4">
          No subscriptions. No recurring fees. Pay once, use forever.
        </p>
        <div className="flex justify-center">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0 mb-12 mx-auto block w-fit px-4 py-1.5">
            Pay once, use forever
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-stretch justify-center">
          {PRICING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="w-full max-w-sm"
            >
              {tier.highlighted ? (
                <div className="relative lg:scale-105 w-full h-full">
                  {/* Gradient border wrapper */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl" />
                  <div className="relative bg-[#1e293b] rounded-xl m-[1px] p-6 h-full flex flex-col">
                    {tier.badge && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-0 mb-4 w-fit">
                        {tier.badge}
                      </Badge>
                    )}
                    <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                      <span className="text-sm text-[#7c8db5] ml-2">{tier.priceLabel}</span>
                    </div>
                    <p className="text-sm text-[#94a3b8] mt-2 mb-6">{tier.description}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature.text} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Minus className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-sm text-slate-300"
                                : "text-sm text-slate-500"
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/tailor">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        {tier.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-6 w-full h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-sm text-[#7c8db5] ml-2">{tier.priceLabel}</span>
                  </div>
                  <p className="text-sm text-[#94a3b8] mt-2 mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature.text} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-sm text-slate-300"
                              : "text-sm text-slate-500"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/tailor">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
