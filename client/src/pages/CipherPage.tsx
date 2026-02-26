import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  Lock,
  Unlock,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  CheckCircle,
  KeyRound,
  Sparkles,
  Gift,
  Package,
  Cog,
  Cable,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGameState } from "@/lib/gameState";
import { CREATURES, TYPE_BADGE, ARTIFACTS } from "@/lib/gameData";
import { getSymbolForLetter } from "@/lib/explorationData";
import {
  CIPHER_SHIFT,
  runCipherMachine,
  type CipherMachineSettings,
} from "@shared/schema";
import type { ArtifactId } from "@shared/schema";
import { CreatureSprite } from "@/components/CreatureSprite";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function MiniWheel({ shift, label, color }: { shift: number; label: string; color: string }) {
  const shiftedAlphabet = ALPHABET.slice(shift) + ALPHABET.slice(0, shift);
  const radius = 56;
  const innerRadius = 40;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 160 160" className="w-48 h-48">
        <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
        <circle cx="80" cy="80" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
        {ALPHABET.split("").map((letter, i) => {
          const angle = (i * 360) / 26 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 80 + radius * Math.cos(rad);
          const y = 80 + radius * Math.sin(rad);
          const ix = 80 + innerRadius * Math.cos(rad);
          const iy = 80 + innerRadius * Math.sin(rad);
          return (
            <g key={i}>
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                className="fill-foreground" fontSize="6" fontFamily="monospace" fontWeight="bold">
                {letter}
              </text>
              <text x={ix} y={iy} textAnchor="middle" dominantBaseline="central"
                className={color} fontSize="5.5" fontFamily="monospace" fontWeight="600">
                {shiftedAlphabet[i]}
              </text>
            </g>
          );
        })}
        <circle cx="80" cy="80" r="16" fill="hsl(var(--muted))" opacity="0.3" />
        <text x="80" y="78" textAnchor="middle" dominantBaseline="central"
          className={color} fontSize="9" fontWeight="bold">+{shift}</text>
        <text x="80" y="88" textAnchor="middle" dominantBaseline="central"
          className="fill-muted-foreground" fontSize="5">{label}</text>
      </svg>
    </div>
  );
}

