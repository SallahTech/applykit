"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import type { TailorResult } from "@/lib/supabase/db-types"

interface ProcessingViewProps {
  jobDescription: string
  onComplete: (result: TailorResult) => void
  onError: () => void
}

export function ProcessingView({ jobDescription, onComplete, onError }: ProcessingViewProps) {
  const [statusText, setStatusText] = useState("Analyzing job requirements...")

  useEffect(() => {
    const t1 = setTimeout(() => setStatusText("Tailoring your CV..."), 3000)
    const t2 = setTimeout(() => setStatusText("Almost done..."), 8000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function tailor() {
      try {
        const res = await fetch("/api/tailor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_description: jobDescription }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Tailoring failed")
        }
        const result = await res.json()
        if (!cancelled) onComplete(result)
      } catch (err: any) {
        if (!cancelled) {
          toast.error(err.message || "Failed to tailor CV. Please try again.")
          onError()
        }
      }
    }
    tailor()
    return () => { cancelled = true }
  }, [jobDescription, onComplete, onError])

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh]"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 className="animate-spin w-10 h-10 text-blue-400 mb-4" />

      <p className="text-lg text-foreground/80 mb-2">
        {statusText}
      </p>

      <p className="text-sm text-muted-foreground">
        Analyzing job requirements and optimizing your experience...
      </p>

      <div className="w-64 h-2 bg-muted rounded-full mt-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "90%" }}
          transition={{ duration: 15, ease: "easeOut" }}
        />
      </div>

      <span className="sr-only" aria-live="polite">
        {statusText}
      </span>
    </motion.div>
  )
}
