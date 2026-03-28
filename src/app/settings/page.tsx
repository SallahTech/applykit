"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/app-navbar";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { ProfileSection } from "@/components/settings/profile-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { PlanSection } from "@/components/settings/plan-section";
import { AccountSection } from "@/components/settings/account-section";

const sections: Record<string, React.ComponentType> = {
  profile: ProfileSection,
  preferences: PreferencesSection,
  plan: PlanSection,
  account: AccountSection,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const ActiveSection = sections[activeTab];

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background">
        <div className="pt-[4.5rem]">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
              <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
              <div>
                <ActiveSection />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
