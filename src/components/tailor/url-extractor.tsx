"use client";

import { useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExtractedData {
  company: string;
  position: string;
  location: string;
  salary_range: string;
  requirements: Array<{ text: string; type: "required" | "nice-to-have" }>;
  job_description: string;
}

interface JobMeta {
  company: string;
  position: string;
  location?: string;
  salary_range?: string;
}

interface UrlExtractorProps {
  onExtracted: (jobDescription: string, meta?: JobMeta) => void;
}

export function UrlExtractor({ onExtracted }: UrlExtractorProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );

  async function handleExtract() {
    if (!url.trim()) {
      toast.error("Paste a job URL first");
      return;
    }

    setLoading(true);
    setExtractedData(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || "Failed to extract. Try pasting the description directly."
        );
      }

      const { extracted } = await res.json();
      setExtractedData(extracted);
      onExtracted(extracted.job_description, {
        company: extracted.company,
        position: extracted.position,
        location: extracted.location,
        salary_range: extracted.salary_range,
      });
      toast.success("Job details extracted!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Extraction failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Tip box */}
      <div className="bg-blue-500/8 border border-blue-500/15 rounded-xl p-3 flex gap-2.5">
        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb className="text-blue-400 w-3 h-3" />
        </div>
        <p className="text-xs text-blue-300/80 leading-relaxed">
          Paste a link from LinkedIn, Indeed, Greenhouse, Lever, or any job
          board. We&apos;ll extract the job description automatically.
        </p>
      </div>

      {/* URL input row */}
      <div>
        <label
          htmlFor="job-url"
          className="text-xs font-medium text-muted-foreground mb-1.5 block"
        >
          Job posting URL
        </label>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            id="job-url"
            className="flex-1 bg-muted/40 border-border text-foreground rounded-lg h-10 focus:border-blue-500/50 focus:ring-blue-500/20 placeholder:text-muted-foreground"
            placeholder="https://company.com/careers/job-id"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg h-10 px-5 font-medium shadow-sm"
            onClick={handleExtract}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Extract →"
            )}
          </Button>
        </div>
      </div>

      {/* Extracted state */}
      {extractedData && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Divider */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              Extracted Job Details
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Company", id: "company", value: extractedData.company },
              {
                label: "Position",
                id: "position",
                value: extractedData.position,
              },
              {
                label: "Location",
                id: "location",
                value: extractedData.location,
              },
              {
                label: "Salary Range",
                id: "salary",
                value: extractedData.salary_range || "Not specified",
              },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={`extracted-${field.id}`}
                  className="text-[11px] font-medium text-muted-foreground mb-1 block"
                >
                  {field.label}
                </label>
                <Input
                  id={`extracted-${field.id}`}
                  className="bg-muted/30 border-border text-foreground text-sm rounded-lg h-9 disabled:opacity-70"
                  value={field.value}
                  disabled
                />
              </div>
            ))}
          </div>

          {/* Key Requirements */}
          {extractedData.requirements.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-2">
                Key Requirements (extracted)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {extractedData.requirements.map((req, i) => (
                  <Badge
                    key={`${req.text}-${i}`}
                    className={
                      req.type === "required"
                        ? "bg-blue-500/15 text-blue-400 border-0 text-xs font-medium px-2.5 py-0.5 rounded-md"
                        : "bg-amber-500/15 text-amber-400 border-0 text-xs font-medium px-2.5 py-0.5 rounded-md"
                    }
                  >
                    {req.text}
                    {req.type === "nice-to-have" && (
                      <span className="text-amber-500/60 ml-1">
                        (nice to have)
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Job Description */}
          {extractedData.job_description && (
            <div>
              <label
                htmlFor="extracted-description"
                className="text-[11px] font-medium text-muted-foreground mb-1.5 block"
              >
                Job Description
              </label>
              <Textarea
                id="extracted-description"
                className="bg-muted/30 border-border text-foreground text-sm min-h-[180px] resize-none rounded-xl disabled:opacity-70"
                value={extractedData.job_description}
                disabled
                rows={8}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
