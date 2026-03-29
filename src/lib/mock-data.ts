import { Feature, Testimonial, PricingTier, CVData, Keyword, DemoResult, ExtractedJob, ApplicationCard, BoardColumn } from "@/types";

export const SAMPLE_JOB_DESCRIPTION = `Software Engineer, Payments — Stripe

We're looking for a Software Engineer to join our Payments team. You'll design and build the infrastructure that moves money across the internet.

Requirements:
• 5+ years of experience in software engineering
• Strong proficiency in TypeScript, React, and Node.js
• Experience with payment systems and financial APIs
• Understanding of distributed systems and high availability
• Experience with PostgreSQL and API design
• Knowledge of PCI compliance is a plus
• Ruby experience is nice to have`;

export const DEMO_RESULTS: DemoResult = {
  bullets: [
    "Architected high-throughput API infrastructure handling 10K+ requests/sec with 99.99% uptime",
    "Designed and built payment processing module integrating Stripe APIs, reducing failed transactions by 35%",
    "Implemented CI/CD pipeline with automated testing for payment flows, maintaining PCI compliance",
    "Led development of financial analytics dashboard using React and TypeScript, serving 50K+ users",
  ],
  changes: [
    "Summary rewritten to emphasize payments and fintech experience",
    "Payment processing bullet enhanced with metrics and Stripe-relevant keywords",
    'Added "payment systems" and "financial APIs" to skills',
  ],
};

