import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CVDemo } from "@/components/landing/cv-demo";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ApplyKit — AI Rewrites Your Resume for Every Job",
  description:
    "Other tools suggest keywords. ApplyKit fully rewrites your CV for every job description with AI. Track applications on a Kanban board, download ATS-ready PDFs, and pay once — no subscription. Free to start.",
  alternates: {
    canonical: "https://tailormicv.com",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ApplyKit",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered resume tailoring and job application tracking tool. Tailor your CV to match any job description, track applications on a Kanban board, and download optimized PDF resumes.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free plan — 5 active applications, 3 CV tailors/month",
      },
      {
        "@type": "Offer",
        price: "19",
        priceCurrency: "USD",
        description: "Pro plan — unlimited applications and CV tailoring",
      },
    ],
    featureList: [
      "AI resume tailoring",
      "Job description keyword matching",
      "ATS-optimized resume generation",
      "Kanban job application tracker",
      "PDF resume download",
      "Match score analysis",
      "Job URL extraction",
    ],
  };

  return (
    <div className="dark bg-[#0f172a] text-[#f1f5f9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <HowItWorks />
        <CVDemo />
        <Features />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
