import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Anchor } from "lucide-react";
import type { TideTimingData } from "@shared/schema";

interface Props {
  data: TideTimingData;
  onComplete: (success: boolean) => void;
}

export function TideTiming({ data, onComplete }: Props) {
  const [tideLevel, setTideLevel] = useState(0);
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(false);
  const [done, setDone] = useState(false);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (done) return;
    let running = true;
    const animate = () => {
      if (!running) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const level = (Math.sin(elapsed * data.speed) + 1) / 2;
      setTideLevel(level);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [data.speed, done]);

  const targetNormalized = data.targetLevel / 100;
  const toleranceNormalized = data.tolerance / 100;

  const handleCast = () => {
    if (done || miss) return;

    const distance = Math.abs(tideLevel - targetNormalized);
    if (distance <= toleranceNormalized) {
      const newHits = hits + 1;
      setHits(newHits);
      if (newHits >= data.rounds) {
        setDone(true);
      }
    } else {
      setMiss(true);
      setTimeout(() => setMiss(false), 500);
    }
  };

  const barHeight = 200;
  const targetTop = (1 - targetNormalized - toleranceNormalized) * barHeight;
  const targetHeight = toleranceNormalized * 2 * barHeight;
  const waterTop = (1 - tideLevel) * barHeight;

  return (
    <div className="space-y-5">
      <div className="text-center text-sm text-muted-foreground">
        Click "Cast" when the tide reaches the target zone
      </div>

      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-1">
          Catches: {hits}/{data.rounds}
        </div>
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: data.rounds }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < hits ? "bg-primary" : "bg-muted border border-border"
              }`}
              data-testid={`tide-dot-${i}`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative border-2 border-border rounded-xl overflow-hidden bg-muted/30" style={{ width: 80, height: barHeight }}>
          <div
            className="absolute left-0 right-0 bg-primary/20 border-y border-primary/40"
            style={{ top: targetTop, height: targetHeight }}
            data-testid="tide-target-zone"
          />
          <motion.div
            className="absolute left-0 right-0 bottom-0 bg-sky-500/60 dark:bg-sky-600/60"
            animate={miss ? { x: [0, -3, 3, -3, 3, 0] } : {}}
            transition={miss ? { duration: 0.3 } : {}}
            style={{ top: waterTop }}
            data-testid="tide-water-level"
          />
          <div
            className="absolute left-0 right-0 h-0.5 bg-foreground/60"
            style={{ top: waterTop }}
          />
        </div>
      </div>

      {!done && (
        <div className="flex justify-center">
          <Button onClick={handleCast} data-testid="button-tide-cast">
            <Anchor className="w-4 h-4 mr-1" /> Cast
          </Button>
        </div>
      )}

      <AnimatePresence>
        {miss && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-destructive">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Missed! Try again...</span>
            </div>
          </motion.div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">All catches landed!</span>
            </div>
            <Button size="sm" onClick={() => onComplete(true)} data-testid="button-tide-continue">
              Claim reward
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
