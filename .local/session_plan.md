# Objective
Add 5 new locations to the Mystery Creature Explorer game: Glitched Laboratory, Forgotten Arcade, Drowned Dock, Silent Radio Tower, and Collector's House. Each location needs unique creatures, puzzle mechanics, exploration scenes, creature sprites, and theme/color integration.

## New Creature Types
Add to existing (Tech, Nature, Weird, Shadow): **Pixel**, **Water**, **Glitch**, **Deep**

## New Artifacts
- `chemical_vial` - "Chemical Vial" - A vial of luminous, self-stirring liquid. The label is in a language that changes. icon: "flask-conical"
- `pixel_shard` - "Pixel Shard" - A fragment of what looks like reality rendered at low resolution. icon: "grid-2x2"
- `rusty_anchor` - "Rusty Anchor" - A small anchor covered in barnacles that glow at night. icon: "anchor"
- `signal_fragment` - "Signal Fragment" - A captured radio wave made solid. It vibrates in your pocket. icon: "radio"
- `collector_key` - "Collector's Key" - An ornate key that fits no lock you've ever seen. icon: "key"

## New Locations
1. **lab** - "The Glitched Laboratory" - gradient: cyan/teal, icon: FlaskConical. description: "Experiments ran without scientists. Equipment hums on its own." hint: "Tech and Weird creatures lurk among the beakers." atmosphere: "Flickering monitors cast green light. Something bubbles that shouldn't." color: "tech"
2. **arcade** - "The Forgotten Arcade" - gradient: pink/fuchsia, icon: Gamepad2. description: "Machines run with no power. High scores from decades in the future." hint: "Pixel and Shadow creatures haunt the cabinets." atmosphere: "Neon flickers in the dark. A cabinet plays a game nobody programmed." color: "pixel"
3. **dock** - "The Drowned Dock" - gradient: sky/blue-deep, icon: Anchor. description: "A pier that sank but still appears at low tide. The water remembers." hint: "Water and Deep creatures surface here." atmosphere: "Salt air and rotting wood. The water is too still." color: "water"
4. **tower** - "The Silent Radio Tower" - gradient: amber/orange, icon: Radio. description: "Broadcasts nobody hears. But something hears you." hint: "Tech and Shadow creatures ride the signal." atmosphere: "Static crackles from nowhere. The antenna hums with purpose." color: "tech"
5. **house** - "The Collector's House" - gradient: rose/red, icon: Home. description: "Someone collected strange things. Then disappeared." hint: "Weird and Deep creatures guard the collection." atmosphere: "Dust moves with intent. Every object has a story it wants to tell." color: "weird"

## New Creatures (3 per location, 15 total)

### Lab (Glitched Laboratory)
- `toxic_slime` - "Toxic Slime" - type: Nature, rarity: common, battlePower: 4, friendliness: 7. Locations: ["lab"]. artSymbol: "@@". weakAgainst: Tech, strongAgainst: Shadow. cipherClue: encodeCaesar("EXPERIMENT FORTY SEVEN WAS NEVER AUTHORIZED"), decodedSecret: "EXPERIMENT FORTY SEVEN WAS NEVER AUTHORIZED". description: "A bubbling, sentient blob of luminous green chemicals. It absorbs anything that touches it." lore: "Lab notes mention it started as a cleaning solution that gained awareness on a Tuesday."
- `spark_golem` - "Spark Golem" - type: Tech, rarity: uncommon, battlePower: 7, friendliness: 4. Locations: ["lab", "tower"]. artSymbol: "$$". weakAgainst: Water, strongAgainst: Nature. cipherClue: encodeCaesar("THE GOLEM WAS BUILT TO GUARD SOMETHING IN THE BASEMENT"), decodedSecret: "THE GOLEM WAS BUILT TO GUARD SOMETHING IN THE BASEMENT". description: "A hulking figure assembled from microscopes, beakers, and copper wire. Sparks fly when it moves." lore: "Someone built it from scratch. The instruction manual was written in symbol code."
- `flask_phantom` - "Flask Phantom" - type: Weird, rarity: rare, battlePower: 8, friendliness: 3. Locations: ["lab"]. artSymbol: "()". weakAgainst: Nature, strongAgainst: Shadow. cipherClue: encodeCaesar("THE PHANTOM WAS ONCE THE HEAD SCIENTIST WHO NEVER LEFT"), decodedSecret: "THE PHANTOM WAS ONCE THE HEAD SCIENTIST WHO NEVER LEFT". description: "A translucent figure swirling inside a massive flask. Its face keeps changing." lore: "The log says: 'Dr. Emerson entered flask room at 3pm. Flask room has no door.'"

