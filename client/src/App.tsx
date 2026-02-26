import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useGameState, getDebugAPI, GameStateProvider } from "@/lib/gameState";
import GamePage from "@/pages/GamePage";
import JournalPage from "@/pages/JournalPage";
import BasePage from "@/pages/BasePage";
import CipherPage from "@/pages/CipherPage";
import NotFound from "@/pages/not-found";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setDark(!dark)}
      data-testid="button-theme-toggle"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={GamePage} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/base" component={BasePage} />
      <Route path="/cipher" component={CipherPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const { state } = useGameState();

  useEffect(() => {
    (window as unknown as { CCK_DEBUG?: ReturnType<typeof getDebugAPI> }).CCK_DEBUG = getDebugAPI();
    if (import.meta.env.DEV) {
      console.log("CCK_DEBUG ready. Type CCK_DEBUG.help() for commands.");
    }
    return () => {
      delete (window as unknown as { CCK_DEBUG?: unknown }).CCK_DEBUG;
    };
  }, []);

  const sidebarStyle = {
    "--sidebar-width": "17rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar
          journalCount={state.journal.length}
          solvedCount={state.solvedCiphers.length}
          symbolCount={state.discoveredSymbols?.length || 0}
          loreCount={state.collectedLore?.length || 0}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between px-3 py-2 border-b border-border bg-background flex-shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {state.totalEncounters} encounter{state.totalEncounters !== 1 ? "s" : ""}
              </span>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameStateProvider>
          <AppShell />
        </GameStateProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
