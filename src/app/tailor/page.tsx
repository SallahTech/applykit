"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/app-navbar";
import { ApplicationForm } from "@/components/tailor/application-form";
import { ProcessingView } from "@/components/tailor/processing-view";
import { CVResultView } from "@/components/tailor/cv-result-view";
import type { TailorResult, JobMeta } from "@/lib/supabase/db-types";

export default function TailorPage() {
  const [step, setStep] = useState<"form" | "processing" | "result">("form");
  const [jobDescription, setJobDescription] = useState("");
  const [jobMeta, setJobMeta] = useState<JobMeta | null>(null);
  const [tailorResult, setTailorResult] = useState<TailorResult | null>(null);

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background">
        {/* Form stays mounted but hidden to preserve state on back navigation */}
        <div className={step !== "form" ? "hidden" : ""}>
          <ApplicationForm onSubmit={(jd: string, meta?: JobMeta) => { setJobDescription(jd); setJobMeta(meta || null); setStep("processing"); }} />
        </div>
        {step === "processing" && (
          <ProcessingView
            jobDescription={jobDescription}
            onComplete={(result: TailorResult) => { setTailorResult(result); setStep("result"); }}
            onError={() => setStep("form")}
          />
        )}
        {step === "result" && (
          <CVResultView
            result={tailorResult!}
            jobDescription={jobDescription}
            jobMeta={jobMeta}
            onBack={() => setStep("form")}
          />
        )}
      </main>
    </>
  );
}
