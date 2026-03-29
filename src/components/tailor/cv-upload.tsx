"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { BaseCVRecord } from "@/lib/supabase/db-types";

interface CVUploadProps {
  currentCV: BaseCVRecord | null;
  onCVReady: (cv: BaseCVRecord) => void;
}

export function CVUpload({ currentCV, onCVReady }: CVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are supported");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cv/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const { cv } = await res.json();
      onCVReady(cv);
      toast.success("CV uploaded and parsed!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <>
      {uploading && (
        <div className="border-2 border-dashed border-blue-500/50 rounded-xl p-6 text-center">
          <Loader2 className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-muted-foreground">Parsing your CV...</p>
        </div>
      )}

      {!uploading && currentCV && (
        <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-sm text-muted-foreground flex-1">
            Using base CV:{" "}
            <strong className="text-foreground font-medium">
              {currentCV.file_name || "resume.pdf"}
            </strong>
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {!currentCV && !uploading && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-blue-500 bg-blue-500/5"
              : "border-border hover:border-blue-500/50"
          }`}
          role="button"
          aria-label="Upload CV"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Upload your CV</p>
          <p className="text-xs text-muted-foreground mt-1">PDF or DOCX, max 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
}
