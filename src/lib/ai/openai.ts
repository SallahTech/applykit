import OpenAI from "openai";
import type { AIProvider, ParsedCVData, TailoredResult, ExtractedJobDetails } from "./provider";

const JOB_EXTRACT_PROMPT = `You are a job listing parser. Given the text content from a job posting webpage, extract the key details. Return valid JSON with this exact structure:
{
  "company": "company name",
  "position": "job title",
  "location": "job location or Remote",
  "salary_range": "salary range if mentioned, otherwise empty string",
  "requirements": [
    { "text": "requirement or skill", "type": "required" },
    { "text": "nice to have skill", "type": "nice-to-have" }
  ],
  "job_description": "the full job description text, cleaned up and formatted"
}
Extract only what is explicitly stated. If salary is not mentioned, use an empty string. Distinguish between required and nice-to-have skills.`;

const CV_STRUCTURING_PROMPT = `You are a professional resume parser. Extract structured data from this resume text. Return valid JSON with this exact structure:
{
  "contact": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "" },
  "summary": "",
  "experience": [{ "company": "", "title": "", "start_date": "", "end_date": "", "bullets": [""] }],
  "education": [{ "institution": "", "degree": "", "year": "" }],
  "skills": [""],
  "certifications": [""]
}
Only include information that is explicitly stated in the resume. Do not fabricate any data. If a field is not found, use an empty string or empty array.`;

const CV_TAILORING_PROMPT = `You are a professional resume writer. Given a candidate's CV data and a job description, rewrite the CV to better match the job requirements.

Rules:
- Never fabricate experience or skills the candidate doesn't have
- Never remove jobs or education — only reorder and rewrite bullets
- Rewrite the summary to target this specific role
- Reorder and enhance experience bullets to emphasize relevant achievements
- Add missing keywords naturally into existing bullet points
- Front-load matching skills in the skills section
- Maintain truthfulness while maximizing keyword relevance

Return valid JSON with this exact structure:
{
  "tailored_cv": { same structure as the input CV with your changes applied },
  "changes": ["human-readable description of each change made"],
  "match_score_before": <number 0-100>,
  "match_score_after": <number 0-100>,
  "keywords_found": ["keywords from the job description found in the tailored CV"],
  "keywords_missing": ["keywords from the job description NOT addressed"],
  "enhanced_bullets": ["exact text of each bullet that was modified or rewritten"],
  "skill_statuses": [{"name": "skill name", "status": "matched|added|default"}],
  "extracted_requirements": ["key requirements extracted from the job description"]
}

For skill_statuses:
- "matched": skill exists in the original CV AND is relevant to the job
- "added": skill was added to better match the job (must be inferable from the candidate's experience)
- "default": skill exists in the original CV but is not specifically relevant to this job`;

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async structureCV(rawText: string): Promise<ParsedCVData> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CV_STRUCTURING_PROMPT },
        { role: "user", content: rawText },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 4000,
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }

  async structureCVFromPDF(pdfBuffer: Buffer): Promise<ParsedCVData> {
    const base64 = pdfBuffer.toString("base64");
    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CV_STRUCTURING_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "file",
              file: {
                filename: "resume.pdf",
                file_data: `data:application/pdf;base64,${base64}`,
              },
            },
            {
              type: "text",
              text: "Please extract and structure the data from this resume PDF.",
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 4000,
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }

  async tailorCV(
    originalCV: ParsedCVData,
    jobDescription: string
  ): Promise<TailoredResult> {
    // Sanitize inputs to prevent invalid JSON payload
    const cleanDescription = jobDescription.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").trim();
    const cvString = JSON.stringify(originalCV, null, 2);

    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CV_TAILORING_PROMPT },
        {
          role: "user",
          content: `## Original CV\n${cvString}\n\n## Job Description\n${cleanDescription}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000,
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }

  async extractJobDetails(pageText: string): Promise<ExtractedJobDetails> {
    const cleanText = pageText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").trim();
    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: JOB_EXTRACT_PROMPT },
        { role: "user", content: cleanText },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 4000,
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }
}
