import type {
  ExplorationScene,
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
  ArtifactId,
  WireConnectionData,
  MastermindData,
} from "@shared/schema";

export const SYMBOL_ALPHABET: Record<string, string> = {
  A: "\u25B2", B: "\u2666", C: "\u2609", D: "\u2736", E: "\u25C6",
  F: "\u2742", G: "\u2605", H: "\u2721", I: "\u25CF", J: "\u2726",
  K: "\u2720", L: "\u2638", M: "\u2734", N: "\u2756", O: "\u25CB",
  P: "\u2740", Q: "\u2741", R: "\u273A", S: "\u2735", T: "\u25A0",
  U: "\u2739", V: "\u2731", W: "\u2743", X: "\u2737", Y: "\u2738",
  Z: "\u2732",
};

export function encodeWithSymbols(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => SYMBOL_ALPHABET[ch] || ch)
    .join(" ");
}

export function getSymbolForLetter(letter: string): string {
  return SYMBOL_ALPHABET[letter.toUpperCase()] || letter;
}

export function getLetterForSymbol(symbol: string): string | null {
  const entry = Object.entries(SYMBOL_ALPHABET).find(([, s]) => s === symbol);
  return entry ? entry[0] : null;
}

const FOREST_PATTERN_SYMBOLS = ["\u2663", "\u2740", "\u2618", "\u2767", "\u273F", "\u2741"];
const CAVE_ECHO_SYMBOLS = ["\u25C6", "\u25B2", "\u25CB", "\u25A0", "\u2666", "\u2605"];

/** Pool of riddles by difficulty; randomizePuzzle picks one so riddle scenes feel different each run. */
const RIDDLE_POOL: { difficulty: 1 | 2; data: RiddleData }[] = [
  { difficulty: 1, data: { question: "The Ember Newt's flames are dim and it seems tired. What is the best way to help it recover?", options: ["Douse it in cold stream water.", "Find a warm stone near the hot spring and let it rest.", "Carry it into a dark, cold cave."], correctIndex: 1, flavor: "The newt tilts its head, watching to see if you understand." } as RiddleData },
  { difficulty: 1, data: { question: "I have hands but cannot clap. I have a face but cannot smile. I run but have no legs. In this school, I run backwards. What am I?", options: ["A clock", "A river", "A shadow"], correctIndex: 0, flavor: "The chalkboard waits. Chalk dust forms a question mark." } as RiddleData },
  { difficulty: 1, data: { question: "You see heavy circular prints and thin claw-scratches dragging toward the water. Which creature most likely left these tracks?", options: ["Tide Lurker — tentacled thing beneath the waves.", "Rust Crab — metal shell and scrap claws.", "Depth Angler — deep-sea hunter."], correctIndex: 1, flavor: "A faint clinking echoes under the pier." } as RiddleData },
  { difficulty: 1, data: { question: "The old radio has one frequency that shows no number, only a symbol. What do the investigators call it?", options: ["Dead air", "Frequency Zero", "The silent channel"], correctIndex: 1, flavor: "The dial sticks when you try to turn past it." } as RiddleData },
  { difficulty: 1, data: { question: "I am in the forest but not a tree. I glow but am not fire. Creatures hide under me. What am I?", options: ["A mushroom", "A lantern", "The moon"], correctIndex: 0, flavor: "The clearing holds its breath." } as RiddleData },
  { difficulty: 1, data: { question: "The book's pages change when you look away. What should you do to read the real message?", options: ["Read only in candlelight.", "Look at the reflection in a mirror.", "Read the last paragraph first."], correctIndex: 1, flavor: "The library watches." } as RiddleData },
  { difficulty: 2, data: { question: "I speak without a mouth. I hear without ears. I have no body, but I come alive with the wind. What am I?", options: ["A ghost", "An echo", "A memory"], correctIndex: 1, flavor: "The room itself is listening for your answer." } as RiddleData },
  { difficulty: 2, data: { question: "It follows you in the dark but vanishes in light. It has your shape but not your voice. What is it?", options: ["Your shadow", "Your reflection", "Your echo"], correctIndex: 0, flavor: "The lights flicker. It's still there." } as RiddleData },
  { difficulty: 2, data: { question: "The creature is made of static and old screens. To see it clearly you must do what?", options: ["Turn off all power.", "Tune an analog set to the dead channel.", "Look at it through a camera."], correctIndex: 1, flavor: "The signal is always there. Most people don't look." } as RiddleData },
  { difficulty: 2, data: { question: "I have keys but no locks. I have space but no room. You can enter but never leave. What am I?", options: ["A maze", "A keyboard", "A memory"], correctIndex: 0, flavor: "The arcade hums. One of the cabinets is warm." } as RiddleData },
  { difficulty: 2, data: { question: "The dock sinks three inches every year but never disappears. What keeps it here?", options: ["The Tide Lurker holds it in place.", "Something underneath is building it back.", "The town forgets it's sinking."], correctIndex: 1, flavor: "The water is very cold. Something moves below." } as RiddleData },
];

