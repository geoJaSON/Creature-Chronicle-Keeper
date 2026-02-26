/**
 * storyMode.ts
 *
 * Utilities for rendering collected lore as a cohesive first-person
 * investigator journal rather than a raw flat list.
 */

/** List of location IDs in the order they should appear in the story. */
export const STORY_LOCATION_ORDER = [
    "forest",
    "library",
    "school",
    "cave",
    "lab",
    "arcade",
    "dock",
    "tower",
    "house",
] as const;

export type LocationId = (typeof STORY_LOCATION_ORDER)[number];

/** Human-readable names for each location. */
export const LOCATION_NAMES: Record<string, string> = {
    forest: "The Forest",
    library: "The Library",
    school: "The Old School",
    cave: "The Cave Network",
    lab: "The Research Lab",
    arcade: "The Arcade",
    dock: "The Dock",
    tower: "The Signal Tower",
    house: "The Old House",
};

/**
 * Opening field-note header lines per location, written in first-person
 * investigator voice. These prefix the chapter when the player has at least
 * one lore entry from that location.
 */
export const LOCATION_STORY_HEADERS: Record<string, string> = {
    forest: "My first days in the forest were quieter than I expected. The trees held their breath while I held mine.",
    library: "I moved on to the library next — or rather, the library seemed to call me. The books remember everything.",
    school: "The school had been closed for years, but it didn't feel empty. The chalk dust hadn't settled.",
    cave: "The cave entrance felt like a mouth that had been waiting. I noted this. I went in anyway.",
    lab: "Whatever they were building here, they didn't finish it. Or it finished itself.",
    arcade: "The arcade shouldn't have been running. The power had been cut to this block for years.",
    dock: "The dock smelled like rust and salt and something older. The water kept things. It kept them well.",
    tower: "The tower was visible from every part of town. I'd been avoiding it. I don't know why.",
    house: "The house was last. I think it was always last — for everyone who came here before me.",
};

/** Short bridge sentences rendered between consecutive location chapters. */
export const LOCATION_TRANSITIONS: Record<string, string> = {
    "forest→library": "I brought what I'd found in the forest back to the library, where things could be read.",
    "forest→school": "From the tree line I could see the school's windows. Nothing was moving. That was the first sign.",
    "forest→cave": "The forest path narrowed until the mouth of the cave was the only way forward.",
    "library→school": "The library's records pointed me toward the school — specifically toward the east wing.",
    "library→cave": "A map tucked inside one of the unmarked books showed a route I recognized.",
    "school→cave": "The school's basement has a door that leads somewhere the blueprints don't show.",
    "cave→lab": "After the cave, the lab felt almost ordinary. Almost.",
    "lab→arcade": "I don't know how I ended up at the arcade. My notes say I was heading somewhere else.",
    "arcade→dock": "The arcade's back door opened onto an alley that led, eventually, to the water.",
    "dock→tower": "You can see the tower from the dock on a clear night. It's always broadcasting.",
    "tower→house": "The tower pointed at the house. Every frequency, every transmission. The house was the source.",
};

export interface ParsedLoreEntry {
    locationId: string;
    text: string;
}

/**
 * Parse a raw lore string into its location tag and clean display text.
 * Format: "[locationId] Actual text..." → { locationId, text }
 * Falls back to { locationId: "unknown", text: rawLore } if no tag found.
 */
export function parseLoreTag(raw: string): ParsedLoreEntry {
    const match = raw.match(/^\[([a-z_]+)\]\s*([\s\S]+)$/);
    if (match) {
        return { locationId: match[1], text: match[2] };
    }
    return { locationId: "unknown", text: raw };
}

export interface LoreChapter {
    locationId: string;
    locationName: string;
    header: string;
    entries: string[];
    transition?: string; // sentence bridging to the NEXT chapter
}

/**
 * Group a flat list of collected lore strings into ordered chapters,
 * one per location. Unknown/untagged entries are placed at the end.
 */
export function buildStoryChapters(collectedLore: string[]): LoreChapter[] {
    // Parse all entries
    const parsed = collectedLore.map(parseLoreTag);

    // Group by locationId, preserving insertion order within each group
    const groups = new Map<string, string[]>();
    for (const { locationId, text } of parsed) {
        if (!groups.has(locationId)) groups.set(locationId, []);
        groups.get(locationId)!.push(text);
    }

    // Build ordered chapters
    const orderedIds = [
        ...STORY_LOCATION_ORDER.filter((id) => groups.has(id)),
        // append any unknown / future location ids at the end
        ...Array.from(groups.keys()).filter(
            (id) => !(STORY_LOCATION_ORDER as readonly string[]).includes(id)
        ),
    ];

    const chapters: LoreChapter[] = orderedIds.map((locationId, idx) => {
        const nextId = orderedIds[idx + 1];
        const transitionKey = nextId ? `${locationId}→${nextId}` : undefined;
        return {
            locationId,
            locationName: LOCATION_NAMES[locationId] ?? locationId,
            header:
                LOCATION_STORY_HEADERS[locationId] ??
                "I wrote down what I found. I'm still not sure what it means.",
            entries: groups.get(locationId)!,
            transition:
                transitionKey ? LOCATION_TRANSITIONS[transitionKey] : undefined,
        };
    });

    return chapters;
}
