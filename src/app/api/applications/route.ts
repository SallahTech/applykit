import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("board_position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications: applications || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate required fields
  if (!body.company_name?.trim() || !body.job_title?.trim()) {
    return NextResponse.json({ error: "Company name and job title are required" }, { status: 400 });
  }

  // Plan limit check
  const { data: profile } = await supabase
    .from("profiles")
    .select("applications_limit, plan")
    .eq("id", user.id)
    .single();

  if (profile) {
    const { count } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("status", "in", '("rejected","accepted")');

    if (count !== null && count >= profile.applications_limit && profile.plan === "free") {
      return NextResponse.json(
        { error: "Application limit reached. Upgrade to Pro for unlimited applications." },
        { status: 403 }
      );
    }
  }

  // Get max board_position for target status
  const status = body.status || "saved";
  const { data: maxPosData } = await supabase
    .from("applications")
    .select("board_position")
    .eq("user_id", user.id)
    .eq("status", status)
    .order("board_position", { ascending: false })
    .limit(1);

  const nextPosition = maxPosData && maxPosData.length > 0 ? maxPosData[0].board_position + 1 : 0;

  // Insert
  const { data: application, error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      company_name: body.company_name.trim(),
      job_title: body.job_title.trim(),
      job_url: body.job_url || null,
      job_description: body.job_description || null,
      status,
      match_score: body.match_score || null,
      salary_range: body.salary_range || null,
      location: body.location || null,
      applied_date: body.applied_date || null,
      notes: body.notes || null,
      board_position: nextPosition,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ application }, { status: 201 });
}
