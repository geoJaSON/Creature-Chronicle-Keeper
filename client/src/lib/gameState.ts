import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import type { GameState, JournalEntry, JournalStatus, ArtifactId, GadgetId, UpgradeId } from "@shared/schema";
import { getCipherReward, CREATURES } from "@/lib/gameData";

const STORAGE_KEY = "mystery_creature_save";

/** All artifact IDs for debug "give all" */
const ALL_ARTIFACT_IDS: ArtifactId[] = [
  "old_gear", "glowing_mushroom", "shadow_dust", "circuit_board", "strange_feather",
  "cave_crystal", "ancient_book", "static_chip", "chemical_vial", "pixel_shard",
  "rusty_anchor", "signal_fragment", "collector_key",
];

const ALL_GADGET_IDS: GadgetId[] = ["trap_camera", "scanner", "decoder_wheel", "map"];
const ALL_SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type DebugRef = {
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  state: GameState;
  addJournalEntry: (creatureId: string, status: JournalStatus) => void;
  addArtifact: (id: ArtifactId, count?: number) => void;
  craftGadget: (id: GadgetId, recipe: { artifactId: ArtifactId; quantity: number }[]) => boolean;
  buyUpgrade: (id: UpgradeId, cost: { artifactId: ArtifactId; quantity: number }[]) => boolean;
  useGadget: (id: GadgetId) => boolean;
  solveCipher: (creatureId: string) => ArtifactId | null;
  addDiscoveredSymbol: (key: string) => void;
  addLoreText: (text: string) => void;
  resetGame: () => void;
} | null;

const debugRef: { current: DebugRef } = { current: null };

const DEFAULT_STATE: GameState = {
  playerName: "Junior Investigator",
  journal: [],
  inventory: {
    artifacts: {},
    gadgetUses: {},
  },
  currentLocation: null,
  totalEncounters: 0,
  solvedCiphers: [],
  discoveredSymbols: [],
  collectedLore: [],
};

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<GameState> & { inventory?: { gadgets?: string[]; gadgetUses?: Partial<Record<string, number>>; artifacts?: Record<string, number> } };
    const state = { ...DEFAULT_STATE, ...parsed };
    if (state.inventory) {
      const inv = state.inventory as { gadgets?: GadgetId[]; gadgetUses?: Partial<Record<GadgetId, number>>; artifacts?: Record<string, number> };
      if (Array.isArray(inv.gadgets) && inv.gadgets.length > 0) {
        const uses: Partial<Record<GadgetId, number>> = { ...inv.gadgetUses };
        for (const id of inv.gadgets as GadgetId[]) {
          if (ALL_GADGET_IDS.includes(id)) uses[id] = (uses[id] || 0) + 1;
        }
        state.inventory = { ...state.inventory, gadgetUses: uses };
        delete (state.inventory as unknown as Record<string, unknown>).gadgets;
      }
      if (!state.inventory.gadgetUses) state.inventory.gadgetUses = {};
    }
    return state;
  } catch { }
  return { ...DEFAULT_STATE };
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

type GameStateContextValue = {
  state: GameState;
  addJournalEntry: (creatureId: string, status: JournalStatus) => void;
  addArtifact: (id: ArtifactId, count?: number) => void;
  craftGadget: (id: GadgetId, recipe: { artifactId: ArtifactId; quantity: number }[]) => boolean;
  buyUpgrade: (id: UpgradeId, cost: { artifactId: ArtifactId; quantity: number }[]) => boolean;
  useGadget: (id: GadgetId) => boolean;
  solveCipher: (creatureId: string) => ArtifactId | null;
  setPlayerName: (name: string) => void;
  resetGame: () => void;
  hasGadget: (id: GadgetId) => boolean;
  hasUpgrade: (id: UpgradeId) => boolean;
  getJournalEntry: (creatureId: string) => JournalEntry | undefined;
  addDiscoveredSymbol: (key: string) => void;
  addLoreText: (text: string) => void;
};

