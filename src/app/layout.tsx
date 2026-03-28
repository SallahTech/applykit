import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PreferencesProvider } from "@/components/preferences-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "ApplyKit — AI-Powered CV Tailoring & Job Tracker",
  description:
    "Stop sending the same resume everywhere. ApplyKit tailors your CV to every job description with AI and tracks all your applications in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider>
          <PreferencesProvider>
            {children}
            <Toaster />
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
