"use client";

import { createContext, useContext, useEffect, useState } from "react";

type BoardView = "kanban" | "list";

interface PreferencesContextType {
  boardView: BoardView;
  setBoardView: (view: BoardView) => void;
}

const PreferencesContext = createContext<PreferencesContextType>({
  boardView: "kanban",
  setBoardView: () => {},
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [boardView, setBoardView] = useState<BoardView>("kanban");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("applykit-board-view") as BoardView | null;
    if (stored) setBoardView(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("applykit-board-view", boardView);
  }, [boardView, mounted]);

  return (
    <PreferencesContext.Provider value={{ boardView, setBoardView }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
