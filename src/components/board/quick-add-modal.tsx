"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Application } from "@/lib/supabase/db-types";

interface QuickAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus: string;
  onApplicationCreated: (app: Application) => void;
}

export function QuickAddModal({
  open,
  onOpenChange,
  defaultStatus,
  onApplicationCreated,
}: QuickAddModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!companyName.trim() || !jobTitle.trim()) {
      setError("Company name and job title are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          job_title: jobTitle.trim(),
          job_url: jobUrl.trim() || undefined,
          location: location.trim() || undefined,
          salary_range: salaryRange.trim() || undefined,
          status: defaultStatus,
        }),
      });

      if (res.status === 403) {
        const data = await res.json();
        toast.error(data.error || "Application limit reached.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error();

      const { application } = await res.json();
      onApplicationCreated(application);
      onOpenChange(false);
      // Reset form
      setCompanyName("");
      setJobTitle("");
      setJobUrl("");
      setLocation("");
      setSalaryRange("");
      toast.success("Application added!");
    } catch {
      setError("Failed to add application. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Application</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Quick-add a job application to your board.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Company Name (required) */}
          <div>
            <label
              htmlFor="qa-company"
              className="text-xs font-medium text-muted-foreground mb-1.5 block"
            >
              Company Name *
            </label>
            <Input
              id="qa-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe"
              className="bg-muted/40 border-border text-foreground"
            />
          </div>

          {/* Job Title (required) */}
          <div>
            <label
              htmlFor="qa-title"
              className="text-xs font-medium text-muted-foreground mb-1.5 block"
            >
              Job Title *
            </label>
            <Input
              id="qa-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="bg-muted/40 border-border text-foreground"
            />
          </div>

          {/* Optional fields in 2-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="qa-url"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Job URL
              </label>
              <Input
                id="qa-url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://..."
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="qa-location"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                Location
              </label>
              <Input
                id="qa-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="qa-salary"
              className="text-xs font-medium text-muted-foreground mb-1.5 block"
            >
              Salary Range
            </label>
            <Input
              id="qa-salary"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. $120-150k"
              className="bg-muted/40 border-border text-foreground"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 text-center" aria-live="polite">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-border text-muted-foreground"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add Application"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
