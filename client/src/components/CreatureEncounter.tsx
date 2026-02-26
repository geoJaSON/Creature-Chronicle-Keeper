import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Swords,
  FlaskConical,
  HandHeart,
  CheckCircle,
  XCircle,
  Sparkles,
  Package,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import type { Creature, ArtifactId, GadgetId } from "@shared/schema";
import { ARTIFACTS, TYPE_BG, TYPE_BADGE, RARITY_COLORS, getArtifactsDropped, getStudyDrops } from "@/lib/gameData";
import { CreatureSprite } from "@/components/CreatureSprite";

type Phase = "intro" | "action" | "battle" | "result";
type ActionChoice = "befriend" | "battle" | "study";
type ResultType = "success" | "fail" | "escape";

interface Props {
  creature: Creature;
  open: boolean;
  onClose: () => void;
  hasScanner: boolean;
  hasTrapCamera: boolean;
  onUseGadget: (id: "scanner" | "trap_camera") => boolean;
  onResult: (status: "befriended" | "battled" | "studied", drops: ArtifactId[]) => void;
}

function BattleView({
  creature,
  playerHasAdvantage,
  onEnd,
}: {
  creature: Creature;
  playerHasAdvantage: boolean;
  onEnd: (won: boolean) => void;
}) {
  const [playerHP, setPlayerHP] = useState(20);
  const [creatureHP, setCreatureHP] = useState(creature.battlePower * 2);
  const [log, setLog] = useState<string[]>(() =>
    playerHasAdvantage
      ? [`Type advantage! ${creature.weakAgainst}-type weakness exploited.`, "Battle started!"]
      : ["Battle started!"]
  );
  const [turn, setTurn] = useState<"player" | "creature" | "done">("player");
  const [shake, setShake] = useState<"player" | "creature" | null>(null);
  const maxCreatureHP = creature.battlePower * 2;

  const addLog = (msg: string) => setLog((prev) => [...prev.slice(-4), msg]);

  const playerAttack = () => {
    if (turn !== "player") return;
    const baseDmg = Math.floor(Math.random() * 4) + 3;
    const bonus = playerHasAdvantage ? 2 : 0;
    const dmg = baseDmg + bonus;
    const newCreatureHP = Math.max(0, creatureHP - dmg);
    setCreatureHP(newCreatureHP);
    setShake("creature");
    setTimeout(() => setShake(null), 400);
    addLog(bonus > 0 ? `Super effective! You hit for ${dmg}!` : `You hit for ${dmg} damage!`);
    if (newCreatureHP <= 0) {
      addLog("You won!");
      setTurn("done");
      setTimeout(() => onEnd(true), 800);
      return;
    }
    setTurn("creature");
  };

  const playerDefend = () => {
    if (turn !== "player") return;
    addLog("You brace yourself...");
    setTurn("creature");
  };

  useEffect(() => {
    if (turn === "creature") {
      const timer = setTimeout(() => {
        const reducedDmg = log[log.length - 1]?.includes("brace") ? 1 : 0;
        const disadvantage = playerHasAdvantage ? 1 : 0;
        const dmg = Math.max(0, Math.floor(Math.random() * (creature.battlePower / 2)) + 1 - reducedDmg - disadvantage);
        const newPlayerHP = Math.max(0, playerHP - dmg);
        setPlayerHP(newPlayerHP);
        setShake("player");
        setTimeout(() => setShake(null), 400);
        addLog(`${creature.name} strikes for ${dmg}!`);
        if (newPlayerHP <= 0) {
          addLog("You were defeated...");
          setTurn("done");
          setTimeout(() => onEnd(false), 800);
        } else {
          setTurn("player");
        }
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [turn]);

  return (
    <div className="space-y-4">
      {playerHasAdvantage && (
        <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-1.5">
          <Zap className="w-3 h-3" />
          <span>Type advantage — {creature.weakAgainst}-type tactics boost your attacks</span>
        </div>
      )}
      <div className="flex items-center justify-center py-2">
        <motion.div
          animate={shake === "creature" ? { x: [0, -5, 5, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <CreatureSprite creatureId={creature.id} size="md" animate={true} />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div className="space-y-1" animate={shake === "player" ? { x: [0, -3, 3, -2, 2, 0] } : {}} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between gap-1 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="w-3 h-3 text-red-500 dark:text-red-400" /> You
            </span>
            <span className="font-mono text-xs">{playerHP}/20</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: playerHP > 10 ? "#22c55e" : playerHP > 5 ? "#eab308" : "#ef4444",
              }}
              animate={{ width: `${(playerHP / 20) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="w-3 h-3 text-red-500 dark:text-red-400" /> {creature.name}
            </span>
            <span className="font-mono text-xs">{creatureHP}/{maxCreatureHP}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-destructive"
              animate={{ width: `${(creatureHP / maxCreatureHP) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-md p-3 min-h-[80px] font-mono text-xs space-y-1 border border-border">
        <AnimatePresence>
          {log.map((l, i) => (
            <motion.div
              key={`${i}-${l}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={i === log.length - 1 ? "text-foreground font-semibold" : "text-muted-foreground"}
            >
              {l}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={playerAttack}
          disabled={turn !== "player"}
          data-testid="button-battle-attack"
          className="flex-1"
        >
          <Swords className="w-3 h-3 mr-1" /> Attack
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={playerDefend}
          disabled={turn !== "player"}
          data-testid="button-battle-defend"
          className="flex-1"
        >
          <Shield className="w-3 h-3 mr-1" /> Defend
        </Button>
      </div>
    </div>
  );
}

export function CreatureEncounter({ creature, open, onClose, hasScanner, hasTrapCamera, onUseGadget, onResult }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [actionChoice, setActionChoice] = useState<ActionChoice | null>(null);
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [drops, setDrops] = useState<ArtifactId[]>([]);

  useEffect(() => {
    if (open) {
      setPhase("intro");
      setActionChoice(null);
      setResultType(null);
      setDrops([]);
    }
  }, [open]);

  const handleAction = (action: ActionChoice) => {
    const usedTrapCamera = action === "study" && hasTrapCamera;
    if (usedTrapCamera) onUseGadget("trap_camera");
    setActionChoice(action);
    if (action === "study") {
      const d = getStudyDrops(creature, usedTrapCamera);
      setDrops(d);
      setResultType("success");
      setPhase("result");
    } else if (action === "battle") {
      if (hasScanner) onUseGadget("scanner");
      setPhase("battle");
    } else if (action === "befriend") {
      if (hasScanner) onUseGadget("scanner");
      const roll = Math.random();
      const threshold = creature.friendliness / 10;
      const d = getArtifactsDropped(creature);
      if (roll < threshold) {
        setDrops(d);
        setResultType("success");
      } else {
        setDrops([]);
        setResultType("fail");
      }
      setPhase("result");
    }
  };

  const handleBattleEnd = (won: boolean) => {
    if (won) {
      setDrops(getArtifactsDropped(creature));
      setResultType("success");
    } else {
      setDrops([]);
      setResultType("escape");
    }
    setPhase("result");
  };

  const handleConfirmResult = () => {
    if (resultType === "success" && actionChoice) {
      const statusMap: Record<ActionChoice, "befriended" | "battled" | "studied"> = {
        befriend: "befriended",
        battle: "battled",
        study: "studied",
      };
      onResult(statusMap[actionChoice], drops);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">Creature Encounter</DialogTitle>
        <DialogDescription className="sr-only">Encounter a mystery creature</DialogDescription>
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="text-xs text-muted-foreground uppercase tracking-widest"
                >
                  Encounter
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold tracking-tight"
                >
                  {creature.name}
                </motion.h2>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${TYPE_BADGE[creature.type]}`}>
                    {creature.type}
                  </span>
                  <span className={`text-xs ${RARITY_COLORS[creature.rarity]} capitalize flex items-center gap-0.5`}>
                    {creature.rarity === "rare" && <Star className="w-3 h-3" />}
                    {creature.rarity}
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className={`rounded-xl border-2 p-6 text-center ${TYPE_BG[creature.type]} relative overflow-visible`}
              >
                <div className="flex justify-center mb-3">
                  <CreatureSprite creatureId={creature.id} size="lg" animate={true} />
                </div>
                <p className="text-sm text-muted-foreground italic">{creature.description}</p>
              </motion.div>

              {hasScanner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/60 rounded-md px-3 py-2.5 border border-border space-y-1.5"
                >
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" /> Scanner Data
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>
                      <div className="font-mono text-foreground text-sm">{creature.battlePower}/10</div>
                      <div>Power</div>
                    </div>
                    <div>
                      <div className="font-mono text-foreground text-sm">{creature.friendliness}/10</div>
                      <div>Friendly</div>
                    </div>
                    <div>
                      <div className="font-mono text-foreground text-sm">{creature.weakAgainst}</div>
                      <div>Weak vs</div>
                    </div>
                  </div>
                </motion.div>
              )}

              <Button className="w-full" onClick={() => {
                if (hasScanner) onUseGadget("scanner");
                setPhase("action");
              }} data-testid="button-engage">
                <Sparkles className="w-4 h-4 mr-2" /> Engage Creature
              </Button>
            </motion.div>
          )}

          {phase === "action" && (
            <motion.div
              key="action"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <CreatureSprite creatureId={creature.id} size="sm" animate={true} />
                </div>
                <div className="text-lg font-semibold">{creature.name} is near!</div>
                <div className="text-sm text-muted-foreground">Choose your approach carefully.</div>
              </div>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left p-4 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30 cursor-pointer transition-colors"
                  onClick={() => handleAction("befriend")}
                  data-testid="button-action-befriend"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <HandHeart className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Befriend</div>
                      <div className="text-xs text-muted-foreground">
                        Chance based on friendliness. Success: full artifacts + journal. Fail: nothing, no entry — you can try again later.
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left p-4 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30 cursor-pointer transition-colors"
                  onClick={() => handleAction("battle")}
                  data-testid="button-action-battle"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
                      <Swords className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Battle</div>
                      <div className="text-xs text-muted-foreground">
                        Fight to subdue. Win: full artifacts + journal. Lose: nothing, no entry — you can try again later.
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 cursor-pointer transition-colors"
                  onClick={() => handleAction("study")}
                  data-testid="button-action-study"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Study</div>
                      <div className="text-xs text-muted-foreground">
                        Safe option. Always adds to journal. 1 artifact{hasTrapCamera ? " (2 with Trap Camera, consumes 1 use)" : ""}.
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === "battle" && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-lg font-semibold">Battle: {creature.name}</div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${TYPE_BADGE[creature.type]}`}>
                  {creature.type}
                </span>
              </div>
              <BattleView creature={creature} playerHasAdvantage={hasScanner} onEnd={handleBattleEnd} />
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-center space-y-3">
                {resultType === "success" ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                    </motion.div>
                    <div className="text-lg font-bold">
                      {actionChoice === "befriend" && "You made a friend!"}
                      {actionChoice === "battle" && "Victory!"}
                      {actionChoice === "study" && "Observation Complete!"}
                    </div>
                    <div className="flex justify-center">
                      <CreatureSprite creatureId={creature.id} size="sm" animate={true} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {creature.name} has been added to your journal.
                    </p>
                  </>
                ) : resultType === "fail" ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                      <XCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="text-lg font-bold">It didn&apos;t work out...</div>
                    <p className="text-sm text-muted-foreground">
                      {creature.name} wasn&apos;t ready to be friends. No journal entry — you can encounter it again and try a different approach.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                      <XCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-lg font-bold">You were defeated!</div>
                    <p className="text-sm text-muted-foreground">
                      You escaped without documenting {creature.name}. No journal entry — you can encounter it again and try a different approach.
                    </p>
                  </>
                )}
              </div>

              {drops.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/50 rounded-lg p-4 border border-border"
                >
                  <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <Package className="w-3 h-3" /> Artifacts Collected
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {drops.map((id, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                      >
                        <Badge variant="secondary" className="text-xs">
                          {ARTIFACTS[id]?.name}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button className="w-full" onClick={handleConfirmResult} data-testid="button-result-confirm">
                Continue Exploring
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
