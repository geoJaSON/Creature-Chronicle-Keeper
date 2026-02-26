import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import type { RiddleData } from "@shared/schema";

interface Props {
  data: RiddleData;
  onComplete: (success: boolean) => void;
}

export function RiddleChallenge({ data, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === data.correctIndex;

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
  };

  const handleRetry = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-muted/50 border border-border rounded-xl p-5 relative">
        <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Riddle
        </div>
        <p className="text-sm text-foreground leading-relaxed italic">
          "{data.question}"
        </p>
        <p className="text-xs text-muted-foreground mt-3">{data.flavor}</p>
      </div>

      <div className="space-y-2">
        {data.options.map((option, i) => {
          let borderClass = "border-border";
          let bgClass = "bg-card";
          if (revealed && i === data.correctIndex) {
            borderClass = "border-primary";
            bgClass = "bg-primary/10";
          } else if (revealed && i === selected && !isCorrect) {
            borderClass = "border-destructive";
            bgClass = "bg-destructive/10";
          }

          return (
            <motion.button
              key={i}
              whileTap={!revealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`w-full text-left p-4 rounded-lg border-2 ${borderClass} ${bgClass} transition-colors ${
                !revealed ? "cursor-pointer" : ""
              }`}
              data-testid={`riddle-option-${i}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  revealed && i === data.correctIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : revealed && i === selected && !isCorrect
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : "border-border text-muted-foreground"
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Correct!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Not quite...</span>
                </div>
                <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-riddle">
                  <RotateCcw className="w-3 h-3 mr-1" /> Try Again
                </Button>
              </div>
            )}
            {isCorrect && (
              <Button size="sm" onClick={() => onComplete(true)} data-testid="button-riddle-continue">
                Claim reward
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
