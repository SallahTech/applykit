import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Only PDF and DOCX files are accepted." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload file: " + uploadError.message },
        { status: 500 }
      );
    }

    // Get file URL (use signed URL for private buckets)
    const { data: urlData } = await supabase.storage
      .from("cvs")
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);

    const url = urlData?.signedUrl || "";

    // AI structuring — extract text and parse into structured data
    const provider = getAIProvider();
    let parsedData;
    if (file.type === "application/pdf") {
      // Send PDF directly to AI (GPT-4o can read PDFs via file input)
      parsedData = await provider.structureCVFromPDF(buffer);
    } else {
      // Extract text from DOCX first, then send to AI
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      parsedData = await provider.structureCV(result.value);
    }

    // Deactivate existing active CVs
    await supabase
      .from("base_cvs")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Insert new CV
    const { data: cv, error: insertError } = await supabase
      .from("base_cvs")
      .insert({
        user_id: user.id,
        file_url: url,
        file_name: file.name,
        parsed_data: parsedData,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save CV: " + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ cv }, { status: 201 });
  } catch (err) {
    console.error("CV upload error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
