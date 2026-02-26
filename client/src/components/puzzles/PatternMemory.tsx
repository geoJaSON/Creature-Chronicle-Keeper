import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, RotateCcw } from "lucide-react";
import type { PatternMemoryData } from "@shared/schema";

interface Props {
  data: PatternMemoryData;
  onComplete: (success: boolean) => void;
}

type Phase = "watching" | "ready" | "input" | "result";

export function PatternMemory({ data, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("watching");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showStep, setShowStep] = useState(0);
  const [success, setSuccess] = useState<boolean | null>(null);

  const startWatching = useCallback(() => {
    setPhase("watching");
    setShowStep(0);
    setPlayerSequence([]);
    setSuccess(null);

    let step = 0;
    const interval = setInterval(() => {
      if (step < data.sequence.length) {
        setActiveIndex(data.sequence[step]);
        setShowStep(step + 1);
        setTimeout(() => setActiveIndex(null), 600);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("ready"), 400);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [data.sequence]);

  useEffect(() => {
    const cleanup = startWatching();
    return cleanup;
  }, [startWatching]);

  const handleSymbolClick = (index: number) => {
    if (phase !== "input" && phase !== "ready") return;
    if (phase === "ready") setPhase("input");

    const newSequence = [...playerSequence, index];
    setPlayerSequence(newSequence);
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 300);

    const currentStep = newSequence.length - 1;
    if (newSequence[currentStep] !== data.sequence[currentStep]) {
      setSuccess(false);
      setPhase("result");
      return;
    }

    if (newSequence.length === data.sequence.length) {
      setSuccess(true);
      setPhase("result");
    }
  };

  const handleRetry = () => {
    startWatching();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <AnimatePresence mode="wait">
          {phase === "watching" && (
            <motion.div
              key="watching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Eye className="w-4 h-4" />
              <span>Watch the pattern... ({showStep}/{data.sequence.length})</span>
            </motion.div>
          )}
          {phase === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-semibold text-primary"
            >
              Your turn! Repeat the pattern.
            </motion.div>
          )}
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              {playerSequence.length}/{data.sequence.length} symbols entered
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {data.symbols.map((symbol, i) => {
          const isActive = activeIndex === i;
          const isClickable = phase === "ready" || phase === "input";
          return (
            <motion.button
              key={i}
              whileTap={isClickable ? { scale: 0.9 } : {}}
              animate={isActive ? { scale: 1.2, boxShadow: "0 0 20px rgba(var(--primary-rgb, 59 130 246), 0.5)" } : { scale: 1 }}
              onClick={() => isClickable && handleSymbolClick(i)}
              className={`w-14 h-14 rounded-xl text-2xl flex items-center justify-center border-2 transition-colors select-none ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : isClickable
                  ? "bg-card border-border cursor-pointer"
                  : "bg-muted/50 border-border/50 text-muted-foreground"
              }`}
              data-testid={`pattern-symbol-${i}`}
            >
              {symbol}
            </motion.button>
          );
        })}
      </div>

      {phase === "ready" && (
        <div className="flex justify-center gap-2">
          {data.sequence.map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-muted border border-border" />
          ))}
        </div>
      )}

      {phase === "input" && (
        <div className="flex justify-center gap-2">
          {data.sequence.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border ${
                i < playerSequence.length
                  ? "bg-primary border-primary"
                  : "bg-muted border-border"
              }`}
            />
          ))}
        </div>
      )}

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
                <span className="font-semibold">Pattern matched!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Wrong pattern</span>
                </div>
                <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-pattern">
                  <RotateCcw className="w-3 h-3 mr-1" /> Try Again
                </Button>
              </div>
            )}
            {success && (
              <Button size="sm" onClick={() => onComplete(true)} data-testid="button-pattern-continue">
                Claim reward
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
