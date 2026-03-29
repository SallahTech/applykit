import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai";
import * as cheerio from "cheerio";

const EXTRACT_PROMPT = `You are a job listing parser. Given the text content from a job posting webpage, extract the key details. Return valid JSON with this exact structure:
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

Extract only what is explicitly stated. If salary is not mentioned, use an empty string. Distinguish between required and nice-to-have skills. The job_description should be a clean version of the full posting text.`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  try {
    // Detect LinkedIn URLs and try the public job view format
    let fetchUrl = url;
    const linkedInMatch = url.match(/linkedin\.com\/jobs\/(?:view|collections\/[^/]+\/?\?currentJobId=)(\d+)/);
    if (linkedInMatch) {
      // Rewrite to the public view URL which is more likely to have content
      fetchUrl = `https://www.linkedin.com/jobs/view/${linkedInMatch[1]}`;
    }

    // Check if this is a site that typically blocks scraping
    const isLinkedIn = url.includes("linkedin.com");

    // Fetch the page
    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      if (isLinkedIn) {
        return NextResponse.json(
          { error: "LinkedIn blocks automated access. Please copy the job description from LinkedIn and paste it in the \"Paste Job Description\" tab instead." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch URL (${response.status}). The site may be blocking requests.` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extract text content from HTML
    const $ = cheerio.load(html);

    // Remove scripts, styles, nav, footer, header
    $("script, style, nav, footer, header, noscript, iframe").remove();

    // For LinkedIn, try to find the job description in specific elements
    let textContent = "";
    if (isLinkedIn) {
      // LinkedIn public pages sometimes embed job data in specific classes
      const jobDesc = $(".description__text, .show-more-less-html__markup, .job-description, [data-job-description]").text().trim();
      const jobTitle = $(".top-card-layout__title, .topcard__title").text().trim();
      const company = $(".topcard__org-name-link, .top-card-layout__second-subline a").text().trim();
      const location = $(".topcard__flavor--bullet, .top-card-layout__bullet").text().trim();

      if (jobDesc.length > 50) {
        textContent = `Job Title: ${jobTitle}\nCompany: ${company}\nLocation: ${location}\n\n${jobDesc}`;
      }
    }

    // Fall back to full body text extraction
    if (!textContent) {
      textContent = $("body").text().replace(/\s+/g, " ").trim();
    }

    // Check if we got meaningful content
    if (textContent.length < 50) {
      const hint = isLinkedIn
        ? "LinkedIn requires login to view most job posts. Please copy the job description and paste it in the \"Paste Job Description\" tab."
        : "Could not extract content from this URL. Try pasting the job description directly.";
      return NextResponse.json({ error: hint }, { status: 400 });
    }

    // Check if the page is a login/auth wall (common patterns)
    const lowerText = textContent.toLowerCase();
    if (
      (lowerText.includes("sign in") || lowerText.includes("log in")) &&
      !lowerText.includes("responsibilities") &&
      !lowerText.includes("requirements") &&
      !lowerText.includes("qualifications") &&
      textContent.length < 500
    ) {
      const hint = isLinkedIn
        ? "LinkedIn requires login to view this job post. Please copy the job description and paste it in the \"Paste Job Description\" tab."
        : "This page appears to require login. Try pasting the job description directly.";
      return NextResponse.json({ error: hint }, { status: 400 });
    }

    // Truncate to avoid sending too much text to the AI (keep first 8000 chars)
    const truncated = textContent.slice(0, 8000);

    // Send to AI for structured extraction
    const provider = getAIProvider();
    const aiResponse = await provider.extractJobDetails(truncated);

    // Check if AI returned empty results (page content wasn't a real job posting)
    if (!aiResponse.company && !aiResponse.position && !aiResponse.job_description) {
      const hint = isLinkedIn
        ? "Could not find job details — LinkedIn likely blocked access. Please copy the job description and paste it in the \"Paste Job Description\" tab."
        : "Could not find job details on this page. Try pasting the job description directly.";
      return NextResponse.json({ error: hint }, { status: 400 });
    }

    return NextResponse.json({ extracted: aiResponse });
  } catch (err) {
    console.error("URL extraction error:", err);

    if (err instanceof DOMException && err.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Request timed out. The site took too long to respond." },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Failed to extract job details. Try pasting the description directly." },
      { status: 500 }
    );
  }
}
