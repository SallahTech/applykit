"use client";

import { useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { usePreferences } from "@/components/preferences-provider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PreferencesSection() {
  const { theme, setTheme } = useTheme();
  const { boardView, setBoardView } = usePreferences();
  const [scoreFormat, setScoreFormat] = useState<"percentage" | "score">(
    "percentage"
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Preferences</h2>

      {/* Follow-up Reminders */}
      <h3 className="text-sm font-medium text-foreground mb-4">
        Follow-up Reminders
      </h3>

      {/* Default reminder interval */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-foreground/80">Default reminder interval</p>
          <p className="text-xs text-muted-foreground">
            How long to wait before reminding you to follow up
          </p>
        </div>
        <Select defaultValue="7">
          <SelectTrigger className="w-[140px] bg-muted/40 border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 days</SelectItem>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="14">14 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email notifications */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/80">Email notifications</p>
          <p className="text-xs text-muted-foreground">
            Receive email reminders for follow-ups
          </p>
        </div>
        <Switch
          defaultChecked={true}
          onCheckedChange={() =>
            toast("Coming soon! Email notifications are in development.")
          }
        />
      </div>

      {/* Theme */}
      <div className="h-px bg-border my-6" />
      <h3 className="text-sm font-medium text-foreground mb-4">Theme</h3>
      <div
        className="flex bg-muted/60 rounded-xl p-1 w-fit"
        role="radiogroup"
        aria-label="Theme selection"
      >
        {[
          { value: "dark", label: "Dark", icon: Moon },
          { value: "light", label: "Light", icon: Sun },
          { value: "system", label: "System", icon: Monitor },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            role="radio"
            aria-checked={theme === value}
            onClick={() => setTheme(value as "dark" | "light" | "system")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              theme === value
                ? "bg-accent text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Display */}
      <div className="h-px bg-border my-6" />
      <h3 className="text-sm font-medium text-foreground mb-4">Display</h3>

      {/* Match score format */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-foreground/80">Match score format</p>
          <p className="text-xs text-muted-foreground">
            How match scores are displayed
          </p>
        </div>
        <div className="flex bg-muted/60 rounded-xl p-1 w-fit">
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              scoreFormat === "percentage"
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => {
              setScoreFormat("percentage");
              toast("Coming soon!");
            }}
          >
            Percentage
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              scoreFormat === "score"
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => {
              setScoreFormat("score");
              toast("Coming soon!");
            }}
          >
            Score
          </button>
        </div>
      </div>

      {/* Default board view */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground/80">Default board view</p>
          <p className="text-xs text-muted-foreground">
            Choose your preferred board layout
          </p>
        </div>
        <div className="flex bg-muted/60 rounded-xl p-1 w-fit">
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              boardView === "kanban"
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => setBoardView("kanban")}
          >
            Kanban
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              boardView === "list"
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => setBoardView("list")}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}
