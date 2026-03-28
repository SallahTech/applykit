"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/app-navbar";
import { ApplicationForm } from "@/components/tailor/application-form";
import { ProcessingView } from "@/components/tailor/processing-view";
import { CVResultView } from "@/components/tailor/cv-result-view";

export default function TailorPage() {
  const [step, setStep] = useState<"form" | "processing" | "result">("form");

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background">
        {/* Form stays mounted but hidden to preserve state on back navigation */}
        <div className={step !== "form" ? "hidden" : ""}>
          <ApplicationForm onSubmit={() => setStep("processing")} />
        </div>
        {step === "processing" && (
          <ProcessingView onComplete={() => setStep("result")} />
        )}
        {step === "result" && (
          <CVResultView onBack={() => setStep("form")} />
        )}
      </main>
    </>
  );
}
