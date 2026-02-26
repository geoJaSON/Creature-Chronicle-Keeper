/**
 * Re-encode all creature decodedSecrets with the cipher machine using
 * 1–2 random letter swaps (plugboard). Run with: npx tsx script/reencodeCreatureCiphers.ts
 *
 * Output: the plugboard used and each creature's new cipherClue. Update gameData.ts
 * with the new cipherClue values. To keep decoding working with symbols, set
 * SYMBOL_PLUGBOARD_FOR_CIPHERS in shared/schema.ts to the printed plugboard
 * (or ensure the discovered symbol keys map to those letter pairs).
 */
import { reencodeWithRandomSwaps } from "../shared/schema.ts";
import { CREATURES } from "../client/src/lib/gameData.ts";

const plaintexts = CREATURES.map((c) => c.decodedSecret);
const numSwaps = (Math.random() < 0.5 ? 1 : 2) as 1 | 2;
const { cipherTexts, plugboard } = reencodeWithRandomSwaps(plaintexts, {
  shift: 3,
  numSwaps,
});

const results = CREATURES.map((creature, i) => ({
  id: creature.id,
  name: creature.name,
  cipherClue: cipherTexts[i],
}));

console.log("Plugboard (use for SYMBOL_PLUGBOARD_FOR_CIPHERS or symbol discovery):");
console.log(JSON.stringify(plugboard));
console.log("\nRe-encoded cipherClues (paste into gameData.ts):\n");
results.forEach((r) => {
  console.log(`  ${r.id}: "${r.cipherClue}",`);
});

// Optional: output as JSON for programmatic use
console.log("\n--- As JSON ---");
console.log(JSON.stringify(results, null, 2));
