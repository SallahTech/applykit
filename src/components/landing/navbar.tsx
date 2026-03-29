"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsSignedIn(!!session?.user);
      } catch {}
    }
    checkAuth();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <span className="text-lg font-semibold">
            <span className="text-white">Apply</span>
            <span className="text-[#3b82f6]">Kit</span>
          </span>
        </a>

        {/* Center nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition scroll-smooth"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <Link href="/board">
              <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-slate-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition">
                  Get Started Free
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:bg-slate-800 transition-colors" aria-label="Open menu">
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-900 border-slate-800 p-6">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-slate-400 hover:text-white transition scroll-smooth py-2"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="border-t border-slate-700 my-4" />

              <div className="flex flex-col gap-3">
                {isSignedIn ? (
                  <Link href="/board" onClick={() => setOpen(false)}>
                    <button className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition">
                      Go to Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full text-slate-300 justify-center"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setOpen(false)}>
                      <button className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition">
                        Get Started Free
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
