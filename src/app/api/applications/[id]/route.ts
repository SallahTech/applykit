import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Plan limit check on status change from inactive to active
  if (body.status) {
    const { data: currentApp } = await supabase
      .from("applications")
      .select("status")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (currentApp) {
      const inactiveStatuses = ["rejected", "accepted"];
      const isCurrentlyInactive = inactiveStatuses.includes(currentApp.status);
      const isNewStatusActive = !inactiveStatuses.includes(body.status);

      if (isCurrentlyInactive && isNewStatusActive) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("applications_limit, plan")
          .eq("id", user.id)
          .single();

        if (profile && profile.plan === "free") {
          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .not("status", "in", '("rejected","accepted")');

          if (count !== null && count >= profile.applications_limit) {
            return NextResponse.json(
              { error: "Application limit reached. Upgrade to Pro for unlimited applications." },
              { status: 403 }
            );
          }
        }
      }
    }
  }

  const { data: application, error } = await supabase
    .from("applications")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({ application });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
