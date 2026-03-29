"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, FileDown, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { CVPanel } from "@/components/tailor/cv-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { TailorResult, JobMeta } from "@/lib/supabase/db-types";

interface CVResultViewProps {
  result: TailorResult;
  jobDescription: string;
  jobMeta?: JobMeta | null;
  onBack: () => void;
}

export function CVResultView({ result: initialResult, jobDescription, jobMeta, onBack }: CVResultViewProps) {
  const router = useRouter();
  const [result, setResult] = useState<TailorResult>(initialResult);
  const [regenerating, setRegenerating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jobDescription }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Regeneration failed");
      }
      const newResult = await res.json();
      setResult(newResult);
      setAnimationKey((prev) => prev + 1);
      toast.success("CV re-tailored successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  async function handleApplyAndTrack() {
    setApplyLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: jobMeta?.company || result.tailored.contact?.name || "Unknown Company",
          job_title: jobMeta?.position || "Position",
          status: "applied",
          match_score: result.match_score_after,
          salary_range: jobMeta?.salary_range || null,
          location: jobMeta?.location || null,
          job_url: jobMeta?.job_url || null,
          job_description: jobDescription,
          applied_date: new Date().toISOString().split("T")[0],
        }),
      });
      if (res.status === 403) {
        toast.error("Application limit reached. Upgrade to Pro.");
        return;
      }
      if (!res.ok) throw new Error();
      toast.success("Application tracked!");
      router.push("/board");
    } catch {
      toast.error("Failed to save application.");
    } finally {
      setApplyLoading(false);
    }
  }

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CVPdfTemplate } = await import("./cv-pdf-template");
      const blob = await pdf(<CVPdfTemplate cv={result.tailored} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored-cv.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("PDF generation failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const matchLabelBefore = result.match_score_before >= 70 ? "Good match" : result.match_score_before >= 50 ? "Fair match" : "Poor match";
  const matchLabelAfter = result.match_score_after >= 80 ? "Strong match" : result.match_score_after >= 60 ? "Good match" : "Fair match";

  return (
    <>
      {/* Top Bar -- pt-16 clears the fixed navbar */}
      <div className="bg-card border-b border-border px-4 py-3 pt-[4.5rem]">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-muted-foreground/50 mx-2">/</span>
            <span className="text-sm text-foreground font-semibold">CV Tailor</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              {regenerating ? (
                <Loader2 className="w-4 h-4 animate-spin md:mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 md:mr-2" />
              )}
              <span className="hidden md:inline">
                {regenerating ? "Regenerating..." : "Regenerate"}
              </span>
            </Button>
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin md:mr-2" />
              ) : (
                <FileDown className="w-4 h-4 md:mr-2" />
              )}
              <span className="hidden md:inline">
                {pdfLoading ? "Generating..." : "Download PDF"}
              </span>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              onClick={handleApplyAndTrack}
              disabled={applyLoading}
            >
              {applyLoading ? <Loader2 className="w-4 h-4 animate-spin md:mr-2" /> : <CheckCircle className="w-4 h-4 md:mr-2" />}
              <span className="hidden md:inline">Save to Board</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area -- subtract navbar (4rem) + top bar (~4.5rem) */}
      <div className="h-[calc(100vh-8.5rem)] relative">
        {/* Regenerate Overlay */}
        {regenerating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Loader2 className="animate-spin w-8 h-8 text-blue-400 mb-3" />
            <p className="text-muted-foreground">Re-tailoring your CV...</p>
          </div>
        )}

        {/* Desktop (md+) */}
        <div className="hidden md:grid grid-cols-2 h-full">
          <motion.div
            key={`original-${animationKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-r border-border"
          >
            <CVPanel
              variant="original"
              cvData={result.original}
              matchScore={result.match_score_before}
              matchLabel={matchLabelBefore}
            />
          </motion.div>
          <motion.div
            key={`tailored-${animationKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CVPanel
              variant="tailored"
              cvData={result.tailored}
              matchScore={result.match_score_after}
              matchLabel={matchLabelAfter}
              changes={result.changes}
              keywords={{ found: result.keywords_found, missing: result.keywords_missing }}
              enhancedBullets={result.enhanced_bullets}
              skillStatuses={result.skill_statuses}
            />
          </motion.div>
        </div>

        {/* Mobile (< md) */}
        <div className="md:hidden h-full">
          <Tabs defaultValue="original" className="h-full">
            <TabsList>
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="tailored">Tailored</TabsTrigger>
            </TabsList>
            <TabsContent value="original">
              <CVPanel
                variant="original"
                cvData={result.original}
                matchScore={result.match_score_before}
                matchLabel={matchLabelBefore}
              />
            </TabsContent>
            <TabsContent value="tailored">
              <CVPanel
                variant="tailored"
                cvData={result.tailored}
                matchScore={result.match_score_after}
                matchLabel={matchLabelAfter}
                changes={result.changes}
                keywords={{ found: result.keywords_found, missing: result.keywords_missing }}
                enhancedBullets={result.enhanced_bullets}
                skillStatuses={result.skill_statuses}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
