import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  BookOpen,
  Lock,
  Unlock,
  Swords,
  HandHeart,
  FlaskConical,
  Filter,
  Star,
  ScrollText,
  Eye,
  Zap,
  Shield,
  Sparkles,
  FileText,
} from "lucide-react";
import { useGameState } from "@/lib/gameState";
import { CREATURES, TYPE_BG, TYPE_BADGE, TYPE_COLORS, RARITY_COLORS } from "@/lib/gameData";
import { SYMBOL_ALPHABET, getSymbolForLetter } from "@/lib/explorationData";
import type { Creature } from "@shared/schema";
import { CreatureSprite } from "@/components/CreatureSprite";

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  befriended: HandHeart,
  battled: Swords,
  studied: FlaskConical,
};

const STATUS_COLORS: Record<string, string> = {
  befriended: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
  battled: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950",
  studied: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950",
};

/** If collectedLore contains this snippet, the creature's journal lore is also unlocked (mission completed). */
const CREATURE_LORE_UNLOCKED_BY_MISSION: Record<string, string> = {
  glitch_fox: "The secret room behind shelf seven contains a map",
  spark_golem: "The vault contains blueprints",
  moss_golem: "Beneath the oldest oak",
  fog_wraith: "You found the town in the fog",
  circuit_sprite: "the power lines form a symbol when seen from above",
  signal_wraith: "Frequency Zero is real",
  mirror_shade: "The school was built to contain something",
  void_moth: "Beyond the third chamber door",
  pixel_knight: "The game was designed to train something",
  tide_lurker: "The dock isn't sinking — it's being lifted",
  porcelain_watcher: "Item #1 is aware",
  rumble_root: "Something below the cave keeps growing upward",
  ember_newt: "At the source of the warm water",
  giggle_wisp: "The book that laughs is not a book at all",
  phase_hound: "Room Thirteen was sealed for a reason",
  prism_beetle: "the Prism Beetle's warning",
  toxic_slime: "The slime is not one organism",
  flask_phantom: "The phantom was once the head scientist",
  neon_serpent: "Follow the neon trail",
  cabinet_ghost: "Something has been repairing them",
  rust_crab: "The crabs build their shells from sunken ships",
  depth_angler: "DO NOT reach for the light",
  frequency_bat: "The bats hear a frequency humans cannot",
  static_owl: "The owl sees in all spectrums",
  shelf_mimic: "Not everything in the collection was collected willingly",
  dust_djinn: "The dust remembers every hand that touched every object",
};

interface CreatureDetailProps {
  creature: Creature;
  entry: { status: string; cipherSolved: boolean };
  hasDecoderWheel: boolean;
  discoveredSymbols: string[];
  collectedLore: string[];
  onSolveCipher: () => void;
  onClose: () => void;
}

function maskCipherWithSymbols(clue: string, discoveredSymbols: string[]): string {
  const discoveredSet = new Set(discoveredSymbols.map((s) => s.toUpperCase()));
  return clue
    .split("")
    .map((ch) => {
      const upper = ch.toUpperCase();
      if (upper < "A" || upper > "Z") return ch;
      if (discoveredSet.has(upper)) return upper;
      return getSymbolForLetter(upper);
    })
    .join("");
}

