import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, HelpCircle } from "lucide-react";
import type { SymbolCipherData } from "@shared/schema";
import { SYMBOL_ALPHABET } from "@/lib/explorationData";

interface Props {
  data: SymbolCipherData;
  discoveredSymbols: string[];
  onComplete: (success: boolean) => void;
}

export function SymbolCipher({ data, discoveredSymbols, onComplete }: Props) {
  const answer = data.answer.toUpperCase();
  const [guesses, setGuesses] = useState<(string | null)[]>(Array(answer.length).fill(null));
  const [activeSlot, setActiveSlot] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);

  const symbolsForWord = answer.split("").map((letter) => SYMBOL_ALPHABET[letter] || "?");

  const isHinted = (index: number) => data.hintLetters.includes(index);
  const isKnown = (letter: string) => discoveredSymbols.includes(letter);

  const filledGuesses = guesses.map((g, i) => {
    if (isHinted(i)) return answer[i];
    return g;
  });

  const handleLetterClick = (letter: string) => {
    if (result !== null) return;
    let slot = activeSlot;
    while (slot < answer.length && isHinted(slot)) {
      slot++;
    }
    if (slot >= answer.length) return;

    const newGuesses = [...guesses];
    newGuesses[slot] = letter;
    setGuesses(newGuesses);

    let nextSlot = slot + 1;
    while (nextSlot < answer.length && isHinted(nextSlot)) {
      nextSlot++;
    }
    setActiveSlot(nextSlot);

    const filled = newGuesses.map((g, i) => isHinted(i) ? answer[i] : g);
    if (filled.every((g) => g !== null)) {
      const attempt = filled.join("");
      if (attempt === answer) {
        setResult(true);
      } else {
        setResult(false);
      }
    }
  };

  const handleReset = () => {
    setGuesses(Array(answer.length).fill(null));
    setActiveSlot(0);
    setResult(null);
  };

  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="space-y-5">
      <div className="text-center text-sm text-muted-foreground">
        Decode the symbols to reveal the hidden word
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {symbolsForWord.map((symbol, i) => {
          const letter = answer[i];
          const hinted = isHinted(i);
          const known = isKnown(letter);
          const filled = filledGuesses[i];
          const isActive = !hinted && activeSlot === i;

          return (
            <motion.div
              key={i}
              animate={isActive ? { borderColor: "hsl(var(--primary))" } : {}}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl select-none ${
                hinted
                  ? "bg-primary/10 border-primary/30"
                  : known
                  ? "bg-muted border-border"
                  : "bg-muted/50 border-border"
              }`}>
                {symbol}
              </div>
              <div className={`w-10 h-8 rounded-md border-2 flex items-center justify-center text-sm font-bold ${
                isActive
                  ? "border-primary bg-primary/5"
                  : filled
                  ? "border-border bg-card"
                  : "border-border/50 bg-muted/30"
              }`}>
                {hinted ? (
                  <span className="text-primary">{letter}</span>
                ) : filled ? (
                  <span>{filled}</span>
                ) : known ? (
                  <span className="text-xs text-muted-foreground">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>

      {result === null && (
        <div className="space-y-2">
          <div className="grid grid-cols-9 gap-1 max-w-xs mx-auto">
            {ALPHA.map((letter) => {
              const known = isKnown(letter);
              return (
                <motion.button
                  key={letter}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetterClick(letter)}
                  className={`w-8 h-8 rounded text-xs font-bold border transition-colors ${
                    known
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                  data-testid={`cipher-letter-${letter}`}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>
          {guesses.some((g) => g !== null) && (
            <div className="flex justify-center">
              <Button size="sm" variant="secondary" onClick={handleReset} data-testid="button-reset-cipher">
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            {result ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Decoded: {answer}!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">That's not right</span>
                </div>
                <Button size="sm" variant="secondary" onClick={handleReset} data-testid="button-retry-cipher">
                  <RotateCcw className="w-3 h-3 mr-1" /> Try Again
                </Button>
              </div>
            )}
            {result && (
              <Button size="sm" onClick={() => onComplete(true)} data-testid="button-cipher-continue">
                Claim reward
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
