import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, Plug, Zap } from "lucide-react";
import type { WireConnectionData } from "@shared/schema";
import { useGameState } from "@/lib/gameState";
import { Progress } from "@/components/ui/progress";

interface Props {
    data: WireConnectionData;
    onComplete: (success: boolean) => void;
}

type Phase = "playing" | "result";
type Pos = { r: number; c: number };

const isSame = (a: Pos, b: Pos) => a.r === b.r && a.c === b.c;
const isAdjacent = (a: Pos, b: Pos) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;

export function WireConnection({ data, onComplete }: Props) {
    const { hasUpgrade } = useGameState();
    const [phase, setPhase] = useState<Phase>("playing");
    const [path, setPath] = useState<Pos[]>([data.startTile]);
    const [success, setSuccess] = useState<boolean | null>(null);

    // Time Limit logic
    const bonusTime = hasUpgrade("optic_augmentation") ? 3000 : 0;
    const totalTime = data.timeLimit + bonusTime;
    const [timeLeft, setTimeLeft] = useState(totalTime);

    const handleRetry = useCallback(() => {
        setPhase("playing");
        setPath([data.startTile]);
        setSuccess(null);
        setTimeLeft(totalTime);
    }, [data.startTile, totalTime]);

    useEffect(() => {
        if (phase !== "playing") return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 100) {
                    clearInterval(interval);
                    setSuccess(false);
                    setPhase("result");
                    return 0;
                }
                return prev - 100;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    const handleCellClick = (r: number, c: number) => {
        if (phase !== "playing") return;
        const clicked: Pos = { r, c };
        const current = path[path.length - 1];

        if (isSame(clicked, current)) return;

        // Check if clicked cell is exactly the previous one (undo)
        if (path.length > 1 && isSame(clicked, path[path.length - 2])) {
            setPath((prev) => prev.slice(0, -1));
            return;
        }

        // Must be adjacent to current
        if (!isAdjacent(clicked, current)) return;

        // Cannot cross own path
        if (path.some((p) => isSame(p, clicked))) return;

        const newPath = [...path, clicked];
        setPath(newPath);

        // Reached end?
        if (isSame(clicked, data.endTile)) {
            setSuccess(true);
            setPhase("result");
        }
    };

    const getCellClasses = (r: number, c: number) => {
        const pos = { r, c };
        const pathIdx = path.findIndex((p) => isSame(p, pos));
        const isStart = isSame(pos, data.startTile);
        const isEnd = isSame(pos, data.endTile);

        let base = "w-10 h-10 border-2 rounded-md flex items-center justify-center transition-all cursor-pointer ";

        if (isStart || isEnd) {
            base += "border-amber-500 bg-amber-500/20 text-amber-500 ";
            if (pathIdx !== -1) base += "shadow-[0_0_15px_rgba(245,158,11,0.5)] ";
        } else if (pathIdx !== -1) {
            base += "border-cyan-400 bg-cyan-400/20 ";
            if (pathIdx === path.length - 1) base += "border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)] ";
        } else {
            base += "border-border/50 bg-card hover:bg-muted ";
        }

        return base;
    };

    const renderGrid = () => {
        const rows = [];
        for (let r = 0; r < data.gridSize; r++) {
            const cols = [];
            for (let c = 0; c < data.gridSize; c++) {
                const isStart = isSame({ r, c }, data.startTile);
                const isEnd = isSame({ r, c }, data.endTile);
                const inPath = path.some((p) => isSame(p, { r, c }));

                cols.push(
                    <motion.div
                        key={`${r}-${c}`}
                        className={getCellClasses(r, c)}
                        onClick={() => handleCellClick(r, c)}
                        whileTap={{ scale: 0.9 }}
                        animate={inPath ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.2 }}
                        data-testid={`wire-cell-${r}-${c}`}
                    >
                        {isStart && <Plug className="w-5 h-5" />}
                        {isEnd && <Zap className="w-5 h-5" />}
                        {!isStart && !isEnd && inPath && (
                            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        )}
                    </motion.div>
                );
            }
            rows.push(
                <div key={r} className="flex gap-2">
                    {cols}
                </div>
            );
        }
        return <div className="flex flex-col gap-2">{rows}</div>;
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                    <Plug className="w-4 h-4" />
                    <span>Connect the Terminals</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Click adjacent tiles to draw a continuous wire from Start to End.
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.ceil(timeLeft / 1000)}s remaining</span>
                    {hasUpgrade("optic_augmentation") && (
                        <span className="text-cyan-400">+3s Augment</span>
                    )}
                </div>
                <Progress value={(timeLeft / totalTime) * 100} className="h-1.5" />
            </div>

            <div className="flex justify-center p-4 bg-black/20 rounded-xl border border-border/50">
                {renderGrid()}
            </div>

            <AnimatePresence>
                {phase === "result" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-3"
                    >
                        {success ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Circuit Connected!</span>
                                </div>
                                <Button size="sm" onClick={() => onComplete(true)} data-testid="button-wire-continue">
                                    Claim Reward
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-destructive">
                                    <XCircle className="w-5 h-5" />
                                    <span className="font-semibold">Connection Failed</span>
                                </div>
                                <Button size="sm" variant="secondary" onClick={handleRetry} data-testid="button-retry-wire">
                                    <RotateCcw className="w-3 h-3 mr-1" /> Re-wire
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
