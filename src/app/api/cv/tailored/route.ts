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

  // Get user's base CV ID
  const { data: baseCV } = await supabase
    .from("base_cvs")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!baseCV) {
    return NextResponse.json({ tailored_cvs: [] });
  }

  const { data: tailoredCVs, error } = await supabase
    .from("tailored_cvs")
    .select("*")
    .eq("base_cv_id", baseCV.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tailored_cvs: tailoredCVs || [] });
}