### Arcade (Forgotten Arcade)
- `pixel_knight` - "Pixel Knight" - type: Pixel, rarity: uncommon, battlePower: 6, friendliness: 5. Locations: ["arcade"]. artSymbol: "[]". weakAgainst: Glitch, strongAgainst: Nature. cipherClue: encodeCaesar("THE HIGH SCORE TABLE CONTAINS A MAP IF READ BACKWARDS"), decodedSecret: "THE HIGH SCORE TABLE CONTAINS A MAP IF READ BACKWARDS". description: "A blocky warrior rendered in chunky pixels. Its sword is surprisingly sharp for something that shouldn't be three-dimensional." lore: "Cabinet #7 has been unplugged for twenty years. The knight walks out anyway."
- `neon_serpent` - "Neon Serpent" - type: Glitch, rarity: rare, battlePower: 9, friendliness: 2. Locations: ["arcade", "lab"]. artSymbol: "~~". weakAgainst: Deep, strongAgainst: Tech. cipherClue: encodeCaesar("FOLLOW THE NEON TRAIL AND IT LEADS TO PLAYER TWO"), decodedSecret: "FOLLOW THE NEON TRAIL AND IT LEADS TO PLAYER TWO". description: "A serpentine creature made of flickering neon tubes. It phases through arcade cabinets leaving trails of color." lore: "The old owner said: 'The snake was always there. It just learned to be seen.'"
- `cabinet_ghost` - "Cabinet Ghost" - type: Shadow, rarity: common, battlePower: 3, friendliness: 8. Locations: ["arcade", "school"]. artSymbol: "{}". weakAgainst: Pixel, strongAgainst: Nature. cipherClue: encodeCaesar("INSERT COIN TO TALK TO THE DEAD DEVELOPER"), decodedSecret: "INSERT COIN TO TALK TO THE DEAD DEVELOPER". description: "A faint, flickering shape inside an unpowered arcade cabinet. It replays the same level forever." lore: "The game was 99% complete. The developer vanished. The ghost finishes what they couldn't."

### Dock (Drowned Dock)
- `tide_lurker` - "Tide Lurker" - type: Water, rarity: uncommon, battlePower: 7, friendliness: 4. Locations: ["dock"]. artSymbol: ")(". weakAgainst: Tech, strongAgainst: Shadow. cipherClue: encodeCaesar("THE DOCK SINKS THREE INCHES EVERY YEAR BUT NEVER DISAPPEARS"), decodedSecret: "THE DOCK SINKS THREE INCHES EVERY YEAR BUT NEVER DISAPPEARS". description: "You never see all of it. Tentacles surface briefly, then withdraw. It's patient." lore: "Fishermen reported it for decades. The town pretended not to hear."
- `rust_crab` - "Rust Crab" - type: Nature, rarity: common, battlePower: 4, friendliness: 7. Locations: ["dock", "cave"]. artSymbol: "^^". weakAgainst: Water, strongAgainst: Tech. cipherClue: encodeCaesar("THE CRABS BUILD THEIR SHELLS FROM SUNKEN SHIPS"), decodedSecret: "THE CRABS BUILD THEIR SHELLS FROM SUNKEN SHIPS". description: "A crab with a shell made of barnacle-covered scrap metal. It clicks and whirs instead of scuttling." lore: "Dock workers leave old bolts and nails as offerings. The crabs always take them by morning."
- `depth_angler` - "Depth Angler" - type: Deep, rarity: rare, battlePower: 9, friendliness: 1. Locations: ["dock"]. artSymbol: "!!". weakAgainst: Nature, strongAgainst: Weird. cipherClue: encodeCaesar("THE LIGHT IT SHOWS YOU IS NOT REALLY THERE"), decodedSecret: "THE LIGHT IT SHOWS YOU IS NOT REALLY THERE". description: "A deep-sea creature that shouldn't be this close to shore. Its lure glows with false promises." lore: "The old dock master's final log: 'Something beautiful rose from the water. I should not have reached for it.'"

