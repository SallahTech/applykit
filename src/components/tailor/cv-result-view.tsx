"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, FileDown, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { CVPanel } from "@/components/tailor/cv-panel";
import { ORIGINAL_CV, TAILORED_CV, CV_CHANGES, KEYWORDS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CVResultViewProps {
  onBack: () => void;
}

export function CVResultView({ onBack }: CVResultViewProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      setAnimationKey((prev) => prev + 1);
    }, 1500);
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CVPdfTemplate } = await import("./cv-pdf-template");
      const blob = await pdf(<CVPdfTemplate cv={TAILORED_CV} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "alex-chen-stripe-tailored.pdf";
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

  return (
    <>
      {/* Top Bar — pt-16 clears the fixed navbar */}
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
            <span className="text-sm text-muted-foreground">
              Stripe — Software Engineer
            </span>
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
            >
              <RefreshCw className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Regenerate</span>
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
              onClick={() =>
                toast("Coming soon! The Kanban board is on its way.")
              }
            >
              <CheckCircle className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Apply & Track</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area — subtract navbar (4rem) + top bar (~4.5rem) */}
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
              cvData={ORIGINAL_CV}
              matchScore={42}
              matchLabel="Poor match"
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
              cvData={TAILORED_CV}
              matchScore={89}
              matchLabel="Strong match"
              changes={CV_CHANGES}
              keywords={KEYWORDS}
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
                cvData={ORIGINAL_CV}
                matchScore={42}
                matchLabel="Poor match"
              />
            </TabsContent>
            <TabsContent value="tailored">
              <CVPanel
                variant="tailored"
                cvData={TAILORED_CV}
                matchScore={89}
                matchLabel="Strong match"
                changes={CV_CHANGES}
                keywords={KEYWORDS}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
