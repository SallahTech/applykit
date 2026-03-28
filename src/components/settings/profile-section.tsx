"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Profile</h2>

      {/* Avatar area */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">AC</span>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">Alex Chen</p>
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
            defaultValue="Alex Chen"
            disabled
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email
          </label>
          <Input
            defaultValue="alex@email.com"
            disabled
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Location
          </label>
          <Input
            defaultValue="San Francisco, CA"
            disabled
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            LinkedIn
          </label>
          <Input
            defaultValue="linkedin.com/in/alexchen"
            disabled
            className="bg-muted/40 border-border text-foreground disabled:opacity-70"
          />
        </div>
      </div>

      <Button
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white mt-6"
        onClick={() => toast("Coming soon!")}
      >
        Save Changes
      </Button>
    </div>
  );
}
