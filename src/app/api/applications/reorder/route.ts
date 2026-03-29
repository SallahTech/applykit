import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { updates } = await request.json();

  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: "Updates array is required" }, { status: 400 });
  }

  // Verify all IDs belong to the user
  const ids = updates.map((u: any) => u.id);
  const { data: existingApps, error: verifyError } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .in("id", ids);

  if (verifyError || !existingApps || existingApps.length !== ids.length) {
    return NextResponse.json({ error: "Some applications not found or unauthorized" }, { status: 403 });
  }

  // Plan limit check: if any update moves from inactive to active
  const inactiveStatuses = ["rejected", "accepted"];
  const { data: currentApps } = await supabase
    .from("applications")
    .select("id, status")
    .in("id", ids);

  if (currentApps) {
    const movingToActive = updates.some((update: any) => {
      const current = currentApps.find((a) => a.id === update.id);
      if (!current) return false;
      return inactiveStatuses.includes(current.status) && !inactiveStatuses.includes(update.status);
    });

    if (movingToActive) {
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

  // Apply updates
  for (const update of updates) {
    await supabase
      .from("applications")
      .update({
        status: update.status,
        board_position: update.board_position,
        updated_at: new Date().toISOString(),
      })
      .eq("id", update.id)
      .eq("user_id", user.id);
  }

  return NextResponse.json({ success: true });
}