### Tower (Silent Radio Tower)
- `signal_wraith` - "Signal Wraith" - type: Tech, rarity: rare, battlePower: 8, friendliness: 3. Locations: ["tower"]. artSymbol: "||". weakAgainst: Deep, strongAgainst: Nature. cipherClue: encodeCaesar("TUNE TO FREQUENCY ZERO AND LISTEN TO WHAT ANSWERS"), decodedSecret: "TUNE TO FREQUENCY ZERO AND LISTEN TO WHAT ANSWERS". description: "A wavering humanoid shape made of visible radio waves. You can hear it before you see it." lore: "The tower was decommissioned in 1987. It started broadcasting again in 2019. Nobody turned it on."
- `frequency_bat` - "Frequency Bat" - type: Shadow, rarity: common, battlePower: 5, friendliness: 6. Locations: ["tower", "cave"]. artSymbol: "}}". weakAgainst: Pixel, strongAgainst: Nature. cipherClue: encodeCaesar("THE BATS HEAR A FREQUENCY HUMANS CANNOT BUT SHOULD"), decodedSecret: "THE BATS HEAR A FREQUENCY HUMANS CANNOT BUT SHOULD". description: "Jet black with ears like satellite dishes. It echolocates using frequencies that shouldn't exist." lore: "They roost inside the tower's dish. Their sonar disrupts phone signals for three blocks."
- `static_owl` - "Static Owl" - type: Weird, rarity: uncommon, battlePower: 6, friendliness: 5. Locations: ["tower", "library"]. artSymbol: "{{". weakAgainst: Tech, strongAgainst: Shadow. cipherClue: encodeCaesar("THE OWL SEES IN ALL SPECTRUMS INCLUDING ONES WE FORGOT"), decodedSecret: "THE OWL SEES IN ALL SPECTRUMS INCLUDING ONES WE FORGOT". description: "An owl whose feathers are made of shifting static patterns. Its eyes display test patterns." lore: "It watches from the highest antenna. Security cameras near it show only snow."

### House (Collector's House)
- `shelf_mimic` - "Shelf Mimic" - type: Weird, rarity: common, battlePower: 5, friendliness: 6. Locations: ["house", "library"]. artSymbol: "==". weakAgainst: Deep, strongAgainst: Nature. cipherClue: encodeCaesar("NOT EVERYTHING IN THE COLLECTION WAS COLLECTED WILLINGLY"), decodedSecret: "NOT EVERYTHING IN THE COLLECTION WAS COLLECTED WILLINGLY". description: "It looks like an ordinary shelf until you notice it has too many surfaces and they're all watching you." lore: "The collector's inventory lists it as 'acquired.' But the shelf was there before the house was built."
- `dust_djinn` - "Dust Djinn" - type: Shadow, rarity: uncommon, battlePower: 7, friendliness: 4. Locations: ["house"]. artSymbol: "&&". weakAgainst: Water, strongAgainst: Weird. cipherClue: encodeCaesar("THE DUST REMEMBERS EVERY HAND THAT TOUCHED EVERY OBJECT"), decodedSecret: "THE DUST REMEMBERS EVERY HAND THAT TOUCHED EVERY OBJECT". description: "A swirling column of dust motes that takes vaguely human shapes. It smells like old libraries and regret." lore: "It speaks in whispers. Each whisper is a memory from someone who once held the objects here."
- `porcelain_watcher` - "Porcelain Watcher" - type: Deep, rarity: rare, battlePower: 8, friendliness: 2. Locations: ["house"]. artSymbol: "::". weakAgainst: Nature, strongAgainst: Glitch. cipherClue: encodeCaesar("THE DOLL WAS MADE BEFORE DOLLS WERE INVENTED"), decodedSecret: "THE DOLL WAS MADE BEFORE DOLLS WERE INVENTED". description: "A pristine porcelain figure with eyes that follow you. It's warm to the touch despite being ceramic." lore: "The collector's journal: 'Item #1. I did not find it. It found me. I built the collection around it.'"

