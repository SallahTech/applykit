"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Supabase handles the token exchange automatically via the URL hash
  // when the user clicks the reset link in their email
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User arrived via password reset link — form is ready
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function handleSubmit() {
    setError(null);

    if (!password.trim()) {
      setError("Please enter a new password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/board"), 2000);
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
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Password updated</h1>
              <p className="text-sm text-muted-foreground">
                Your password has been reset. Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-1">Set new password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Choose a strong password for your account.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-muted/40 border-border text-foreground h-11 rounded-lg pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Confirm Password
                  </label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-muted/40 border-border text-foreground h-11 rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-11 font-semibold mt-6 rounded-xl shadow-lg shadow-blue-500/20"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </Button>

              {error && <p className="text-sm text-red-400 mt-3 text-center" aria-live="polite">{error}</p>}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
