import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  Package,
  Eye,
  BookOpen,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import type {
  ExplorationScene,
  ArtifactId,
  Creature,
  PatternMemoryData,
  SymbolCipherData,
  RiddleData,
  EchoSequenceData,
  ChemicalMixData,
  PixelMatchData,
  TideTimingData,
  FrequencyTuneData,
  ArtifactSortData,
  MorseCodeData,
} from "@shared/schema";
import { generateExplorationSequence, SYMBOL_ALPHABET } from "@/lib/explorationData";
import { ARTIFACTS } from "@/lib/gameData";
import { PatternMemory } from "@/components/puzzles/PatternMemory";
import { SymbolCipher } from "@/components/puzzles/SymbolCipher";
import { RiddleChallenge } from "@/components/puzzles/RiddleChallenge";
import { EchoSequence } from "@/components/puzzles/EchoSequence";
import { ChemicalMix } from "@/components/puzzles/ChemicalMix";
import { PixelMatch } from "@/components/puzzles/PixelMatch";
import { TideTiming } from "@/components/puzzles/TideTiming";
import { FrequencyTune } from "@/components/puzzles/FrequencyTune";
import { ArtifactSort } from "@/components/puzzles/ArtifactSort";
import { MorseCodePuzzle } from "@/components/puzzles/MorseCodePuzzle";

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

