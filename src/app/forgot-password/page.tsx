"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit() {
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-foreground">Apply</span>
            <span className="text-blue-400">Kit</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Tailor your CV. Track your application. Land the job.
        </p>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl shadow-black/10">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
              <p className="text-sm text-muted-foreground mb-6">
                We sent a password reset link to <span className="text-foreground font-medium">{email}</span>. Click the link in the email to set a new password.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-1">Reset password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the email address associated with your account and we&apos;ll send you a reset link.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@email.com"
                    className="bg-muted/40 border-border text-foreground h-11 rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-11 font-semibold mt-6 rounded-xl shadow-lg shadow-blue-500/20"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
              </Button>

              {error && <p className="text-sm text-red-400 mt-3 text-center" aria-live="polite">{error}</p>}
            </>
          )}
        </div>

        {/* Footer link */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
