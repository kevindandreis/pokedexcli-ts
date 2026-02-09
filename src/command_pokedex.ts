import type { State } from "./state.js";

export async function commandPokedex(state: State, ...args: string[]) {
  console.log("Your Pokedex:");
  
  const pokemonNames = Object.keys(state.pokedex);
  
  if (pokemonNames.length === 0) {
    console.log(" - (empty)");
    return;
  }
  
  for (const name of pokemonNames) {
    console.log(` - ${name}`);
  }
}
