# Mystery Creature Explorer — Content Guide

A guide for adding and editing creatures, ciphers, exploration scenes, artifacts, and other game content.

---

## Adding a New Creature

Open `client/src/lib/gameData.ts` and add an entry to the `CREATURES` array:

```ts
{
  id: "your_creature",           // unique snake_case ID
  name: "Your Creature",
  type: "Nature",                // Tech | Nature | Weird | Shadow | Pixel | Water | Glitch | Deep
  rarity: "uncommon",           // common | uncommon | rare (affects encounter rates & loot drops)
  description: "What it looks like and feels like.",
  lore: "Backstory and rumors about it.",
  cipherClue: "ENCODED TEXT HERE",  // use script: npx tsx script/reencodeCreatureCiphers.ts
  decodedSecret: "YOUR SECRET MESSAGE HERE",             // plain text; cipherClue is encoded from this
  weakAgainst: "Tech",          // takes extra damage from this type
  strongAgainst: "Shadow",      // deals extra damage to this type
  locations: ["forest", "cave"],// where it can appear (use location IDs)
  battlePower: 6,               // 1-10, affects battle difficulty
  friendliness: 5,              // 1-10, affects befriend success chance
  artSymbol: ">>",              // 2-char symbol shown in compact views
}
```

Then add a sprite in `client/src/components/CreatureSprite.tsx`:

1. Create a function component: `function YourCreature({ w, animate }: { w: number; animate: boolean })`
2. Draw an SVG with `viewBox="0 0 100 100"` and use `w` for width/height
3. Use `motion` elements for idle animations when `animate` is true
4. Add it to the `CREATURE_MAP` record: `your_creature: YourCreature`

That's it — the creature will automatically appear in the right locations, drop loot based on its type, and have a cipher entry.

---

## Editing Cipher Clues

In `gameData.ts`, find the creature and change two fields:

```ts
decodedSecret: "NEW SECRET TEXT",             // plain text (what the player decodes to)
cipherClue: "GIVK XHOBOX...",                 // encoded with shift + plugboard
```

To generate new `cipherClue` values from all `decodedSecret` texts (with 1–2 random letter swaps so the shift wheel reveals almost-English), run:

```bash
npx tsx script/reencodeCreatureCiphers.ts
```

Then paste the printed `cipherClue` lines into `gameData.ts`. The cipher machine uses **plugboard then shift** (encode) and **unshift then plugboard** (decode), so setting the shift alone shows recognizable words with 1–2 letters swapped until the player adds the plugboard pairs. Decode output in the Cipher Lab masks letters whose symbols haven’t been discovered yet.

If you want a cipher to unlock a hidden hotspot in exploration, the `decodedSecret` text should hint at something discoverable, then you add a hidden hotspot in `explorationData.ts` (see below).

---

## Adding Hidden Hotspots (Secret Areas)

In `client/src/lib/explorationData.ts`, find a discovery scene's `hotspots` array and add:

```ts
{
  id: "unique_hotspot_id",
  label: "What the Player Sees",
  description: "What happens when they click it.",
  reward: { type: "lore", text: "The lore entry they receive." },
  // or: reward: { type: "artifact", artifactId: "glowing_mushroom" },
  // or: reward: { type: "symbol", symbolKey: "A" },
  hidden: true,
  unlockedBySecret: "creature_id",  // creature whose cipher must be solved first
}
```

---

## How cipher-unlocked options work

When a player solves a creature's cipher in the Cipher Lab, two kinds of new options can appear:

### 1. New hotspots in discovery scenes (recommended)

Use this for new places or actions that appear in a location after solving a cipher (e.g. Spark Golem → basement stairs in the lab).

- In `explorationData.ts`, add a **hidden hotspot** to an existing discovery scene:
  - `hidden: true`
  - `unlockedBySecret: "creature_id"` (the creature whose cipher must be solved first)
- The exploration view only shows that hotspot when `state.solvedCiphers` includes that creature id.
- **Example:** Spark Golem’s secret says “THE GOLEM WAS BUILT TO GUARD SOMETHING IN THE BASEMENT”. In the lab discovery scene there is a hidden hotspot “Unauthorized Basement Access” with `unlockedBySecret: "spark_golem"`. Once the cipher is solved, that option appears; clicking it gives lore (and optionally artifacts).

### 2. New options inside a puzzle (e.g. radio Channel Zero)

Use this when the decoded secret tells the player to do something *inside* a minigame (e.g. “BROADCAST ON CHANNEL ZERO”).

- **Schema:** In `shared/schema.ts`, the puzzle’s data type can include optional fields such as:
  - `channelZeroUnlockedBySecret?: string` — creature id that gates the option
  - `channelZeroLore?: string` — lore text granted when the option is used
- **Puzzle component:** The puzzle (e.g. `FrequencyTune`) receives `solvedCiphers` from `ExplorationView`. If the data has `channelZeroUnlockedBySecret` and that id is in `solvedCiphers`, show an extra button (e.g. “Broadcast on Channel Zero”). When the player uses it, call `onComplete(success, [lore])` so the exploration flow adds the lore and can advance.
- **ExplorationView:** `handlePuzzleComplete(success, extraLore?)` already supports optional `extraLore` and appends it to the run’s collected lore.
- **Example:** Signal Wraith’s secret is “TUNE TO FREQUENCY ZERO AND LISTEN TO WHAT ANSWERS”. The tower frequency_tune puzzles in `explorationData.ts` set `channelZeroUnlockedBySecret: "signal_wraith"` and `channelZeroLore: "..."`. When that cipher is solved, the dial can go to 0 Hz; tuning to 0 and using “Reach Frequency Zero” completes the scene and adds the lore to Field Notes.

