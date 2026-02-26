import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, Volume2 } from "lucide-react";
import type { EchoSequenceData } from "@shared/schema";

interface Props {
  data: EchoSequenceData;
  onComplete: (success: boolean) => void;
}

type Phase = "watching" | "input" | "correct" | "wrong" | "done";

export function EchoSequence({ data, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("watching");
  const [currentRound, setCurrentRound] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const currentSequenceLength = Math.min(3 + currentRound, data.sequence.length);
  const currentSequence = data.sequence.slice(0, currentSequenceLength);

  const playSequence = useCallback(() => {
    setPhase("watching");
    setPlayerInput([]);
    let step = 0;
    const interval = setInterval(() => {
      if (step < currentSequence.length) {
        setActiveIndex(currentSequence[step]);
        setTimeout(() => setActiveIndex(null), 500);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("input"), 400);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [currentRound, currentSequence]);

  useEffect(() => {
    const cleanup = playSequence();
    return cleanup;
  }, [playSequence]);

  const handleClick = (index: number) => {
    if (phase !== "input") return;

    const newInput = [...playerInput, index];
    setPlayerInput(newInput);
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 250);

    const step = newInput.length - 1;
    if (newInput[step] !== currentSequence[step]) {
      setPhase("wrong");
      return;
    }

    if (newInput.length === currentSequence.length) {
      const nextRound = roundsCompleted + 1;
      setRoundsCompleted(nextRound);

      if (nextRound >= data.rounds) {
        setPhase("done");
      } else {
        setPhase("correct");
        setTimeout(() => {
          setCurrentRound((r) => r + 1);
        }, 1000);
      }
    }
  };

  const handleRetry = () => {
    setCurrentRound(0);
    setRoundsCompleted(0);
    setPlayerInput([]);
  };

  const COLORS = [
    "bg-blue-500 dark:bg-blue-600",
    "bg-emerald-500 dark:bg-emerald-600",
    "bg-amber-500 dark:bg-amber-600",
    "bg-rose-500 dark:bg-rose-600",
    "bg-purple-500 dark:bg-purple-600",
    "bg-cyan-500 dark:bg-cyan-600",
  ];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-1">
          Round {Math.min(roundsCompleted + 1, data.rounds)} of {data.rounds}
        </div>
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: data.rounds }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < roundsCompleted ? "bg-primary" : "bg-muted border border-border"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "watching" && (
          <motion.div
            key="watching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen to the echo... ({currentSequence.length} tones)</span>
          </motion.div>
        )}
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-primary font-semibold"
          >
            Repeat the pattern! ({playerInput.length}/{currentSequence.length})
          </motion.div>
        )}
        {phase === "correct" && (
          <motion.div
            key="correct"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-primary font-semibold flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-4 h-4" /> Round complete! Next one is longer...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-3 flex-wrap">
        {data.symbols.slice(0, Math.max(4, currentSequenceLength + 1)).map((symbol, i) => {
          const isActive = activeIndex === i;
          const colorClass = COLORS[i % COLORS.length];
          const isClickable = phase === "input";

          return (
            <motion.button
              key={i}
              whileTap={isClickable ? { scale: 0.85 } : {}}
              animate={
                isActive
                  ? { scale: 1.15 }
                  : { scale: 1 }
              }
              onClick={() => isClickable && handleClick(i)}
              className={`w-16 h-16 rounded-xl text-xl flex items-center justify-center border-2 select-none transition-all ${
                isActive
                  ? `${colorClass} text-white border-transparent shadow-lg`
                  : isClickable
                  ? "bg-card border-border cursor-pointer text-foreground"
                  : "bg-muted/50 border-border/50 text-muted-foreground"
              }`}
              data-testid={`echo-symbol-${i}`}
            >
              {symbol}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {phase === "wrong" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">Wrong echo!</span>
            </div>
            <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-echo">
              <RotateCcw className="w-3 h-3 mr-1" /> Start Over
            </Button>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Echo mastered!</span>
            </div>
            <Button size="sm" onClick={() => onComplete(true)} data-testid="button-echo-continue">
              Claim reward
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
