"use client";

import Link from "next/link";
import { toast } from "sonner";
import { KanbanSquare, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/app-navbar";
import { KanbanBoard } from "@/components/board/kanban-board";
import { BoardListView } from "@/components/board/board-list-view";
import { usePreferences } from "@/components/preferences-provider";

export default function BoardPage() {
  const { boardView, setBoardView } = usePreferences();

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-background">
        {/* Board Header */}
        <div className="bg-card border-b border-border px-4 py-3 pt-[4.5rem]">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-foreground">Application Board</h1>
            <div className="flex items-center gap-3">
              <div className="flex bg-muted/60 rounded-lg p-0.5">
                <button
                  onClick={() => setBoardView("kanban")}
                  className={`p-1.5 rounded-md transition-colors ${boardView === "kanban" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="Kanban view"
                >
                  <KanbanSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setBoardView("list")}
                  className={`p-1.5 rounded-md transition-colors ${boardView === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted"
                onClick={() => toast("Coming soon!")}
              >
                Import Jobs
              </Button>
              <Link href="/tailor">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  + New Application
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Board */}
        {boardView === "kanban" ? <KanbanBoard /> : <BoardListView />}
      </main>
    </>
  );
}
