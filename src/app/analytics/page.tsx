"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Target,
  Briefcase,
  FileText,
  Loader2,
} from "lucide-react";
import { AppNavbar } from "@/components/app-navbar";

interface AnalyticsData {
  total_applications: number;
  status_counts: Record<string, number>;
  score_ranges: { high: number; medium: number; low: number; unscored: number };
  avg_match_score: number | null;
  timeline: Record<string, number>;
  profile: {
    cv_tailors_used: number;
    cv_tailors_limit: number;
    applications_limit: number;
    plan: string;
  } | null;
  tailored_cvs_count: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  saved: { label: "Saved", color: "bg-slate-500" },
  applied: { label: "Applied", color: "bg-blue-500" },
  "phone-screen": { label: "Phone Screen", color: "bg-cyan-500" },
  interview: { label: "Interview", color: "bg-purple-500" },
  offer: { label: "Offer", color: "bg-emerald-500" },
  rejected: { label: "Rejected", color: "bg-red-500" },
  accepted: { label: "Accepted", color: "bg-green-500" },
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

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

  if (!data) {
    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Failed to load analytics.</p>
        </div>
      </>
    );
  }

  const maxStatusCount = Math.max(...Object.values(data.status_counts), 1);

  // Calculate response rate (interviews + offers + accepted / total applied+)
  const activeApps = (data.status_counts["applied"] || 0) +
    (data.status_counts["phone-screen"] || 0) +
    (data.status_counts["interview"] || 0) +
    (data.status_counts["offer"] || 0) +
    (data.status_counts["accepted"] || 0) +
    (data.status_counts["rejected"] || 0);
  const responses = (data.status_counts["phone-screen"] || 0) +
    (data.status_counts["interview"] || 0) +
    (data.status_counts["offer"] || 0) +
    (data.status_counts["accepted"] || 0);
  const responseRate = activeApps > 0 ? Math.round((responses / activeApps) * 100) : 0;

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-1">Analytics</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Track your job search progress and performance.
            </p>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Briefcase className="w-5 h-5" />}
                label="Total Applications"
                value={data.total_applications}
                color="text-blue-400"
                bgColor="bg-blue-500/10"
              />
              <StatCard
                icon={<Target className="w-5 h-5" />}
                label="Avg Match Score"
                value={data.avg_match_score != null ? `${data.avg_match_score}%` : "N/A"}
                color="text-emerald-400"
                bgColor="bg-emerald-500/10"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Response Rate"
                value={`${responseRate}%`}
                color="text-purple-400"
                bgColor="bg-purple-500/10"
              />
              <StatCard
                icon={<FileText className="w-5 h-5" />}
                label="CVs Tailored"
                value={data.profile?.cv_tailors_used || 0}
                color="text-amber-400"
                bgColor="bg-amber-500/10"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Application Pipeline */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-foreground">Application Pipeline</h2>
                </div>
                <div className="space-y-4">
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                    const count = data.status_counts[status] || 0;
                    const pct = (count / maxStatusCount) * 100;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-muted-foreground">{config.label}</span>
                          <span className="text-sm font-semibold text-foreground">{count}</span>
                        </div>
                        <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${config.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Match Score Distribution */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-foreground">Match Score Distribution</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ScoreBlock
                    label="Strong (70%+)"
                    count={data.score_ranges.high}
                    total={data.total_applications}
                    color="text-emerald-400"
                    bgColor="bg-emerald-500/15"
                  />
                  <ScoreBlock
                    label="Medium (40-69%)"
                    count={data.score_ranges.medium}
                    total={data.total_applications}
                    color="text-amber-400"
                    bgColor="bg-amber-500/15"
                  />
                  <ScoreBlock
                    label="Low (<40%)"
                    count={data.score_ranges.low}
                    total={data.total_applications}
                    color="text-red-400"
                    bgColor="bg-red-500/15"
                  />
                  <ScoreBlock
                    label="Not Scored"
                    count={data.score_ranges.unscored}
                    total={data.total_applications}
                    color="text-slate-400"
                    bgColor="bg-slate-500/15"
                  />
                </div>

                {/* Usage Stats */}
                {data.profile && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Usage</h3>
                    <div className="space-y-3">
                      <UsageBar
                        label="CV Tailors"
                        used={data.profile.cv_tailors_used}
                        limit={data.profile.plan === "free" ? data.profile.cv_tailors_limit : null}
                      />
                      <UsageBar
                        label="Applications"
                        used={data.total_applications}
                        limit={data.profile.plan === "free" ? data.profile.applications_limit : null}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Plan: <span className="capitalize font-medium text-foreground">{data.profile.plan.replace("_", " ")}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}) {
  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

function ScoreBlock({
  label,
  count,
  total,
  color,
  bgColor,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  bgColor: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={`rounded-xl ${bgColor} p-4`}>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-1">{pct}% of total</p>
    </div>
  );
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const isUnlimited = limit === null;
  const pct = isUnlimited ? 30 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !isUnlimited && pct >= 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-medium ${isNearLimit ? "text-amber-400" : "text-foreground"}`}>
          {used}{isUnlimited ? "" : ` / ${limit}`}
          {isUnlimited && <span className="text-muted-foreground/60 ml-1">(unlimited)</span>}
        </span>
      </div>
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isNearLimit ? "bg-amber-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
