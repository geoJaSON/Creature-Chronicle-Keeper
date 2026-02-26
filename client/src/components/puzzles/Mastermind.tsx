import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, HelpCircle } from "lucide-react";
import type { MastermindData } from "@shared/schema";

interface Props {
    data: MastermindData;
    onComplete: (success: boolean) => void;
}

type Phase = "playing" | "result";

interface GuessResult {
    guess: string[];
    exact: number;
    partial: number;
}

export function Mastermind({ data, onComplete }: Props) {
    const [phase, setPhase] = useState<Phase>("playing");
    const [success, setSuccess] = useState<boolean | null>(null);

    // Generate secret code
    const secretCode = useMemo(() => {
        return Array.from({ length: data.codeLength }).map(
            () => data.colors[Math.floor(Math.random() * data.colors.length)]
        );
    }, [data.codeLength, data.colors]);

    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string[]>([]);

    const handleRetry = useCallback(() => {
        setPhase("playing");
        setSuccess(null);
        setGuesses([]);
        setCurrentGuess([]);
    }, []);

    const addColorToGuess = (color: string) => {
        if (phase !== "playing" || currentGuess.length >= data.codeLength) return;
        setCurrentGuess((prev) => [...prev, color]);
    };

    const removeLastColor = () => {
        if (phase !== "playing" || currentGuess.length === 0) return;
        setCurrentGuess((prev) => prev.slice(0, -1));
    };

    const submitGuess = () => {
        if (phase !== "playing" || currentGuess.length !== data.codeLength) return;

        let exact = 0;
        let partial = 0;

        const codeCopy = [...secretCode];
        const guessCopy = [...currentGuess];

        // Check exacts
        for (let i = 0; i < data.codeLength; i++) {
            if (guessCopy[i] === codeCopy[i]) {
                exact++;
                codeCopy[i] = "DONE";
                guessCopy[i] = "MATCHED";
            }
        }

        // Check partials
        for (let i = 0; i < data.codeLength; i++) {
            if (guessCopy[i] !== "MATCHED") {
                const idx = codeCopy.indexOf(guessCopy[i]);
                if (idx !== -1) {
                    partial++;
                    codeCopy[idx] = "DONE";
                }
            }
        }

        const newGuesses = [...guesses, { guess: currentGuess, exact, partial }];
        setGuesses(newGuesses);
        setCurrentGuess([]);

        if (exact === data.codeLength) {
            setSuccess(true);
            setPhase("result");
        } else if (newGuesses.length >= data.maxGuesses) {
            setSuccess(false);
            setPhase("result");
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                    <HelpCircle className="w-4 h-4" />
                    <span>Crack the Code</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Guess the correct sequence of {data.codeLength} colors.
                </p>
            </div>

            <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-border/50">
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-4 border-b border-border/30 pb-2">
                    <span>{data.maxGuesses - guesses.length} guesses left</span>
                    <span>● Exact ○ Color</span>
                </div>

                {/* Previous Guesses */}
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
                    {guesses.map((g, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between bg-card p-2 rounded border border-border/50"
                        >
                            <div className="flex gap-1.5">
                                {g.guess.map((c, ci) => (
                                    <div key={ci} className={`w-6 h-6 rounded-full ${c} shadow-sm border border-black/20`} />
                                ))}
                            </div>
                            <div className="flex gap-1 bg-black/30 px-2 py-1 rounded">
                                {Array.from({ length: g.exact }).map((_, ei) => (
                                    <div key={`e-${ei}`} className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                                ))}
                                {Array.from({ length: g.partial }).map((_, pi) => (
                                    <div key={`p-${pi}`} className="w-2.5 h-2.5 rounded-full border border-white/60" />
                                ))}
                                {Array.from({ length: data.codeLength - g.exact - g.partial }).map((_, mi) => (
                                    <div key={`m-${mi}`} className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Current Guess row */}
                {phase === "playing" && (
                    <div className="flex items-center justify-between bg-card/50 p-3 rounded-lg border border-primary/30 mt-4">
                        <div className="flex gap-1.5">
                            {Array.from({ length: data.codeLength }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${i < currentGuess.length ? `${currentGuess[i]} border-black/20 shadow-sm` : "border-dashed border-border/50 bg-black/10"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={removeLastColor} disabled={currentGuess.length === 0} className="px-2" data-testid="button-mastermind-undo">
                                <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" onClick={submitGuess} disabled={currentGuess.length < data.codeLength} data-testid="button-mastermind-submit">
                                Submit
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Color Palette */}
            {phase === "playing" && (
                <div className="flex justify-center gap-3 py-2">
                    {data.colors.map((c, i) => (
                        <motion.button
                            key={i}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addColorToGuess(c)}
                            className={`w-10 h-10 rounded-full ${c} shadow-md border-2 border-white/10 hover:border-white/40 transition-all`}
                            data-testid={`mastermind-color-${i}`}
                        />
                    ))}
                </div>
            )}

            <AnimatePresence>
                {phase === "result" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-3 mt-4"
                    >
                        {success ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Code Cracked!</span>
                                </div>
                                <Button size="sm" onClick={() => onComplete(true)} data-testid="button-mastermind-continue">
                                    Claim Reward
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-destructive">
                                    <XCircle className="w-5 h-5" />
                                    <span className="font-semibold">System Locked - Out of Guesses</span>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                                    <span>The code was:</span>
                                    <div className="flex gap-1">
                                        {secretCode.map((c, i) => (
                                            <div key={i} className={`w-4 h-4 rounded-full ${c}`} />
                                        ))}
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-mastermind">
                                    <RotateCcw className="w-3 h-3 mr-1" /> Reboot System
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
