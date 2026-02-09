import { initState } from "./state.js";

const state = initState();

console.log("Commands:");
for (const [key, cmd] of Object.entries(state.commands)) {
  console.log(`  ${key}: ${cmd.name} - ${cmd.description}`);
}
