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

export default function Home() {
  return (
    <div className="dark bg-[#0f172a] text-[#f1f5f9]">
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
