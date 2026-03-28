"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface ProcessingViewProps {
  onComplete: () => void
}

export function ProcessingView({ onComplete }: ProcessingViewProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [onComplete])

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
        Tailoring your CV for Stripe...
      </p>

      <p className="text-sm text-muted-foreground">
        Analyzing job requirements and optimizing your experience...
      </p>

      <div className="w-64 h-2 bg-muted rounded-full mt-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>

      <span className="sr-only" aria-live="polite">
        Tailoring your CV...
      </span>
    </motion.div>
  )
}