const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addJournalEntry = useCallback(
    (creatureId: string, status: JournalStatus) => {
      setState((prev) => {
        const existing = prev.journal.find((e) => e.creatureId === creatureId);
        if (existing) {
          return {
            ...prev,
            journal: prev.journal.map((e) =>
              e.creatureId === creatureId ? { ...e, status } : e
            ),
            totalEncounters: prev.totalEncounters + 1,
          };
        }
        const entry: JournalEntry = {
          creatureId,
          status,
          discoveredAt: new Date().toISOString(),
          cipherSolved: false,
        };
        return {
          ...prev,
          journal: [...prev.journal, entry],
          totalEncounters: prev.totalEncounters + 1,
        };
      });
    },
    []
  );

  const addArtifact = useCallback((artifactId: ArtifactId, count = 1) => {
    setState((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        artifacts: {
          ...prev.inventory.artifacts,
          [artifactId]: (prev.inventory.artifacts[artifactId] || 0) + count,
        },
      },
    }));
  }, []);

  const craftGadget = useCallback(
    (gadgetId: GadgetId, recipe: { artifactId: ArtifactId; quantity: number }[]): boolean => {
      let canCraft = true;
      setState((prev) => {
        for (const req of recipe) {
          if ((prev.inventory.artifacts[req.artifactId] || 0) < req.quantity) {
            canCraft = false;
            return prev;
          }
        }
        const newArtifacts = { ...prev.inventory.artifacts };
        for (const req of recipe) {
          newArtifacts[req.artifactId] = Math.max(0, (newArtifacts[req.artifactId] || 0) - req.quantity);
        }
        const gadgetUses = { ...prev.inventory.gadgetUses };
        gadgetUses[gadgetId] = (gadgetUses[gadgetId] || 0) + 1;
        return {
          ...prev,
          inventory: {
            ...prev.inventory,
            artifacts: newArtifacts,
            gadgetUses,
          },
        };
      });
      return canCraft;
    },
    []
  );

  const buyUpgrade = useCallback(
    (upgradeId: UpgradeId, cost: { artifactId: ArtifactId; quantity: number }[]): boolean => {
      let canBuy = true;
      setState((prev) => {
        if (prev.upgrades?.[upgradeId]) return prev; // already have it
        for (const req of cost) {
          if ((prev.inventory.artifacts[req.artifactId] || 0) < req.quantity) {
            canBuy = false;
            return prev;
          }
        }
        const newArtifacts = { ...prev.inventory.artifacts };
        for (const req of cost) {
          newArtifacts[req.artifactId] = Math.max(0, (newArtifacts[req.artifactId] || 0) - req.quantity);
        }
        const nextUpgrades = { ...(prev.upgrades || {}) } as Record<UpgradeId, boolean>;
        nextUpgrades[upgradeId] = true;
        return {
          ...prev,
          inventory: {
            ...prev.inventory,
            artifacts: newArtifacts,
          },
          upgrades: nextUpgrades,
        };
      });
      return canBuy;
    },
    []
  );

  const useGadget = useCallback((gadgetId: GadgetId): boolean => {
    let used = false;
    setState((prev) => {
      const count = prev.inventory.gadgetUses?.[gadgetId] ?? 0;
      if (count <= 0) return prev;
      used = true;
      const gadgetUses = { ...prev.inventory.gadgetUses };
      gadgetUses[gadgetId] = count - 1;
      return {
        ...prev,
        inventory: { ...prev.inventory, gadgetUses },
      };
    });
    return used;
  }, []);

  const solveCipher = useCallback((creatureId: string): ArtifactId | null => {
    let rewardArtifact: ArtifactId | null = null;
    setState((prev) => {
      if (prev.solvedCiphers.includes(creatureId)) return prev;
      rewardArtifact = getCipherReward(creatureId);
      const newArtifacts = { ...prev.inventory.artifacts };
      if (rewardArtifact) {
        newArtifacts[rewardArtifact] = (newArtifacts[rewardArtifact] || 0) + 1;
      }
      return {
        ...prev,
        journal: prev.journal.map((e) =>
          e.creatureId === creatureId ? { ...e, cipherSolved: true } : e
        ),
        solvedCiphers: [...prev.solvedCiphers, creatureId],
        inventory: {
          ...prev.inventory,
          artifacts: newArtifacts,
        },
      };
    });
    return rewardArtifact;
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, playerName: name }));
  }, []);

  const resetGame = useCallback(() => {
    setState({ ...DEFAULT_STATE });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasGadget = useCallback(
    (gadgetId: GadgetId) => (state.inventory.gadgetUses?.[gadgetId] ?? 0) > 0,
    [state.inventory.gadgetUses]
  );

  const hasUpgrade = useCallback(
    (upgradeId: UpgradeId) => !!state.upgrades?.[upgradeId],
    [state.upgrades]
  );

  const getJournalEntry = useCallback(
    (creatureId: string) => state.journal.find((e) => e.creatureId === creatureId),
    [state.journal]
  );

  const addDiscoveredSymbol = useCallback((symbolKey: string) => {
    setState((prev) => {
      if (prev.discoveredSymbols.includes(symbolKey)) return prev;
      return { ...prev, discoveredSymbols: [...prev.discoveredSymbols, symbolKey] };
    });
  }, []);

  const addLoreText = useCallback((text: string) => {
    setState((prev) => {
      if (prev.collectedLore.includes(text)) return prev;
      return { ...prev, collectedLore: [...prev.collectedLore, text] };
    });
  }, []);

  useEffect(() => {
    debugRef.current = {
      setState,
      state,
      addJournalEntry,
      addArtifact,
      craftGadget,
      buyUpgrade,
      useGadget,
      solveCipher,
      addDiscoveredSymbol,
      addLoreText,
      resetGame,
    };
    return () => {
      debugRef.current = null;
    };
  }, [state, addJournalEntry, addArtifact, craftGadget, useGadget, solveCipher, addDiscoveredSymbol, addLoreText, resetGame]);

  const value: GameStateContextValue = {
    state,
    addJournalEntry,
    addArtifact,
    craftGadget,
    buyUpgrade,
    useGadget,
    solveCipher,
    setPlayerName,
    resetGame,
    hasGadget,
    hasUpgrade,
    getJournalEntry,
    addDiscoveredSymbol,
    addLoreText,
  };

  return React.createElement(GameStateContext.Provider, { value }, children);
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error("useGameState must be used within GameStateProvider");
  }
  return ctx;
}

