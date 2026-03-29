"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, LogOut, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
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
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabaseClient = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabaseClient.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "?";

  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            href="/analytics"
            className={`text-sm transition-colors cursor-pointer ${
              pathname === "/analytics"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Analytics
          </Link>

          <Link
            href="/cv-manager"
            className={`text-sm transition-colors cursor-pointer ${
              pathname === "/cv-manager"
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
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted"
                onClick={() => toast("Coming soon!")}
              >
                Import Jobs
              </Button>
              <Link href="/tailor">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  + New Application
                </Button>
              </Link>
              <div className="ml-2 pl-2 border-l border-border relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen((prev) => !prev)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                  {userInitial}
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl shadow-black/20 py-1 z-50">
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-medium text-foreground">
                        {user?.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="h-px bg-border my-1" />
                    <Link href="/analytics" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </Link>
                    <Link href="/settings" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => { setAvatarOpen(false); handleSignOut(); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-muted/50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
          )}
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
                  href="/analytics"
                  onClick={() => setOpen(false)}
                  className={`text-sm transition-colors cursor-pointer py-2 ${
                    pathname === "/analytics"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Analytics
                </Link>

                <Link
                  href="/cv-manager"
                  onClick={() => setOpen(false)}
                  className={`text-sm transition-colors cursor-pointer py-2 ${
                    pathname === "/cv-manager"
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

              {user ? (
                <>
                  <div className="border-t border-border my-2 pt-2">
                    <button
                      onClick={() => { handleSignOut(); setOpen(false); }}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-muted/50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full text-muted-foreground justify-center">
                    Sign In
                  </Button>
                </Link>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
