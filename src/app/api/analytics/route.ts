import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all applications
  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const apps = applications || [];

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  for (const app of apps) {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  }

  // Match score distribution
  const scoreRanges = { high: 0, medium: 0, low: 0, unscored: 0 };
  for (const app of apps) {
    if (app.match_score == null) scoreRanges.unscored++;
    else if (app.match_score >= 70) scoreRanges.high++;
    else if (app.match_score >= 40) scoreRanges.medium++;
    else scoreRanges.low++;
  }

  // Applications over time (last 30 days, grouped by day)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const timeline: Record<string, number> = {};
  for (const app of apps) {
    const date = (app.applied_date || app.created_at.split("T")[0]);
    if (new Date(date) >= thirtyDaysAgo) {
      timeline[date] = (timeline[date] || 0) + 1;
    }
  }

  // Average match score
  const scored = apps.filter((a) => a.match_score != null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((sum, a) => sum + a.match_score!, 0) / scored.length)
    : null;

  // Fetch profile for usage stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_tailors_used, cv_tailors_limit, applications_limit, plan")
    .eq("id", user.id)
    .single();

  // Fetch tailored CVs count
  const { count: tailoredCount } = await supabase
    .from("tailored_cvs")
    .select("*", { count: "exact", head: true })
    .eq("base_cv_id", user.id);

  return NextResponse.json({
    total_applications: apps.length,
    status_counts: statusCounts,
    score_ranges: scoreRanges,
    avg_match_score: avgScore,
    timeline,
    profile: profile || null,
    tailored_cvs_count: tailoredCount || 0,
  });
}
