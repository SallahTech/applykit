"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/db-types";
import type { ParsedCVData } from "@/lib/ai/provider";

export function ProfileSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, cvRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/cv"),
        ]);

        if (profileRes.ok) {
          const { profile } = await profileRes.json();
          setProfile(profile);
          setFullName(profile?.full_name || "");
        }

        if (cvRes.ok) {
          const { cv } = await cvRes.json();
          if (cv?.parsed_data) {
            const parsed = cv.parsed_data as ParsedCVData;
            setLocation(parsed.contact?.location || "");
            setLinkedin(parsed.contact?.linkedin || "");
            if (!profile?.full_name && parsed.contact?.name) {
              setFullName(parsed.contact.name);
            }
          }
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) setEmail(user.email);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Profile</h2>

      {/* Avatar area */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{fullName || "—"}</p>
          <button
            className="text-sm text-blue-400"
            onClick={() => toast("Coming soon!")}
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Full Name
          </label>
          <Input
            value={fullName}
            disabled
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email
          </label>
          <Input
            value={email}
            disabled
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Location
          </label>
          <Input
            value={location}
            disabled
            placeholder="Upload a CV to populate"
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            LinkedIn
          </label>
          <Input
            value={linkedin}
            disabled
            placeholder="Upload a CV to populate"
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Profile details are pulled from your uploaded CV.
      </p>
    </div>
  );
}
