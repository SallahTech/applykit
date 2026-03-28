"use client";

import { User, SlidersHorizontal, CreditCard, Shield } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "plan", label: "Plan & Billing", icon: CreditCard },
  { id: "account", label: "Account", icon: Shield },
];

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:block bg-muted/30 rounded-xl p-2 h-fit sticky top-24">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                tab.id === activeTab
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Mobile pill tabs */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-1 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center gap-2 flex-shrink-0 transition-colors ${
                tab.id === activeTab
                  ? "bg-accent text-foreground"
                  : "bg-muted/30 text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