## New Puzzle Types (one per new location)
- `chemical_mix` (Lab) - Players click colored chemical bottles in the correct order to create a formula. 4-5 chemicals, shown a target color sequence, reproduce it.
- `pixel_match` (Arcade) - A pixel art pattern flashes briefly, player selects matching pattern from 4 options. Visual memory test.
- `tide_timing` (Dock) - A tide meter rises and falls. Player must click "cast" when tide is at the right level. Timing-based, 3 successful catches needed.
- `frequency_tune` (Tower) - A frequency dial with a target signal. Player adjusts using +/- buttons to match the frequency. The display shows waveforms.
- `artifact_sort` (House) - 4-5 objects shown with descriptions. Player clicks them into the correct category bins. Knowledge-based sorting.

# Tasks

### T001: Update schema types
- **Blocked By**: []
- **Details**:
  - In `shared/schema.ts`:
    - Update `CreatureType` to add: "Pixel" | "Water" | "Glitch" | "Deep"
    - Update `ArtifactId` to add: "chemical_vial" | "pixel_shard" | "rusty_anchor" | "signal_fragment" | "collector_key"
    - Update `PuzzleType` to add: "chemical_mix" | "pixel_match" | "tide_timing" | "frequency_tune" | "artifact_sort"
    - Add new puzzle data interfaces:
      ```ts
      export interface ChemicalMixData { chemicals: { id: string; color: string; label: string }[]; targetSequence: string[]; }
      export interface PixelMatchData { pattern: number[][]; options: number[][][]; correctIndex: number; displayTime: number; }
      export interface TideTimingData { targetLevel: number; speed: number; rounds: number; tolerance: number; }
      export interface FrequencyTuneData { targetFrequency: number; startFrequency: number; tolerance: number; minFreq: number; maxFreq: number; }
      export interface ArtifactSortData { items: { id: string; name: string; description: string; category: string }[]; categories: string[]; }
      ```
    - Update `PuzzleConfig.data` union type to include the 5 new data types
  - Files: `shared/schema.ts`
  - Acceptance: TypeScript compiles with new types

### T002: Add new locations, creatures, and artifacts to gameData.ts
- **Blocked By**: [T001]
- **Details**:
  - Add 5 new artifacts to the ARTIFACTS record (chemical_vial, pixel_shard, rusty_anchor, signal_fragment, collector_key) with descriptions and icons from the Objective section
  - Add 5 new locations to the LOCATIONS array with id, name, description, hint, color, icon, atmosphere — see the New Locations section of Objective for details
  - Add 15 new creatures to the CREATURES array — see the New Creatures section of Objective for ALL details (type, rarity, battlePower, friendliness, locations, artSymbol, cipherClue using encodeCaesar, decodedSecret, weakAgainst, strongAgainst, description, lore). Copy these EXACTLY.
  - Add new entries to TYPE_COLORS, TYPE_BG, TYPE_BADGE for: Pixel (pink/fuchsia tones), Water (sky/cyan tones), Glitch (rose/red tones), Deep (indigo/violet tones)
  - Update `getArtifactsDropped` to handle new creature types: Pixel drops pixel_shard/circuit_board/old_gear, Water drops rusty_anchor/cave_crystal/glowing_mushroom, Glitch drops pixel_shard/static_chip/signal_fragment, Deep drops rusty_anchor/shadow_dust/collector_key
  - Files: `client/src/lib/gameData.ts`
  - Acceptance: All 15 new creatures, 5 new artifacts, 5 new locations defined