function LocationDecoration({ locationId }: { locationId: string }) {
  switch (locationId) {
    case "forest":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-emerald-400">
            <path d="M30 110 L45 60 L15 60 Z" />
            <path d="M30 90 L50 40 L10 40 Z" />
            <path d="M70 110 L90 50 L50 50 Z" />
            <path d="M70 85 L95 30 L45 30 Z" />
            <path d="M120 110 L140 55 L100 55 Z" />
            <path d="M120 80 L145 25 L95 25 Z" />
            <path d="M160 110 L175 65 L145 65 Z" />
            <path d="M160 90 L180 45 L140 45 Z" />
            <circle cx="50" cy="105" r="3" opacity="0.6" />
            <circle cx="90" cy="108" r="2" opacity="0.4" />
            <circle cx="140" cy="106" r="2.5" opacity="0.5" />
          </g>
        </svg>
      );
    case "library":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-blue-400">
            <rect x="10" y="30" width="12" height="80" rx="1" />
            <rect x="25" y="20" width="10" height="90" rx="1" />
            <rect x="38" y="35" width="14" height="75" rx="1" />
            <rect x="55" y="25" width="11" height="85" rx="1" />
            <rect x="70" y="40" width="13" height="70" rx="1" />
            <rect x="86" y="22" width="10" height="88" rx="1" />
            <rect x="100" y="30" width="15" height="80" rx="1" />
            <rect x="118" y="28" width="11" height="82" rx="1" />
            <rect x="132" y="38" width="14" height="72" rx="1" />
            <rect x="150" y="20" width="10" height="90" rx="1" />
            <rect x="164" y="32" width="12" height="78" rx="1" />
            <rect x="180" y="25" width="13" height="85" rx="1" />
            <line x1="5" y1="110" x2="198" y2="110" stroke="currentColor" strokeWidth="2" />
          </g>
        </svg>
      );
    case "school":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-purple-400">
            <rect x="10" y="20" width="180" height="90" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="35" x2="190" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="10" y1="50" x2="190" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="10" y1="65" x2="190" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="10" y1="80" x2="190" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="10" y1="95" x2="190" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <text x="25" y="48" fontSize="8" fill="currentColor" opacity="0.5">x + ? = 13</text>
            <text x="100" y="63" fontSize="8" fill="currentColor" opacity="0.5">WHO WAS HERE</text>
            <text x="40" y="78" fontSize="8" fill="currentColor" opacity="0.5">DO NOT OPEN</text>
          </g>
        </svg>
      );
    case "cave":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-slate-300">
            <polygon points="30,100 40,50 50,100" />
            <polygon points="60,100 68,60 76,100" opacity="0.7" />
            <polygon points="100,100 112,40 124,100" />
            <polygon points="140,100 148,55 156,100" opacity="0.8" />
            <polygon points="170,100 182,45 194,100" opacity="0.6" />
            <polygon points="20,20 30,80 10,80" opacity="0.5" />
            <polygon points="80,10 88,65 72,65" opacity="0.4" />
            <polygon points="150,15 158,60 142,60" opacity="0.5" />
            <circle cx="45" cy="70" r="2" opacity="0.6" />
            <circle cx="115" cy="55" r="3" opacity="0.5" />
            <circle cx="175" cy="65" r="2" opacity="0.7" />
          </g>
        </svg>
      );
    case "lab":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-cyan-400">
            <path d="M30 110 L30 50 L20 50 L20 45 L40 45 L40 50 L30 50 L30 110 Z" opacity="0.6" />
            <path d="M25 110 L22 80 L38 80 L35 110 Z" />
            <circle cx="30" cy="90" r="3" opacity="0.4" />
            <circle cx="28" cy="85" r="2" opacity="0.3" />
            <path d="M70 110 L70 40 L60 40 L60 35 L80 35 L80 40 L70 40 L70 110 Z" opacity="0.6" />
            <path d="M65 110 L62 70 L78 70 L75 110 Z" />
            <circle cx="70" cy="85" r="4" opacity="0.5" />
            <rect x="100" y="60" width="30" height="50" rx="2" opacity="0.3" />
            <rect x="105" y="65" width="8" height="6" rx="1" opacity="0.5" />
            <rect x="117" y="65" width="8" height="6" rx="1" opacity="0.5" />
            <rect x="105" y="75" width="8" height="6" rx="1" opacity="0.4" />
            <line x1="140" y1="70" x2="180" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <line x1="140" y1="80" x2="175" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <circle cx="160" cy="95" r="8" opacity="0.2" />
            <circle cx="160" cy="95" r="4" opacity="0.3" />
          </g>
        </svg>
      );
    case "arcade":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-pink-400">
            <rect x="10" y="20" width="35" height="90" rx="3" opacity="0.4" />
            <rect x="15" y="28" width="25" height="18" rx="2" opacity="0.6" />
            <circle cx="27" cy="60" r="4" opacity="0.5" />
            <rect x="22" y="70" width="3" height="8" rx="1" opacity="0.4" />
            <rect x="28" y="68" width="3" height="8" rx="1" opacity="0.4" />
            <rect x="60" y="25" width="35" height="85" rx="3" opacity="0.3" />
            <rect x="65" y="32" width="25" height="18" rx="2" opacity="0.5" />
            <rect x="110" y="30" width="35" height="80" rx="3" opacity="0.35" />
            <rect x="115" y="37" width="25" height="18" rx="2" opacity="0.55" />
            <rect x="155" y="22" width="35" height="88" rx="3" opacity="0.25" />
            <rect x="160" y="30" width="25" height="18" rx="2" opacity="0.45" />
            <rect x="50" y="100" width="4" height="4" opacity="0.6" />
            <rect x="56" y="96" width="4" height="4" opacity="0.5" />
            <rect x="62" y="102" width="4" height="4" opacity="0.4" />
          </g>
        </svg>
      );
    case "dock":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-sky-400">
            <rect x="40" y="50" width="6" height="60" rx="1" opacity="0.5" />
            <rect x="80" y="45" width="6" height="65" rx="1" opacity="0.4" />
            <rect x="120" y="55" width="6" height="55" rx="1" opacity="0.5" />
            <rect x="160" y="48" width="6" height="62" rx="1" opacity="0.4" />
            <rect x="30" y="50" width="150" height="5" rx="1" opacity="0.3" />
            <path d="M0 85 Q25 75 50 85 Q75 95 100 85 Q125 75 150 85 Q175 95 200 85 L200 120 L0 120 Z" opacity="0.2" />
            <path d="M0 90 Q25 80 50 90 Q75 100 100 90 Q125 80 150 90 Q175 100 200 90 L200 120 L0 120 Z" opacity="0.15" />
            <circle cx="70" cy="100" r="2" opacity="0.3" />
            <circle cx="140" cy="95" r="3" opacity="0.2" />
          </g>
        </svg>
      );
    case "tower":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-amber-400">
            <rect x="95" y="10" width="10" height="100" rx="1" opacity="0.5" />
            <rect x="85" y="30" width="30" height="5" rx="1" opacity="0.4" />
            <rect x="80" y="50" width="40" height="5" rx="1" opacity="0.3" />
            <rect x="75" y="70" width="50" height="5" rx="1" opacity="0.3" />
            <line x1="100" y1="10" x2="60" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <line x1="100" y1="10" x2="140" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <circle cx="100" cy="10" r="3" opacity="0.6" />
            <path d="M30 95 Q40 90 50 95 Q60 100 70 95" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M130 90 Q140 85 150 90 Q160 95 170 90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M20 100 Q35 95 50 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <path d="M150 100 Q165 95 180 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          </g>
        </svg>
      );
    case "house":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-24 opacity-10 pointer-events-none">
          <g fill="currentColor" className="text-rose-400">
            <polygon points="100,15 160,55 40,55" opacity="0.4" />
            <rect x="50" y="55" width="100" height="55" rx="2" opacity="0.3" />
            <rect x="85" y="80" width="20" height="30" rx="1" opacity="0.5" />
            <rect x="58" y="62" width="18" height="15" rx="1" opacity="0.4" />
            <rect x="124" y="62" width="18" height="15" rx="1" opacity="0.4" />
            <line x1="67" y1="62" x2="67" y2="77" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="58" y1="70" x2="76" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="133" y1="62" x2="133" y2="77" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="124" y1="70" x2="142" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <rect x="20" y="45" width="15" height="65" rx="1" opacity="0.2" />
            <rect x="22" y="48" width="4" height="5" rx="0.5" opacity="0.3" />
            <rect x="28" y="48" width="4" height="5" rx="0.5" opacity="0.3" />
            <rect x="22" y="56" width="4" height="5" rx="0.5" opacity="0.3" />
            <rect x="165" y="40" width="15" height="70" rx="1" opacity="0.2" />
            <rect x="167" y="43" width="4" height="5" rx="0.5" opacity="0.3" />
            <rect x="173" y="43" width="4" height="5" rx="0.5" opacity="0.3" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}

