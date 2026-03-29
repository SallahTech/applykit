export interface ParsedCVData {
  contact: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    start_date: string;
    end_date: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  certifications: string[];
}

export interface TailoredResult {
  tailored_cv: ParsedCVData;
  changes: string[];
  match_score_before: number;
  match_score_after: number;
  keywords_found: string[];
  keywords_missing: string[];
  enhanced_bullets: string[];
  skill_statuses: Array<{ name: string; status: "matched" | "added" | "default" }>;
  extracted_requirements: string[];
}

export interface ExtractedJobDetails {
  company: string;
  position: string;
  location: string;
  salary_range: string;
  requirements: Array<{ text: string; type: "required" | "nice-to-have" }>;
  job_description: string;
}

export interface AIProvider {
  structureCV(rawText: string): Promise<ParsedCVData>;
  structureCVFromPDF(pdfBuffer: Buffer): Promise<ParsedCVData>;
  tailorCV(originalCV: ParsedCVData, jobDescription: string): Promise<TailoredResult>;
  extractJobDetails(pageText: string): Promise<ExtractedJobDetails>;
}
