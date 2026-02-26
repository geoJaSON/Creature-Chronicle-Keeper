import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trees,
  Library,
  School,
  Mountain,
  Compass,
  Search,
  MapPin,
  Sparkles,
  Eye,
  BookOpen,
  FlaskConical,
  Gamepad2,
  Anchor,
  Radio,
  Home,
} from "lucide-react";
import { CreatureEncounter } from "@/components/CreatureEncounter";
import { ExplorationView } from "@/components/ExplorationView";
import { useGameState } from "@/lib/gameState";
import { LOCATIONS, getRandomCreature, getCreaturesForLocation, CREATURES } from "@/lib/gameData";
import type { Creature, ArtifactId } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { CreatureSprite } from "@/components/CreatureSprite";

const LOCATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  forest: Trees,
  library: Library,
  school: School,
  cave: Mountain,
  lab: FlaskConical,
  arcade: Gamepad2,
  dock: Anchor,
  tower: Radio,
  house: Home,
};

const LOCATION_GRADIENTS: Record<string, string> = {
  forest: "from-green-950 via-green-900 to-emerald-800",
  library: "from-blue-950 via-indigo-900 to-blue-800",
  school: "from-purple-950 via-purple-900 to-violet-800",
  cave: "from-slate-950 via-slate-900 to-zinc-800",
  lab: "from-cyan-950 via-teal-900 to-cyan-800",
  arcade: "from-pink-950 via-fuchsia-900 to-pink-800",
  dock: "from-sky-950 via-blue-900 to-sky-800",
  tower: "from-amber-950 via-orange-900 to-amber-800",
  house: "from-rose-950 via-red-900 to-rose-800",
};

const LOCATION_ACCENT: Record<string, string> = {
  forest: "text-emerald-400",
  library: "text-blue-400",
  school: "text-purple-400",
  cave: "text-slate-300",
  lab: "text-cyan-400",
  arcade: "text-pink-400",
  dock: "text-sky-400",
  tower: "text-amber-400",
  house: "text-rose-400",
};

const LOCATION_GLOW: Record<string, string> = {
  forest: "shadow-[0_0_60px_rgba(16,185,129,0.15)]",
  library: "shadow-[0_0_60px_rgba(59,130,246,0.15)]",
  school: "shadow-[0_0_60px_rgba(139,92,246,0.15)]",
  cave: "shadow-[0_0_60px_rgba(100,116,139,0.15)]",
  lab: "shadow-[0_0_60px_rgba(6,182,212,0.15)]",
  arcade: "shadow-[0_0_60px_rgba(236,72,153,0.15)]",
  dock: "shadow-[0_0_60px_rgba(14,165,233,0.15)]",
  tower: "shadow-[0_0_60px_rgba(245,158,11,0.15)]",
  house: "shadow-[0_0_60px_rgba(244,63,94,0.15)]",
};

