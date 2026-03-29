"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UrlExtractor } from "@/components/tailor/url-extractor";
import { CVUpload } from "@/components/tailor/cv-upload";
import { SAMPLE_JOB_DESCRIPTION } from "@/lib/mock-data";
import type { BaseCVRecord, JobMeta } from "@/lib/supabase/db-types";

interface ApplicationFormProps {
  onSubmit: (jobDescription: string, jobMeta?: JobMeta) => void;
}

export function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("url");
  const [textValue, setTextValue] = useState(SAMPLE_JOB_DESCRIPTION);
  const [extractedJobDescription, setExtractedJobDescription] = useState<string | null>(null);
  const [extractedMeta, setExtractedMeta] = useState<JobMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cv, setCv] = useState<BaseCVRecord | null>(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCV() {
      try {
        const res = await fetch("/api/cv");
        if (res.ok) {
          const { cv } = await res.json();
          setCv(cv);
        }
      } catch {} finally {
        setCvLoading(false);
      }
    }
    fetchCV();
  }, []);

  function handleSubmit() {
    if (!cv) {
      setError("Upload a CV first");
      return;
    }
    if (activeTab === "url" && !extractedJobDescription) {
      setError("Extract the job details first");
      return;
    }
    if (activeTab === "text" && textValue.trim() === "") {
      setError("Paste a job description first");
      return;
    }
    setError(null);

    const jobDescription = activeTab === "text" ? textValue : extractedJobDescription!;
    onSubmit(jobDescription, extractedMeta || undefined);
  }

  return (
    <div className="max-w-[640px] mx-auto pt-28 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo + Tagline */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-foreground">Apply</span>
            <span className="text-blue-400">Kit</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground text-center mb-10">
          Tailor your CV. Track your application. Land the job.
        </p>

        {/* Main Card */}
        <div className="rounded-2xl border border-border bg-card backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/20">
          <h1 className="text-2xl font-bold text-foreground mb-1">New Application</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Paste a job URL or description and we&apos;ll tailor your CV in seconds.
          </p>

          {/* CV Status Bar */}
          <div className="mb-6">
            {cvLoading ? (
              <div className="bg-muted/40 border border-border rounded-xl p-3.5 animate-pulse">
                <div className="h-5 bg-muted rounded w-2/3" />
              </div>
            ) : (
              <CVUpload currentCV={cv} onCVReady={(newCv) => setCv(newCv)} />
            )}
          </div>

          {/* Tabbed Input */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-muted/60 rounded-xl p-1 h-auto mb-4">
              <TabsTrigger
                value="url"
                className="flex-1 rounded-lg py-2.5 px-4 text-sm font-medium text-muted-foreground transition-all data-active:bg-accent data-active:text-foreground data-active:shadow-sm"
              >
                Paste URL
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="flex-1 rounded-lg py-2.5 px-4 text-sm font-medium text-muted-foreground transition-all data-active:bg-accent data-active:text-foreground data-active:shadow-sm"
              >
                Paste Job Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url">
              <UrlExtractor onExtracted={(jd, meta) => { setExtractedJobDescription(jd); if (meta) setExtractedMeta(meta); }} />
            </TabsContent>

            <TabsContent value="text">
              <label htmlFor="job-description" className="sr-only">
                Job description
              </label>
              <Textarea
                id="job-description"
                rows={8}
                className="bg-muted/40 border-border text-foreground text-sm min-h-[200px] resize-none rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20 placeholder:text-muted-foreground"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Paste the full job description here..."
              />
            </TabsContent>
          </Tabs>

          {/* CTA Button */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-12 text-[15px] font-semibold mt-5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!cv}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Tailor My CV for This Job
          </Button>
          {!cv && !cvLoading && (
            <p className="text-xs text-amber-400 mt-2 text-center">
              ↑ Upload your CV above to enable tailoring
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400 mt-2.5 text-center">{error}</p>
          )}

          {/* Secondary Button */}
          <Button
            variant="outline"
            className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 mt-2.5 h-11 rounded-xl"
            disabled={saving}
            onClick={async () => {
              const hasUrl = activeTab === "url" && extractedMeta;
              const hasText = activeTab === "text" && textValue.trim();
              if (!hasUrl && !hasText) {
                setError("Paste a job URL or description first");
                return;
              }
              setError(null);
              setSaving(true);
              try {
                const res = await fetch("/api/applications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    company_name: extractedMeta?.company || "Unknown Company",
                    job_title: extractedMeta?.position || "Position",
                    status: "saved",
                    job_description: activeTab === "text" ? textValue : extractedJobDescription,
                    salary_range: extractedMeta?.salary_range || null,
                    location: extractedMeta?.location || null,
                  }),
                });
                if (res.status === 403) {
                  toast.error("Application limit reached. Upgrade to Pro.");
                  return;
                }
                if (!res.ok) throw new Error();
                toast.success("Job saved to your board!");
                router.push("/board");
              } catch {
                toast.error("Failed to save. Please try again.");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bookmark className="w-4 h-4 mr-2" />}
            Save for Later
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
