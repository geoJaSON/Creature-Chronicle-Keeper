# Mystery Creature Explorer

A browser-based adventure game inspired by Gravity Falls x Pokémon x Minecraft.

## Overview

Players are junior investigators in a weird town. Creatures are appearing, and their job is to catalog them in a mystery journal. The game features creature encounters, cipher decoding, base building, and gadget crafting.

## Architecture

- **Frontend**: React + TypeScript + Vite, Wouter for routing, TanStack Query, Framer Motion, Shadcn UI
- **Backend**: Express (minimal — game state is localStorage-based)
- **Storage**: localStorage (no database needed — this is a client-side game)
- **State**: Custom `useGameState` hook with localStorage persistence (`client/src/lib/gameState.ts`)

## Key Pages

- `/` — Town Square: Choose locations to explore and encounter creatures
- `/journal` — Mystery Journal: Browse discovered creatures, read lore, solve ciphers
- `/base` — Investigator's Base: Manage artifact inventory and craft gadgets
- `/cipher` — Cipher Lab: Manual cipher tool + auto-decode with Decoder Wheel gadget

## Game Data

All static game content lives in `client/src/lib/gameData.ts`:
- 27 creatures across 8 types (Tech, Nature, Weird, Shadow, Pixel, Water, Glitch, Deep)
- 9 locations (Forest, Library, School, Cave, Lab, Arcade, Dock, Tower, House)
- 13 artifact types
- 4 craftable gadgets (Trap Camera, Scanner, Decoder Wheel, Map)

## Locations

| Location | ID | Theme Colors | Creatures |
|---|---|---|---|
| Whispering Forest | forest | green/emerald | Moss Golem, Rumble Root, Ember Newt + visitors |
| Peculiar Library | library | blue/indigo | Glitch Fox, Circuit Sprite, Giggle Wisp + visitors |
| Abandoned School | school | purple/violet | Mirror Shade, Fog Wraith + visitors |
| Echo Cave | cave | slate/zinc | Void Moth, Phase Hound, Prism Beetle + visitors |
| Glitched Laboratory | lab | cyan/teal | Toxic Slime, Spark Golem, Flask Phantom |
| Forgotten Arcade | arcade | pink/fuchsia | Pixel Knight, Neon Serpent, Cabinet Ghost |
| Drowned Dock | dock | sky/blue | Tide Lurker, Rust Crab, Depth Angler |
| Silent Radio Tower | tower | amber/orange | Signal Wraith, Frequency Bat, Static Owl |
| Collector's House | house | rose/red | Shelf Mimic, Dust Djinn, Porcelain Watcher |

## Exploration System

Multi-scene exploration (`client/src/components/ExplorationView.tsx`) with 4 scene types:
- **Discovery**: Investigate hotspots to find artifacts, symbols, and lore
- **Puzzle**: Mini-games that must be solved to proceed
- **Choice**: Narrative branching decisions with rewards
- **Encounter**: Transition to creature encounter

Scene data per location in `client/src/lib/explorationData.ts`.

## Puzzle Types

9 puzzle mini-games in `client/src/components/puzzles/`:
- `PatternMemory` — Memorize and replay a symbol sequence
- `SymbolCipher` — Decode a word using the symbol alphabet
- `RiddleChallenge` — Multiple-choice riddle
- `EchoSequence` — Repeat an expanding sound/symbol sequence
- `ChemicalMix` (Lab) — Mix chemicals in the correct order
- `PixelMatch` (Arcade) — Visual memory match of pixel patterns
- `TideTiming` (Dock) — Timing-based tide level targeting
- `FrequencyTune` (Tower) — Dial tuning to match a target frequency
- `ArtifactSort` (House) — Sort artifacts into correct categories

## Game Systems

- **Type balance**: Rock-paper-scissors (Tech > Weird > Shadow > Nature > Tech), plus Pixel, Water, Glitch, Deep interactions
- **Encounter actions**: Befriend (chance-based), Battle (turn-based), Study (always works)
- **Cipher system**: Shift + plugboard (encode: plugboard then shift; decode: unshift then plugboard). Run `script/reencodeCreatureCiphers.ts` to regenerate cipher clues with 1–2 letter swaps. Decode output masks letters whose symbols haven’t been discovered. Decoder Wheel gadget solves ciphers in one use. Cipher solve rewards and hidden hotspots unchanged (CIPHER_REWARDS, unlockedBySecret).
- **Gadgets**: Decoder Wheel (solve ciphers), Scanner (reveal stats), Trap Camera (boost study), Map (choose first scene type in exploration)
- **Artifacts**: Dropped after encounters, used to craft gadgets

## Visual Components

- `client/src/components/CreatureSprite.tsx` — Custom SVG creature illustrations (27 unique creatures) with Framer Motion animations. Each creature has a distinct visual design with animated elements.
- Location cards use gradient backgrounds, particle effects, and glow shadows per location theme.
- Cipher Lab: shift dial + plugboard (letter swaps); decode output shows symbols until discovered
- Stats shown as bar chart visualizations (battle power / friendliness) in journal detail views.
- LocationDecoration SVGs in ExplorationView for atmospheric background art per location.

## Key Files

- `shared/schema.ts` — All TypeScript types (creatures, artifacts, puzzles, game state)
- `client/src/lib/gameData.ts` — Static game content (creatures, locations, artifacts, gadgets)
- `client/src/lib/explorationData.ts` — Exploration scene pools per location
- `client/src/lib/gameState.ts` — Game state management with localStorage persistence
- `client/src/pages/GamePage.tsx` — Main exploration/encounter page
- `client/src/components/ExplorationView.tsx` — Multi-scene exploration UI
- `client/src/components/CreatureEncounter.tsx` — Encounter dialog (befriend/battle/study)
- `client/src/components/CreatureSprite.tsx` — All 27 creature SVG sprites

## Conventions

- No emojis in UI; use Lucide icons and SVG art
- No `hover:bg-*` on Button components; use `hover-elevate` CSS class
- Keep `index.css` unchanged; design tokens in `tailwind.config.ts` only
- Symbol alphabet in explorationData.ts; cipher: shift + plugboard (see CONTENT_GUIDE)
