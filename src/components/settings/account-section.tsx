"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AccountSection() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Account</h2>

      <Button
        variant="outline"
        className="border-border text-muted-foreground hover:bg-muted"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>

      <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="text-sm font-semibold text-red-400 mb-2">
          Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          onClick={() => toast("Coming soon!")}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
