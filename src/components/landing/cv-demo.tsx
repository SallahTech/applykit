"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ORIGINAL_CV, TAILORED_CV, KEYWORDS } from "@/lib/mock-data";
import { CVData } from "@/types";

function renderCVCard(cv: CVData, variant: "original" | "tailored") {
  return (
    <Card className="bg-[#0f1629] border-[#1e293b] p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">
          {variant === "original" ? "Original CV" : "Tailored for Stripe"}
        </span>
        <div className="flex items-center gap-2">
          {variant === "original" ? (
            <Badge className="bg-red-500/20 text-red-400 border-0">
              42% — Poor match
            </Badge>
          ) : (
            <>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                89% — Strong match
              </Badge>
              <span className="text-xs text-emerald-400 font-semibold">
                ↑47%
              </span>
            </>
          )}
        </div>
      </div>

      {/* AI Changes Made box */}
      {variant === "tailored" && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-amber-400 mb-2">
            ✨ AI Changes Made
          </p>
          <ul className="space-y-1 text-xs text-amber-300/80">
            <li>
              • Summary rewritten to emphasize payments and fintech experience
            </li>
            <li>
              • Payment processing bullet enhanced with metrics and
              Stripe-relevant keywords
            </li>
            <li>
              • Added &quot;payment systems&quot; and &quot;financial APIs&quot;
              to skills
            </li>
            <li>
              • Reordered experience bullets to lead with most relevant
              achievements
            </li>
          </ul>
        </div>
      )}

      {/* CV Content */}
      <h3 className="text-lg font-bold text-white">{cv.name}</h3>
      <p className="text-xs text-[#7c8db5] mb-3">{cv.contact}</p>

      {/* Summary */}
      <div
        className={`p-3 rounded-lg text-sm leading-relaxed ${
          variant === "original"
            ? "bg-slate-800/50 text-slate-400"
            : "bg-emerald-500/10 border border-emerald-500/20 text-slate-300"
        }`}
      >
        {cv.summary}
      </div>

      {/* Experience */}
      <p className="text-xs font-semibold text-[#7c8db5] uppercase tracking-wider mt-4 mb-2">
        EXPERIENCE
      </p>
      {cv.experience.map((exp) => (
        <div key={`${exp.company}-${exp.dateRange}`} className="mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">
              {exp.company}
            </span>
            <span className="text-xs text-[#7c8db5]">{exp.dateRange}</span>
          </div>
          <p className="text-xs text-[#94a3b8]">{exp.title}</p>
          <div className="mt-1 space-y-1">
            {exp.bullets.map((bullet, i) =>
              bullet.enhanced ? (
                <div
                  key={i}
                  className="bg-emerald-500/10 rounded px-2 py-1 text-sm text-slate-300"
                >
                  • {bullet.text}
                  <span className="text-xs text-emerald-400 font-semibold ml-2">
                    Enhanced
                  </span>
                </div>
              ) : (
                <div key={i} className="text-sm text-slate-400 py-1">
                  • {bullet.text}
                </div>
              )
            )}
          </div>
        </div>
      ))}

      {/* Skills */}
      <p className="text-xs font-semibold text-[#7c8db5] uppercase tracking-wider mt-4 mb-2">
        SKILLS
      </p>
      <div className="flex flex-wrap gap-2">
        {cv.skills.map((skill) => {
          let className = "";
          if (skill.status === "matched") {
            className = "bg-emerald-500/20 text-emerald-400 border-0";
          } else if (skill.status === "added") {
            className =
              "bg-blue-500/20 text-blue-400 border border-dashed border-blue-500/40";
          } else {
            className = "bg-slate-800 text-slate-400";
          }
          return (
            <Badge key={skill.name} className={className}>
              {skill.name}
            </Badge>
          );
        })}
      </div>
    </Card>
  );
}

export function CVDemo() {
  return (
    <section aria-labelledby="cv-demo-heading" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="cv-demo-heading"
            className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          >
            See the Difference
          </h2>
          <p className="text-[#94a3b8] text-center mb-12 max-w-2xl mx-auto">
            Watch how AI transforms a generic resume into a targeted application
          </p>

          {/* Desktop/Tablet Layout */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {renderCVCard(ORIGINAL_CV, "original")}
            {renderCVCard(TAILORED_CV, "tailored")}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <Tabs defaultValue="original">
              <TabsList>
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="tailored">Tailored</TabsTrigger>
              </TabsList>
              <TabsContent value="original">
                {renderCVCard(ORIGINAL_CV, "original")}
              </TabsContent>
              <TabsContent value="tailored">
                {renderCVCard(TAILORED_CV, "tailored")}
              </TabsContent>
            </Tabs>
          </div>

          {/* Keyword Coverage */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-[#7c8db5] uppercase tracking-wider">
              KEYWORD COVERAGE
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {KEYWORDS.map((kw) =>
                kw.found ? (
                  <span
                    key={kw.text}
                    className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400"
                  >
                    Found: {kw.text}
                  </span>
                ) : (
                  <span
                    key={kw.text}
                    className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 line-through"
                  >
                    Missing: {kw.text}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