### T003: Build 5 new puzzle components
- **Blocked By**: [T001]
- **Details**:
  - Create `client/src/components/puzzles/ChemicalMix.tsx`:
    - Props: data: ChemicalMixData, onComplete: (success: boolean) => void
    - Shows colored chemical bottles in a row. Shows a "Target Formula" as a color sequence.
    - Player clicks bottles in order to build a sequence. Wrong order = red flash + reset. Correct = green glow + success.
    - Add data-testid attributes to interactive elements.
  - Create `client/src/components/puzzles/PixelMatch.tsx`:
    - Props: data: PixelMatchData, onComplete: (success: boolean) => void
    - Shows a 4x4 or 5x5 pixel grid briefly (displayTime ms), then shows 4 options. Player picks the matching one.
    - Use colored grid cells. Each option is a small grid. Correct = success, wrong = try again.
    - Add data-testid attributes.
  - Create `client/src/components/puzzles/TideTiming.tsx`:
    - Props: data: TideTimingData, onComplete: (success: boolean) => void
    - Shows an animated tide level bar that rises and falls sinusoidally. A target zone is highlighted.
    - Player clicks "Cast" when the level is within the target zone (tolerance). Need data.rounds successful catches.
    - Progress shown as round dots. Miss = shake animation. Hit = fill dot.
    - Add data-testid attributes.
  - Create `client/src/components/puzzles/FrequencyTune.tsx`:
    - Props: data: FrequencyTuneData, onComplete: (success: boolean) => void
    - Shows a waveform display and a frequency number. Target frequency shown. Player clicks +/- buttons (coarse: +/-10, fine: +/-1) to adjust.
    - When within tolerance of target, "Lock Signal" button appears. Click to complete.
    - Visual: simple sine wave SVG that changes frequency as you tune. Static noise when far, clean wave when close.
    - Add data-testid attributes.
  - Create `client/src/components/puzzles/ArtifactSort.tsx`:
    - Props: data: ArtifactSortData, onComplete: (success: boolean) => void
    - Shows category bins at top. Items listed below. Player clicks an item then clicks a category to place it.
    - When all items placed, "Check" button appears. All correct = success, any wrong = show which were wrong + reset.
    - Add data-testid attributes.
  - All puzzle components should use framer-motion for animations, lucide-react for icons, and match the visual style of existing puzzle components (PatternMemory, SymbolCipher, RiddleChallenge, EchoSequence). Use Button from @/components/ui/button.
  - Files: `client/src/components/puzzles/ChemicalMix.tsx`, `client/src/components/puzzles/PixelMatch.tsx`, `client/src/components/puzzles/TideTiming.tsx`, `client/src/components/puzzles/FrequencyTune.tsx`, `client/src/components/puzzles/ArtifactSort.tsx`
  - Acceptance: All 5 puzzle components render and function correctly

### T004: Add exploration scene data for 5 new locations
- **Blocked By**: [T001]
- **Details**:
  - In `client/src/lib/explorationData.ts`:
    - Add scene pools for lab, arcade, dock, tower, house (5-6 scenes each, mix of discovery, puzzle, choice types)
    - Each location needs: 2 discovery scenes (with 3 hotspots each giving artifacts/symbols/lore), 1-2 puzzle scenes (using new puzzle types), 1 choice scene
    - Register all in LOCATION_SCENES record
    - Puzzle data must match the new puzzle type interfaces from schema.ts (ChemicalMixData, PixelMatchData, TideTimingData, FrequencyTuneData, ArtifactSortData)
    - Discovery scenes should award new artifacts (chemical_vial for lab, pixel_shard for arcade, rusty_anchor for dock, signal_fragment for tower, collector_key for house) and symbol mappings
    - Choice scenes should have atmospheric text fitting each location's theme
    - Write Gravity Falls-quality atmospheric text - creepy, mysterious, hint at deeper secrets
    - Scene ids should follow pattern: {locationId}_{sceneName} e.g. "lab_entrance", "arcade_cabinet_row"
  - Files: `client/src/lib/explorationData.ts`
  - Acceptance: All 5 new locations have scene pools, all scene types present, puzzle configs valid

