import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Radio, Minus, Plus } from "lucide-react";
import type { FrequencyTuneData } from "@shared/schema";

interface Props {
  data: FrequencyTuneData;
  solvedCiphers?: string[];
  onComplete: (success: boolean, extraLore?: string[]) => void;
}

const WIDTH = 280;
const HEIGHT = 80;
const MID = HEIGHT / 2;
const MAX_AMP = MID - 6;

function gainToAmplitude(gain: number, minGain: number, maxGain: number): number {
  const range = maxGain - minGain;
  if (range <= 0) return MAX_AMP * 0.5;
  return ((gain - minGain) / range) * MAX_AMP;
}

function sinePath(
  frequency: number,
  gain: number,
  minFreq: number,
  maxFreq: number,
  minGain: number,
  maxGain: number
): string {
  const freqScale = 0.5 + (frequency / maxFreq) * 3;
  const amplitude = gainToAmplitude(gain, minGain, maxGain);
  const points: string[] = [];
  for (let x = 0; x <= WIDTH; x += 2) {
    const t = (x / WIDTH) * Math.PI * 2 * freqScale;
    const y = MID + Math.sin(t) * amplitude;
    points.push(`${x},${y.toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
}

export function FrequencyTune({ data, solvedCiphers = [], onComplete }: Props) {
  const [frequency, setFrequency] = useState(data.startFrequency);
  const [gain, setGain] = useState(data.startGain);
  const [locked, setLocked] = useState(false);
  const [channelZeroUsed, setChannelZeroUsed] = useState(false);

  const canReachFrequencyZero =
    data.channelZeroUnlockedBySecret &&
    data.channelZeroLore &&
    solvedCiphers.includes(data.channelZeroUnlockedBySecret);
  const effectiveMinFreq = canReachFrequencyZero ? 0 : data.minFreq;

  const atFrequencyZero = frequency <= data.tolerance;
  const canUseChannelZero =
    !channelZeroUsed &&
    canReachFrequencyZero &&
    atFrequencyZero;

  const freqDistance = Math.abs(frequency - data.targetFrequency);
  const gainDistance = Math.abs(gain - data.targetGain);
  const freqOk = freqDistance <= data.tolerance;
  const gainOk = gainDistance <= data.gainTolerance;
  const isClose = freqOk && gainOk;

  const normalizedFreqDist = Math.min(freqDistance / (data.maxFreq - effectiveMinFreq), 1);
  const normalizedGainDist = Math.min(gainDistance / (data.maxGain - data.minGain), 1);
  const normalizedDistance = Math.max(normalizedFreqDist, normalizedGainDist);

  const adjustFreq = (amount: number) => {
    if (locked) return;
    setFrequency((f) => Math.max(effectiveMinFreq, Math.min(data.maxFreq, f + amount)));
  };

  const adjustGain = (amount: number) => {
    if (locked) return;
    setGain((g) => Math.max(data.minGain, Math.min(data.maxGain, g + amount)));
  };

  const handleLock = () => {
    if (!isClose) return;
    setLocked(true);
  };

  const targetPath = useMemo(
    () =>
      sinePath(
        data.targetFrequency,
        data.targetGain,
        data.minFreq,
        data.maxFreq,
        data.minGain,
        data.maxGain
      ),
    [data.targetFrequency, data.targetGain, data.minFreq, data.maxFreq, data.minGain, data.maxGain]
  );

  const tuningPath = useMemo(
    () =>
      sinePath(
        frequency,
        gain,
        effectiveMinFreq,
        data.maxFreq,
        data.minGain,
        data.maxGain
      ),
    [frequency, gain, effectiveMinFreq, data.maxFreq, data.minGain, data.maxGain]
  );

  const signalQuality = isClose
    ? "text-primary"
    : normalizedDistance < 0.3
      ? "text-amber-500"
      : "text-destructive";

  return (
    <div className="space-y-5">
      <div className="text-center text-sm text-muted-foreground">
        Match the target wave by adjusting <strong>frequency</strong> and <strong>gain</strong>
      </div>

      <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground flex-wrap">
          <span className={`font-bold ${signalQuality}`}>
            {isClose ? "Signal Clear" : normalizedDistance < 0.3 ? "Partial Signal" : "Static"}
          </span>
        </div>

        <div className="flex justify-center">
          <svg
            width={WIDTH}
            height={HEIGHT}
            className="bg-background/50 rounded-md border border-border"
            data-testid="frequency-waveform"
          >
            {/* Target sine (dashed, muted) */}
            <motion.path
              d={targetPath}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.7}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            {/* User tuning sine */}
            <motion.path
              d={tuningPath}
              fill="none"
              stroke={isClose ? "hsl(var(--primary))" : normalizedDistance < 0.3 ? "#f59e0b" : "#ef4444"}
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.15 }}
            />
          </svg>
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          <span className={`text-xl font-bold tabular-nums ${signalQuality}`} data-testid="text-frequency-value">
            {frequency.toFixed(1)} Hz
          </span>
          <span className={`text-xl font-bold tabular-nums ${signalQuality}`} data-testid="text-gain-value">
            Gain {gain}
          </span>
        </div>
      </div>

      {!locked && (
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground text-center">Frequency</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button size="icon" variant="outline" onClick={() => adjustFreq(-10)} data-testid="button-freq-down-10">
                <span className="text-xs font-bold">-10</span>
              </Button>
              <Button size="icon" variant="outline" onClick={() => adjustFreq(-1)} data-testid="button-freq-down-1">
                <Minus className="w-4 h-4" />
              </Button>
              <div className="w-16 text-center">
                <Radio className="w-4 h-4 mx-auto text-muted-foreground" />
              </div>
              <Button size="icon" variant="outline" onClick={() => adjustFreq(1)} data-testid="button-freq-up-1">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => adjustFreq(10)} data-testid="button-freq-up-10">
                <span className="text-xs font-bold">+10</span>
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground text-center">Gain</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button size="icon" variant="outline" onClick={() => adjustGain(-10)} data-testid="button-gain-down-10">
                <span className="text-xs font-bold">-10</span>
              </Button>
              <Button size="icon" variant="outline" onClick={() => adjustGain(-1)} data-testid="button-gain-down-1">
                <Minus className="w-4 h-4" />
              </Button>
              <div className="w-16 text-center">
                <Radio className="w-4 h-4 mx-auto text-muted-foreground" />
              </div>
              <Button size="icon" variant="outline" onClick={() => adjustGain(1)} data-testid="button-gain-up-1">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => adjustGain(10)} data-testid="button-gain-up-10">
                <span className="text-xs font-bold">+10</span>
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isClose && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <Button onClick={handleLock} data-testid="button-lock-signal">
                  Lock Signal
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {locked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Signal locked!</span>
            </div>
            <Button size="sm" onClick={() => onComplete(true)} data-testid="button-frequency-continue">
              Claim reward
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {canReachFrequencyZero && !canUseChannelZero && !channelZeroUsed && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          A decoded secret mentioned Frequency Zero. Tune to 0 Hz to reach it.
        </p>
      )}

      {canUseChannelZero && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">You&apos;ve reached Frequency Zero.</p>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              setChannelZeroUsed(true);
              onComplete(true, [data.channelZeroLore!]);
            }}
            data-testid="button-broadcast-channel-zero"
          >
            <Radio className="w-3 h-3 mr-1" /> Reach Frequency Zero
          </Button>
        </div>
      )}
    </div>
  );
}
