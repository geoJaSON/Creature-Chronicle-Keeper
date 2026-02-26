import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Hammer, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Props {
    gadgetName: string;
    open: boolean;
    onResult: (success: boolean) => void;
    onCancel: () => void;
}

export function CraftingMinigame({ gadgetName, open, onResult, onCancel }: Props) {
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [phase, setPhase] = useState<"playing" | "success" | "fail">("playing");
    const [hits, setHits] = useState(0);

    useEffect(() => {
        if (!open) {
            setPhase("playing");
            setHits(0);
            setPosition(0);
            setDirection(1);
        }
    }, [open]);

    useEffect(() => {
        if (phase !== "playing" || !open) return;

    // The bar moves at a kid-friendly speed and only ramps up gently
    const speed = 0.8 + hits * 0.6;

    const interval = setInterval(() => {
            setPosition((p) => {
                let next = p + direction * speed;
                if (next >= 100) {
                    next = 100;
                    setDirection(-1);
                }
                if (next <= 0) {
                    next = 0;
                    setDirection(1);
                }
                return next;
            });
        }, 20);

        return () => clearInterval(interval);
    }, [direction, phase, open, hits]);

    const handleStrike = () => {
        if (phase !== "playing") return;

    // Target zone is 35 to 65 (center)
    if (position >= 35 && position <= 65) {
            if (hits === 2) {
                setPhase("success");
                setTimeout(() => onResult(true), 1200);
            } else {
                setHits((h) => h + 1);
            }
        } else {
            setPhase("fail");
            setTimeout(() => onResult(false), 1200);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onCancel(); }}>
            <DialogContent className="sm:max-w-md bg-stone-950 border-stone-800 text-stone-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Hammer className="w-5 h-5 text-amber-500" />
                        Crafting: {gadgetName}
                    </DialogTitle>
                    <DialogDescription className="text-stone-400">
                        Strike the anvil when the heat indicator is in the green zone. You need 3 perfect strikes.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-8 flex flex-col items-center">
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full border-2 transition-all ${i < hits ? "bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "border-stone-700 bg-stone-900"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="relative w-full h-8 bg-stone-900 rounded-full border border-stone-700 overflow-hidden">
                        {/* Target Zone */}
                        <div className="absolute top-0 bottom-0 left-[40%] right-[40%] bg-emerald-500/20 border-x border-emerald-500/50" />

                        {/* Indicator */}
                        <motion.div
                            className={`absolute top-0 bottom-0 w-2 rounded-full ${phase === "fail" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" :
                                    phase === "success" ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" :
                                        "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                                }`}
                            style={{ left: `${position}%`, x: "-50%" }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {phase === "playing" ? (
                            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Button size="lg" onClick={handleStrike} className="w-48 bg-amber-600 hover:bg-amber-500 text-white font-bold tracking-wider">
                                    STRIKE
                                </Button>
                            </motion.div>
                        ) : phase === "success" ? (
                            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                                <CheckCircle className="w-6 h-6" />
                                Crafted!
                            </motion.div>
                        ) : (
                            <motion.div key="fail" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 text-red-400 font-bold text-xl">
                                <XCircle className="w-6 h-6" />
                                Material Ruined!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
