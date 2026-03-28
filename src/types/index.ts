export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
}

export interface PricingTier {
  name: string;
  price: string;
  priceLabel: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

export interface CVExperience {
  company: string;
  title: string;
  dateRange: string;
  bullets: { text: string; enhanced: boolean }[];
}

export interface CVData {
  name: string;
  contact: string;
  summary: string;
  experience: CVExperience[];
  skills: { name: string; status: "matched" | "added" | "default" }[];
}

export interface Keyword {
  text: string;
  found: boolean;
}

export interface DemoResult {
  bullets: string[];
  changes: string[];
}

export interface ExtractedJob {
  company: string;
  position: string;
  location: string;
  salaryRange: string;
  requirements: { text: string; type: "required" | "nice-to-have" }[];
}

export interface ApplicationCard {
  id: string;
  company: string;
  title: string;
  matchScore: number;
  location?: string;
  salary?: string;
  date: string;
  followUp?: string;
}

export interface BoardColumn {
  id: string;
  name: string;
}
