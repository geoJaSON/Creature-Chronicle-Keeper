import {
  runCipherMachine,
  DEFAULT_CIPHER_MACHINE_SETTINGS,
  SYMBOL_PLUGBOARD_FOR_CIPHERS,
  type CipherMachineSettings,
} from "../shared/schema.ts";
import { CREATURES } from "../client/src/lib/gameData.ts";

const settings: CipherMachineSettings = {
  ...DEFAULT_CIPHER_MACHINE_SETTINGS,
  plugboard: SYMBOL_PLUGBOARD_FOR_CIPHERS,
};
const results = CREATURES.map((creature) => {
  const plaintext = creature.decodedSecret;
  const cipher = runCipherMachine(plaintext, settings, "encode");
  return {
    id: creature.id,
    plaintext,
    cipher,
  };
});

console.log(JSON.stringify(results, null, 2));

