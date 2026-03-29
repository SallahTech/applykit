"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    setError(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        router.push("/board");
        router.refresh();
      } else {
        setConfirmEmail(true);
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start tailoring your CV in seconds</p>

          {confirmEmail ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground mb-4">
                We sent a confirmation link to <strong className="text-foreground">{email}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Didn&apos;t get it?{" "}
                <button
                  onClick={() => supabase.auth.resend({ type: "signup", email })}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Resend
                </button>
              </p>
            </div>
          ) : (
            <>
              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                  <Input id="name" placeholder="Alex Chen" className="bg-muted/40 border-border text-foreground h-11 rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                  <Input id="email" type="email" placeholder="alex@email.com" className="bg-muted/40 border-border text-foreground h-11 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="password" className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
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
              </div>

              {/* Submit */}
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-11 font-semibold mt-6 rounded-xl shadow-lg shadow-blue-500/20"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>

              {error && <p className="text-sm text-red-400 mt-3 text-center" aria-live="polite">{error}</p>}
            </>
          )}
        </div>

        {/* Footer link */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