### T005: Add 15 new creature SVG sprites
- **Blocked By**: []
- **Details**:
  - In `client/src/components/CreatureSprite.tsx`:
    - Add SVG sprite components for all 15 new creatures, following the same pattern as existing sprites:
      - Each is a function component taking `{ w: number; animate: boolean }`
      - Uses framer-motion for idle animations
      - Each creature should be visually distinct and match its description/type
      - SVG viewBox="0 0 100 100", uses the `w` prop for width/height
    - Add all 15 to the CREATURE_MAP record
    - Creature SVG design guidelines:
      - `toxic_slime`: Green blob with bubbles, pulsing animation
      - `spark_golem`: Boxy robot shape with sparks, copper/yellow tones
      - `flask_phantom`: Translucent swirling figure in a flask shape, purple/cyan
      - `pixel_knight`: Blocky 8-bit warrior shape, sharp edges, pink/magenta
      - `neon_serpent`: Sinuous snake shape made of neon lines, multicolor glow
      - `cabinet_ghost`: Faint shape inside a rectangle (cabinet), gray/white
      - `tide_lurker`: Tentacles rising from below, dark blue/teal
      - `rust_crab`: Round body with legs, orange/brown rust tones
      - `depth_angler`: Fish shape with glowing lure, dark indigo/bioluminescent
      - `signal_wraith`: Humanoid made of wave lines, amber/orange
      - `frequency_bat`: Bat with dish-like ears, dark with amber accents
      - `static_owl`: Owl shape filled with static pattern, gray/white noise
      - `shelf_mimic`: Bookshelf shape with hidden eyes, brown/wood tones
      - `dust_djinn`: Swirling dust column, gray/gold particles
      - `porcelain_watcher`: Doll shape, white/cream with staring eyes
    - Each sprite should have appropriate idle animations (float, pulse, glitch, rotate, etc.)
  - Files: `client/src/components/CreatureSprite.tsx`
  - Acceptance: All 15 creatures render in the sprite component with animations

### T006: Integrate new locations into GamePage and ExplorationView
- **Blocked By**: [T002, T003, T004, T005]
- **Details**:
  - In `client/src/pages/GamePage.tsx`:
    - Add LOCATION_ICONS entries for: lab (FlaskConical), arcade (Gamepad2), dock (Anchor), tower (Radio), house (Home) — import from lucide-react
    - Add LOCATION_GRADIENTS: lab="from-cyan-950 via-teal-900 to-cyan-800", arcade="from-pink-950 via-fuchsia-900 to-pink-800", dock="from-sky-950 via-blue-900 to-sky-800", tower="from-amber-950 via-orange-900 to-amber-800", house="from-rose-950 via-red-900 to-rose-800"
    - Add LOCATION_ACCENT: lab="text-cyan-400", arcade="text-pink-400", dock="text-sky-400", tower="text-amber-400", house="text-rose-400"
    - Add LOCATION_GLOW: lab="shadow-[0_0_60px_rgba(6,182,212,0.15)]", arcade="shadow-[0_0_60px_rgba(236,72,153,0.15)]", dock="shadow-[0_0_60px_rgba(14,165,233,0.15)]", tower="shadow-[0_0_60px_rgba(245,158,11,0.15)]", house="shadow-[0_0_60px_rgba(244,63,94,0.15)]"
    - Update the journal count display from /12 to /27
  - In `client/src/components/ExplorationView.tsx`:
    - Add same gradient/accent/glow entries for new locations
    - Add LocationDecoration SVG cases for: lab (beakers, tubes, bubbles), arcade (cabinet outlines, pixel blocks), dock (waves, pier posts), tower (antenna, signal waves), house (shelves, picture frames)
    - Import new puzzle components (ChemicalMix, PixelMatch, TideTiming, FrequencyTune, ArtifactSort) and add cases in the puzzle rendering switch for: chemical_mix, pixel_match, tide_timing, frequency_tune, artifact_sort
    - Import new data types from schema: ChemicalMixData, PixelMatchData, TideTimingData, FrequencyTuneData, ArtifactSortData
  - Files: `client/src/pages/GamePage.tsx`, `client/src/components/ExplorationView.tsx`
  - Acceptance: All 9 locations render on the game page with correct theming, exploration works for all locations
