import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, Eye } from "lucide-react";
import type { PixelMatchData } from "@shared/schema";
import { useGameState } from "@/lib/gameState";

interface Props {
  data: PixelMatchData;
  onComplete: (success: boolean) => void;
}

const PIXEL_COLORS = [
  "bg-transparent",
  "bg-primary",
  "bg-destructive",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-amber-500 dark:bg-amber-600",
  "bg-purple-500 dark:bg-purple-600",
  "bg-cyan-500 dark:bg-cyan-600",
];

type Phase = "showing" | "choosing" | "result";

export function PixelMatch({ data, onComplete }: Props) {
  const { hasUpgrade } = useGameState();
  const [phase, setPhase] = useState<Phase>("showing");
  const [selected, setSelected] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const startShowing = useCallback(() => {
    setPhase("showing");
    setSelected(null);
    setSuccess(null);
    const bonusTime = hasUpgrade("optic_augmentation") ? 3000 : 0;
    const timer = setTimeout(() => setPhase("choosing"), data.displayTime + bonusTime);
    return () => clearTimeout(timer);
  }, [data.displayTime, hasUpgrade]);

  useEffect(() => {
    const cleanup = startShowing();
    return cleanup;
  }, [startShowing]);

  const handleOptionClick = (index: number) => {
    if (phase !== "choosing" || selected !== null) return;
    setSelected(index);
    const isCorrect = index === data.correctIndex;
    setSuccess(isCorrect);
    setPhase("result");
  };

  const handleRetry = () => {
    startShowing();
  };

  const renderGrid = (grid: number[][], size: number, testIdPrefix: string) => {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    return (
      <div
        className="inline-grid gap-px border border-border rounded-md overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${size}px)`,
          gridTemplateRows: `repeat(${rows}, ${size}px)`,
        }}
        data-testid={testIdPrefix}
      >
        {grid.flatMap((row, ri) =>
          row.map((cell, ci) => (
            <div
              key={`${ri}-${ci}`}
              className={`${PIXEL_COLORS[cell] || "bg-muted"}`}
              style={{ width: size, height: size }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {phase === "showing" && (
          <motion.div
            key="showing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>Memorize this pattern...</span>
            </div>
            <div className="flex justify-center">
              {renderGrid(data.pattern, 16, "pixel-pattern-original")}
            </div>
          </motion.div>
        )}

        {(phase === "choosing" || phase === "result") && (
          <motion.div
            key="choosing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="text-center text-sm text-muted-foreground">
              Which pattern matches?
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {data.options.map((option, i) => {
                let borderClass = "border-border";
                if (phase === "result" && i === data.correctIndex) {
                  borderClass = "border-primary";
                } else if (phase === "result" && i === selected && !success) {
                  borderClass = "border-destructive";
                }

                return (
                  <motion.button
                    key={i}
                    whileTap={phase === "choosing" ? { scale: 0.95 } : {}}
                    onClick={() => handleOptionClick(i)}
                    className={`p-3 rounded-xl border-2 ${borderClass} transition-colors ${phase === "choosing" ? "cursor-pointer bg-card" : "bg-card"
                      }`}
                    data-testid={`pixel-option-${i}`}
                  >
                    {renderGrid(option, 12, `pixel-grid-option-${i}`)}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "result" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            {success ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Correct match!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Wrong pattern</span>
                </div>
                <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-pixel">
                  <RotateCcw className="w-3 h-3 mr-1" /> Try Again
                </Button>
              </div>
            )}
            {success && (
              <Button size="sm" onClick={() => onComplete(true)} data-testid="button-pixel-continue">
                Claim reward
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