function CreatureDetail({
  creature,
  entry,
  hasDecoderWheel,
  discoveredSymbols,
  collectedLore,
  onSolveCipher,
  onClose,
}: CreatureDetailProps) {
  const [showDecoder, setShowDecoder] = useState(false);
  const StatusIcon = STATUS_ICONS[entry.status];
  const showLore =
    !!CREATURE_LORE_UNLOCKED_BY_MISSION[creature.id] &&
    collectedLore.some((t) => t.includes(CREATURE_LORE_UNLOCKED_BY_MISSION[creature.id]));

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1">
          <ScrollText className="w-3 h-3" /> Journal Entry
        </div>
        <h2 className="text-xl font-bold">{creature.name}</h2>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${TYPE_BADGE[creature.type]}`}>
            {creature.type}
          </span>
          <span className={`text-xs capitalize ${RARITY_COLORS[creature.rarity]} flex items-center gap-0.5`}>
            {creature.rarity === "rare" && <Star className="w-3 h-3" />}
            {creature.rarity}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${STATUS_COLORS[entry.status]}`}>
            <StatusIcon className="w-3 h-3" />
            {entry.status}
          </span>
        </div>
      </div>

      <div className={`rounded-xl border-2 p-6 text-center ${TYPE_BG[creature.type]}`}>
        <div className="flex justify-center mb-3">
          <CreatureSprite creatureId={creature.id} size="lg" animate={true} />
        </div>
        <p className="text-sm text-muted-foreground italic">{creature.description}</p>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> Lore
        </div>
        {showLore ? (
          <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border italic">
            {creature.lore}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-lg border border-dashed">
            Decode this creature&apos;s secret and follow where it leads to uncover its deeper lore.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            {entry.cipherSolved ? <Unlock className="w-3 h-3 text-primary" /> : <Lock className="w-3 h-3" />}
            Cryptic Clue
          </div>
          {!entry.cipherSolved && hasDecoderWheel && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowDecoder(!showDecoder)}
              data-testid="button-toggle-decoder"
            >
              {showDecoder ? "Hide" : "Decode"}
            </Button>
          )}
          {!entry.cipherSolved && !hasDecoderWheel && (
            <span className="text-xs text-muted-foreground">Craft a Decoder Wheel</span>
          )}
        </div>

        {entry.cipherSolved ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary/10 border border-primary/30 rounded-lg p-3"
          >
            <p className="text-sm font-mono text-primary">{creature.decodedSecret}</p>
          </motion.div>
        ) : (
          <div className="bg-muted/60 border border-border rounded-lg p-3">
            <p className="text-sm font-mono text-muted-foreground tracking-wider">
              {maskCipherWithSymbols(creature.cipherClue, discoveredSymbols)}
            </p>
          </div>
        )}

        <AnimatePresence>
          {showDecoder && !entry.cipherSolved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="text-xs font-semibold text-foreground">Decoder Wheel Assist</div>
                <div className="font-mono text-xs space-y-1">
                  <div className="text-muted-foreground">Encrypted clue:</div>
                  <div className="text-foreground break-all">{creature.cipherClue}</div>
                  <div className="text-muted-foreground mt-2">Machine solution:</div>
                  <div className="text-primary break-all font-semibold">{creature.decodedSecret}</div>
                </div>
                <Button size="sm" className="w-full" onClick={onSolveCipher} data-testid="button-solve-cipher">
                  <Unlock className="w-3 h-3 mr-1" /> Confirm & Record Secret
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
          <div className="text-xs text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> Weak vs
          </div>
          <div className="text-sm font-semibold">{creature.weakAgainst}</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
          <div className="text-xs text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" /> Strong vs
          </div>
          <div className="text-sm font-semibold">{creature.strongAgainst}</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
          <div className="text-xs text-muted-foreground mb-0.5">Battle Power</div>
          <div className="flex justify-center gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-3 rounded-sm ${i < creature.battlePower ? "bg-destructive" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
          <div className="text-xs text-muted-foreground mb-0.5">Friendliness</div>
          <div className="flex justify-center gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-3 rounded-sm ${i < creature.friendliness ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <Button variant="secondary" className="w-full" onClick={onClose} data-testid="button-close-detail">
        Close Entry
      </Button>
    </div>
  );
}

type FilterType = "all" | "befriended" | "battled" | "studied";

