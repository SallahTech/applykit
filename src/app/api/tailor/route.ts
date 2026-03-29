import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { job_description, application_id } = await request.json();

  if (!job_description || typeof job_description !== "string") {
    return NextResponse.json(
      { error: "job_description is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  // Plan limit check
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (
    profile &&
    profile.plan === "free" &&
    profile.cv_tailors_used >= profile.cv_tailors_limit
  ) {
    return NextResponse.json(
      { error: "CV tailor limit reached. Upgrade to Pro." },
      { status: 403 }
    );
  }

  // Fetch active CV
  const { data: baseCV, error: cvError } = await supabase
    .from("base_cvs")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (cvError || !baseCV) {
    return NextResponse.json(
      { error: "Upload a CV first" },
      { status: 400 }
    );
  }

  try {
    // Call AI
    const provider = getAIProvider();
    const result = await provider.tailorCV(baseCV.parsed_data, job_description);

    // Save to tailored_cvs
    const { data: tailoredRecord } = await supabase
      .from("tailored_cvs")
      .insert({
        application_id: application_id || null,
        base_cv_id: baseCV.id,
        tailored_data: result.tailored_cv,
        changes_summary: result.changes.join("\n"),
        match_score_before: result.match_score_before,
        match_score_after: result.match_score_after,
      })
      .select()
      .single();

    // Increment usage
    await supabase
      .from("profiles")
      .update({
        cv_tailors_used: (profile?.cv_tailors_used || 0) + 1,
      })
      .eq("id", user.id);

    // Update application if linked
    if (application_id) {
      await supabase
        .from("applications")
        .update({
          match_score: result.match_score_after,
          extracted_requirements: result.extracted_requirements,
          tailored_cv_id: tailoredRecord?.id,
        })
        .eq("id", application_id);
    }

    return NextResponse.json({
      original: baseCV.parsed_data,
      tailored: result.tailored_cv,
      changes: result.changes,
      match_score_before: result.match_score_before,
      match_score_after: result.match_score_after,
      keywords_found: result.keywords_found,
      keywords_missing: result.keywords_missing,
      enhanced_bullets: result.enhanced_bullets,
      skill_statuses: result.skill_statuses,
      extracted_requirements: result.extracted_requirements,
    });
  } catch (err) {
    console.error("CV tailoring error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
