import { z } from "zod";

export type CreatureType = "Tech" | "Nature" | "Weird" | "Shadow" | "Pixel" | "Water" | "Glitch" | "Deep";
export type EncounterAction = "befriend" | "battle" | "study";
export type JournalStatus = "befriended" | "battled" | "studied";
export type GadgetId = "trap_camera" | "scanner" | "decoder_wheel" | "map" | "creature_lure" | "stun_pulser" | "preservation_jar";
export type ArtifactId =
  | "old_gear"
  | "glowing_mushroom"
  | "shadow_dust"
  | "circuit_board"
  | "strange_feather"
  | "cave_crystal"
  | "ancient_book"
  | "static_chip"
  | "chemical_vial"
  | "pixel_shard"
  | "rusty_anchor"
  | "signal_fragment"
  | "collector_key";

export interface Creature {
  id: string;
  name: string;
  type: CreatureType;
  rarity: "common" | "uncommon" | "rare";
  description: string;
  lore: string;
  cipherClue: string;
  decodedSecret: string;
  weakAgainst: CreatureType;
  strongAgainst: CreatureType;
  locations: string[];
  battlePower: number;
  friendliness: number;
  artSymbol: string;
}

export interface JournalEntry {
  creatureId: string;
  status: JournalStatus;
  discoveredAt: string;
  cipherSolved: boolean;
}

export interface Artifact {
  id: ArtifactId;
  name: string;
  description: string;
  icon: string;
}

export interface Gadget {
  id: GadgetId;
  name: string;
  description: string;
  effect: string;
  recipe: { artifactId: ArtifactId; quantity: number }[];
}

export interface PlayerInventory {
  artifacts: { [key in ArtifactId]?: number };
  /** @deprecated Use gadgetUses. Kept for migration. */
  gadgets?: GadgetId[];
  /** Consumable uses per gadget. Each craft adds 1 use. */
  gadgetUses?: Partial<Record<GadgetId, number>>;
}

export type UpgradeId = "acoustic_dampening" | "overclocked_emitter" | "optic_augmentation" | "deep_sea_submersible";

export interface Upgrade {
  id: UpgradeId;
  name: string;
  description: string;
  effect: string;
  cost: { artifactId: ArtifactId; quantity: number }[];
}

export interface GameState {
  playerName: string;
  journal: JournalEntry[];
  inventory: PlayerInventory;
  upgrades?: Record<UpgradeId, boolean>;
  currentLocation: string | null;
  totalEncounters: number;
  solvedCiphers: string[];
  discoveredSymbols: string[];
  collectedLore: string[];
}

export type SceneType = "discovery" | "puzzle" | "choice" | "encounter";
export type PuzzleType =
  | "pattern_memory"
  | "symbol_cipher"
  | "riddle"
  | "echo_sequence"
  | "chemical_mix"
  | "pixel_match"
  | "tide_timing"
  | "frequency_tune"
  | "artifact_sort"
  | "morse_code"
  | "wire_connection"
  | "mastermind";

export interface SceneHotspot {
  id: string;
  label: string;
  description: string;
  reward?: { type: "artifact"; artifactId: ArtifactId } | { type: "symbol"; symbolKey: string } | { type: "lore"; text: string };
  hidden?: boolean;
  unlockedBySecret?: string;
}

export interface SceneChoice {
  id: string;
  label: string;
  description: string;
  outcome: string;
  reward?: { type: "artifact"; artifactId: ArtifactId } | { type: "lore"; text: string };
}

export interface PuzzleConfig {
  puzzleType: PuzzleType;
  difficulty: 1 | 2 | 3;
  data:
  | PatternMemoryData
  | SymbolCipherData
  | RiddleData
  | EchoSequenceData
  | ChemicalMixData
  | PixelMatchData
  | TideTimingData
  | FrequencyTuneData
  | ArtifactSortData
  | MorseCodeData
  | WireConnectionData
  | MastermindData;
}

export interface PatternMemoryData {
  symbols: string[];
  sequence: number[];
  displayTime: number;
}

export interface SymbolCipherData {
  encodedWord: string;
  answer: string;
  hintLetters: number[];
}

export interface RiddleData {
  question: string;
  options: string[];
  correctIndex: number;
  flavor: string;
}

export interface EchoSequenceData {
  symbols: string[];
  sequence: number[];
  rounds: number;
}

export interface ChemicalMixData {
  chemicals: { id: string; color: string; label: string }[];
  targetSequence: string[];
}

export interface PixelMatchData {
  pattern: number[][];
  options: number[][][];
  correctIndex: number;
  displayTime: number;
}

export interface TideTimingData {
  targetLevel: number;
  speed: number;
  rounds: number;
  tolerance: number;
}

export interface FrequencyTuneData {
  targetFrequency: number;
  startFrequency: number;
  tolerance: number;
  minFreq: number;
  maxFreq: number;
  /** Gain (amplitude) to match; user adjusts frequency and gain to match target sine wave. */
  targetGain: number;
  startGain: number;
  gainTolerance: number;
  minGain: number;
  maxGain: number;
  /** If set, when this creature's cipher is solved, show a "Broadcast on Channel Zero" option; lore is granted when used. */
  channelZeroUnlockedBySecret?: string;
  channelZeroLore?: string;
}

export interface MorseCodeData {
  word: string;
}

export interface ArtifactSortData {
  items: { id: string; name: string; description: string; category: string }[];
  categories: string[];
}
export interface WireConnectionData {
  gridSize: number; // e.g. 4 for 4x4
  startTile: { r: number; c: number };
  endTile: { r: number; c: number };
  timeLimit: number;
}