export function getDebugAPI(): {
  help: () => void;
  revealAllSymbols: () => void;
  solveAllCiphers: () => void;
  addAllJournalEntries: () => void;
  giveAllArtifacts: (count?: number) => void;
  unlockAllGadgets: () => void;
  reset: () => void;
  getState: () => GameState | null;
} {
  return {
    help() {
      console.log(
        "%cCCK Debug",
        "font-weight: bold; font-size: 14px",
        "\n\nAvailable commands:\n" +
        "  CCK_DEBUG.revealAllSymbols()   - Unlock all cipher symbols (A–Z)\n" +
        "  CCK_DEBUG.solveAllCiphers()   - Mark all creature ciphers as solved\n" +
        "  CCK_DEBUG.addAllJournalEntries() - Add every creature to the journal (befriended)\n" +
        "  CCK_DEBUG.giveAllArtifacts(n) - Add n of each artifact (default 5)\n" +
        "  CCK_DEBUG.unlockAllGadgets()  - Unlock trap_camera, scanner, decoder_wheel\n" +
        "  CCK_DEBUG.reset()             - Reset game to default state\n" +
        "  CCK_DEBUG.getState()          - Return current game state (for inspection)\n" +
        "  CCK_DEBUG.help()              - Show this message"
      );
    },

    revealAllSymbols() {
      const r = debugRef.current;
      if (!r) {
        console.warn("CCK_DEBUG: Game state not ready. Interact with the app first.");
        return;
      }
      r.setState((prev: GameState) => ({
        ...prev,
        discoveredSymbols: [...ALL_SYMBOLS],
      }));
      console.log("CCK_DEBUG: All symbols revealed (A–Z).");
    },

    solveAllCiphers() {
      const r = debugRef.current;
      if (!r) {
        console.warn("CCK_DEBUG: Game state not ready.");
        return;
      }
      const ids = CREATURES.map((c) => c.id);
      r.setState((prev: GameState) => {
        const solved = Array.from(new Set([...prev.solvedCiphers, ...ids]));
        const journal = prev.journal.map((e: JournalEntry) => {
          if (ids.includes(e.creatureId)) return { ...e, cipherSolved: true };
          return e;
        });
        let artifacts = { ...prev.inventory.artifacts };
        for (const creatureId of ids) {
          const reward = getCipherReward(creatureId);
          if (reward) artifacts[reward] = (artifacts[reward] || 0) + 1;
        }
        return {
          ...prev,
          journal,
          solvedCiphers: solved,
          inventory: { ...prev.inventory, artifacts },
        };
      });
      console.log("CCK_DEBUG: All ciphers solved.");
    },

    addAllJournalEntries() {
      const r = debugRef.current;
      if (!r) {
        console.warn("CCK_DEBUG: Game state not ready.");
        return;
      }
      CREATURES.forEach((c) => r.addJournalEntry(c.id, "befriended"));
      console.log("CCK_DEBUG: All creatures added to journal (befriended).");
    },

    giveAllArtifacts(count = 5) {
      const r = debugRef.current;
      if (!r) {
        console.warn("CCK_DEBUG: Game state not ready.");
        return;
      }
      ALL_ARTIFACT_IDS.forEach((id) => r.addArtifact(id, count));
      console.log(`CCK_DEBUG: Added ${count} of each artifact.`);
    },

    unlockAllGadgets() {
      const r = debugRef.current;
      if (!r) {
        console.warn("CCK_DEBUG: Game state not ready.");
        return;
      }
      r.setState((prev: GameState) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          gadgetUses: {
            trap_camera: 3,
            scanner: 3,
            decoder_wheel: 3,
            map: 3,
          },
        },
      }));
      console.log("CCK_DEBUG: Added 3 uses of each gadget.");
    },

    reset() {
      const r = debugRef.current;
      if (!r) {
        console.warn("CCK_DEBUG: Game state not ready.");
        return;
      }
      r.resetGame();
      console.log("CCK_DEBUG: Game reset.");
    },

    getState() {
      const r = debugRef.current;
      if (!r) {
        console.warn("CCK_DEBUG: Game state not ready.");
        return null;
      }
      return r.state;
    },
  };
}