export const FOREST_SCENES: ExplorationScene[] = [
  {
    id: "forest_clearing",
    locationId: "forest",
    type: "discovery",
    title: "The Clearing",
    description: "You push through thick undergrowth into a small clearing. Mushrooms form a perfect circle on the ground. Three objects catch your eye.",
    atmosphere: "Pale light filters through the canopy. The air tastes like copper.",
    hotspots: [
      {
        id: "mushroom_ring",
        label: "Glowing Mushroom Ring",
        description: "The mushrooms pulse with a faint green light. One is loose enough to take.",
        reward: { type: "artifact", artifactId: "glowing_mushroom" },
      },
      {
        id: "carved_stump",
        label: "Carved Tree Stump",
        description: "Symbols are carved deep into the wood. You recognize two of them and copy them into your journal.",
        reward: { type: "symbol", symbolKey: "A" },
      },
      {
        id: "bird_nest",
        label: "Abandoned Nest",
        description: "High up, a nest made of strange feathers and copper wire. Inside, you find an iridescent feather.",
        reward: { type: "artifact", artifactId: "strange_feather" },
      },
    ],
  },
  {
    id: "forest_hollow",
    locationId: "forest",
    type: "discovery",
    title: "The Hollow Tree",
    description: "An enormous tree, split open by lightning. Inside the hollow, the walls are covered in scratch marks and strange writing.",
    atmosphere: "Wind moans through the hollow like a voice trying to form words.",
    hotspots: [
      {
        id: "scratch_marks",
        label: "Scratch Marks",
        description: "The marks form a pattern. Something was counting days. Or counting something else entirely.",
        reward: { type: "lore", text: "[forest] The marks spell out: '147 days since it woke up. It hasn't slept since.'" },
      },
      {
        id: "hidden_cache",
        label: "Hidden Cache",
        description: "Behind a loose piece of bark, someone stashed a handful of strange dust that absorbs light.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
      {
        id: "symbol_wall",
        label: "Symbol Wall",
        description: "A section of bark has been carefully carved with unfamiliar symbols. You copy a new one into your journal.",
        reward: { type: "symbol", symbolKey: "T" },
      },
      {
        id: "forest_buried_oak",
        label: "The Oldest Oak's Roots",
        description: "You dig where the Moss Golem's secret told you to look. Beneath the roots of the hollow tree, a cache of crystals and a journal page: 'The roots connect every tree. The forest is one organism.'",
        reward: { type: "lore", text: "[forest] Beneath the oldest oak, you found what was never found: proof that the forest is alive and aware. It has been watching the town since before the town existed." },
        hidden: true,
        unlockedBySecret: "moss_golem",
      },
    ],
  },
  {
    id: "forest_creek",
    locationId: "forest",
    type: "discovery",
    title: "The Creek Crossing",
    description: "A narrow creek cuts through the undergrowth. Stepping stones form an irregular path. Something glints under the surface.",
    atmosphere: "The water runs clear but reflects nothing. No sky, no trees.",
    hotspots: [
      {
        id: "creek_bed",
        label: "Search the creek bed",
        description: "You wade in. Among the stones is a small gear, rust-free despite the water. It still turns when you touch it.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "far_bank",
        label: "Cross to the far bank",
        description: "The far side is thick with ferns. Under them you find a patch of mushrooms that glow faintly blue.",
        reward: { type: "artifact", artifactId: "glowing_mushroom" },
      },
      {
        id: "forest_warm_water_upstream",
        label: "Follow the Warm Water Upstream",
        description: "The Ember Newt's secret was right. You follow the creek to where the water grows warm. A hidden hot spring seeps from the rocks; newts cluster on the stones, and fog pools at your feet.",
        reward: { type: "lore", text: "[forest] At the source of the warm water you found where the Ember Newts begin. The spring isn't on any map. The forest has been keeping it secret. The newts don't mind you—they remember every hand that didn't grab." },
        hidden: true,
        unlockedBySecret: "ember_newt",
      },
    ],
  },
  {
    id: "forest_fog_edge",
    locationId: "forest",
    type: "discovery",
    title: "Where the Fog Thickens",
    description: "At the edge of the woods the mist never quite lifts. Sometimes you see lights in the distance—lanterns, windows—that vanish when you blink.",
    atmosphere: "The fog doesn't feel hostile. It feels like waiting.",
    hotspots: [
      {
        id: "treeline",
        label: "Stay at the treeline",
        description: "You watch the fog from the safety of the trees. A cold draft carries the smell of rain and something older.",
        reward: { type: "lore", text: "[forest] The fog has a border. It doesn't spread past the oldest markers. Someone—or something—decided where it ends." },
      },
      {
        id: "follow_lights_fog",
        label: "Follow the lights into the fog",
        description: "You step off the path and into the mist. The lights grow steadier. Streets form under your feet. You are standing in a town that is and isn't yours—a twin that exists between dimensions, where the Fog Wraith is not a monster but a guardian. The lights are real. So are the faces in the windows. They nod as you pass. You leave before dawn, and the fog lets you go.",
        reward: { type: "lore", text: "[forest] You found the town in the fog. It has the same streets, the same shops, but the people are reflections—older, quieter, never quite looking at you. They live in the space between. The Fog Wraith keeps the border. It doesn't want our world to forget its twin exists." },
        hidden: true,
        unlockedBySecret: "fog_wraith",
      },
    ],
  },
  {
    id: "forest_fork",
    locationId: "forest",
    type: "choice",
    title: "The Forking Path",
    description: "The trail splits. To the left, a faint green glow pulses between the trees. To the right, you hear what sounds like whispering.",
    atmosphere: "Both paths feel like they're watching you decide.",
    choices: [
      {
        id: "follow_light",
        label: "Follow the green glow",
        description: "The light seems to beckon. It pulses faster as you look at it.",
        outcome: "You find a cluster of bioluminescent mushrooms growing around an old brass gear half-buried in moss.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "follow_whisper",
        label: "Follow the whispers",
        description: "The voices are faint but insistent. They seem to be repeating something.",
        outcome: "The whispers lead you to a stone with symbols carved into it. You feel like you've learned something important.",
        reward: { type: "lore", text: "[forest] The whispers say: 'The roots remember what the branches forget. Dig where the shadow falls at noon.'" },
      },
    ],
  },
  {
    id: "forest_pattern",
    locationId: "forest",
    type: "puzzle",
    title: "The Memory Trees",
    description: "Six trees stand in a circle. Their bark flashes with glowing symbols in a specific pattern. You need to remember the sequence.",
    atmosphere: "The forest holds its breath. Even the wind stops.",
    puzzle: {
      puzzleType: "pattern_memory",
      difficulty: 1,
      data: {
        symbols: FOREST_PATTERN_SYMBOLS,
        sequence: [2, 0, 4, 1],
        displayTime: 1000,
      } as PatternMemoryData,
    },
    rewardArtifact: "strange_feather",
  },
  {
    id: "forest_pattern_hard",
    locationId: "forest",
    type: "puzzle",
    title: "The Ancient Grove",
    description: "Deeper in the forest, older trees pulse with longer patterns. The symbols glow brighter here.",
    atmosphere: "The air crackles with energy. Something ancient is testing you.",
    puzzle: {
      puzzleType: "pattern_memory",
      difficulty: 2,
      data: {
        symbols: FOREST_PATTERN_SYMBOLS,
        sequence: [1, 3, 0, 5, 2],
        displayTime: 1800,
      } as PatternMemoryData,
    },
    rewardArtifact: "cave_crystal",
  },
  {
    id: "forest_echo_sequence",
    locationId: "forest",
    type: "puzzle",
    title: "The Echoing Grove",
    description: "Wind moves through the trees in deliberate gusts. Each tree flashes with light, answering another and passing a pattern around the circle.",
    atmosphere: "The forest speaks in echoes of light. You just have to watch the flashes in the right order.",
    puzzle: {
      puzzleType: "echo_sequence",
      difficulty: 1,
      data: {
        symbols: FOREST_PATTERN_SYMBOLS,
        sequence: [0, 2, 4, 1, 3, 5],
        rounds: 3,
      } as EchoSequenceData,
    },
    rewardArtifact: "strange_feather",
  },
  {
    id: "forest_creature_care",
    locationId: "forest",
    type: "puzzle",
    title: "Caring for a Forest Friend",
    description: "Near a warm spring, an Ember Newt you befriended curls up on a cool stone. Its tiny flame-spots flicker weakly.",
    atmosphere: "The air smells like damp earth and woodsmoke. The newt blinks slowly, waiting to see what you do.",
    puzzle: {
      puzzleType: "riddle",
      difficulty: 1,
      data: {
        question: "The Ember Newt's flames are dim and it seems tired. What is the best way to help it recover?",
        options: [
          "Douse it in a bucket of cold stream water to cool it down completely.",
          "Find a smooth warm stone near the forest hot spring and let it rest there.",
          "Carry it deep into a dark, cold cave where no light can reach.",
        ],
        correctIndex: 1,
        flavor: "The Ember Newt tilts its head, watching closely to see if you understand what it needs.",
      } as RiddleData,
    },
    rewardArtifact: "glowing_mushroom",
  },
  {
    id: "forest_overgrown_statue",
    locationId: "forest",
    type: "discovery",
    title: "Overgrown Statue",
    description: "Vines have completely enveloped a stone statue. Only one hand is visible, pointing toward the ground. The ground there is soft.",
    atmosphere: "The birds aren't singing near the statue. They're just watching it.",
    hotspots: [
      {
        id: "statue_hand",
        label: "The Pointing Hand",
        description: "The stone is warm. Clutched in the fingers is a single strange feather that shouldn't belong to any local bird.",
        reward: { type: "artifact", artifactId: "strange_feather" },
      },
      {
        id: "statue_base",
        label: "Soft Ground at Base",
        description: "You brush away the dirt. A symbol is carved perfectly into the bedrock.",
        reward: { type: "symbol", symbolKey: "Y" },
      },
    ],
  },
  {
    id: "forest_strange_tracks",
    locationId: "forest",
    type: "choice",
    title: "Strange Tracks",
    description: "The path is suddenly crossed by footprints that have too many toes. They lead off the trail into a thicket of thorns. The other direction shows broken branches.",
    atmosphere: "Whatever made these tracks is heavy enough to crack stone.",
    choices: [
      {
        id: "follow_thorns",
        label: "Brave the thicket",
        description: "The thorns catch your clothes, but you squeeze through.",
        outcome: "You find the remains of a campfire that burns with green flames. Next to it, an old gear mechanism.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "follow_branches",
        label: "Follow the broken branches",
        description: "The snapping sounds of wood echo back to you, like a recording.",
        outcome: "You find nothing but a scrap of paper pinned to a tree with a rusty nail. It reads: 'They aren't lost, they're hiding.'",
        reward: { type: "lore", text: "[forest] The note smells strongly of ozone." },
      },
    ],
  },
];

export const LIBRARY_SCENES: ExplorationScene[] = [
  {
    id: "library_stairwell",
    locationId: "library",
    type: "discovery",
    title: "The Back Stairwell",
    description: "A narrow staircase leads to a floor that doesn't appear on any sign. The walls are lined with filing cabinets instead of shelves.",
    atmosphere: "The steps creak in sequence, as if someone just climbed them.",
    hotspots: [
      {
        id: "top_drawer",
        label: "Open the top drawer",
        description: "Files with no names, only dates. One folder contains a single page of symbols. You copy one into your journal.",
        reward: { type: "symbol", symbolKey: "R" },
      },
      {
        id: "stair_landing",
        label: "Inspect the landing",
        description: "A dusty crate holds discarded equipment. One item is a small chip that hums when you pick it up.",
        reward: { type: "artifact", artifactId: "static_chip" },
      },
    ],
  },
  {
    id: "library_entrance",
    locationId: "library",
    type: "discovery",
    title: "The Entrance Hall",
    description: "The library's front hall is lined with portraits of librarians going back centuries. One frame is empty. The card catalog hums softly.",
    atmosphere: "Dust motes float in beams of light that come from no visible window.",
    hotspots: [
      {
        id: "empty_frame",
        label: "Empty Portrait Frame",
        description: "The nameplate reads a name in strange symbols. You manage to decode part of it and copy a symbol to your journal.",
        reward: { type: "symbol", symbolKey: "S" },
      },
      {
        id: "card_catalog",
        label: "Humming Card Catalog",
        description: "One drawer is slightly open. Inside, a circuit board is wired to the filing system. Someone automated this catalog.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
      {
        id: "return_pile",
        label: "Return Pile",
        description: "A stack of books that were never re-shelved. One has a torn page sticking out with writing that shifts when you're not looking directly at it.",
        reward: { type: "artifact", artifactId: "ancient_book" },
      },
      {
        id: "library_book_that_laughs",
        label: "The Book That Laughs",
        description: "The Giggle Wisp's secret was true. In a quiet corner, one volume giggles at random. It isn't a book—it's where the wisp hides between Tuesday evenings. You open it and a page of lore falls out.",
        reward: { type: "lore", text: "[library] The book that laughs is not a book at all. It's a nest. The Giggle Wisp has been living in the same binding for decades. The librarians gave up removing it; it always comes back." },
        hidden: true,
        unlockedBySecret: "giggle_wisp",
      },
      {
        id: "library_shelf_seven",
        label: "Inspect Shelf Seven",
        description: "The Glitch Fox's secret was right. Behind shelf seven, a narrow passage leads to a hidden room. Inside: a desk, a journal, and a map of the town covered in red circles.",
        reward: { type: "lore", text: "[library] The secret room behind shelf seven contains a map. Every location you've explored is circled. But there are three circles you don't recognize. Someone was tracking the same things you are." },
        hidden: true,
        unlockedBySecret: "glitch_fox",
      },
    ],
  },
  {
    id: "library_restricted",
    locationId: "library",
    type: "discovery",
    title: "The Restricted Section",
    description: "Behind a velvet rope, shelves of books with no titles. The air smells like ozone and old ink.",
    atmosphere: "Books rearrange themselves on the shelves when you blink.",
    hotspots: [
      {
        id: "blank_book",
        label: "Book With No Title",
        description: "The pages are full of symbol writing. You recognize some symbols and copy a new one to your journal.",
        reward: { type: "symbol", symbolKey: "E" },
      },
      {
        id: "hidden_note",
        label: "Note Between Pages",
        description: "Tucked inside: 'If you're reading this, you've been chosen. The catalog knows your name. Don't trust shelf seven.'",
        reward: { type: "lore", text: "[library] The note is signed with a symbol you don't recognize. The ink is still wet." },
      },
      {
        id: "static_device",
        label: "Strange Device",
        description: "A small chip-like device wedged behind the books. It plays white noise when you hold it.",
        reward: { type: "artifact", artifactId: "static_chip" },
      },
    ],
  },
  {
    id: "library_cipher",
    locationId: "library",
    type: "puzzle",
    title: "The Cipher Shelf",
    description: "An entire shelf of books with titles written in the symbol alphabet. One book's spine seems to spell a word you need to decode.",
    atmosphere: "The symbols shimmer and rearrange as you look at them.",
    puzzle: {
      puzzleType: "symbol_cipher",
      difficulty: 1,
      data: {
        encodedWord: "",
        answer: "OWL",
        hintLetters: [0, 2],
      } as SymbolCipherData,
    },
    rewardArtifact: "ancient_book",
  },
  {
    id: "library_cipher_hard",
    locationId: "library",
    type: "puzzle",
    title: "The Locked Archive",
    description: "A glass case holds a single page covered in symbols. To open it, you must decode the word etched on the lock.",
    atmosphere: "The glass vibrates at a frequency you can feel in your teeth.",
    puzzle: {
      puzzleType: "symbol_cipher",
      difficulty: 2,
      data: {
        encodedWord: "",
        answer: "GHOST",
        hintLetters: [0, 4],
      } as SymbolCipherData,
    },
    rewardArtifact: "circuit_board",
  },
  {
    id: "library_sort_table",
    locationId: "library",
    type: "puzzle",
    title: "The Sorting Desk",
    description: "A reshelving cart overflows with books from every section. The classification cards have been shuffled.",
    atmosphere: "The catalog lights blink impatiently, as if judging your filing system.",
    puzzle: {
      puzzleType: "artifact_sort",
      difficulty: 1,
      data: {
        items: [
          {
            id: "atlas",
            name: "Crumpled Atlas",
            description: "Maps of continents that never existed, with sea monsters in the margins.",
            category: "History",
          },
          {
            id: "lab_notes",
            name: "Scorched Lab Notebook",
            description: "Filled with chemical diagrams and warnings like 'DO NOT MIX THESE.'",
            category: "Science",
          },
          {
            id: "ghost_story",
            name: "Dog-Eared Ghost Story",
            description: "Every time you flip a page, the ending changes.",
            category: "Fiction",
          },
          {
            id: "star_chart",
            name: "Annotated Star Chart",
            description: "Constellations are circled with notes like 'moved last week'.",
            category: "Science",
          },
          {
            id: "town_archive",
            name: "Town Archive Ledger",
            description: "Lists every book ever checked out. Some entries are dated decades in the future.",
            category: "History",
          },
        ],
        categories: ["History", "Science", "Fiction"],
      } as ArtifactSortData,
    },
    rewardArtifact: "ancient_book",
  },
  {
    id: "library_choice",
    locationId: "library",
    type: "choice",
    title: "The Reading Room",
    description: "Two reading lamps are on, illuminating different tables. One table has an open book with diagrams. The other has scattered notes covered in hasty handwriting.",
    atmosphere: "Someone was here very recently. The chair is still warm.",
    choices: [
      {
        id: "diagrams",
        label: "Examine the diagrams",
        description: "Technical drawings of something. A machine? A creature? It's hard to tell the difference.",
        outcome: "The diagrams show how to wire a circuit board to a crystal. Useful for crafting. You find a spare circuit board tucked under the page.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
      {
        id: "notes",
        label: "Read the scattered notes",
        description: "Frantic handwriting. The author was excited. Or afraid.",
        outcome: "The notes describe encounters with something in the restricted section. The final line reads: 'It speaks in symbols. I'm learning its language.'",
        reward: { type: "lore", text: "[library] Margin note: 'Symbol alphabet found on page 47. Each creature knows a different dialect.'" },
      },
    ],
  },
  {
    id: "library_forgotten_aisle",
    locationId: "library",
    type: "discovery",
    title: "The Forgotten Aisle",
    description: "This row isn't on the library map. The books here don't have titles, just numbers counting down.",
    atmosphere: "You feel suddenly very thirsty.",
    hotspots: [
      {
        id: "book_zero",
        label: "Book Zero",
        description: "The countdown ends here. You open it to find a cavity containing a perfectly preserved feather.",
        reward: { type: "artifact", artifactId: "strange_feather" },
      },
      {
        id: "aisle_marking",
        label: "Aisle Marking",
        description: "The sign for the aisle is a single glowing symbol instead of a number.",
        reward: { type: "symbol", symbolKey: "K" },
      },
    ],
  },
  {
    id: "library_whispering_books",
    locationId: "library",
    type: "choice",
    title: "Whispering Books",
    description: "You hear a faint muttering. Two books have fallen from the shelf. One is vibrating. The other is perfectly still, but feels heavy.",
    atmosphere: "The dust in the air forms spirals above the books.",
    choices: [
      {
        id: "vibrating_book",
        label: "Pick up the vibrating book",
        description: "It buzzes like a hive of mechanical bees.",
        outcome: "You crack it open. A tiny, intricate circuit board falls out. The book instantly goes silent.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
      {
        id: "heavy_book",
        label: "Pick up the heavy book",
        description: "It weighs as much as a cinder block.",
        outcome: "The pages are bound together with thick dark dust. You scrape off a handful. Shadow dust.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
    ],
  },
];

export const SCHOOL_SCENES: ExplorationScene[] = [
  {
    id: "school_hallway",
    locationId: "school",
    type: "discovery",
    title: "Main Hallway",
    description: "Lockers line both walls, some dented from the inside. The floor tiles form a pattern that doesn't quite repeat correctly.",
    atmosphere: "A bell rings somewhere far away. The echo takes too long to fade.",
    hotspots: [
      {
        id: "open_locker",
        label: "Dented Locker #13",
        description: "The locker is pushed open from inside. A strange feather and a note that says 'IT KNOWS MY LOCKER COMBINATION' are inside.",
        reward: { type: "artifact", artifactId: "strange_feather" },
      },
      {
        id: "floor_pattern",
        label: "Floor Tile Pattern",
        description: "Some tiles have symbols scratched into them. They form a path to the east wing.",
        reward: { type: "symbol", symbolKey: "R" },
      },
      {
        id: "school_room_thirteen",
        label: "The Sealed Door to Room Thirteen",
        description: "The Phase Hound's secret led you here. Room 13 is sealed—no handle, no keyhole, just a door that shouldn't exist. The thud of footsteps vibrates through your chest from the other side. You leave a note and walk away. Some doors stay closed.",
        reward: { type: "lore", text: "[school] Room Thirteen was sealed for a reason. The Phase Hound doesn't walk through walls to escape—it walks through to guard what's inside. The janitor locks the east wing every night to keep us out, not it in." },
        hidden: true,
        unlockedBySecret: "phase_hound",
      },
      {
        id: "trophy_case",
        label: "Dusty Trophy Case",
        description: "Trophies for clubs that never existed. One is made of a crystal that pulses with inner light.",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
    ],
  },
  {
    id: "school_classroom",
    locationId: "school",
    type: "discovery",
    title: "Classroom 7B",
    description: "Desks arranged in a circle, facing outward. The chalkboard has writing on it that nobody remembers putting there.",
    atmosphere: "You could swear the clock is running backwards.",
    hotspots: [
      {
        id: "chalkboard",
        label: "The Chalkboard",
        description: "It reads: 'TODAY'S LESSON: How to disappear. Step 1: Look away.' You look away. When you look back, a new symbol has appeared.",
        reward: { type: "symbol", symbolKey: "N" },
      },
      {
        id: "teacher_desk",
        label: "Teacher's Desk",
        description: "The drawer is locked, but something rattles inside. You find a loose gear mechanism on the floor nearby.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "student_journal",
        label: "Left-Behind Notebook",
        description: "A student's journal from the year the school closed. The entries get stranger toward the end.",
        reward: { type: "lore", text: "[school] Last entry: 'Mrs. Peterson wasn't real. None of the teachers were. We finally noticed on Thursday.'" },
      },
      {
        id: "school_mirror_room",
        label: "The Old Mirror Closet",
        description: "The Mirror Shade's secret was true. You ask the reflection a question. It writes the answer backwards on the glass: a set of coordinates and a date.",
        reward: { type: "lore", text: "[school] Your reflection wrote: 'The school was built to contain something. Not to educate. The classrooms are cells. The students were the experiment.'" },
        hidden: true,
        unlockedBySecret: "mirror_shade",
      },
    ],
  },
  {
    id: "school_riddle",
    locationId: "school",
    type: "puzzle",
    title: "The Chalkboard Riddle",
    description: "You enter a classroom and the door shuts behind you. On the chalkboard, new words are appearing letter by letter, as if written by an invisible hand.",
    atmosphere: "Chalk dust swirls in patterns that almost look like faces.",
    puzzle: {
      puzzleType: "riddle",
      difficulty: 1,
      data: {
        question: "I have hands but cannot clap. I have a face but cannot smile. I run but have no legs. In this school, I run backwards. What am I?",
        options: ["A clock", "A river", "A shadow"],
        correctIndex: 0,
        flavor: "The chalkboard waits for your answer. The chalk dust forms a question mark.",
      } as RiddleData,
    },
    rewardArtifact: "old_gear",
  },
  {
    id: "school_riddle_2",
    locationId: "school",
    type: "puzzle",
    title: "The Final Exam",
    description: "Another classroom, another riddle. This one was already on the board when you arrived. Someone wrote 'ANSWER ME' underneath.",
    atmosphere: "The desks have been pushed against the walls. Something needed the space.",
    puzzle: {
      puzzleType: "riddle",
      difficulty: 2,
      data: {
        question: "I speak without a mouth. I hear without ears. I have no body, but I come alive with the wind. What am I?",
        options: ["A ghost", "An echo", "A memory"],
        correctIndex: 1,
        flavor: "The lights flicker. You feel like the room itself is listening for your answer.",
      } as RiddleData,
    },
    rewardArtifact: "shadow_dust",
  },
  {
    id: "school_afternoon_choice",
    locationId: "school",
    type: "choice",
    title: "Afternoon Light",
    description: "Sun streams through the windows of an empty corridor. One door is ajar — a supply closet. The other leads to a room where a single desk faces the blackboard.",
    atmosphere: "The bell never rings here. You're not sure if it's been minutes or hours.",
    choices: [
      {
        id: "supply_closet",
        label: "Check the supply closet",
        description: "Cramped. Something has been living in the back, behind the boxes.",
        outcome: "You find a vial of crystal dust and a note: 'Sample 47 — do not open.'",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
      {
        id: "single_desk",
        label: "Enter the room with one desk",
        description: "The desk is covered in carved symbols. Student work, or something else?",
        outcome: "The symbols match your journal. You add a new one. The desk drawer holds a tarnished gear.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
    ],
  },
  {
    id: "school_habitat_lesson",
    locationId: "school",
    type: "puzzle",
    title: "Creature Habitat Lesson",
    description: "In the science wing, a teacher's chart shows creature cards pinned under different habitat headings. Half the cards have fallen to the floor.",
    atmosphere: "A draft rustles the cards. It's like the creatures are waiting for someone to remember where they belong.",
    puzzle: {
      puzzleType: "artifact_sort",
      difficulty: 1,
      data: {
        items: [
          {
            id: "moss_golem_card",
            name: "Moss Golem",
            description: "A lumbering guardian of roots and trees, covered in damp moss.",
            category: "Forest",
          },
          {
            id: "tide_lurker_card",
            name: "Tide Lurker",
            description: "Tentacles that only surface near rotting piers and deep water.",
            category: "Dock",
          },
          {
            id: "signal_wraith_card",
            name: "Signal Wraith",
            description: "A body made of radio waves, always sketched next to tall antennas.",
            category: "Tower",
          },
          {
            id: "porcelain_watcher_card",
            name: "Porcelain Watcher",
            description: "A porcelain figure that never seems to leave the same old house.",
            category: "House",
          },
        ],
        categories: ["Forest", "Dock", "Tower", "House"],
      } as ArtifactSortData,
    },
    rewardArtifact: "ancient_book",
  },
  {
    id: "school_choice",
    locationId: "school",
    type: "choice",
    title: "The East Wing",
    description: "The hallway splits. A sign says 'GYMNASIUM' pointing left. Another says 'SCIENCE LAB' pointing right. Both signs are hanging crooked.",
    atmosphere: "From the gym, rhythmic thumping. From the lab, a faint chemical smell.",
    choices: [
      {
        id: "gymnasium",
        label: "Enter the gymnasium",
        description: "The thumping is steady, like something bouncing a ball. But there's no one in there. Right?",
        outcome: "A basketball rolls toward you and stops. Underneath it, someone taped a small gear mechanism and a note: 'FOR THE INVESTIGATOR.'",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "science_lab",
        label: "Enter the science lab",
        description: "The chemical smell is sharp. Someone's been here recently.",
        outcome: "Beakers arranged in a pattern on the lab bench. One contains a crystal that shouldn't exist in nature. You take it carefully.",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
    ],
  },
  {
    id: "school_cafeteria",
    locationId: "school",
    type: "discovery",
    title: "The Cafeteria",
    description: "The tables are bolted to the floor in concentric circles instead of rows. The menu board lists items that aren't food.",
    atmosphere: "It smells faintly of sulfur and burnt sugar.",
    hotspots: [
      {
        id: "lunch_tray",
        label: "Abandoned Tray",
        description: "Under a cloche, there's no food. Just a cluster of glowing mushrooms growing out of a milk carton.",
        reward: { type: "artifact", artifactId: "glowing_mushroom" },
      },
      {
        id: "menu_symbol",
        label: "The Menu Board",
        description: "Today's special is written in a language you shouldn't be able to read. But you do. You copy the main symbol.",
        reward: { type: "symbol", symbolKey: "B" },
      },
    ],
  },
  {
    id: "school_detention",
    locationId: "school",
    type: "choice",
    title: "Detention Room",
    description: "The door reads 'INDEFINITE DETENTION'. Inside, two desks face opposing walls. One wall is covered in frantic chalk tally marks. The other is a large mirror.",
    atmosphere: "The clock ticks, but the second hand only moves backward.",
    choices: [
      {
        id: "tally_wall",
        label: "Examine the tallies",
        description: "Thousands of lines. But they aren't counting days.",
        outcome: "They're counting failures. At the bottom, a note says: 'Experiment 412 concluded. Subject yielded one (1) crystal.' You find a small glimmer under the desk.",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
      {
        id: "mirror_wall",
        label: "Look in the mirror",
        description: "Your reflection doesn't blink when you do.",
        outcome: "The reflection points to a loose floor tile. You pry it up to find a rusted mechanism that still turns silently.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
    ],
  },
];

export const CAVE_SCENES: ExplorationScene[] = [
  {
    id: "cave_entrance",
    locationId: "cave",
    type: "discovery",
    title: "Cave Mouth",
    description: "The entrance is wider than it should be. Crystals embedded in the rock cast prismatic light across the walls. Something drips in the darkness ahead.",
    atmosphere: "Your breath fogs, but it's not cold. The cave breathes back.",
    hotspots: [
      {
        id: "wall_crystal",
        label: "Embedded Crystal",
        description: "A crystal that hums at a frequency you can almost hear. It comes free with a gentle tug.",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
      {
        id: "cave_marking",
        label: "Cave Marking",
        description: "Ancient symbols painted on the rock in something that still glows faintly after what must be centuries.",
        reward: { type: "symbol", symbolKey: "D" },
      },
      {
        id: "cave_roots_warning",
        label: "Roots at the Cave Mouth",
        description: "The Rumble Root's secret led you here. Among the rocks at the entrance, thick roots breach the soil—too deep and too many. Something below is growing upward.",
        reward: { type: "lore", text: "[cave] Something below the cave keeps growing upward. The roots at the mouth are just the beginning. The Rumble Root doesn't guard the cave—it's running from what's underneath." },
        hidden: true,
        unlockedBySecret: "rumble_root",
      },
      {
        id: "shadow_pool",
        label: "Pool of Darkness",
        description: "A small depression filled with something darker than shadow. When you reach in, fine particles cling to your hand.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
    ],
  },
  {
    id: "cave_chamber",
    locationId: "cave",
    type: "discovery",
    title: "The Crystal Chamber",
    description: "A vast cavern where crystals grow from every surface. They pulse in sequence, like a heartbeat. Writing covers one wall.",
    atmosphere: "The pulsing light makes your own heartbeat sync with the cave's rhythm.",
    hotspots: [
      {
        id: "pulsing_crystal",
        label: "Largest Crystal",
        description: "The biggest crystal has a chip missing. The broken piece is on the ground, still pulsing in sync.",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
      {
        id: "wall_text",
        label: "Carved Wall Text",
        description: "Ancient text reads: 'THE THIRD CHAMBER IS NOT THE LAST. THE CAVE GOES DEEPER THAN THE EARTH.'",
        reward: { type: "lore", text: "[cave] Below the text, fresher carvings: 'I went deeper. I found what was sleeping. I shouldn't have woken it.'" },
      },
      {
        id: "crystal_symbol",
        label: "Symbol in Crystal",
        description: "A symbol is perfectly preserved inside a clear crystal, as if it grew around the carving.",
        reward: { type: "symbol", symbolKey: "O" },
      },
      {
        id: "cave_third_door",
        label: "The Third Chamber Door",
        description: "The Void Moth was right. The dead end in the third chamber is actually a door. You push through into a space that shouldn't exist. The air is warm. Something enormous breathes in the dark.",
        reward: { type: "lore", text: "[cave] Beyond the third chamber door, you found a cavern the size of a cathedral. Something sleeps here. Its heartbeat makes the crystals pulse. It has been sleeping longer than the town has existed." },
        hidden: true,
        unlockedBySecret: "void_moth",
      },
      {
        id: "cave_prism_sequence",
        label: "The Crystal Flash Sequence",
        description: "The Prism Beetle's secret made sense here. In the chamber, one crystal pulses red, then blue, then green in order. You record the pattern. A researcher's note lies in the dust: 'Red blue green in that order means danger is near.'",
        reward: { type: "lore", text: "[cave] The cave's crystals repeat the Prism Beetle's warning: red, blue, green. When they flash in that order, something in the deep stirs. The beetle wasn't speaking nonsense—it was translating." },
        hidden: true,
        unlockedBySecret: "prism_beetle",
      },
    ],
  },
  {
    id: "cave_echo",
    locationId: "cave",
    type: "puzzle",
    title: "The Signal Chamber",
    description: "You enter a perfectly round chamber. Crystals embedded in the walls pulse on and off in a repeating pattern. The cave wants you to learn its new language of light.",
    atmosphere: "The air feels charged. Light blinks where echoes should be, spelling something over and over.",
    puzzle: {
      puzzleType: "morse_code",
      difficulty: 1,
      data: {
        word: "ECHO",
      } as MorseCodeData,
    },
    rewardArtifact: "shadow_dust",
  },
  {
    id: "cave_echo_hard",
    locationId: "cave",
    type: "puzzle",
    title: "The Deep Signal",
    description: "Deeper in the cave, the crystals flash in longer, denser chains of light. The pulses feel deliberate, like a warning repeated until someone understands.",
    atmosphere: "Shadows jump with every flash. The pattern spells a short word again and again, daring you to read it.",
    puzzle: {
      puzzleType: "morse_code",
      difficulty: 2,
      data: {
        word: "DEEP",
      } as MorseCodeData,
    },
    rewardArtifact: "cave_crystal",
  },
  {
    id: "cave_echo_sequence",
    locationId: "cave",
    type: "puzzle",
    title: "Crystal Echo Choir",
    description: "Far below, a ring of crystals lights up one after another, each flash bouncing off the walls in a specific order.",
    atmosphere: "Every echo answers another. The cave is teaching you a new song.",
    puzzle: {
      puzzleType: "echo_sequence",
      difficulty: 1,
      data: {
        symbols: ["\u25C6", "\u25C8", "\u25CF", "\u25CE"],
        sequence: [0, 1, 2, 3, 2, 1],
        rounds: 3,
      } as EchoSequenceData,
    },
    rewardArtifact: "cave_crystal",
  },
  {
    id: "cave_choice",
    locationId: "cave",
    type: "choice",
    title: "The Split Tunnel",
    description: "The cave splits into two passages. One slopes downward toward a faint glow. The other is perfectly dark but warm air flows from it.",
    atmosphere: "Water drips in one tunnel. In the other, something breathes.",
    choices: [
      {
        id: "glow_tunnel",
        label: "Follow the glow",
        description: "The light is warm and golden. It pulses slowly, like a heartbeat deep underground.",
        outcome: "The glow comes from a vein of crystals running through the rock. Where they intersect, a dark residue has collected — pure shadow dust.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
      {
        id: "dark_tunnel",
        label: "Follow the warm air",
        description: "The warmth feels like breath. The tunnel narrows but never closes completely.",
        outcome: "The tunnel opens into a small grotto. On a natural shelf, someone left a gear mechanism wrapped in cloth. How long has it been here?",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
    ],
  },
  {
    id: "cave_fossil",
    locationId: "cave",
    type: "discovery",
    title: "The Fossil Wall",
    description: "An entire face of the rock is embedded with bones. They don't look human, nor do they look like any animal seen today.",
    atmosphere: "A breeze blows through the ribcage of something massive.",
    hotspots: [
      {
        id: "ribcage_cache",
        label: "Hidden Cavity",
        description: "Behind the massive ribs, something glitters. You pry out an old crystal.",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
      {
        id: "fossil_symbol",
        label: "Fossilized Symbol",
        description: "The bones seem arranged intentionally, forming a distinct shape against the stone.",
        reward: { type: "symbol", symbolKey: "V" },
      },
    ],
  },
  {
    id: "cave_abyss_choice",
    locationId: "cave",
    type: "choice",
    title: "Edge of the Abyss",
    description: "The floor drops away into a seemingly bottomless pit. A narrow stone bridge crosses it to a glowing altar. A crumbling ledge runs along the wall to your right.",
    atmosphere: "Pebbles fall and never seem to hit the bottom.",
    choices: [
      {
        id: "cross_bridge",
        label: "Cross the bridge",
        description: "The stone bridge is barely a foot wide and slick with moisture.",
        outcome: "You carefully cross to the altar and find a handful of pure dark powder resting on it.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
      {
        id: "take_ledge",
        label: "Shimmy the ledge",
        description: "The ledge hugs the wall tightly. It's safer than the bridge, but ends abruptly.",
        outcome: "At the end of the ledge, you find a rusted gear lodged in a crack in the stone. You wrench it free.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
    ],
  },
];

const LAB_CHEMICAL_BOTTLES = [
  { id: "acid", color: "#22c55e", label: "Acid" },
  { id: "base", color: "#3b82f6", label: "Base" },
  { id: "catalyst", color: "#f59e0b", label: "Catalyst" },
  { id: "solvent", color: "#a855f7", label: "Solvent" },
  { id: "reagent", color: "#ef4444", label: "Reagent" },
];

const HOUSE_POTION_INGREDIENTS = [
  { id: "moonwater", color: "#38bdf8", label: "Moonwater" },
  { id: "root_essence", color: "#22c55e", label: "Root Essence" },
  { id: "starlight_dust", color: "#e5e7eb", label: "Starlight Dust" },
  { id: "shadow_sap", color: "#1f2937", label: "Shadow Sap" },
];

export const LAB_SCENES: ExplorationScene[] = [
  {
    id: "lab_entrance",
    locationId: "lab",
    type: "discovery",
    title: "Reception Lab",
    description: "The main lab stretches before you, long benches covered in beakers that bubble without flame. A clipboard dangles from a chain, its pages turning on their own.",
    atmosphere: "Flickering monitors cast green light across the ceiling. Something bubbles that shouldn't.",
    hotspots: [
      {
        id: "bubbling_beaker",
        label: "Self-Heating Beaker",
        description: "A beaker of luminous liquid stirs itself in slow circles. When you lean close, it leans toward you. You pocket a small vial of it.",
        reward: { type: "artifact", artifactId: "chemical_vial" },
      },
      {
        id: "clipboard_notes",
        label: "Spinning Clipboard",
        description: "The pages settle when you grab it. Experiment logs. Most are redacted, but one symbol is circled repeatedly in red ink.",
        reward: { type: "symbol", symbolKey: "G" },
      },
      {
        id: "broken_centrifuge",
        label: "Cracked Centrifuge",
        description: "Something melted through the centrifuge wall. Inside, a circuit board fused with crystal. It still works, somehow.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
      {
        id: "lab_basement_stairs",
        label: "Unauthorized Basement Access",
        description: "The Spark Golem's secret revealed it. A hidden staircase leads to a sub-basement vault. The golem was built to guard this. Inside: schematics for creatures. Someone was designing them.",
        reward: { type: "lore", text: "[lab] The vault contains blueprints for creatures that match ones you've encountered. They weren't discovered. They were manufactured. The question is: by whom, and why were they released?" },
        hidden: true,
        unlockedBySecret: "spark_golem",
      },
    ],
  },
  {
    id: "lab_basement",
    locationId: "lab",
    type: "discovery",
    title: "Sub-Level Storage",
    description: "Below the main lab, shelves of sealed containers line the walls. Half are empty. The other half are fogged over from inside, as if something is breathing in them.",
    atmosphere: "The fluorescent lights buzz at a frequency that makes your fillings ache.",
    hotspots: [
      {
        id: "fogged_container",
        label: "Fogged Container",
        description: "You wipe the glass. Inside: a gear mechanism suspended in fluid that defies gravity. You drain the container and take the gear.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "experiment_log",
        label: "Experiment Log #47",
        description: "A leather-bound notebook. The last entry reads: 'It learned to open the container from inside. We didn't teach it that.'",
        reward: { type: "lore", text: "[lab] Scrawled in the margin: 'The slime is not one organism. It's thousands pretending to agree.'" },
      },
      {
        id: "chemical_symbol",
        label: "Etched Formula",
        description: "A chemical formula etched into the shelf with acid. One symbol is unfamiliar but feels important.",
        reward: { type: "symbol", symbolKey: "L" },
      },
    ],
  },
  {
    id: "lab_chemical_puzzle",
    locationId: "lab",
    type: "puzzle",
    title: "The Formula Station",
    description: "Five chemical bottles sit on a mixing station. A screen above displays a target formula as a sequence of colors. You need to add them in the right order.",
    atmosphere: "Each bottle hums at a different pitch. Together they almost form a chord.",
    puzzle: {
      puzzleType: "chemical_mix",
      difficulty: 1,
      data: {
        chemicals: LAB_CHEMICAL_BOTTLES.slice(0, 4),
        targetSequence: ["acid", "catalyst", "base", "acid"],
      } as ChemicalMixData,
    },
    rewardArtifact: "chemical_vial",
  },
  {
    id: "lab_chemical_hard",
    locationId: "lab",
    type: "puzzle",
    title: "Experiment 47",
    description: "The advanced mixing station. Five chemicals, longer sequences. The screen flickers with a formula that Dr. Emerson never finished.",
    atmosphere: "The temperature drops. Something in the room is absorbing heat.",
    puzzle: {
      puzzleType: "chemical_mix",
      difficulty: 2,
      data: {
        chemicals: LAB_CHEMICAL_BOTTLES,
        targetSequence: ["reagent", "base", "catalyst", "solvent", "acid"],
      } as ChemicalMixData,
    },
    rewardArtifact: "static_chip",
  },
  {
    id: "lab_choice",
    locationId: "lab",
    type: "choice",
    title: "The Sealed Wing",
    description: "A corridor splits. Left: the biological samples room, its door ajar with green light spilling out. Right: the electronics workshop, sparking behind a cracked window.",
    atmosphere: "Both rooms are calling. Neither should be.",
    choices: [
      {
        id: "bio_samples",
        label: "Enter the biological samples room",
        description: "The green light pulses like something alive. You can smell copper and ozone.",
        outcome: "Shelves of specimens. Most are empty. One jar contains a vial of self-stirring chemical that glows when you touch the glass.",
        reward: { type: "artifact", artifactId: "chemical_vial" },
      },
      {
        id: "electronics_workshop",
        label: "Enter the electronics workshop",
        description: "Sparks fly in rhythmic bursts. Something is building itself in there.",
        outcome: "Workbenches covered in half-assembled devices. You find a static chip still warm from whatever was soldering it. No soldering iron in sight.",
        reward: { type: "artifact", artifactId: "static_chip" },
      },
    ],
  },
  {
    id: "lab_quarantine",
    locationId: "lab",
    type: "discovery",
    title: "Quarantine Zone",
    description: "Yellow tape covers a heavy steel door that's been breached from the inside. The metal edges are melted and curled outward.",
    atmosphere: "The air here smells sterile, yet there's a distinct hum of energy remaining.",
    hotspots: [
      {
        id: "broken_vial",
        label: "Shattered Vials",
        description: "Several glass containers are broken on the floor. One is still intact, filled with a sluggish green liquid.",
        reward: { type: "artifact", artifactId: "chemical_vial" },
      },
      {
        id: "melted_terminal",
        label: "Melted Terminal",
        description: "The computer terminal is slag, but its cooling fan survived. You pry it loose—a perfectly functioning gear assembly.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "lab_flask_room",
        label: "The Flask Room",
        description: "The Flask Phantom's secret led you here. A room with no door—Dr. Emerson entered at 3pm and the log says the flask room has no door. You find a breach in the wall. Inside, the phantom's face shifts through a hundred expressions. A note: 'The phantom was once the head scientist who never left.'",
        reward: { type: "lore", text: "[lab] The phantom was once the head scientist who never left. The flask room has no door because it was never meant to be opened from the outside. What's inside is still running the experiments." },
        hidden: true,
        unlockedBySecret: "flask_phantom",
      },
    ],
  },
  {
    id: "lab_test_chamber_choice",
    locationId: "lab",
    type: "choice",
    title: "Calibration Chamber",
    description: "You step into an octagonal room lined with sensors. A central pedestal holds two items: a data chip covered in ice, and a circuit board humming with heat.",
    atmosphere: "The automated voice repeats: 'Calibration cycle incomplete.'",
    choices: [
      {
        id: "frozen_chip",
        label: "Take the frozen chip",
        description: "It burns to the touch from the extreme cold.",
        outcome: "You wrap your sleeve around your hand and grab it. It immediately begins thawing, revealing intact memory circuits.",
        reward: { type: "artifact", artifactId: "static_chip" },
      },
      {
        id: "hot_board",
        label: "Take the humming board",
        description: "It smells strongly of ozone and soldering iron smoke.",
        outcome: "You carefully lift it by the edges. Small sparks jump between the transistors as it goes into your pack.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
    ],
  },
  {
    id: "lab_wire_puzzle",
    locationId: "lab",
    type: "puzzle",
    title: "Broken Circuit",
    description: "A terminal is sparking. You need to connect the power nodes to bypass the lockdown.",
    atmosphere: "Ozone stings your nose. The timer is ticking.",
    puzzle: {
      puzzleType: "wire_connection",
      difficulty: 1,
      data: {
        gridSize: 4,
        startTile: { r: 0, c: 0 },
        endTile: { r: 3, c: 3 },
        timeLimit: 15000,
      } as WireConnectionData,
    },
    rewardArtifact: "circuit_board",
  },
];

const ARCADE_PIXEL_PATTERN: number[][] = [
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 1, 0, 0],
  [0, 0, 1, 1],
];

const ARCADE_PIXEL_OPTIONS: number[][][] = [
  [[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0], [0, 0, 1, 1]],
  [[1, 0, 1, 0], [0, 1, 0, 1], [0, 1, 1, 0], [0, 0, 1, 1]],
  [[0, 1, 0, 1], [1, 0, 1, 0], [1, 1, 0, 0], [0, 0, 1, 1]],
  [[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0], [1, 0, 0, 1]],
];

const ARCADE_PIXEL_PATTERN_HARD: number[][] = [
  [1, 1, 0, 1, 0],
  [0, 1, 1, 0, 1],
  [1, 0, 0, 1, 1],
  [0, 1, 1, 0, 0],
  [1, 0, 1, 1, 0],
];

const ARCADE_PIXEL_OPTIONS_HARD: number[][][] = [
  [[1, 1, 0, 1, 0], [0, 1, 1, 0, 1], [1, 0, 0, 1, 1], [0, 1, 1, 0, 0], [1, 0, 1, 1, 0]],
  [[1, 1, 0, 1, 0], [0, 1, 1, 0, 1], [1, 0, 1, 1, 1], [0, 1, 1, 0, 0], [1, 0, 1, 1, 0]],
  [[1, 1, 0, 1, 0], [1, 1, 1, 0, 1], [1, 0, 0, 1, 1], [0, 1, 1, 0, 0], [1, 0, 1, 1, 0]],
  [[1, 1, 0, 1, 0], [0, 1, 1, 0, 1], [1, 0, 0, 1, 1], [0, 1, 0, 0, 0], [1, 0, 1, 1, 0]],
];

export const ARCADE_SCENES: ExplorationScene[] = [
  {
    id: "arcade_cabinet_row",
    locationId: "arcade",
    type: "discovery",
    title: "Cabinet Row",
    description: "Rows of arcade cabinets stretch into darkness. Most screens show static, but a few play games that don't exist. The carpet pattern hurts your eyes.",
    atmosphere: "Neon flickers in the dark. A cabinet plays a game nobody programmed.",
    hotspots: [
      {
        id: "unplugged_cabinet",
        label: "Unplugged Cabinet #7",
        description: "The power cord lies on the floor, unplugged. The screen shows a knight marching across a pixel landscape. A shard of its world fell out of the screen.",
        reward: { type: "artifact", artifactId: "pixel_shard" },
      },
      {
        id: "high_score_board",
        label: "High Score Board",
        description: "The top scores are dated years in the future. The initials spell something backwards. You copy a symbol from the display.",
        reward: { type: "symbol", symbolKey: "P" },
      },
      {
        id: "coin_return",
        label: "Overflowing Coin Return",
        description: "Quarters spill onto the floor, but they're not currency you recognize. Under them, a circuit board with traces that glow faintly pink.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
      {
        id: "arcade_high_score_map",
        label: "The Hidden Map in the Scores",
        description: "The Pixel Knight's secret was true. Reading the high score initials backwards reveals coordinates. Following them on the carpet pattern leads to a loose tile hiding a developer's journal.",
        reward: { type: "lore", text: "[arcade] The developer's journal: 'The game was designed to train something. Not the players — something watching the players. Every high score teaches it how humans make decisions.'" },
        hidden: true,
        unlockedBySecret: "pixel_knight",
      },
    ],
  },
  {
    id: "arcade_back_room",
    locationId: "arcade",
    type: "discovery",
    title: "The Back Room",
    description: "Behind a curtain marked 'EMPLOYEES ONLY,' a room full of spare parts and broken cabinets. Someone has been repairing them. Recently.",
    atmosphere: "A half-eaten sandwich sits on a workbench. The bread is still soft. But the dust says no one's been here in years.",
    hotspots: [
      {
        id: "repair_bench",
        label: "Repair Workbench",
        description: "Tools laid out with surgical precision. Among them, a strange chip that pulses with white noise when you hold it near your ear.",
        reward: { type: "artifact", artifactId: "static_chip" },
      },
      {
        id: "developer_note",
        label: "Developer's Notebook",
        description: "Notes for a game that was never released. The final page says: 'Player 2 has been found. Game resumes.'",
        reward: { type: "lore", text: "[arcade] Margin scrawl: 'The serpent was always in the code. We just compiled it into something that could move.'" },
      },
      {
        id: "arcade_neon_trail",
        label: "Follow the Neon Trail",
        description: "The Neon Serpent's secret was right. You trace the flickering afterimages through the back room. They lead to a cabinet marked PLAYER TWO. The wiring inside is still warm.",
        reward: { type: "lore", text: "[arcade] Follow the neon trail and it leads to Player Two. The serpent doesn't live in the cabinets—it lives in the current between them. The old owner was right: it just finally learned how to be seen." },
        hidden: true,
        unlockedBySecret: "neon_serpent",
      },
      {
        id: "neon_symbol",
        label: "Neon Sign Fragment",
        description: "A broken neon tube bent into a symbol you've never seen. It still glows without power.",
        reward: { type: "symbol", symbolKey: "X" },
      },
    ],
  },
  {
    id: "arcade_pixel_puzzle",
    locationId: "arcade",
    type: "puzzle",
    title: "Screen Burn Memory",
    description: "A cabinet flashes a pixel pattern on its screen, then goes dark. Four other screens light up with similar patterns. Which one matches?",
    atmosphere: "The screen burns the image into your retinas. Or maybe into your memory. Same thing here.",
    puzzle: {
      puzzleType: "pixel_match",
      difficulty: 1,
      data: {
        pattern: ARCADE_PIXEL_PATTERN,
        options: ARCADE_PIXEL_OPTIONS,
        correctIndex: 0,
        displayTime: 3000,
      } as PixelMatchData,
    },
    rewardArtifact: "pixel_shard",
  },
  {
    id: "arcade_pixel_hard",
    locationId: "arcade",
    type: "puzzle",
    title: "Boss Level Pattern",
    description: "A larger, more complex pattern appears on a widescreen cabinet. The image flashes faster this time. The cabinets around it hum in anticipation.",
    atmosphere: "The pixels rearrange themselves when you blink. Trust your first memory.",
    puzzle: {
      puzzleType: "pixel_match",
      difficulty: 2,
      data: {
        pattern: ARCADE_PIXEL_PATTERN_HARD,
        options: ARCADE_PIXEL_OPTIONS_HARD,
        correctIndex: 0,
        displayTime: 2500,
      } as PixelMatchData,
    },
    rewardArtifact: "circuit_board",
  },
  {
    id: "arcade_choice",
    locationId: "arcade",
    type: "choice",
    title: "Two Players",
    description: "Two cabinets face each other. One says 'INSERT COIN' in neon green. The other says 'INSERT MEMORY' in flickering pink. Both accept quarters.",
    atmosphere: "The two screens reflect each other infinitely. In the reflection, you see someone else standing where you are.",
    choices: [
      {
        id: "coin_cabinet",
        label: "Insert coin in the green cabinet",
        description: "The slot is warm. The screen brightens as if it's been waiting for you specifically.",
        outcome: "The game starts. You play three rounds of a game you've never seen but somehow know the controls for. When you win, a pixel shard materializes from the screen.",
        reward: { type: "artifact", artifactId: "pixel_shard" },
      },
      {
        id: "memory_cabinet",
        label: "Insert coin in the pink cabinet",
        description: "The moment your quarter drops, the screen shows a place you've been but don't remember visiting.",
        outcome: "The game shows fragments of your exploration. When it ends, text appears: 'PLAYER 2 REMEMBERS.' A note prints from a slot you didn't notice.",
        reward: { type: "lore", text: "[arcade] The printout reads: 'Cabinet Ghost has been waiting since version 0.1. It cannot leave until someone finishes the game.'" },
      },
    ],
  },
  {
    id: "arcade_forgotten_token",
    locationId: "arcade",
    type: "discovery",
    title: "The Token Machine",
    description: "An ancient token dispenser sits between two racing games. The coin slot is jammed with something metallic.",
    atmosphere: "The machine buzzes angrily every few seconds, impatient to dispense.",
    hotspots: [
      {
        id: "jammed_slot",
        label: "Pry the slot open",
        description: "You force the mechanism. Instead of a token, out drops a thick, rusted cog.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "machine_decal",
        label: "Faded Decal",
        description: "The side of the machine features a mascot pointing at a symbol. You note it down.",
        reward: { type: "symbol", symbolKey: "J" },
      },
    ],
  },
  {
    id: "arcade_prize_counter",
    locationId: "arcade",
    type: "choice",
    title: "Prize Counter",
    description: "The glass case is mostly empty. Two items remain on the bottom shelf: a glowing plastic ring and a heavy puzzle box.",
    atmosphere: "A single fluorescent bulb flickers overhead, illuminating the dust motes.",
    choices: [
      {
        id: "take_ring",
        label: "Take the glowing ring",
        description: "It emits a soft, pulsing light that feels entirely unnatural.",
        outcome: "As you slip it onto your finger, the glow transfers to a hidden circuit underneath. You salvage the tech.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
      {
        id: "take_box",
        label: "Take the puzzle box",
        description: "It is surprisingly heavy for its size.",
        outcome: "You force the mechanism open. Fine, dark powder cascades out over your hands.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
    ],
  },
  {
    id: "arcade_mastermind",
    locationId: "arcade",
    type: "puzzle",
    title: "The Codebreaker Cabinet",
    description: "An old game simply titled 'MASTERMIND'. The screen prompts you to input a color sequence.",
    atmosphere: "The 8-bit music is unnervingly cheerful.",
    puzzle: {
      puzzleType: "mastermind",
      difficulty: 1,
      data: {
        codeLength: 4,
        colors: ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-cyan-500"],
        maxGuesses: 8,
      } as MastermindData,
    },
    rewardArtifact: "pixel_shard",
  },
];

export const DOCK_SCENES: ExplorationScene[] = [
  {
    id: "dock_pier",
    locationId: "dock",
    type: "discovery",
    title: "The Rotting Pier",
    description: "Wooden planks creak underfoot, half of them missing. The water below is unnaturally still. Barnacles cover everything, even things that shouldn't have barnacles.",
    atmosphere: "Salt air and rotting wood. The water is too still. Too clear. You can see the bottom, and something on the bottom can see you.",
    hotspots: [
      {
        id: "barnacle_anchor",
        label: "Barnacled Anchor",
        description: "A small anchor encrusted with barnacles that glow faintly blue at night. It's lighter than it should be, as if the water forgot its weight.",
        reward: { type: "artifact", artifactId: "rusty_anchor" },
      },
      {
        id: "dock_post_carving",
        label: "Carved Dock Post",
        description: "Sailors carved tally marks into this post. Below the tallies, a symbol you don't recognize. You copy it carefully.",
        reward: { type: "symbol", symbolKey: "W" },
      },
      {
        id: "dock_sunken_shells",
        label: "Scrap Metal at the Waterline",
        description: "The Rust Crab's secret made sense. At the waterline, shells of barnacle-covered metal pile up—pieces of sunken ships. The crabs build their shells from what the sea gives back.",
        reward: { type: "lore", text: "[dock] The crabs build their shells from sunken ships. The dock workers leave bolts and nails as offerings because they've seen the alternative. Every rust crab is wearing a piece of a vessel that didn't make it home." },
        hidden: true,
        unlockedBySecret: "rust_crab",
      },
      {
        id: "tide_pool",
        label: "Glowing Tide Pool",
        description: "A shallow pool trapped between rocks. Something crystalline grows at the bottom, pulsing with the rhythm of waves that aren't there.",
        reward: { type: "artifact", artifactId: "cave_crystal" },
      },
      {
        id: "dock_sinking_measurement",
        label: "The Impossible Measurement",
        description: "The Tide Lurker's secret led you here. Three inches per year, but the dock is older than the water. You find depth markings that go negative — the dock is rising, not sinking. Something below is pushing it up.",
        reward: { type: "lore", text: "[dock] The depth markings reveal the truth: something beneath the dock is growing. The dock isn't sinking — it's being lifted. The water level isn't rising. The ground beneath is." },
        hidden: true,
        unlockedBySecret: "tide_lurker",
      },
    ],
  },
  {
    id: "dock_boathouse",
    locationId: "dock",
    type: "discovery",
    title: "The Boathouse",
    description: "A listing structure at the end of the dock. Inside, a boat that could never float — it's made of stone. Charts on the wall show coastlines that don't exist.",
    atmosphere: "The wood groans with the tide. Inside, everything is damp. The charts update themselves when you look away.",
    hotspots: [
      {
        id: "stone_boat",
        label: "Stone Boat",
        description: "The boat is carved from a single piece of dark stone. Inside, a rusted anchor charm. It hums when you pick it up.",
        reward: { type: "artifact", artifactId: "rusty_anchor" },
      },
      {
        id: "chart_markings",
        label: "Shifting Charts",
        description: "The charts show a route marked in symbol alphabet. You catch one symbol before the ink moves again.",
        reward: { type: "symbol", symbolKey: "M" },
      },
      {
        id: "dock_master_log",
        label: "Dock Master's Log",
        description: "The final entry is dated tomorrow. It says: 'The tide brought it back. I told them it would. They still don't believe me.'",
        reward: { type: "lore", text: "[dock] A note pinned to the log: 'Depth Angler spotted again. DO NOT reach for the light. I mean it this time.'" },
      },
    ],
  },
  {
    id: "dock_tide_puzzle",
    locationId: "dock",
    type: "puzzle",
    title: "The Tide Gate",
    description: "An old sluice gate controls water flow to a locked chamber. A gauge shows the tide level rising and falling. You need to open the gate when the tide is just right.",
    atmosphere: "The water breathes in and out. The gate wants to open but only at the right moment.",
    puzzle: {
      puzzleType: "tide_timing",
      difficulty: 1,
      data: {
        targetLevel: 50,
        speed: 2,
        rounds: 3,
        tolerance: 15,
      } as TideTimingData,
    },
    rewardArtifact: "rusty_anchor",
  },
  {
    id: "dock_tide_hard",
    locationId: "dock",
    type: "puzzle",
    title: "The Deep Gate",
    description: "A second gate, deeper underwater. The tide moves faster here and the target zone is narrower. The water seems to resist your timing.",
    atmosphere: "Something watches from below the surface. It wants you to fail. Or maybe it wants you to succeed. You can't tell.",
    puzzle: {
      puzzleType: "tide_timing",
      difficulty: 2,
      data: {
        targetLevel: 65,
        speed: 3,
        rounds: 4,
        tolerance: 10,
      } as TideTimingData,
    },
    rewardArtifact: "cave_crystal",
  },
  {
    id: "dock_footprint_riddle",
    locationId: "dock",
    type: "puzzle",
    title: "Tracks in the Wet Boards",
    description: "After a storm, you spot a line of prints crossing the slick pier: deep round dents paired with long scratch marks that drag toward the water.",
    atmosphere: "The boards still drip. Whatever left these marks moved slowly, but it did not hesitate.",
    puzzle: {
      puzzleType: "riddle",
      difficulty: 1,
      data: {
        question: "You examine the trail. Heavy circular prints, like metal feet, and thin claw-scratches where something dragged spare pieces behind it. Which creature most likely left these tracks?",
        options: [
          "Tide Lurker — the unseen tentacled thing that waits beneath the waves.",
          "Rust Crab — a crab whose metal shell and scrap claws clatter along the dock.",
          "Depth Angler — a deep-sea hunter that should never come this close to shore.",
        ],
        correctIndex: 1,
        flavor: "A faint clinking sound echoes under the pier, as if something metal is still moving in the dark water.",
      } as RiddleData,
    },
    rewardArtifact: "rusty_anchor",
  },
  {
    id: "dock_choice",
    locationId: "dock",
    type: "choice",
    title: "The Submerged Path",
    description: "At low tide, two paths reveal themselves. One leads to a sunken rowboat with something glinting inside. The other leads to a rock formation covered in bioluminescent barnacles.",
    atmosphere: "The tide will return in minutes. Choose quickly.",
    choices: [
      {
        id: "sunken_boat",
        label: "Wade to the sunken rowboat",
        description: "The water is knee-deep and freezing. The glint comes from something metallic wedged under a seat.",
        outcome: "You pull free a small anchor made of a metal you can't identify. It doesn't rust despite being underwater for what looks like decades.",
        reward: { type: "artifact", artifactId: "rusty_anchor" },
      },
      {
        id: "barnacle_rocks",
        label: "Climb to the barnacle rocks",
        description: "The barnacles pulse in sequence, like a code. The rocks are slippery but warm.",
        outcome: "Among the barnacles, you find a mushroom growing where no mushroom should. It glows the same color as the barnacles. The dock and the forest are connected somehow.",
        reward: { type: "artifact", artifactId: "glowing_mushroom" },
      },
    ],
  },
  {
    id: "dock_crane",
    locationId: "dock",
    type: "discovery",
    title: "Derelict Crane",
    description: "A colossal rusted crane leans over the water. Its hook is submerged, the cable thrumming with tension.",
    atmosphere: "The metal groans in the wind. Whatever the crane is holding, it's very heavy.",
    hotspots: [
      {
        id: "crane_controls",
        label: "Winch Controls",
        description: "You manually crank the rusted wheel. The hook breaches the surface, dragging up a chunk of strange glowing coral.",
        reward: { type: "artifact", artifactId: "glowing_mushroom" },
      },
      {
        id: "crane_base",
        label: "Rusted Base",
        description: "Scraped into the oxidized metal is a perfect, unweathered symbol.",
        reward: { type: "symbol", symbolKey: "C" },
      },
    ],
  },
  {
    id: "dock_lighthouse_choice",
    locationId: "dock",
    type: "choice",
    title: "Abandoned Lighthouse",
    description: "The lighthouse at the end of the pier has been dark for years. The reinforced door is locked, but a window is smashed. A maintenance hatch sits near the foundation.",
    atmosphere: "You can hear the surf crashing violently on the other side of the structure.",
    choices: [
      {
        id: "enter_window",
        label: "Climb through the window",
        description: "The glass is sharp and the drop inside is dark.",
        outcome: "You land on a pile of old navigational equipment. Amidst the junk is a heavy iron anchor charm.",
        reward: { type: "artifact", artifactId: "rusty_anchor" },
      },
      {
        id: "open_hatch",
        label: "Pry open the hatch",
        description: "Saltwater pours out from the foundation.",
        outcome: "Crawling inside the wet concrete base, you find a waterproof casing containing intricate circuitry.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
    ],
  },
];

export const TOWER_SCENES: ExplorationScene[] = [
  {
    id: "tower_base",
    locationId: "tower",
    type: "discovery",
    title: "Tower Base",
    description: "The radio tower's base is a concrete bunker with a heavy door hanging open. Equipment inside hasn't been touched in years, but the power lights are green.",
    atmosphere: "Static crackles from nowhere. The antenna above hums with purpose. Your phone shows full signal, then no signal, then symbols.",
    hotspots: [
      {
        id: "control_panel",
        label: "Active Control Panel",
        description: "Dials and switches, all set to positions that don't match any standard configuration. A signal fragment has solidified on one of the dials.",
        reward: { type: "artifact", artifactId: "signal_fragment" },
      },
      {
        id: "frequency_log",
        label: "Broadcast Log",
        description: "A log of frequencies broadcast. Most are normal radio bands. One entry just says 'FREQUENCY ZERO' in red ink, circled multiple times.",
        reward: { type: "lore", text: "[tower] Written below: 'Frequency Zero is not silence. It is where the signal goes when it has nowhere else to be.'" },
      },
      {
        id: "panel_symbol",
        label: "Etched Panel Symbol",
        description: "Someone scratched a symbol into the control panel with a key or knife. It matches nothing in any manual here.",
        reward: { type: "symbol", symbolKey: "F" },
      },
      {
        id: "tower_frequency_zero",
        label: "Frequency Zero Receiver",
        description: "The Signal Wraith's secret told you to tune to Frequency Zero. You find a hidden dial behind the panel, turn it past the minimum. Static becomes a voice. The voice says your name. Then it says: 'You're the second investigator. The first one is still listening.'",
        reward: { type: "lore", text: "[tower] Frequency Zero is real. It's not a frequency — it's a channel. Something has been broadcasting on it since before the tower existed. The voice knows every investigator by name." },
        hidden: true,
        unlockedBySecret: "signal_wraith",
      },
    ],
  },
  {
    id: "tower_upper",
    locationId: "tower",
    type: "discovery",
    title: "Observation Platform",
    description: "A metal staircase spirals up to an open platform where the antenna array looms overhead. The view stretches for miles, but what you see doesn't match any map.",
    atmosphere: "The wind carries voices. Not words — just the rhythm of conversation, stripped of meaning.",
    hotspots: [
      {
        id: "antenna_shard",
        label: "Broken Antenna Fragment",
        description: "A piece of antenna that vibrates in your hand like a tuning fork. It resonates with something you can feel but not hear.",
        reward: { type: "artifact", artifactId: "signal_fragment" },
      },
      {
        id: "owl_perch",
        label: "Feathered Perch",
        description: "The highest antenna crossbar is covered in strange feathers that shift between colors. Static electricity arcs between them.",
        reward: { type: "artifact", artifactId: "strange_feather" },
      },
      {
        id: "tower_bat_roost",
        label: "Inside the Main Dish",
        description: "The Frequency Bat's secret led you here. You climb into the rusted dish. The bats roost in impossible numbers. Their sonar isn't sound—it's something else. A technician's note: 'The bats hear a frequency humans cannot but should.'",
        reward: { type: "lore", text: "[tower] The bats hear a frequency humans cannot but should. When the swarm takes flight at twilight, they don't just disrupt signals—they broadcast something. The three blocks of silence aren't a malfunction. They're the only time the town is listening to the right channel." },
        hidden: true,
        unlockedBySecret: "frequency_bat",
      },
      {
        id: "tower_owl_antenna",
        label: "The Highest Antenna",
        description: "The Static Owl's secret was true. At the very top, an owl perches motionless. Its feathers are shifting static; its eyes show test patterns. Every camera aimed here goes to snow. A note: 'The owl sees in all spectrums including ones we forgot.'",
        reward: { type: "lore", text: "[tower] The owl sees in all spectrums including ones we forgot. It doesn't hunt at night—it watches. The test patterns in its eyes aren't random. They're a language. We stopped broadcasting in that language in 1987." },
        hidden: true,
        unlockedBySecret: "static_owl",
      },
      {
        id: "tower_graffiti",
        label: "Technician's Graffiti",
        description: "Spray-painted on the railing: 'WE ARE NOT ALONE ON THIS FREQUENCY.' Below it, a symbol in careful marker.",
        reward: { type: "symbol", symbolKey: "Q" },
      },
      {
        id: "power_lines_from_above",
        label: "Look down at the power lines",
        description: "You trace the cables from the tower to the town. Where they cross and branch, they form a single shape—a symbol. You sketch it before the light shifts. The Circuit Sprites weren't mapping randomly. They were following the lines. The symbol is now in your journal.",
        reward: { type: "lore", text: "[tower] From the observation platform you saw what the Circuit Sprites see: the power lines form a symbol when seen from above. It's the same shape they trace in their frenetic flights. Someone designed the grid. The town was wired to mean something." },
        hidden: true,
        unlockedBySecret: "circuit_sprite",
      },
    ],
  },
  {
    id: "tower_frequency_puzzle",
    locationId: "tower",
    type: "puzzle",
    title: "Signal Lock",
    description: "The main transmitter has a frequency dial and a target signal displayed on an oscilloscope. Tune the dial to match the signal and lock it in.",
    atmosphere: "The static resolves into almost-words as you get closer to the right frequency.",
    puzzle: {
      puzzleType: "frequency_tune",
      difficulty: 1,
      data: {
        targetFrequency: 147,
        startFrequency: 100,
        tolerance: 5,
        minFreq: 50,
        maxFreq: 200,
        targetGain: 55,
        startGain: 30,
        gainTolerance: 8,
        minGain: 10,
        maxGain: 90,
        channelZeroUnlockedBySecret: "signal_wraith",
        channelZeroLore: "You tune to Frequency Zero. Static breaks into a voice: 'The first investigator is still listening. You are the second.' The signal fades. You've received an answer.",
      } as FrequencyTuneData,
    },
    rewardArtifact: "signal_fragment",
  },
  {
    id: "tower_frequency_hard",
    locationId: "tower",
    type: "puzzle",
    title: "Frequency Zero",
    description: "A hidden dial behind the panel. The target frequency keeps shifting. Lock it when the signal stabilizes. The tolerance is razor thin.",
    atmosphere: "The voices in the static sound familiar now. One of them sounds like you.",
    puzzle: {
      puzzleType: "frequency_tune",
      difficulty: 2,
      data: {
        targetFrequency: 173,
        startFrequency: 120,
        tolerance: 3,
        minFreq: 80,
        maxFreq: 250,
        targetGain: 65,
        startGain: 40,
        gainTolerance: 5,
        minGain: 15,
        maxGain: 95,
        channelZeroUnlockedBySecret: "signal_wraith",
        channelZeroLore: "You tune to Frequency Zero. Static breaks into a voice: 'The first investigator is still listening. You are the second.' The signal fades. You've received an answer.",
      } as FrequencyTuneData,
    },
    rewardArtifact: "static_chip",
  },
  {
    id: "tower_choice",
    locationId: "tower",
    type: "choice",
    title: "The Broadcast",
    description: "The transmitter is live. Two frequencies are available. One broadcasts outward, into the sky. The other broadcasts inward, into the ground beneath the tower.",
    atmosphere: "The antenna vibrates with anticipation. It wants to transmit. It doesn't care which direction.",
    choices: [
      {
        id: "broadcast_sky",
        label: "Broadcast skyward",
        description: "The signal reaches into the atmosphere. Something might hear it. Something might already be listening.",
        outcome: "Static fills the speakers, then clears. A response comes back: three pulses of pure tone. In the silence after, a signal fragment drops from the antenna, solidified by the response.",
        reward: { type: "artifact", artifactId: "signal_fragment" },
      },
      {
        id: "broadcast_ground",
        label: "Broadcast into the ground",
        description: "The signal drives into the earth. You feel the vibration in your teeth, in your bones.",
        outcome: "The ground hums for ten seconds, then silence. A message scratches itself onto the broadcast log in handwriting that isn't yours: 'We heard you. We've always heard you.'",
        reward: { type: "lore", text: "[tower] The log adds: 'Transmission received at depth unknown. Response time: negative four seconds. They answered before we asked.'" },
      },
    ],
  },
  {
    id: "tower_maintenance",
    locationId: "tower",
    type: "discovery",
    title: "Maintenance Shaft",
    description: "A heavy metal door labeled 'AUTHORIZED PERSONNEL ONLY' has been torn off its hinges. Inside, thick cables run downward into absolute darkness.",
    atmosphere: "The cables thrum with immense electrical current. Ozone burns your nose.",
    hotspots: [
      {
        id: "cable_splice",
        label: "Spliced Cables",
        description: "Someone tapped into the main power line using a jury-rigged circuit board. It's glowing hot, but you manage to detach it safely.",
        reward: { type: "artifact", artifactId: "circuit_board" },
      },
      {
        id: "wall_schematic",
        label: "Faded Schematic",
        description: "A diagram on the wall shows the tower's wiring, but it includes an underground sublevel that doesn't exist on official blueprints. You note the symbol denoting the sublevel.",
        reward: { type: "symbol", symbolKey: "Y" },
      },
    ],
  },
  {
    id: "tower_generator_choice",
    locationId: "tower",
    type: "choice",
    title: "Auxiliary Generator",
    description: "You find the backup generator room. The machine is idling, but two massive switches dominate the control panel: 'DUMP LOAD' and 'OVERCHARGE.'",
    atmosphere: "The floor vibrates. The generator sounds like a trapped beast.",
    choices: [
      {
        id: "dump_load",
        label: "Pull 'DUMP LOAD'",
        description: "The vibration stops instantly. The silence is deafening.",
        outcome: "A compartment pops open on the generator's side, revealing a perfectly preserved gear mechanism.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "overcharge",
        label: "Pull 'OVERCHARGE'",
        description: "The machine screams. Sparks shower the room.",
        outcome: "The intense energy solidifies a fragment of the ambient signal right out of the air. You catch it before it hits the floor.",
        reward: { type: "artifact", artifactId: "signal_fragment" },
      },
    ],
  },
];

const HOUSE_SORT_ITEMS = [
  { id: "music_box", name: "Self-Playing Music Box", description: "Plays a lullaby from a country that doesn't exist.", category: "Mechanical" },
  { id: "glass_eye", name: "Glass Eye", description: "It tracks movement. There is no mechanism to explain this.", category: "Organic" },
  { id: "compass", name: "Broken Compass", description: "Points toward something, but not north. Never north.", category: "Mechanical" },
  { id: "pressed_flower", name: "Pressed Flower", description: "From a species that went extinct before humans existed.", category: "Organic" },
  { id: "tin_soldier", name: "Tin Soldier", description: "Stands at attention. Falls over when no one is watching. Stands again.", category: "Mechanical" },
];

const HOUSE_SORT_ITEMS_HARD = [
  { id: "wax_seal", name: "Self-Sealing Letter", description: "The wax reforms every time you break it.", category: "Written" },
  { id: "bone_key", name: "Bone Key", description: "Carved from something's rib. It's warm.", category: "Organic" },
  { id: "clock_hand", name: "Clock Hand", description: "Moves on its own. Counts something that isn't seconds.", category: "Mechanical" },
  { id: "moth_wing", name: "Moth Wing", description: "From a moth the size of a dinner plate. Still shimmers.", category: "Organic" },
  { id: "telegram", name: "Unsent Telegram", description: "Addressed to 'The Next Collector.' It's addressed to you.", category: "Written" },
  { id: "gear_brooch", name: "Gear Brooch", description: "Tiny gears still turn. They mesh with nothing visible.", category: "Mechanical" },
];

export const HOUSE_SCENES: ExplorationScene[] = [
  {
    id: "house_foyer",
    locationId: "house",
    type: "discovery",
    title: "The Foyer",
    description: "The front door was unlocked. It always is. The foyer is lined with glass cases, each containing a single object with a handwritten label. The labels change when you read them twice.",
    atmosphere: "Dust moves with intent. Every object has a story it wants to tell. You just have to listen in the right way.",
    hotspots: [
      {
        id: "display_case",
        label: "Cracked Display Case",
        description: "One case has a crack in the glass. Inside, an ornate key that fits no lock you've ever seen. The label says 'YOURS.'",
        reward: { type: "artifact", artifactId: "collector_key" },
      },
      {
        id: "coat_rack",
        label: "Coat Rack",
        description: "A coat rack with a single coat that smells like someone was just wearing it. In the pocket, a note and a symbol drawn in pencil.",
        reward: { type: "symbol", symbolKey: "C" },
      },
      {
        id: "guest_book",
        label: "Guest Book",
        description: "A guest book with entries spanning centuries. Every entry says the same thing in different handwriting: 'I was invited. I think.'",
        reward: { type: "lore", text: "[house] The most recent entry is in your handwriting. You don't remember writing it. It says: 'Third visit. Still haven't found the room that moves.'" },
      },
      {
        id: "house_item_one",
        label: "Item #1",
        description: "The Porcelain Watcher's secret led you here. The oldest item in the collection. It predates everything. When you touch it, you understand: the collector didn't build the collection. The collection built the collector. This doll chose someone to gather the rest.",
        reward: { type: "lore", text: "[house] Item #1 is aware. The Porcelain Watcher isn't a creature that lives in the house — it IS the house. Everything here was gathered because it wanted it. Including you." },
        hidden: true,
        unlockedBySecret: "porcelain_watcher",
      },
    ],
  },
  {
    id: "house_collection_room",
    locationId: "house",
    type: "discovery",
    title: "The Collection Room",
    description: "Floor to ceiling shelves packed with objects that shouldn't exist together. A mammoth tusk next to a USB drive. A Roman coin touching a circuit board. Everything is cataloged meticulously.",
    atmosphere: "The shelves rearrange when you turn corners. The room is bigger on the inside. You're sure of it.",
    hotspots: [
      {
        id: "catalog_drawer",
        label: "Card Catalog Drawer",
        description: "A drawer labeled with your first initial. Inside, a key identical to the one in the display case, but older. Much older.",
        reward: { type: "artifact", artifactId: "collector_key" },
      },
      {
        id: "shelf_gap",
        label: "Gap in the Shelf",
        description: "One shelf has a gap where something was removed. Shadow dust has settled in the empty space, forming a silhouette of what was there.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
      {
        id: "catalog_symbol",
        label: "Catalog Symbol",
        description: "The catalog uses a symbol system for categorizing. You learn one of the symbols by studying the index.",
        reward: { type: "symbol", symbolKey: "H" },
      },
      {
        id: "house_shelf_that_watches",
        label: "The Shelf That Predates the House",
        description: "The Shelf Mimic's secret led you here. Blueprints show this shelf was here before the house was built around it. Its surfaces shift when you pass. Not everything in the collection was collected willingly.",
        reward: { type: "lore", text: "[house] Not everything in the collection was collected willingly. The shelf has too many surfaces and they're all watching. The late collector's inventory just says 'acquired.' It was here first. The house was built to contain it." },
        hidden: true,
        unlockedBySecret: "shelf_mimic",
      },
    ],
  },
  {
    id: "house_sort_puzzle",
    locationId: "house",
    type: "puzzle",
    title: "The Sorting Table",
    description: "A table with category bins and a pile of uncatalogued objects. The collector's system is precise. Sort them correctly and the locked drawer opens.",
    atmosphere: "The objects vibrate when placed in the wrong bin. They know where they belong, even if you don't.",
    puzzle: {
      puzzleType: "artifact_sort",
      difficulty: 1,
      data: {
        items: HOUSE_SORT_ITEMS,
        categories: ["Mechanical", "Organic"],
      } as ArtifactSortData,
    },
    rewardArtifact: "collector_key",
  },
  {
    id: "house_potion_mixer",
    locationId: "house",
    type: "puzzle",
    title: "The Potion Workbench",
    description: "In a side room, a low table is crowded with vials, herbs, and tiny labels written in three different handwritings.",
    atmosphere: "Glass clinks softly as if someone just set a bottle down. The ingredients feel like they're watching to see what you brew.",
    puzzle: {
      puzzleType: "chemical_mix",
      difficulty: 1,
      data: {
        chemicals: HOUSE_POTION_INGREDIENTS,
        targetSequence: ["moonwater", "root_essence", "starlight_dust"],
      } as ChemicalMixData,
    },
    rewardArtifact: "collector_key",
  },
  {
    id: "house_sort_hard",
    locationId: "house",
    type: "puzzle",
    title: "The Master Catalog",
    description: "The collector's master sorting station. More categories, more objects, and some that could belong in multiple places. Only one arrangement is correct.",
    atmosphere: "The room shifts impatiently. The collection wants to be organized. It's been waiting.",
    puzzle: {
      puzzleType: "artifact_sort",
      difficulty: 2,
      data: {
        items: HOUSE_SORT_ITEMS_HARD,
        categories: ["Mechanical", "Organic", "Written"],
      } as ArtifactSortData,
    },
    rewardArtifact: "shadow_dust",
  },
  {
    id: "house_choice",
    locationId: "house",
    type: "choice",
    title: "The Locked Rooms",
    description: "Two doors at the end of a hallway. One has a brass knob polished smooth by countless hands. The other has a knob covered in dust that no one has ever turned.",
    atmosphere: "Behind the polished door, the sound of a music box. Behind the dusty door, absolute silence. Not quiet — the absence of sound.",
    choices: [
      {
        id: "polished_door",
        label: "Open the polished door",
        description: "The knob turns easily. The music gets louder. It's a lullaby you almost recognize.",
        outcome: "A sitting room. A porcelain figure sits in a chair, watching the door. On the table beside it, a key — different from the others. This one feels alive.",
        reward: { type: "artifact", artifactId: "collector_key" },
      },
      {
        id: "dusty_door",
        label: "Open the dusty door",
        description: "The knob resists. When it turns, the dust doesn't fall — it retreats, like it's afraid of what's inside.",
        outcome: "An empty room. Perfectly empty. Except for a single word written on the far wall in shadow dust: 'FOUND.' The dust on the wall is still settling.",
        reward: { type: "lore", text: "[house] As you leave, you hear a whisper: 'The Porcelain Watcher was Item #1. Everything else was collected to keep it company. It was lonely.'" },
      },
    ],
  },
  {
    id: "house_attic",
    locationId: "house",
    type: "discovery",
    title: "The Dusty Attic",
    description: "You manage to pull down the attic stairs. It's crammed with forgotten items covered in dust sheets. The air is stagnant and smells of dry rot.",
    atmosphere: "Dust motes dance in the single beam of sunlight piercing the gloom. They seem to form shapes when you aren't looking directly at them.",
    hotspots: [
      {
        id: "sheet_covered_mirror",
        label: "Covered Mirror",
        description: "You pull the sheet off an ornate mirror. It doesn't reflect the attic. It reflects a pristine ballroom. A symbol is etched into the ornate brass frame.",
        reward: { type: "symbol", symbolKey: "Z" },
      },
      {
        id: "old_trunk",
        label: "Steamer Trunk",
        description: "A heavy leather trunk with rusted clasps. Inside, among moth-eaten clothes, is a strange, ticking gear assembly.",
        reward: { type: "artifact", artifactId: "old_gear" },
      },
      {
        id: "house_dust_whisper",
        label: "The Dust That Remembers",
        description: "The Dust Djinn's secret was true. In the attic, the dust doesn't just settle—it swirls into shapes. It smells like old libraries and regret. One whisper reaches you: the stolen memory of someone who once held an object from the collection. The dust remembers every hand that touched every object.",
        reward: { type: "lore", text: "[house] The dust remembers every hand that touched every object. The Dust Djinn doesn't speak—it replays. Each whisper is a stolen, personal memory. If you listen long enough, you hear the collector's voice. And the voices of everyone who ever entered this house." },
        hidden: true,
        unlockedBySecret: "dust_djinn",
      },
    ],
  },
  {
    id: "house_basement_choice",
    locationId: "house",
    type: "choice",
    title: "The Root Cellar",
    description: "The stairs descend into darkness. At the bottom, a heavy wooden door is barred from the *outside*. A tiny grate lets you see in.",
    atmosphere: "Cold air seeps from beneath the door. You hear a wet, rhythmic sloshing sound.",
    choices: [
      {
        id: "open_door",
        label: "Unbar the door",
        description: "You lift the heavy wooden bar. The sloshing stops.",
        outcome: "The room is empty, save for a puddle of dark, viscous fluid. As it dries, it leaves behind a mound of shadow dust.",
        reward: { type: "artifact", artifactId: "shadow_dust" },
      },
      {
        id: "ignore_door",
        label: "Leave it barred and turn back",
        description: "Some things are locked away for a reason.",
        outcome: "As you turn to leave, you notice a strange feather resting on the top step. It wasn't there when you came down.",
        reward: { type: "artifact", artifactId: "strange_feather" },
      },
    ],
  },
];

export const LOCATION_SCENES: Record<string, ExplorationScene[]> = {
  forest: FOREST_SCENES,
  library: LIBRARY_SCENES,
  school: SCHOOL_SCENES,
  cave: CAVE_SCENES,
  lab: LAB_SCENES,
  arcade: ARCADE_SCENES,
  dock: DOCK_SCENES,
  tower: TOWER_SCENES,
  house: HOUSE_SCENES,
};

export function randomizePuzzle(scene: ExplorationScene): ExplorationScene {
  if (scene.type !== "puzzle" || !scene.puzzle) return scene;

  // Deep clone to avoid mutating the base const arrays
  const newScene = JSON.parse(JSON.stringify(scene)) as ExplorationScene;
  const puzzle = newScene.puzzle!;
  const { puzzleType, difficulty, data } = puzzle;

  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  if (puzzleType === "pattern_memory") {
    const pd = data as PatternMemoryData;
    const seqLen = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
    const newSeq = [];
    for (let i = 0; i < seqLen; i++) {
      newSeq.push(randInt(0, pd.symbols.length - 1));
    }
    pd.sequence = newSeq;
    pd.displayTime = randInt(difficulty === 1 ? 2500 : 3000, difficulty === 1 ? 3800 : 4500);
  } else if (puzzleType === "chemical_mix") {
    const cd = data as ChemicalMixData;
    const seqLen = difficulty === 1 ? 4 : 5;
    const newSeq = [];
    for (let i = 0; i < seqLen; i++) {
      newSeq.push(randElement(cd.chemicals).id);
    }
    cd.targetSequence = newSeq;
  } else if (puzzleType === "symbol_cipher") {
    const sd = data as SymbolCipherData;
    const words1 = ["OWL", "FOX", "MOON", "DARK", "LEAF", "WOOD", "DUST", "TIME", "CAVE", "SIGN"];
    const words2 = ["GHOST", "SHADOW", "ECHOES", "SIGNAL", "MIRROR", "SECRET", "BEACON", "MEMORY", "STATIC", "PULSE"];
    const wordList = difficulty === 1 ? words1 : words2;
    sd.answer = randElement(wordList);
    const idx1 = randInt(0, sd.answer.length - 1);
    let idx2 = randInt(0, sd.answer.length - 1);
    while (idx1 === idx2 && sd.answer.length > 1) {
      idx2 = randInt(0, sd.answer.length - 1);
    }
    sd.hintLetters = [idx1, idx2].sort((a, b) => a - b);
  } else if (puzzleType === "riddle") {
    const pool = RIDDLE_POOL.filter((r) => r.difficulty === difficulty);
    if (pool.length > 0) {
      const pick = randElement(pool);
      (puzzle as { data: RiddleData }).data = JSON.parse(JSON.stringify(pick.data));
    }
  } else if (puzzleType === "morse_code") {
    const md = data as MorseCodeData;
    const words1 = ["ECHO", "CAVE", "DARK", "DEEP", "COLD", "ROCK", "MIST", "GATE"];
    const words2 = ["SIGNAL", "BEACON", "WAVES", "PULSE", "LIGHT", "ABYSS", "CRYSTAL", "WHISPER"];
    const wordList = difficulty === 1 ? words1 : words2;
    md.word = randElement(wordList);
  } else if (puzzleType === "frequency_tune") {
    const fd = data as FrequencyTuneData;
    fd.targetFrequency = randInt(fd.minFreq + 10, fd.maxFreq - 10);
    fd.startFrequency = randInt(fd.minFreq, Math.max(fd.minFreq, fd.targetFrequency - 20));
    fd.targetGain = randInt(fd.minGain + 10, fd.maxGain - 10);
    fd.startGain = randInt(fd.minGain, Math.max(fd.minGain, fd.targetGain - 25));
  } else if (puzzleType === "tide_timing") {
    const td = data as TideTimingData;
    td.targetLevel = randInt(25, 75);
    td.speed = randInt(2, 4);
    td.rounds = randInt(3, 5);
    td.tolerance = randInt(8, 18);
  } else if (puzzleType === "pixel_match") {
    const pd = data as PixelMatchData;
    const newCorrect = randInt(0, pd.options.length - 1);
    pd.correctIndex = newCorrect;
    pd.pattern = JSON.parse(JSON.stringify(pd.options[newCorrect]));
    pd.displayTime = randInt(2200, 3500);
  } else if (puzzleType === "artifact_sort") {
    const ad = data as ArtifactSortData;
    const shuffled = [...ad.items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    ad.items = shuffled;
  } else if (puzzleType === "wire_connection") {
    const wd = data as WireConnectionData;
    wd.timeLimit = difficulty === 1 ? 15000 : 12000;
  } else if (puzzleType === "mastermind") {
    const md = data as MastermindData;
    md.codeLength = difficulty === 1 ? 4 : 5;
    md.maxGuesses = difficulty === 1 ? 8 : 6;
  }

  return newScene;
}

export function generateExplorationSequence(locationId: string): ExplorationScene[] {
  const pool = LOCATION_SCENES[locationId];
  if (!pool) return [];

  const discoveryAndChoice = pool.filter((s) => s.type === "discovery" || s.type === "choice");
  const puzzles = pool.filter((s) => s.type === "puzzle");

  const shuffled = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const selected: ExplorationScene[] = [];

  const shuffledDiscovery = shuffled(discoveryAndChoice);
  if (shuffledDiscovery.length > 0) selected.push(shuffledDiscovery[0]);

  const shuffledPuzzles = shuffled(puzzles);
  if (shuffledPuzzles.length > 0) {
    selected.push(randomizePuzzle(shuffledPuzzles[0]));
  }

  if (shuffledDiscovery.length > 1) selected.push(shuffledDiscovery[1]);

  const encounterDescriptions = [
    "You sense a presence nearby. The air shifts. A creature is close.",
    "The ambient noise suddenly drops to dead silence. Something is watching you.",
    "A strange shadow detaches itself from the background. An encounter is imminent.",
    "The temperature drops rapidly as a silhouette forms in front of you.",
    "You hear an unusual sound echoing toward you. Prepare yourself.",
  ];

  const encounterScene: ExplorationScene = {
    id: `${locationId}_encounter`,
    locationId,
    type: "encounter",
    title: "Something stirs...",
    description: encounterDescriptions[Math.floor(Math.random() * encounterDescriptions.length)],
    atmosphere: "Every nerve tells you something is about to happen.",
  };
  selected.push(encounterScene);

  return selected;
}
