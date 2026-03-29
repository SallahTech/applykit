import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try to fetch existing profile
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // On-demand creation for pre-migration users
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || null,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
    profile = newProfile;
  }

  return NextResponse.json({ profile });
}