export interface MastermindData {
  codeLength: number;
  colors: string[]; // Options
  maxGuesses: number;
}

export interface ExplorationScene {
  id: string;
  locationId: string;
  type: SceneType;
  title: string;
  description: string;
  atmosphere: string;
  hotspots?: SceneHotspot[];
  choices?: SceneChoice[];
  puzzle?: PuzzleConfig;
  rewardArtifact?: ArtifactId;
}

export interface BattleState {
  playerHP: number;
  creatureHP: number;
  round: number;
  log: string[];
  playerGadget?: GadgetId;
}

export type ReflectorId = "direct" | "alpha" | "beta";

export interface CipherMachineSettings {
  shift: number;
  plugboard: [string, string][];
}

function applyPlugboardIndex(code: number, plugboard: [string, string][]): number {
  for (const [a, b] of plugboard) {
    if (!a || !b) continue;
    const ai = a.toUpperCase().charCodeAt(0) - 65;
    const bi = b.toUpperCase().charCodeAt(0) - 65;
    if (code === ai) return bi;
    if (code === bi) return ai;
  }
  return code;
}

export function runCipherMachine(
  text: string,
  settings: CipherMachineSettings,
  direction: "encode" | "decode" = "encode"
): string {
  const { shift, plugboard } = settings;

  return text
    .split("")
    .map((char) => {
      if (!char.match(/[a-zA-Z]/)) return char;
      const isUpper = char === char.toUpperCase();
      let code = char.toUpperCase().charCodeAt(0) - 65;

      if (direction === "encode") {
        code = applyPlugboardIndex(code, plugboard);
        code = (code + shift + 26) % 26;
      } else {
        code = (code - shift + 26) % 26;
        code = applyPlugboardIndex(code, plugboard);
      }

      const result = String.fromCharCode(code + 65);
      return isUpper ? result : result.toLowerCase();
    })
    .join("");
}

export const DEFAULT_CIPHER_MACHINE_SETTINGS: CipherMachineSettings = {
  shift: 3,
  plugboard: [],
};

/** Mirror letter for symbol plugboard: A↔Z, B↔Y, etc. */
function mirrorLetter(L: string): string {
  const code = L.toUpperCase().charCodeAt(0);
  if (code < 65 || code > 90) return L;
  return String.fromCharCode(155 - code);
}

/**
 * Build plugboard from discovered symbol keys. Each pair is (letter, mirror):
 * if both L and mirror(L) are in symbols, they swap. Max 2 pairs.
 */
export function derivePlugboardFromSymbols(symbolKeys: string[]): [string, string][] {
  const set = new Set(symbolKeys.map((k) => k.toUpperCase().replace(/[^A-Z]/g, "")).filter(Boolean));
  const pairs: [string, string][] = [];
  const used = new Set<string>();
  for (const k of Array.from(set)) {
    if (k.length !== 1) continue;
    const m = mirrorLetter(k);
    if (m === k) continue;
    if (!set.has(m)) continue;
    const key = [k, m].sort().join(",");
    if (used.has(key)) continue;
    used.add(key);
    pairs.push([k, m]);
    if (pairs.length >= 2) break;
  }
  return pairs;
}

/** Plugboard used to encode creature ciphers. Decode with same pairs from discovered symbols (A&Z, B&Y). */
export const SYMBOL_PLUGBOARD_FOR_CIPHERS: [string, string][] = [["A", "Z"], ["B", "Y"]];

/**
 * Generate a random plugboard with 1 or 2 letter pairs. No letter appears in more than one pair.
 */
export function generateRandomPlugboard(numPairs: 1 | 2): [string, string][] {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const shuffled = [...letters].sort(() => Math.random() - 0.5);
  const used = new Set<string>();
  const pairs: [string, string][] = [];
  let i = 0;
  while (pairs.length < numPairs && i < shuffled.length - 1) {
    const a = shuffled[i];
    const b = shuffled[i + 1];
    i += 2;
    if (used.has(a) || used.has(b)) continue;
    used.add(a);
    used.add(b);
    pairs.push([a, b]);
  }
  return pairs;
}

/**
 * Re-encode one or more plaintext secrets with the cipher machine using the given shift
 * and 1–2 random letter swaps (plugboard). Returns the new cipher texts and the plugboard
 * used so decoding can use the same pairs.
 */
export function reencodeWithRandomSwaps(
  plaintexts: string[],
  options: { shift?: number; numSwaps?: 1 | 2 } = {}
): { cipherTexts: string[]; plugboard: [string, string][] } {
  const shift = options.shift ?? DEFAULT_CIPHER_MACHINE_SETTINGS.shift;
  const numPairs = options.numSwaps ?? 2;
  const plugboard = generateRandomPlugboard(numPairs === 1 ? 1 : 2);
  const settings: CipherMachineSettings = { shift, plugboard };
  const cipherTexts = plaintexts.map((text) => runCipherMachine(text, settings, "encode"));
  return { cipherTexts, plugboard };
}

export const CIPHER_SHIFT = 3;

export function encodeCaesar(text: string, shift: number = CIPHER_SHIFT): string {
  return text
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      if (char.match(/[A-Z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return char;
    })
    .join("");
}

export function decodeCaesar(text: string, shift: number = CIPHER_SHIFT): string {
  return encodeCaesar(text, 26 - shift);
}
