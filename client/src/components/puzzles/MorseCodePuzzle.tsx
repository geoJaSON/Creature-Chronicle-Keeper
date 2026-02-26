import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Eye, RotateCcw } from "lucide-react";
import type { MorseCodeData } from "@shared/schema";

interface Props {
  data: MorseCodeData;
  onComplete: (success: boolean) => void;
}

type Frame = {
  on: boolean;
  duration: number;
  letterIndex: number | null;
};

const MORSE_CODE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
};

export function MorseCodePuzzle({ data, onComplete }: Props) {
  const cleanedWord = data.word.trim().toUpperCase();

  const frames: Frame[] = useMemo(() => {
    const DOT = 250;
    const DASH = DOT * 3;
    const SYMBOL_GAP = DOT;
    const LETTER_GAP = DOT * 3;
    const LOOP_GAP = DOT * 7;

    const result: Frame[] = [];

    cleanedWord.split("").forEach((ch, letterIndex) => {
      const pattern = MORSE_CODE[ch];
      if (!pattern) return;
      const symbols = pattern.split("");
      symbols.forEach((symbol, symbolIndex) => {
        const onDuration = symbol === "." ? DOT : DASH;
        result.push({
          on: true,
          duration: onDuration,
          letterIndex,
        });

        const isLastSymbolInLetter = symbolIndex === symbols.length - 1;
        const gapDuration = isLastSymbolInLetter ? LETTER_GAP : SYMBOL_GAP;
        result.push({
          on: false,
          duration: gapDuration,
          letterIndex,
        });
      });
    });

    if (result.length === 0) {
      result.push({
        on: false,
        duration: LOOP_GAP,
        letterIndex: null,
      });
    } else {
      result.push({
        on: false,
        duration: LOOP_GAP,
        letterIndex: null,
      });
    }

    return result;
  }, [cleanedWord]);

  const [frameIndex, setFrameIndex] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    if (frames.length === 0) return;

    const frame = frames[frameIndex];
    setIsOn(frame.on);
    setCurrentLetterIndex(frame.letterIndex);

    const timeout = setTimeout(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, frame.duration);

    return () => clearTimeout(timeout);
  }, [frameIndex, frames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = guess.trim().toUpperCase();
    if (!value) return;
    if (value === cleanedWord) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  const handleRetry = () => {
    setGuess("");
    setStatus("idle");
  };

  const referenceEntries = useMemo(
    () => Object.entries(MORSE_CODE).sort(([a], [b]) => a.localeCompare(b)),
    [],
  );

  const currentLetterNumber =
    currentLetterIndex !== null && currentLetterIndex >= 0
      ? currentLetterIndex + 1
      : null;

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>Watch the flashing crystal. It repeats the same word in code.</span>
        </div>
        {cleanedWord.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Word length: <span className="font-semibold">{cleanedWord.length} letters</span>
            {currentLetterNumber && (
              <span className="ml-2">
                (Currently flashing letter {currentLetterNumber})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <motion.div
          animate={
            isOn
              ? { scale: 1.1, boxShadow: "0 0 40px rgba(251, 191, 36, 0.7)" }
              : { scale: 1, boxShadow: "0 0 10px rgba(148, 163, 184, 0.4)" }
          }
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
            isOn
              ? "bg-amber-400/90 border-amber-300"
              : "bg-slate-800 border-slate-500"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full ${
              isOn ? "bg-white/90" : "bg-slate-600"
            }`}
          />
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Morse Reference
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {referenceEntries.map(([letter, code]) => (
            <div
              key={letter}
              className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-2 py-1"
            >
              <span className="font-semibold">{letter}</span>
              <span className="font-mono">{code}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            Type the word the cave is flashing:
          </div>
          <Input
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Enter word"
            className="uppercase tracking-widest"
            autoComplete="off"
          />
        </div>
        <div className="flex justify-center gap-2">
          <Button type="submit" size="sm" data-testid="button-submit-morse">
            Decode
          </Button>
          {guess && status === "idle" && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleRetry}
              data-testid="button-reset-morse"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {status === "wrong" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="text-center text-sm text-destructive flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Not quite. Watch the pattern again and try a different word.</span>
          </motion.div>
        )}

        {status === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">You cracked the code!</span>
            </div>
            <Button
              size="sm"
              onClick={() => onComplete(true)}
              data-testid="button-morse-continue"
            >
              Claim reward
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