export const FEATURES: Feature[] = [
  {
    icon: "Sparkles",
    title: "Full CV Rewrite, Not Suggestions",
    description: "Other tools highlight keywords. We rewrite your entire CV — summary, bullets, skills — tailored to the specific role.",
  },
  {
    icon: "KanbanSquare",
    title: "Visual Application Tracker",
    description: "Drag-and-drop Kanban board to track every application from Saved to Accepted. Never lose track of where you stand.",
  },
  {
    icon: "Target",
    title: "Match Score Before You Apply",
    description: "See your before/after match score so you know exactly how competitive your CV is before hitting submit.",
  },
  {
    icon: "Bell",
    title: "Follow-Up Reminders",
    description: "Set reminders on any application. Get nudged when it's time to follow up so opportunities don't slip away.",
  },
  {
    icon: "FileDown",
    title: "One-Click PDF Download",
    description: "Download your tailored CV as a clean, ATS-friendly PDF. Ready to attach and send in seconds.",
  },
  {
    icon: "BarChart3",
    title: "Job Search Analytics",
    description: "See your response rate, pipeline breakdown, and match score trends. Data-driven job searching.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah K.",
    role: "Product Designer",
    quote: "I tried three other tools that just highlighted keywords. ApplyKit actually rewrote my bullets and I went from 3% to 15% response rate in two weeks.",
    initials: "SK",
  },
  {
    name: "Marcus T.",
    role: "Software Engineer",
    quote: "Pasted a job link, got a fully rewritten CV in 10 seconds. Downloaded the PDF, applied, got the interview. No subscription needed — paid once and I'm set.",
    initials: "MT",
  },
  {
    name: "Priya R.",
    role: "Data Analyst",
    quote: "The Kanban board keeps me organized and the match scores tell me where to focus. Landed my role in 3 weeks. Best $19 I've spent on my career.",
    initials: "PR",
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    priceLabel: "forever free",
    description: "Try the full rewrite experience — no card required",
    features: [
      { text: "5 active applications", included: true },
      { text: "3 CV tailors/month", included: true },
      { text: "Basic application tracker", included: true },
      { text: "Follow-up reminders", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "Cover letter generation", included: false },
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    priceLabel: "one-time payment",
    description: "Unlimited rewrites for serious job seekers",
    features: [
      { text: "Unlimited applications", included: true },
      { text: "Unlimited CV tailoring", included: true },
      { text: "Advanced application tracker", included: true },
      { text: "Follow-up reminders", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Cover letter generation", included: false },
    ],
    cta: "Get Pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Pro+",
    price: "$39",
    priceLabel: "one-time payment",
    description: "Full toolkit with cover letters and interview prep",
    features: [
      { text: "Unlimited applications", included: true },
      { text: "Unlimited CV tailoring", included: true },
      { text: "Advanced application tracker", included: true },
      { text: "Follow-up reminders", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Cover letter generation", included: true },
    ],
    cta: "Get Pro+",
    highlighted: false,
  },
];

export const ORIGINAL_CV: CVData = {
  name: "Alex Chen",
  contact: "alex@email.com · San Francisco, CA · linkedin.com/in/alexchen",
  summary:
    "Full stack engineer with 5 years of experience building web applications. Proficient in React, Node.js, and cloud infrastructure. Passionate about creating user-friendly products that solve real problems.",
  experience: [
    {
      company: "TechCorp Inc.",
      title: "Senior Software Engineer",
      dateRange: "2022 - Present",
      bullets: [
        { text: "Led development of customer-facing dashboard using React and TypeScript", enhanced: false },
        { text: "Built RESTful APIs handling 10K requests per second", enhanced: false },
        { text: "Mentored 3 junior developers and conducted code reviews", enhanced: false },
      ],
    },
    {
      company: "StartupXYZ",
      title: "Software Engineer",
      dateRange: "2020 - 2022",
      bullets: [
        { text: "Developed payment processing module for e-commerce platform", enhanced: false },
        { text: "Implemented CI/CD pipeline reducing deployment time by 60%", enhanced: false },
        { text: "Collaborated with product team on feature specifications", enhanced: false },
      ],
    },
  ],
  skills: [
    { name: "React", status: "default" },
    { name: "TypeScript", status: "default" },
    { name: "Node.js", status: "default" },
    { name: "PostgreSQL", status: "default" },
    { name: "AWS", status: "default" },
    { name: "Docker", status: "default" },
    { name: "GraphQL", status: "default" },
    { name: "Python", status: "default" },
  ],
};

export const TAILORED_CV: CVData = {
  name: "Alex Chen",
  contact: "alex@email.com · San Francisco, CA · linkedin.com/in/alexchen",
  summary:
    "Full stack engineer with 5 years of experience building scalable payment infrastructure and financial APIs. Expert in React, TypeScript, and Node.js with hands-on experience processing high-volume transactions. Proven track record of architecting reliable systems that handle millions in payment volume.",
  experience: [
    {
      company: "TechCorp Inc.",
      title: "Senior Software Engineer",
      dateRange: "2022 - Present",
      bullets: [
        {
          text: "Architected high-throughput API infrastructure handling 10K+ requests/sec with 99.99% uptime, processing $2M+ in daily transaction volume",
          enhanced: true,
        },
        {
          text: "Led development of financial analytics dashboard using React and TypeScript, serving 50K+ business users",
          enhanced: true,
        },
        {
          text: "Mentored 3 junior developers and established code review standards for payment-critical code paths",
          enhanced: false,
        },
      ],
    },
    {
      company: "StartupXYZ",
      title: "Software Engineer",
      dateRange: "2020 - 2022",
      bullets: [
        {
          text: "Designed and built payment processing module integrating Stripe APIs, reducing failed transactions by 35% and increasing conversion by 12%",
          enhanced: true,
        },
        {
          text: "Implemented CI/CD pipeline with automated testing for payment flows, reducing deployment time by 60% while maintaining PCI compliance",
          enhanced: true,
        },
        {
          text: "Collaborated with product and compliance teams on payment feature specifications",
          enhanced: false,
        },
      ],
    },
  ],
  skills: [
    { name: "React", status: "matched" },
    { name: "TypeScript", status: "matched" },
    { name: "Node.js", status: "matched" },
    { name: "PostgreSQL", status: "matched" },
    { name: "AWS", status: "matched" },
    { name: "Docker", status: "default" },
    { name: "GraphQL", status: "matched" },
    { name: "Python", status: "default" },
    { name: "Payment Systems", status: "added" },
    { name: "Financial APIs", status: "added" },
    { name: "PCI Compliance", status: "added" },
  ],
};

export const KEYWORDS: Keyword[] = [
  { text: "payments", found: true },
  { text: "TypeScript", found: true },
  { text: "React", found: true },
  { text: "API design", found: true },
  { text: "scalability", found: true },
  { text: "financial", found: true },
  { text: "compliance", found: true },
  { text: "distributed systems", found: false },
  { text: "high availability", found: true },
  { text: "Ruby", found: false },
];

export const SOCIAL_PROOF = {
  cvsTailored: "12,847",
  avgMatchScore: "89%",
  subscriptions: "0",
};

export const TRUSTED_COMPANIES = [
  "Stripe",
  "Vercel",
  "Shopify",
  "Linear",
  "Supabase",
  "Figma",
];

export const CV_CHANGES: string[] = [
  "Summary rewritten to emphasize payments and fintech experience",
  "Payment processing bullet enhanced with metrics and Stripe-relevant keywords",
  "Added \"payment systems\" and \"financial APIs\" to skills",
  "Reordered experience bullets to lead with most relevant achievements",
];

export const EXTRACTED_JOB: ExtractedJob = {
  company: "Stripe",
  position: "Software Engineer, Payments",
  location: "San Francisco / Remote",
  salaryRange: "$180,000 - $220,000",
  requirements: [
    { text: "TypeScript", type: "required" },
    { text: "Payment Systems", type: "required" },
    { text: "API Design", type: "required" },
    { text: "React", type: "required" },
    { text: "Distributed Systems", type: "required" },
    { text: "5+ years", type: "required" },
    { text: "Ruby", type: "nice-to-have" },
  ],
};

export const BOARD_COLUMNS: BoardColumn[] = [
  { id: "saved", name: "Saved" },
  { id: "applied", name: "Applied" },
  { id: "phone-screen", name: "Phone Screen" },
  { id: "interview", name: "Interview" },
  { id: "offer", name: "Offer" },
  { id: "rejected", name: "Rejected" },
  { id: "accepted", name: "Accepted" },
];

export const BOARD_CARDS: Record<string, ApplicationCard[]> = {
  saved: [
    { id: "1", company: "Vercel", title: "Senior Frontend Engineer", matchScore: 92, location: "Remote", date: "Saved 2 days ago" },
    { id: "2", company: "Linear", title: "Full Stack Engineer", matchScore: 87, location: "Remote", date: "Saved 3 days ago" },
    { id: "3", company: "Notion", title: "Product Engineer", matchScore: 71, salary: "$160-190k", date: "Saved 5 days ago" },
  ],
  applied: [
    { id: "4", company: "Stripe", title: "Software Engineer, Payments", matchScore: 89, salary: "$180-220k", date: "Applied Mar 18", followUp: "Follow up tomorrow" },
    { id: "5", company: "Supabase", title: "Backend Engineer", matchScore: 85, location: "Remote", date: "Applied Mar 20" },
    { id: "6", company: "Figma", title: "Frontend Developer", matchScore: 76, date: "Applied Mar 15", followUp: "Follow up overdue" },
  ],
  "phone-screen": [
    { id: "7", company: "Shopify", title: "Senior Developer", matchScore: 91, location: "Remote", date: "Screen on Mar 24" },
    { id: "8", company: "Planetscale", title: "Software Engineer", matchScore: 83, date: "Screen completed Mar 19" },
  ],
  interview: [
    { id: "9", company: "Resend", title: "Full Stack Engineer", matchScore: 88, salary: "$150-180k", date: "Technical round Mar 25" },
  ],
  offer: [
    { id: "10", company: "Railway", title: "Platform Engineer", matchScore: 0, salary: "$165k + equity", location: "Remote", date: "Offer received Mar 20" },
  ],
  rejected: [
    { id: "11", company: "Netflix", title: "Senior SWE", matchScore: 54, date: "Rejected Mar 17" },
    { id: "12", company: "Meta", title: "Production Engineer", matchScore: 62, date: "Rejected Mar 14" },
  ],
  accepted: [],
};

export const COLUMN_ACCENTS: Record<string, string> = {
  saved: "transparent",
  applied: "#3b82f6",
  "phone-screen": "#10b981",
  interview: "#10b981",
  offer: "#f59e0b",
  rejected: "#ef4444",
  accepted: "#10b981",
};
