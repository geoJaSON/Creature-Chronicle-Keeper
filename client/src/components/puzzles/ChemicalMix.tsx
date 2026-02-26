import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, FlaskConical } from "lucide-react";
import type { ChemicalMixData } from "@shared/schema";

interface Props {
  data: ChemicalMixData;
  onComplete: (success: boolean) => void;
}

export function ChemicalMix({ data, onComplete }: Props) {
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [flashWrong, setFlashWrong] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleBottleClick = (chemId: string) => {
    if (success !== null || flashWrong) return;

    const nextIndex = playerSequence.length;
    if (chemId !== data.targetSequence[nextIndex]) {
      setFlashWrong(true);
      setTimeout(() => {
        setFlashWrong(false);
        setPlayerSequence([]);
      }, 600);
      return;
    }

    const newSeq = [...playerSequence, chemId];
    setPlayerSequence(newSeq);

    if (newSeq.length === data.targetSequence.length) {
      setSuccess(true);
    }
  };

  const handleRetry = () => {
    setPlayerSequence([]);
    setSuccess(null);
    setFlashWrong(false);
  };

  return (
    <div className="space-y-5">
      <div className="text-center text-sm text-muted-foreground">
        Mix chemicals in the correct order to create the formula
      </div>

      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
          Target Formula
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          {data.targetSequence.map((chemId, i) => {
            const chem = data.chemicals.find((c) => c.id === chemId);
            const filled = i < playerSequence.length;
            return (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                  filled
                    ? "border-primary"
                    : "border-border/50"
                }`}
                style={filled && chem ? { backgroundColor: chem.color } : undefined}
                data-testid={`formula-slot-${i}`}
              >
                {!filled && (
                  <span className="text-muted-foreground text-xs">{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {data.chemicals.map((chem) => (
          <motion.button
            key={chem.id}
            whileTap={{ scale: 0.9 }}
            animate={flashWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={flashWrong ? { duration: 0.4 } : {}}
            onClick={() => handleBottleClick(chem.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors select-none ${
              flashWrong
                ? "border-destructive bg-destructive/10"
                : success !== null
                ? "border-border/50 bg-muted/50 text-muted-foreground"
                : "border-border bg-card cursor-pointer"
            }`}
            data-testid={`chemical-bottle-${chem.id}`}
          >
            <div
              className="w-10 h-14 rounded-md border border-border/50 flex items-center justify-center"
              style={{ backgroundColor: chem.color }}
            >
              <FlaskConical className="w-5 h-5 text-white/80" />
            </div>
            <span className="text-xs font-medium">{chem.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="text-center text-xs text-muted-foreground">
        {playerSequence.length}/{data.targetSequence.length} chemicals mixed
      </div>

      <AnimatePresence>
        {success !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Formula complete!</span>
            </div>
            <Button size="sm" onClick={() => onComplete(true)} data-testid="button-chemical-continue">
              Claim reward
            </Button>
          </motion.div>
        )}

        {flashWrong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">Wrong chemical! Resetting...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!success && !flashWrong && playerSequence.length > 0 && (
        <div className="flex justify-center">
          <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-chemical">
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
        </div>
      )}
    </div>
  );
}
