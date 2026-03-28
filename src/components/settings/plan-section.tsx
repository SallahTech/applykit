"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

export function PlanSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Plan & Billing</h2>

      {/* Current plan card */}
      <div className="rounded-xl border border-border bg-muted/30 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-accent/60 text-muted-foreground text-xs px-3 py-1 rounded-full font-medium">
            Free Plan
          </span>
          <span className="text-xs text-muted-foreground">Current</span>
        </div>

        <p className="text-sm text-foreground/80 mb-1">
          Active applications{" "}
          <span className="text-muted-foreground">— 3 of 5 used</span>
        </p>
        <div className="h-2 bg-muted rounded-full mb-4">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: "60%" }}
          />
        </div>

        <p className="text-sm text-foreground/80 mb-1">
          CV tailors this month{" "}
          <span className="text-muted-foreground">— 1 of 3 used</span>
        </p>
        <div className="h-2 bg-muted rounded-full mb-4">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: "33%" }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Resets on the 1st of each month
        </p>
      </div>

      {/* Upgrade cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pro card */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6">
          <p className="text-lg font-bold text-foreground mb-1">Pro</p>
          <p className="mb-4">
            <span className="text-3xl font-extrabold text-foreground">$19</span>
            <span className="text-sm text-muted-foreground ml-2">one-time</span>
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Unlimited applications",
              "Unlimited CV tailoring",
              "Follow-up reminders",
              "Analytics dashboard",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mt-4"
            onClick={() => toast("Coming soon!")}
          >
            Upgrade to Pro
          </Button>
        </div>

        {/* Pro+ card */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
          <p className="text-lg font-bold text-foreground mb-1">Pro+</p>
          <p className="mb-4">
            <span className="text-3xl font-extrabold text-foreground">$39</span>
            <span className="text-sm text-muted-foreground ml-2">one-time</span>
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Everything in Pro",
              "Cover letter generation",
              "LinkedIn optimization",
              "Interview prep notes",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mt-4"
            onClick={() => toast("Coming soon!")}
          >
            Upgrade to Pro+
          </Button>
        </div>
      </div>
    </div>
  );
}