export default function JournalPage() {
  const { state, solveCipher, hasGadget } = useGameState();
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const entries = state.journal;
  const filteredEntries = filter === "all" ? entries : entries.filter((e) => e.status === filter);

  const selectedEntry = selectedCreature
    ? entries.find((e) => e.creatureId === selectedCreature.id)
    : null;

  const handleSolveCipher = () => {
    if (selectedCreature) {
      solveCipher(selectedCreature.id);
      setSelectedCreature(selectedCreature);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            Field Notes
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Mystery Journal</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {entries.length === 0
              ? "No creatures catalogued yet. Start exploring!"
              : `${entries.length} creature${entries.length !== 1 ? "s" : ""} discovered -- ${state.solvedCiphers.length} cipher${state.solvedCiphers.length !== 1 ? "s" : ""} solved${state.discoveredSymbols.length > 0 ? ` -- ${state.discoveredSymbols.length} symbol${state.discoveredSymbols.length !== 1 ? "s" : ""}` : ""}${state.collectedLore.length > 0 ? ` -- ${state.collectedLore.length} note${state.collectedLore.length !== 1 ? "s" : ""}` : ""}`}
          </p>
        </motion.div>

        {entries.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {(["all", "befriended", "battled", "studied"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-testid={`filter-${f}`}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all capitalize ${filter === f
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border text-muted-foreground"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {entries.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center space-y-4">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <BookOpen className="w-14 h-14 text-muted-foreground/30 mx-auto" />
                </motion.div>
                <div className="text-muted-foreground">
                  <div className="font-semibold text-lg">Journal is empty</div>
                  <div className="text-sm mt-1">Go explore a location to encounter your first creature.</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {filteredEntries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredEntries.map((entry, i) => {
              const creature = CREATURES.find((c) => c.id === entry.creatureId);
              if (!creature) return null;
              const StatusIcon = STATUS_ICONS[entry.status];
              return (
                <motion.div
                  key={entry.creatureId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer group"
                    onClick={() => setSelectedCreature(creature)}
                    data-testid={`card-creature-${creature.id}`}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className={`rounded-lg p-4 flex justify-center ${TYPE_BG[creature.type]} relative overflow-visible`}>
                        <CreatureSprite creatureId={creature.id} size="sm" animate={false} />
                        {creature.rarity === "rare" && (
                          <div className="absolute top-1 right-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm truncate">{creature.name}</div>
                        <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
                          <span className={`text-xs ${TYPE_COLORS[creature.type]}`}>{creature.type}</span>
                          <span className={`flex items-center gap-0.5 text-xs ${STATUS_COLORS[entry.status]} px-1.5 py-0.5 rounded`}>
                            <StatusIcon className="w-2.5 h-2.5" />
                            {entry.status}
                          </span>
                        </div>
                      </div>
                      {!entry.cipherSolved ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Cipher locked</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Unlock className="w-2.5 h-2.5" />
                          <span>Secret revealed</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredEntries.length === 0 && entries.length > 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No {filter} creatures yet.
          </div>
        )}

        {state.discoveredSymbols.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-muted-foreground" /> Discovered Symbols
            </h2>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {state.discoveredSymbols.map((key) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2 border border-border"
                      data-testid={`symbol-${key}`}
                    >
                      <span className="font-mono text-lg text-primary font-bold">{SYMBOL_ALPHABET[key] || "?"}</span>
                      <span className="text-xs text-muted-foreground uppercase">{key}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  {state.discoveredSymbols.length} symbol{state.discoveredSymbols.length !== 1 ? "s" : ""} decoded -- use these in the Cipher Lab to decode messages.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state.collectedLore.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" /> Field Notes
            </h2>
            <div className="space-y-2">
              {state.collectedLore.map((text, i) => (
                <Card key={i}>
                  <CardContent className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <ScrollText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground italic leading-relaxed" data-testid={`lore-entry-${i}`}>
                        {text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <Dialog open={!!selectedCreature} onOpenChange={(o) => !o && setSelectedCreature(null)}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogTitle className="sr-only">Creature Detail</DialogTitle>
            <DialogDescription className="sr-only">View creature details</DialogDescription>
            {selectedCreature && selectedEntry && (
              <CreatureDetail
                creature={selectedCreature}
                entry={{ status: selectedEntry.status, cipherSolved: selectedEntry.cipherSolved }}
                hasDecoderWheel={hasGadget("decoder_wheel")}
                discoveredSymbols={state.discoveredSymbols}
                collectedLore={state.collectedLore}
                onSolveCipher={handleSolveCipher}
                onClose={() => setSelectedCreature(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
