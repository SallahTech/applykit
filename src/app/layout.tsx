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
  title: "ApplyKit — AI Resume Tailoring & Job Application Tracker",
  description:
    "Tailor your resume to every job description in seconds with AI. Track applications on a Kanban board, boost your match score, and land more interviews. Free to start.",
  keywords: [
    "AI resume builder",
    "AI CV tailor",
    "resume tailoring tool",
    "CV optimizer",
    "job application tracker",
    "ATS resume checker",
    "resume keyword optimizer",
    "AI cover letter generator",
    "job search organizer",
    "kanban job tracker",
    "resume match score",
    "tailor resume to job description",
    "AI resume writer",
    "job board tracker",
    "application tracking system",
    "resume PDF generator",
    "career management tool",
    "job hunt organizer",
    "resume skills matcher",
    "AI job application tool",
  ],
  authors: [{ name: "ApplyKit" }],
  creator: "ApplyKit",
  metadataBase: new URL("https://tailormicv.com"),
  openGraph: {
    type: "website",
    title: "ApplyKit — AI Resume Tailoring & Job Application Tracker",
    description:
      "Tailor your resume to every job description in seconds with AI. Track applications, boost your match score, and land more interviews.",
    siteName: "ApplyKit",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyKit — AI Resume Tailoring & Job Application Tracker",
    description:
      "Tailor your resume to every job description in seconds with AI. Track applications, boost your match score, and land more interviews.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