To add more cipher-gated puzzle options for other minigames, follow the same pattern: extend the puzzle data type with `*UnlockedBySecret` and `*Lore` (or similar), pass `solvedCiphers` into the puzzle, and have the puzzle call `onComplete(success, extraLore?)` when the special action is used.

---

## Adding/Editing Exploration Scenes

In `explorationData.ts`, each location has a scene array (e.g., `FOREST_SCENES`). There are four scene types:

### Discovery Scene (hotspots to investigate)

```ts
{
  id: "location_scenename",
  locationId: "forest",
  type: "discovery",
  title: "Scene Title",
  description: "What the player sees.",
  atmosphere: "Mood text shown in italics.",
  hotspots: [
    {
      id: "hotspot_id",
      label: "Clickable Thing",
      description: "Result text.",
      reward: { type: "artifact", artifactId: "old_gear" },
    },
  ],
}
```

### Choice Scene (branching decision)

```ts
{
  id: "location_choice",
  locationId: "forest",
  type: "choice",
  title: "Title",
  description: "Setup text.",
  atmosphere: "Mood.",
  choices: [
    {
      id: "option_a",
      label: "Option A",
      description: "Teaser.",
      outcome: "What happens.",
      reward: { type: "artifact", artifactId: "shadow_dust" },
    },
    {
      id: "option_b",
      label: "Option B",
      description: "Teaser.",
      outcome: "What happens.",
      reward: { type: "lore", text: "Lore entry." },
    },
  ],
}
```

### Puzzle Scene (mini-game)

```ts
{
  id: "location_puzzle",
  locationId: "forest",
  type: "puzzle",
  title: "Title",
  description: "Setup.",
  atmosphere: "Mood.",
  puzzle: {
    puzzleType: "riddle",
    difficulty: 1,
    data: {
      question: "What has...",
      options: ["A", "B", "C", "D"],
      correctIndex: 2,
      flavor: "Hint.",
    },
  },
  rewardArtifact: "strange_feather",
}
```

### Puzzle Data Shapes (by type)

- **pattern_memory** — `{ symbols: string[], sequence: number[], displayTime: number }`
- **symbol_cipher** — `{ encodedWord: string, answer: string, hintLetters: number[] }`
- **riddle** — `{ question: string, options: string[], correctIndex: number, flavor: string }`
- **echo_sequence** — `{ symbols: string[], sequence: number[], rounds: number }`
- **chemical_mix** — `{ chemicals: { id: string, color: string, label: string }[], targetSequence: string[] }`
- **pixel_match** — `{ pattern: number[][], options: number[][][], correctIndex: number, displayTime: number }`
- **tide_timing** — `{ targetLevel: number, speed: number, rounds: number, tolerance: number }`
- **frequency_tune** — `{ targetFrequency, startFrequency, tolerance, minFreq, maxFreq, targetGain, startGain, gainTolerance, minGain, maxGain }` — Match a target sine wave by adjusting frequency and gain; both must be within tolerance to lock.
- **artifact_sort** — `{ items: { id: string, name: string, description: string, category: string }[], categories: string[] }`
 - **morse_code** — `{ word: string }` (word is shown as a looping visual Morse code pattern the player decodes)

---

## Adding Artifacts

1. Add the ID to the `ArtifactId` union type in `shared/schema.ts`
2. Add the artifact details to the `ARTIFACTS` record in `client/src/lib/gameData.ts`
3. Add icon/color entries in `client/src/pages/BasePage.tsx` (look for `ARTIFACT_ICONS` and `ARTIFACT_COLORS`)
4. Optionally add to a creature type's drop table in `getArtifactsDropped` in `gameData.ts`

---

## Reward Types

Hotspots and choices can give one of three reward types:

```ts
{ type: "artifact", artifactId: "old_gear" }       // adds artifact to inventory
{ type: "symbol", symbolKey: "A" }                  // teaches a symbol alphabet letter
{ type: "lore", text: "The lore text here." }       // adds field note to journal
```

---

## Location IDs

| ID | Name |
|---|---|
| `forest` | Whispering Forest |
| `library` | Peculiar Library |
| `school` | Abandoned School |
| `cave` | Echo Cave |
| `lab` | The Glitched Laboratory |
| `arcade` | The Forgotten Arcade |
| `dock` | The Drowned Dock |
| `tower` | The Silent Radio Tower |
| `house` | The Collector's House |

---

## Creature Types

| Type | Drop Pool | Badge Colors |
|---|---|---|
| Tech | circuit_board, static_chip, old_gear | Blue |
| Nature | glowing_mushroom, strange_feather, cave_crystal | Green |
| Weird | strange_feather, ancient_book, cave_crystal | Purple |
| Shadow | shadow_dust, cave_crystal, ancient_book | Slate |
| Pixel | pixel_shard, circuit_board, old_gear | Pink |
| Water | rusty_anchor, cave_crystal, glowing_mushroom | Sky |
| Glitch | pixel_shard, static_chip, signal_fragment | Rose |
| Deep | rusty_anchor, shadow_dust, collector_key | Indigo |

Edit the drop pools in the `getArtifactsDropped` function in `gameData.ts`.

---

## Cipher Reward Mapping

When a cipher is solved, the player receives a bonus artifact based on the creature's type. Edit the `CIPHER_REWARDS` record in `gameData.ts` to change what each type awards.

| Type | Cipher Reward |
|---|---|
| Tech | circuit_board |
| Nature | glowing_mushroom |
| Weird | ancient_book |
| Shadow | shadow_dust |
| Pixel | pixel_shard |
| Water | rusty_anchor |
| Glitch | signal_fragment |
| Deep | collector_key |
