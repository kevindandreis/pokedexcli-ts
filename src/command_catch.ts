import type { State } from "./state.js";

export async function commandCatch(state: State, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Please provide a Pokemon name");
  }

  const pokemonName = args[0];
  console.log(`Throwing a Pokeball at ${pokemonName}...`);

  const pokemon = await state.pokeAPI.fetchPokemon(pokemonName);

  // Calculate catch probability based on base_experience
  // Higher base_experience = harder to catch
  // Formula: 50% base catch rate, reduced by base_experience
  // Pikachu (112 exp) ~= 31% catch rate
  // Mewtwo (340 exp) ~= 6% catch rate
  const catchProbability = Math.max(0.05, 0.5 - (pokemon.base_experience / 400));
  const randomValue = Math.random();

  if (randomValue < catchProbability) {
    console.log(`${pokemonName} was caught!`);
    console.log("You may now inspect it with the inspect command.");
    state.pokedex[pokemonName] = pokemon;
  } else {
    console.log(`${pokemonName} escaped!`);
  }
}
