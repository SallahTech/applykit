"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AppNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass =
    "text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled ? "bg-background/80 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <span className="text-lg font-semibold">
            <span className="text-foreground">Apply</span>
            <span className="text-[#3b82f6]">Kit</span>
          </span>
        </Link>

        {/* Center nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/board"
            className={`text-sm transition-colors cursor-pointer ${
              pathname === "/board"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Board
          </Link>

          <Link
            href="/tailor"
            className={`text-sm transition-colors cursor-pointer ${
              pathname === "/tailor"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            CV Manager
          </Link>

          <Link
            href="/settings"
            className={`text-sm transition-colors cursor-pointer ${
              pathname === "/settings"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Settings
          </Link>
        </div>

        {/* Right buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground bg-transparent"
            onClick={() => toast("Coming soon!")}
          >
            Import Jobs
          </Button>

          <Link href="/tailor">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition border-0">
              + New Application
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-card border-border p-6"
            >
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/board"
                  onClick={() => setOpen(false)}
                  className={`text-sm transition-colors cursor-pointer py-2 ${
                    pathname === "/board"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Board
                </Link>

                <Link
                  href="/tailor"
                  onClick={() => setOpen(false)}
                  className={`text-sm transition-colors cursor-pointer py-2 ${
                    pathname === "/tailor"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  CV Manager
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className={`text-sm transition-colors cursor-pointer py-2 ${
                    pathname === "/settings"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Settings
                </Link>
              </nav>

              <div className="border-t border-border my-4" />

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full border-border text-muted-foreground hover:bg-muted hover:text-foreground bg-transparent"
                  onClick={() => {
                    setOpen(false);
                    toast("Coming soon!");
                  }}
                >
                  Import Jobs
                </Button>

                <Link href="/tailor" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition border-0">
                    + New Application
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
