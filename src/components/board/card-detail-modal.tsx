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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Application } from "@/lib/supabase/db-types";

interface CardDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application;
  onUpdated: (app: Application) => void;
}

export function CardDetailModal({
  open,
  onOpenChange,
  application,
  onUpdated,
}: CardDetailModalProps) {
  const [companyName, setCompanyName] = useState(application.company_name);
  const [jobTitle, setJobTitle] = useState(application.job_title);
  const [jobUrl, setJobUrl] = useState(application.job_url || "");
  const [location, setLocation] = useState(application.location || "");
  const [salaryRange, setSalaryRange] = useState(application.salary_range || "");
  const [notes, setNotes] = useState(application.notes || "");
  const [contactName, setContactName] = useState(application.contact_name || "");
  const [contactEmail, setContactEmail] = useState(application.contact_email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    if (!companyName.trim() || !jobTitle.trim()) {
      setError("Company name and job title are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          job_title: jobTitle.trim(),
          job_url: jobUrl.trim() || null,
          location: location.trim() || null,
          salary_range: salaryRange.trim() || null,
          notes: notes.trim() || null,
          contact_name: contactName.trim() || null,
          contact_email: contactEmail.trim() || null,
        }),
      });

      if (!res.ok) throw new Error();

      const { application: updated } = await res.json();
      onUpdated(updated);
      onOpenChange(false);
      toast.success("Application updated!");
    } catch {
      setError("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Application</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update details for this application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Company + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="cd-company" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Company Name *
              </label>
              <Input
                id="cd-company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
            <div>
              <label htmlFor="cd-title" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Job Title *
              </label>
              <Input
                id="cd-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
          </div>

          {/* Location + Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="cd-location" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Location
              </label>
              <Input
                id="cd-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
            <div>
              <label htmlFor="cd-salary" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Salary Range
              </label>
              <Input
                id="cd-salary"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $120-150k"
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label htmlFor="cd-url" className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Job URL
            </label>
            <Input
              id="cd-url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="bg-muted/40 border-border text-foreground"
            />
          </div>

          {/* Job Description (collapsible) */}
          {application.job_description && (
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-medium text-muted-foreground">Job Description</span>
                <span className="text-xs text-blue-400">
                  <span className="group-open:hidden">Show</span>
                  <span className="hidden group-open:inline">Hide</span>
                </span>
              </summary>
              <div className="bg-muted/30 border border-border rounded-xl p-3 mt-1.5 max-h-[250px] overflow-y-auto">
                <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {application.job_description}
                </p>
              </div>
            </details>
          )}

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="cd-contact-name" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Contact Name
              </label>
              <Input
                id="cd-contact-name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Sarah Chen"
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
            <div>
              <label htmlFor="cd-contact-email" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Contact Email
              </label>
              <Input
                id="cd-contact-email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="cd-notes" className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Notes
            </label>
            <Textarea
              id="cd-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this application..."
              rows={3}
              className="bg-muted/40 border-border text-foreground text-sm resize-none rounded-xl"
            />
          </div>

          {/* Match score (read-only) */}
          {application.match_score != null && application.match_score > 0 && (
            <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Match Score</span>
              <span className={`text-sm font-semibold ${
                application.match_score >= 70 ? "text-emerald-400" :
                application.match_score >= 40 ? "text-amber-400" : "text-red-400"
              }`}>
                {application.match_score}%
              </span>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 text-center" aria-live="polite">{error}</p>
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
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