export default function GamePage() {
  const { state, addJournalEntry, addArtifact, addDiscoveredSymbol, addLoreText, hasGadget, useGadget } = useGameState();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [foundCreature, setFoundCreature] = useState<Creature | null>(null);
  const [encounterOpen, setEncounterOpen] = useState(false);
  const [bonusArtifacts, setBonusArtifacts] = useState<ArtifactId[]>([]);

  const journalCount = state.journal.length;

  const handleStartExploration = (locationId: string) => {
    setSelectedLocation(locationId);
    setIsExploring(true);
    setBonusArtifacts([]);
  };

  const handleExplorationComplete = (
    collectedArtifacts: ArtifactId[],
    discoveredSymbolKeys: string[],
    loreTexts: string[]
  ) => {
    collectedArtifacts.forEach((id) => addArtifact(id));
    discoveredSymbolKeys.forEach((key) => addDiscoveredSymbol(key));
    loreTexts.forEach((text) => addLoreText(text));
    setBonusArtifacts(collectedArtifacts);

    if (collectedArtifacts.length > 0) {
      toast({
        title: "Exploration rewards collected!",
        description: `Found ${collectedArtifacts.length} artifact${collectedArtifacts.length !== 1 ? "s" : ""} during exploration.`,
      });
    }

    const creature = getRandomCreature(selectedLocation!);
    setFoundCreature(creature);
    setIsExploring(false);
    setEncounterOpen(true);
  };

  const handleExplorationLeave = (
    collectedArtifacts: ArtifactId[],
    discoveredSymbolKeys: string[],
    loreTexts: string[] = []
  ) => {
    collectedArtifacts.forEach((id) => addArtifact(id));
    discoveredSymbolKeys.forEach((key) => addDiscoveredSymbol(key));
    loreTexts.forEach((text) => addLoreText(text));

    if (collectedArtifacts.length > 0) {
      toast({
        title: "Left with your findings",
        description: `Collected ${collectedArtifacts.length} artifact${collectedArtifacts.length !== 1 ? "s" : ""} during exploration.`,
      });
    }

    setIsExploring(false);
    setSelectedLocation(null);
  };

  const handleEncounterResult = (
    status: "befriended" | "battled" | "studied",
    drops: ArtifactId[]
  ) => {
    if (!foundCreature) return;
    addJournalEntry(foundCreature.id, status);
    drops.forEach((id) => addArtifact(id));
    const isNew = !state.journal.find((e) => e.creatureId === foundCreature.id);
    toast({
      title: isNew ? `New entry: ${foundCreature.name}!` : `${foundCreature.name} encountered again`,
      description: drops.length
        ? `Collected: ${drops.map((d) => d.replace(/_/g, " ")).join(", ")}`
        : "Added to your journal.",
    });
  };

  const handleEncounterClose = () => {
    setEncounterOpen(false);
    setFoundCreature(null);
    setSelectedLocation(null);
    setBonusArtifacts([]);
  };

  const loc = LOCATIONS.find((l) => l.id === selectedLocation);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {!isExploring && !encounterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Compass className="w-3.5 h-3.5" />
                Junior Investigator
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Town Square</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Strange creatures have been sighted across town. Pick a location and investigate.
              </p>
            </motion.div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{journalCount}/{CREATURES.length} catalogued</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Eye className="w-3.5 h-3.5" />
                <span>{state.totalEncounters} encounter{state.totalEncounters !== 1 ? "s" : ""}</span>
              </div>
              {hasGadget("scanner") && (
                <Badge variant="secondary" className="text-xs">Scanner Active</Badge>
              )}
              {hasGadget("trap_camera") && (
                <Badge variant="secondary" className="text-xs">Trap Camera Ready</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {LOCATIONS.map((location, i) => {
                const Icon = LOCATION_ICONS[location.id];
                const accentClass = LOCATION_ACCENT[location.id];
                const gradient = LOCATION_GRADIENTS[location.id];
                const glow = LOCATION_GLOW[location.id];
                const creaturesHere = getCreaturesForLocation(location.id);
                const discoveredHere = creaturesHere.filter((c) =>
                  state.journal.some((j) => j.creatureId === c.id)
                );

                return (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card
                      className={`border-0 bg-gradient-to-br ${gradient} cursor-pointer group relative overflow-visible ${glow} transition-shadow duration-300`}
                      onClick={() => handleStartExploration(location.id)}
                      data-testid={`card-location-${location.id}`}
                    >
                      <CardContent className="p-0 relative">
                        <div className="absolute top-0 right-0 overflow-hidden rounded-tr-lg rounded-bl-lg opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                          <Icon className="w-24 h-24 -mt-4 -mr-4 text-white" />
                        </div>

                        <div className="p-6 space-y-3 relative">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                              <Icon className={`w-4.5 h-4.5 ${accentClass}`} />
                            </div>
                            <div>
                              <span className="font-bold text-white text-lg leading-tight block">{location.name}</span>
                              <span className="text-white/40 text-xs">{discoveredHere.length}/{creaturesHere.length} discovered</span>
                            </div>
                          </div>
                          <p className="text-white/65 text-sm leading-relaxed">{location.description}</p>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {creaturesHere.map((c) => {
                              const found = state.journal.some((j) => j.creatureId === c.id);
                              return (
                                <div
                                  key={c.id}
                                  className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                    found ? "bg-white/15" : "bg-white/5"
                                  }`}
                                >
                                  {found ? (
                                    <CreatureSprite creatureId={c.id} size="sm" animate={false} />
                                  ) : (
                                    <span className="text-white/20 text-xs font-mono">?</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="border-t border-white/10 px-6 py-3 flex items-center justify-between gap-2">
                          <span className={`text-xs italic ${accentClass} opacity-70`}>{location.hint}</span>
                          <div className="flex items-center gap-1 text-white/30 group-hover:text-white/60 transition-colors">
                            <span className="text-xs">Enter</span>
                            <Sparkles className="w-3 h-3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {journalCount === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-4 space-y-1"
              >
                <p className="text-sm text-muted-foreground italic">
                  "Click on any location to begin your investigation..."
                </p>
              </motion.div>
            )}
          </>
        )}

        {isExploring && loc && (
          <ExplorationView
            locationId={loc.id}
            locationName={loc.name}
            discoveredSymbols={state.discoveredSymbols}
            solvedCiphers={state.solvedCiphers}
            hasMap={hasGadget("map")}
            onUseMap={() => useGadget("map")}
            onComplete={handleExplorationComplete}
            onLeave={handleExplorationLeave}
          />
        )}
      </div>

      {foundCreature && (
        <CreatureEncounter
          creature={foundCreature}
          open={encounterOpen}
          onClose={handleEncounterClose}
          hasScanner={hasGadget("scanner")}
          hasTrapCamera={hasGadget("trap_camera")}
          onUseGadget={(id) => useGadget(id)}
          onResult={handleEncounterResult}
        />
      )}
    </div>
  );
}
