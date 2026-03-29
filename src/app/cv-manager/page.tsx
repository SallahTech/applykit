"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Loader2,
  Download,
  Eye,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { AppNavbar } from "@/components/app-navbar";
import { CVUpload } from "@/components/tailor/cv-upload";
import { Button } from "@/components/ui/button";
import type { BaseCVRecord, TailoredCVRecord } from "@/lib/supabase/db-types";
import type { ParsedCVData } from "@/lib/ai/provider";

export default function CVManagerPage() {
  const [baseCV, setBaseCV] = useState<BaseCVRecord | null>(null);
  const [tailoredCVs, setTailoredCVs] = useState<TailoredCVRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cvRes, tailoredRes] = await Promise.all([
          fetch("/api/cv"),
          fetch("/api/cv/tailored"),
        ]);
        if (cvRes.ok) {
          const { cv } = await cvRes.json();
          setBaseCV(cv);
        }
        if (tailoredRes.ok) {
          const { tailored_cvs } = await tailoredRes.json();
          setTailoredCVs(tailored_cvs);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleDownloadPDF(cv: TailoredCVRecord) {
    setDownloadingId(cv.id);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CVPdfTemplate } = await import("@/components/tailor/cv-pdf-template");
      const blob = await pdf(<CVPdfTemplate cv={cv.tailored_data as ParsedCVData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date(cv.created_at).toISOString().split("T")[0];
      a.download = `tailored-cv-${dateStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("PDF generation failed.");
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">CV Manager</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your base CV and view all tailored versions.
                </p>
              </div>
              <Link href="/tailor">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tailor New CV
                </Button>
              </Link>
            </div>

            {/* Base CV Section */}
            <div className="rounded-2xl border border-border bg-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Base CV</h2>
              </div>

              <CVUpload
                currentCV={baseCV}
                onCVReady={(newCv) => setBaseCV(newCv)}
              />

              {baseCV?.parsed_data && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MiniStat label="Name" value={baseCV.parsed_data.contact?.name || "—"} />
                    <MiniStat label="Experience" value={`${baseCV.parsed_data.experience?.length || 0} roles`} />
                    <MiniStat label="Skills" value={`${baseCV.parsed_data.skills?.length || 0} listed`} />
                    <MiniStat label="Education" value={`${baseCV.parsed_data.education?.length || 0} entries`} />
                  </div>
                </div>
              )}
            </div>

            {/* Tailored CVs Section */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Tailored Versions
                  {tailoredCVs.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({tailoredCVs.length})
                    </span>
                  )}
                </h2>
              </div>

              {tailoredCVs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No tailored CVs yet. Tailor your first CV to see it here.
                  </p>
                  <Link href="/tailor">
                    <Button variant="outline" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {tailoredCVs.map((cv) => {
                    const parsedData = cv.tailored_data as ParsedCVData;
                    const isExpanded = expandedId === cv.id;
                    return (
                      <div
                        key={cv.id}
                        className="rounded-xl border border-border bg-muted/20 overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {parsedData.contact?.name || "Tailored CV"}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(cv.created_at).toLocaleDateString()}
                                </span>
                                {cv.match_score_before != null && cv.match_score_after != null && (
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                                    {cv.match_score_before}% → {cv.match_score_after}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => setExpandedId(isExpanded ? null : cv.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => handleDownloadPDF(cv)}
                              disabled={downloadingId === cv.id}
                            >
                              {downloadingId === cv.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-border px-4 pb-4"
                          >
                            <div className="pt-4 space-y-4">
                              {cv.changes_summary && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Changes Made</p>
                                  <ul className="text-sm text-foreground/80 space-y-1">
                                    {cv.changes_summary.split("\n").filter(Boolean).map((change, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        {change}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {parsedData.skills && parsedData.skills.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Skills</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {parsedData.skills.slice(0, 15).map((skill) => (
                                      <span
                                        key={skill}
                                        className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {parsedData.skills.length > 15 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{parsedData.skills.length - 15} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  );
}