function normalize(text: string): string {
  return text.toUpperCase().replace(/[^A-Z]/g, "");
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

export default function CipherPage() {
  const { state, hasGadget, useGadget, solveCipher } = useGameState();
  const [inputText, setInputText] = useState("");
  const [encodeInput, setEncodeInput] = useState("");
  const [shift, setShift] = useState(0);
  const [plugboard, setPlugboard] = useState<[string, string][]>([]);
  const [activePlugLetter, setActivePlugLetter] = useState<string | null>(null);
  const [activeCipherId, setActiveCipherId] = useState<string | null>(null);

  const [lastReward, setLastReward] = useState<{
    creatureName: string;
    artifactId: ArtifactId | null;
  } | null>(null);
  const [mode, setMode] = useState<"decode" | "encode">("decode");

  const hasDecoder = hasGadget("decoder_wheel");

  const machineSettings: CipherMachineSettings = { shift, plugboard };

  // Helper to visually get plugboard connection
  const getPlugTarget = (letter: string) => {
    for (const [a, b] of plugboard) {
      if (a === letter) return b;
      if (b === letter) return a;
    }
    return null;
  };

  const handlePlugClick = (letter: string) => {
    // If clicking an already plugged letter, remove that specific pair
    const existingTarget = getPlugTarget(letter);
    if (existingTarget) {
      setPlugboard((prev) =>
        prev.filter(([a, b]) => !(a === letter || b === letter)),
      );
      if (activePlugLetter === letter) {
        setActivePlugLetter(null);
      }
      return;
    }

    if (!activePlugLetter) {
      // Start a new connection
      setActivePlugLetter(letter);
    } else {
      // Complete the connection
      if (activePlugLetter !== letter) {
        setPlugboard((prev) => [...prev, [activePlugLetter, letter]]);
      }
      setActivePlugLetter(null);
    }
  };

  const journalCreatures = state.journal
    .map((entry) => {
      const creature = CREATURES.find((c) => c.id === entry.creatureId);
      return { entry, creature };
    })
    .filter((x) => x.creature !== undefined);

  const unsolved = journalCreatures.filter((x) => !x.entry.cipherSolved);
  const solved = journalCreatures.filter((x) => x.entry.cipherSolved);

  // If we have an active cipher selected from the list, use that as input, otherwise use manual input
  const activeCreature = activeCipherId
    ? unsolved.find((u) => u.creature?.id === activeCipherId)?.creature
    : null;
  const currentDecodeInput = activeCreature
    ? activeCreature.cipherClue
    : inputText;

  const result = runCipherMachine(currentDecodeInput, machineSettings, "decode");
  const encoded = runCipherMachine(encodeInput, machineSettings, "encode");

  const discoveredSet = new Set(state.discoveredSymbols.map((s) => s.toUpperCase()));
  const resultMaskedForDisplay = result
    .split("")
    .map((ch) => {
      const upper = ch.toUpperCase();
      if (upper < "A" || upper > "Z") return ch;
      return discoveredSet.has(upper) ? upper : getSymbolForLetter(upper);
    })
    .join("");

  const matchedCreature = useMemo(() => {
    if (!result || result.trim().length < 5) return null;
    const normalizedResult = normalize(result);
    // If we have an active creature loaded, just check against that one
    if (activeCreature) {
      if (normalizedResult === normalize(activeCreature.decodedSecret)) {
        return activeCreature;
      }
      return null;
    }
    // Otherwise scan all unsolved (useful if they typed it manually)
    for (const { entry, creature } of journalCreatures) {
      if (!creature || entry.cipherSolved) continue;
      const normalizedSecret = normalize(creature.decodedSecret);
      if (normalizedResult === normalizedSecret) return creature;
    }
    return null;
  }, [result, activeCreature, journalCreatures]);

  const handleSolveCipher = (creatureId: string, creatureName: string) => {
    const reward = solveCipher(creatureId);
    if (hasDecoder) useGadget("decoder_wheel");
    setLastReward({ creatureName, artifactId: reward });
    setActiveCipherId(null);
    setTimeout(() => setLastReward(null), 4000);
  };

  const activePlugCount = plugboard.length;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <KeyRound className="w-3.5 h-3.5" />
            Cryptography
          </div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-cipher-title">Cipher Lab</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Configure the shift dial and manual plugboard to decrypt creature lore. Load an unsolved cipher from the list below into the Chamber to translate it live.
            {!hasDecoder && " Craft the Decoder Wheel at your base to bypass the machine entirely."}
          </p>
        </motion.div>

        <AnimatePresence>
          {lastReward && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <Card className="border-primary bg-primary/10">
                <CardContent className="py-4 text-center space-y-2">
                  <motion.div animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                    <Gift className="w-8 h-8 mx-auto text-primary" />
                  </motion.div>
                  <div className="font-semibold text-primary" data-testid="text-cipher-reward">
                    Secret Decoded: {lastReward.creatureName}
                  </div>
                  {lastReward.artifactId && (
                    <Badge className="bg-yellow-600/30 text-yellow-300 border-yellow-600/50">
                      <Package className="w-3 h-3 mr-1" />
                      +1 {ARTIFACTS[lastReward.artifactId]?.name}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6 items-start">
          {/* Left column: shift wheel + plugboard */}
          <div className="space-y-4 order-2 lg:order-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cog className="w-4 h-4" /> Shift Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex justify-center">
                  <div className="space-y-2 max-w-[200px] w-full">
                    <MiniWheel
                      shift={shift}
                      label="CAESAR SHIFT"
                      color="fill-blue-400"
                    />
                    <div className="flex items-center gap-2 px-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 flex-shrink-0"
                        onClick={() => setShift((w) => (w - 1 + 26) % 26)}
                        data-testid="button-wheel1-down"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <input
                          type="range"
                          min={0}
                          max={25}
                          value={shift}
                          onChange={(e) => setShift(Number(e.target.value))}
                          className="w-full accent-blue-400"
                          data-testid="slider-wheel1"
                        />
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          Shift Offset: +{shift}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 flex-shrink-0"
                        onClick={() => setShift((w) => (w + 1) % 26)}
                        data-testid="button-wheel1-up"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cable className="w-4 h-4" /> Manual Plugboard
                  </div>
                  {activePlugCount > 0 && (
                    <Badge variant="secondary" className="text-[10px]">
                      {activePlugCount} wire{activePlugCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </CardTitle>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  Click two letters to wire them together and swap their output.
                  Click a wired letter to safely unplug it.
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 justify-center mt-2">
                  {ALPHABET.split("").map((letter) => {
                    const target = getPlugTarget(letter);
                    const isWired = target !== null;
                    const isActive = activePlugLetter === letter;

                    return (
                      <button
                        key={letter}
                        onClick={() => handlePlugClick(letter)}
                        className={`
                          relative flex flex-col items-center justify-center p-1 rounded-md border text-sm font-mono font-bold transition-all
                          ${isWired
                            ? "bg-primary/20 border-primary text-primary hover:bg-destructive/10 hover:border-destructive hover:text-destructive group"
                            : isActive
                              ? "bg-amber-500/20 border-amber-500 text-amber-500 ring-2 ring-amber-500/50"
                              : "bg-muted/50 border-border text-foreground hover:bg-muted"
                          }
                        `}
                      >
                        <span>{letter}</span>
                        {isWired && (
                          <span className="text-[9px] font-semibold opacity-70 absolute -bottom-1 tracking-tighter group-hover:block">
                            ↔{target}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setShift(0);
                  setPlugboard([]);
                  setActivePlugLetter(null);
                  setActiveCipherId(null);
                  setInputText("");
                  setEncodeInput("");
                }}
                className="text-xs w-full sm:w-auto"
                data-testid="button-reset-machine"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset All Terminals
              </Button>
            </div>
          </div>

          {/* Right column: cipher chamber */}
          <div className="min-w-0 order-1 lg:order-2">
          <Card>
            <CardHeader className="pb-3 flex items-center justify-between gap-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FlaskConical className="w-4 h-4" /> Cipher Chamber
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Mode</span>
                <div className="inline-flex items-center rounded-full border border-border bg-muted px-1 py-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setMode("decode")}
                    className={`px-2 py-0.5 rounded-full font-semibold ${mode === "decode"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground"
                      }`}
                  >
                    Decode
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("encode")}
                    className={`px-2 py-0.5 rounded-full font-semibold ${mode === "encode"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground"
                      }`}
                  >
                    Encode
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === "decode" && activeCreature ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      Decrypting:{" "}
                      <span className="text-foreground">
                        {activeCreature.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px]"
                      onClick={() => setActiveCipherId(null)}
                    >
                      Clear Chamber
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-4 justify-center">
                    {currentDecodeInput.split(" ").map((word, wIdx) => (
                      <div key={wIdx} className="flex gap-1">
                        {word.split("").map((char, cIdx) => {
                          const isAlpha = char.match(/[A-Z]/i);
                          // We know result word structure matches input structure exactly in runCipherMachine
                          const decodedWordsCount = result.split(" ");
                          const decodedChar = isAlpha
                            ? decodedWordsCount[wIdx]?.[cIdx] ?? char
                            : char;
                          const showDecoded =
                            !isAlpha
                              ? decodedChar
                              : discoveredSet.has(decodedChar.toUpperCase())
                                ? decodedChar.toUpperCase()
                                : getSymbolForLetter(decodedChar.toUpperCase());
                          return (
                            <div
                              key={cIdx}
                              className="flex flex-col items-center gap-1"
                            >
                              <div className="w-7 h-9 md:w-8 md:h-10 flex items-center justify-center bg-muted/30 border border-border rounded text-muted-foreground font-mono text-xs md:text-sm uppercase shadow-sm">
                                {char}
                              </div>
                              <ArrowDown className="w-3 h-3 text-muted-foreground/30" />
                              <div
                                className={`w-8 h-10 md:w-9 md:h-11 flex items-center justify-center rounded-md font-mono text-sm md:text-base font-bold shadow-sm transition-colors ${isAlpha
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                                  }`}
                              >
                                {showDecoded}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 font-medium">
                      {mode === "decode"
                        ? "Encrypted Input (Manual)"
                        : "Plaintext Input"}
                    </div>
                    <textarea
                      value={mode === "decode" ? inputText : encodeInput}
                      onChange={(e) =>
                        mode === "decode"
                          ? setInputText(e.target.value)
                          : setEncodeInput(e.target.value)
                      }
                      placeholder={
                        mode === "decode"
                          ? "Load a creature cipher from below, or paste custom text here..."
                          : "Type a message to encode with the current physical settings..."
                      }
                      className="w-full min-h-[70px] px-3 py-2 text-sm font-mono rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid={
                        mode === "decode"
                          ? "input-cipher-text"
                          : "input-encode-text"
                      }
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <span>Input</span>
                    <ArrowDown className="w-3 h-3" />
                    <span>Dial Shift (+{shift})</span>
                    <ArrowDown className="w-3 h-3" />
                    <span>Plugboard ({plugboard.length} pairs)</span>
                    <ArrowDown className="w-3 h-3" />
                    <span>Output</span>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1 font-medium">
                      {mode === "decode"
                        ? "Decrypted Output"
                        : "Encoded Output"}
                    </div>
                    <div
                      className={`min-h-[70px] px-3 py-2 text-sm font-mono rounded-lg break-all whitespace-pre-wrap text-foreground ${mode === "decode"
                        ? "border-2 border-primary/20 bg-primary/5"
                        : "border border-border bg-muted/40"
                        }`}
                      data-testid={
                        mode === "decode"
                          ? "text-decrypt-output"
                          : "text-encode-output"
                      }
                    >
                      {(mode === "decode" ? resultMaskedForDisplay : encoded) || (
                        <span className="text-muted-foreground/40">
                          Output appears here...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {mode === "decode" && matchedCreature && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Card
                      className="border-2 border-primary bg-primary/5"
                      data-testid={`card-match-${matchedCreature.id}`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Sparkles className="w-5 h-5 text-primary" />
                          </motion.div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                              Secret Matched
                            </div>
                            <div className="font-semibold text-sm">{matchedCreature.name}</div>
                          </div>
                          <CreatureSprite creatureId={matchedCreature.id} size="sm" animate />
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleSolveCipher(matchedCreature.id, matchedCreature.name)}
                          data-testid={`button-confirm-match-${matchedCreature.id}`}
                        >
                          <Unlock className="w-3 h-3 mr-1" /> Confirm & Record Secret
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
          </div>
        </div>

        {unsolved.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" /> Unsolved Creature Ciphers
              <Badge variant="secondary" className="text-xs">{unsolved.length}</Badge>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unsolved.map(({ entry, creature }, i) => {
                if (!creature) return null;
                return (
                  <motion.div
                    key={creature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card data-testid={`card-unsolved-${creature.id}`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <CreatureSprite creatureId={creature.id} size="sm" animate={false} />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm">{creature.name}</div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${TYPE_BADGE[creature.type]}`}>
                              {creature.type}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-xs text-muted-foreground font-mono tracking-wider break-all bg-muted/50 p-2 rounded-md border border-border">
                            {maskCipherWithSymbols(creature.cipherClue, state.discoveredSymbols)}
                          </div>
                          <div className="text-xs text-muted-foreground/60 italic">
                            Discover more symbol meanings to reveal this encoded clue. Once you can read all the letters, paste it into the Cipher Chamber above.
                          </div>
                        </div>
                        {hasDecoder ? (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              handleSolveCipher(creature.id, creature.name)
                            }
                            data-testid={`button-solve-${creature.id}`}
                          >
                            <Unlock className="w-3 h-3 mr-1" /> Use Decoder
                            Wheel
                          </Button>
                        ) : activeCipherId === creature.id ? (
                          <div className="text-xs font-semibold text-center text-primary py-1 border border-primary/20 rounded-md bg-primary/10">
                            Currently inside the Chamber
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                              setActiveCipherId(creature.id);
                              setMode("decode");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            data-testid={`button-load-${creature.id}`}
                          >
                            <ArrowRight className="w-3 h-3 mr-1" /> Load into
                            Chamber
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {solved.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Solved Secrets
              <Badge variant="secondary" className="text-xs">{solved.length}</Badge>
            </h2>
            <div className="space-y-3">
              {solved.map(({ entry, creature }, i) => {
                if (!creature) return null;
                return (
                  <motion.div
                    key={creature.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-primary/20 bg-primary/5" data-testid={`card-solved-${creature.id}`}>
                      <CardContent className="p-4 flex items-start gap-3">
                        <CreatureSprite creatureId={creature.id} size="sm" animate={false} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-semibold text-sm">{creature.name}</span>
                          </div>
                          <p className="text-sm font-mono text-foreground">{creature.decodedSecret}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