interface Props {
  locationId: string;
  locationName: string;
  discoveredSymbols: string[];
  solvedCiphers: string[];
  hasMap: boolean;
  onUseMap: () => void;
  onComplete: (collectedArtifacts: ArtifactId[], discoveredSymbolKeys: string[], loreTexts: string[]) => void;
  onLeave: (collectedArtifacts: ArtifactId[], discoveredSymbolKeys: string[], loreTexts: string[]) => void;
}

export function ExplorationView({ locationId, locationName, discoveredSymbols, solvedCiphers, hasMap, onUseMap, onComplete, onLeave }: Props) {
  const [scenes, setScenes] = useState<ExplorationScene[]>(() => generateExplorationSequence(locationId));
  const [mapUsed, setMapUsed] = useState(false);
  const [showMapChoice, setShowMapChoice] = useState(hasMap);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectedArtifacts, setCollectedArtifacts] = useState<ArtifactId[]>([]);
  const [discoveredSymbolKeys, setDiscoveredSymbolKeys] = useState<string[]>([]);
  const [loreTexts, setLoreTexts] = useState<string[]>([]);
  const [examinedHotspots, setExaminedHotspots] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [choiceMade, setChoiceMade] = useState<string | null>(null);
  const [choiceOutcome, setChoiceOutcome] = useState<string | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [sceneComplete, setSceneComplete] = useState(false);

  const scene = scenes[currentIndex];
  const isLastScene = currentIndex === scenes.length - 1;
  const gradient = LOCATION_GRADIENTS[locationId] || LOCATION_GRADIENTS.forest;
  const accent = LOCATION_ACCENT[locationId] || LOCATION_ACCENT.forest;
  const glow = LOCATION_GLOW[locationId] || LOCATION_GLOW.forest;

  const handleMapChoice = useCallback((firstStop: "discovery" | "puzzle" | "choice" | "skip") => {
    setShowMapChoice(false);
    setMapUsed(true);
    if (firstStop === "skip") return;
    onUseMap();
    if (firstStop === "puzzle" || firstStop === "discovery" || firstStop === "choice") {
      setScenes((prev) => {
        const idx = prev.findIndex((s) => s.type === firstStop);
        if (idx <= 0) return prev;
        const copy = [...prev];
        const [scene] = copy.splice(idx, 1);
        copy.unshift(scene);
        return copy;
      });
    }
  }, [onUseMap]);

  const collectReward = useCallback((reward: NonNullable<ExplorationScene["hotspots"]>[0]["reward"]) => {
    if (!reward) return;
    if (reward.type === "artifact") {
      setCollectedArtifacts((prev) => [...prev, reward.artifactId]);
    } else if (reward.type === "symbol") {
      setDiscoveredSymbolKeys((prev) =>
        prev.includes(reward.symbolKey) ? prev : [...prev, reward.symbolKey]
      );
    } else if (reward.type === "lore") {
      setLoreTexts((prev) => [...prev, reward.text]);
    }
  }, []);

  const handleHotspotClick = (hotspot: NonNullable<ExplorationScene["hotspots"]>[0]) => {
    if (examinedHotspots.includes(hotspot.id)) return;
    setActiveHotspot(hotspot.id);
    setExaminedHotspots((prev) => [...prev, hotspot.id]);
    if (hotspot.reward) collectReward(hotspot.reward);
  };

  const handleChoice = (choice: NonNullable<ExplorationScene["choices"]>[0]) => {
    setChoiceMade(choice.id);
    setChoiceOutcome(choice.outcome);
    if (choice.reward) collectReward(choice.reward);
  };

  const handlePuzzleComplete = (success: boolean, extraLore?: string[]) => {
    setPuzzleSolved(true);
    if (success && scene.rewardArtifact) {
      setCollectedArtifacts((prev) => [...prev, scene.rewardArtifact!]);
    }
    if (extraLore?.length) {
      setLoreTexts((prev) => [...prev, ...extraLore]);
    }
    setSceneComplete(true);
  };

  const handleAdvance = () => {
    if (isLastScene) {
      onComplete(collectedArtifacts, discoveredSymbolKeys, loreTexts);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setActiveHotspot(null);
    setChoiceMade(null);
    setChoiceOutcome(null);
    setPuzzleSolved(false);
    setSceneComplete(false);
    setExaminedHotspots([]);
  };

  const handleLeave = () => {
    onLeave(collectedArtifacts, discoveredSymbolKeys, loreTexts);
  };

  const canAdvance = (() => {
    if (scene.type === "discovery") return examinedHotspots.length > 0 || sceneComplete;
    if (scene.type === "choice") return choiceMade !== null;
    if (scene.type === "puzzle") return puzzleSolved;
    if (scene.type === "encounter") return true;
    return true;
  })();

  const renderSceneContent = () => {
    switch (scene.type) {
      case "discovery": {
        const visibleHotspots = (scene.hotspots || []).filter((h) => {
          if (!h.hidden) return true;
          return h.unlockedBySecret && solvedCiphers.includes(h.unlockedBySecret);
        });
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1">
              <Search className="w-3 h-3" /> Investigate
            </div>
            <div className="grid grid-cols-1 gap-2">
              {visibleHotspots.map((hotspot) => {
                const examined = examinedHotspots.includes(hotspot.id);
                const isActive = activeHotspot === hotspot.id;
                const isSecretHotspot = !!hotspot.hidden;
                return (
                  <motion.button
                    key={hotspot.id}
                    initial={isSecretHotspot ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={!examined ? { scale: 0.98 } : {}}
                    onClick={() => handleHotspotClick(hotspot)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all ${examined
                        ? "border-white/20 bg-white/5"
                        : isSecretHotspot
                          ? "border-primary/40 bg-primary/10 cursor-pointer"
                          : "border-white/10 bg-white/5 cursor-pointer"
                      }`}
                    data-testid={`hotspot-${hotspot.id}`}
                    disabled={examined}
                  >
                    <div className="flex items-start gap-3">
                      {!examined && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${isSecretHotspot ? "bg-primary" : "bg-yellow-400"
                            }`}
                        />
                      )}
                      {examined && (
                        <Eye className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${examined ? "text-white/40" : "text-white"}`}>
                            {hotspot.label}
                          </span>
                          {isSecretHotspot && !examined && (
                            <Badge className="text-[10px] bg-primary/20 text-primary border-primary/30 px-1.5 py-0">
                              Secret
                            </Badge>
                          )}
                        </div>
                        <AnimatePresence>
                          {(isActive || examined) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs text-white/60 mt-1 leading-relaxed">{hotspot.description}</p>
                              {examined && hotspot.reward && (
                                <div className="mt-2 flex items-center gap-1.5">
                                  {hotspot.reward.type === "artifact" && (
                                    <Badge className="text-xs bg-yellow-600/30 text-yellow-300 border-yellow-600/50">
                                      <Package className="w-3 h-3 mr-1" />
                                      +{ARTIFACTS[hotspot.reward.artifactId]?.name}
                                    </Badge>
                                  )}
                                  {hotspot.reward.type === "symbol" && (
                                    <Badge className="text-xs bg-purple-600/30 text-purple-300 border-purple-600/50">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      Symbol learned: {SYMBOL_ALPHABET[hotspot.reward.symbolKey]} = {hotspot.reward.symbolKey}
                                    </Badge>
                                  )}
                                  {hotspot.reward.type === "lore" && (
                                    <div className="bg-white/5 border border-white/10 rounded-md p-2 mt-1">
                                      <div className="text-xs text-white/50 flex items-center gap-1 mb-1">
                                        <BookOpen className="w-3 h-3" /> Lore Discovered
                                      </div>
                                      <p className="text-xs text-white/70 italic">{hotspot.reward.text}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      }

      case "choice":
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Choose Your Path
            </div>
            {!choiceMade && (
              <div className="grid grid-cols-1 gap-2">
                {scene.choices?.map((choice) => (
                  <motion.button
                    key={choice.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left p-4 rounded-lg border border-white/15 bg-white/5 cursor-pointer transition-all"
                    data-testid={`choice-${choice.id}`}
                  >
                    <div className="font-semibold text-sm text-white">{choice.label}</div>
                    <p className="text-xs text-white/50 mt-1">{choice.description}</p>
                  </motion.button>
                ))}
              </div>
            )}
            {choiceMade && choiceOutcome && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="bg-white/5 border border-white/15 rounded-lg p-4">
                  <p className="text-sm text-white/80 leading-relaxed">{choiceOutcome}</p>
                </div>
                {scene.choices?.find((c) => c.id === choiceMade)?.reward && (() => {
                  const reward = scene.choices!.find((c) => c.id === choiceMade)!.reward!;
                  return (
                    <div className="flex items-center gap-2">
                      {reward.type === "artifact" && (
                        <Badge className="text-xs bg-yellow-600/30 text-yellow-300 border-yellow-600/50">
                          <Package className="w-3 h-3 mr-1" />
                          +{ARTIFACTS[reward.artifactId]?.name}
                        </Badge>
                      )}
                      {reward.type === "lore" && (
                        <div className="bg-white/5 border border-white/10 rounded-md p-2">
                          <p className="text-xs text-white/70 italic">{reward.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>
        );

      case "puzzle":
        return (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Puzzle
            </div>
            <div className="bg-background/90 backdrop-blur-sm rounded-xl p-4 border border-border">
              {scene.puzzle?.puzzleType === "pattern_memory" && (
                <PatternMemory
                  data={scene.puzzle.data as PatternMemoryData}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "symbol_cipher" && (
                <SymbolCipher
                  data={scene.puzzle.data as SymbolCipherData}
                  discoveredSymbols={[...discoveredSymbols, ...discoveredSymbolKeys]}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "riddle" && (
                <RiddleChallenge
                  data={scene.puzzle.data as RiddleData}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "echo_sequence" && (
                <EchoSequence
                  data={scene.puzzle.data as EchoSequenceData}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "chemical_mix" && (
                <ChemicalMix
                  data={scene.puzzle.data as ChemicalMixData}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "pixel_match" && (
                <PixelMatch
                  data={scene.puzzle.data as PixelMatchData}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "tide_timing" && (
                <TideTiming
                  data={scene.puzzle.data as TideTimingData}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "frequency_tune" && (
                <FrequencyTune
                  data={scene.puzzle.data as FrequencyTuneData}
                  solvedCiphers={solvedCiphers}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "artifact_sort" && (
                <ArtifactSort
                  data={scene.puzzle.data as ArtifactSortData}
                  onComplete={handlePuzzleComplete}
                />
              )}
              {scene.puzzle?.puzzleType === "morse_code" && (
                <MorseCodePuzzle
                  data={scene.puzzle.data as MorseCodeData}
                  onComplete={handlePuzzleComplete}
                />
              )}
            </div>
          </div>
        );

      case "encounter":
        return (
          <div className="text-center space-y-4 py-4">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto"
            >
              <Sparkles className="w-8 h-8 text-white/60" />
            </motion.div>
            <div>
              <div className="text-white font-bold text-lg">Something stirs...</div>
              <p className="text-white/50 text-sm mt-1">A creature emerges from the shadows.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {showMapChoice ? (
        <>
          <div className="flex justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={handleLeave} className="text-muted-foreground">
              <ArrowLeft className="w-3 h-3 mr-1" /> Leave {locationName}
            </Button>
          </div>
          <Card className={`bg-gradient-to-br ${gradient} border-0 ${glow} overflow-hidden`}>
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <MapPin className="w-10 h-10 text-white/80" />
                </div>
                <h2 className="text-xl font-bold text-white">Use your Location Map?</h2>
                <p className="text-sm text-white/70">Choose your first stop in {locationName}.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" className="h-auto py-3" onClick={() => handleMapChoice("discovery")}>
                  <Search className="w-4 h-4 mr-1" /> Discovery
                </Button>
                <Button variant="secondary" className="h-auto py-3" onClick={() => handleMapChoice("puzzle")}>
                  <AlertTriangle className="w-4 h-4 mr-1" /> Puzzle
                </Button>
                <Button variant="secondary" className="h-auto py-3" onClick={() => handleMapChoice("choice")}>
                  <BookOpen className="w-4 h-4 mr-1" /> Choice
                </Button>
                <Button variant="ghost" className="h-auto py-3 text-white/70 hover:text-white" onClick={() => handleMapChoice("skip")}>
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLeave}
              className="text-muted-foreground"
              data-testid="button-leave-exploration"
            >
              <ArrowLeft className="w-3 h-3 mr-1" /> Leave {locationName}
            </Button>
            <div className="flex items-center gap-1.5">
              {scenes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i < currentIndex
                      ? "w-6 bg-primary"
                      : i === currentIndex
                        ? "w-6 bg-primary/70"
                        : "w-3 bg-muted"
                    }`}
                />
              ))}
            </div>
          </div>

          {collectedArtifacts.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              {collectedArtifacts.map((id, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {ARTIFACTS[id]?.name}
                </Badge>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`bg-gradient-to-br ${gradient} border-0 ${glow} overflow-hidden relative`}>
                <div className="absolute bottom-0 left-0 right-0">
                  <LocationDecoration locationId={locationId} />
                </div>
                <CardContent className="p-6 space-y-4 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                        {scene.type === "encounter" ? "Encounter" : `Scene ${currentIndex + 1}`}
                      </div>
                      <div className="text-xs text-white/30">
                        {currentIndex + 1} / {scenes.length}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-white">{scene.title}</h2>
                    <p className="text-sm text-white/70 leading-relaxed">{scene.description}</p>
                    <p className={`text-xs italic ${accent} opacity-70`}>{scene.atmosphere}</p>
                  </div>

                  {renderSceneContent()}
                </CardContent>
              </Card>

              {canAdvance && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-center"
                >
                  <Button onClick={handleAdvance} data-testid="button-advance-scene">
                    {scene.type === "encounter" ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" /> Face the Creature
                      </>
                    ) : isLastScene ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" /> Continue
                      </>
                    ) : (
                      <>
                        Go Deeper <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
