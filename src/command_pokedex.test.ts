import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { commandPokedex } from "./command_pokedex.js";
import type { State } from "./state.js";
import type { Pokemon } from "./pokeapi.js";

describe("commandPokedex", () => {
  let mockState: State;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create a minimal mock state
    mockState = {
      pokedex: {},
      readline: {} as any,
      commands: {} as any,
      pokeAPI: {} as any,
      nextLocationsURL: "",
      prevLocationsURL: "",
    };

    // Spy on console.log to capture output
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should display empty pokedex message when no Pokemon are caught", async () => {
    await commandPokedex(mockState);

    expect(consoleLogSpy).toHaveBeenCalledWith("Your Pokedex:");
    expect(consoleLogSpy).toHaveBeenCalledWith(" - (empty)");
    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
  });

  it("should display a single caught Pokemon", async () => {
    const mockPokemon: Pokemon = {
      id: 25,
      name: "pikachu",
      height: 4,
      weight: 60,
      stats: [],
      types: [],
      base_experience: 112,
    };

    mockState.pokedex["pikachu"] = mockPokemon;

    await commandPokedex(mockState);

    expect(consoleLogSpy).toHaveBeenCalledWith("Your Pokedex:");
    expect(consoleLogSpy).toHaveBeenCalledWith(" - pikachu");
    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
  });

  it("should display multiple caught Pokemon", async () => {
    const mockPikachu: Pokemon = {
      id: 25,
      name: "pikachu",
      height: 4,
      weight: 60,
      stats: [],
      types: [],
      base_experience: 112,
    };

    const mockBulbasaur: Pokemon = {
      id: 1,
      name: "bulbasaur",
      height: 7,
      weight: 69,
      stats: [],
      types: [],
      base_experience: 64,
    };

    const mockCharizard: Pokemon = {
      id: 6,
      name: "charizard",
      height: 17,
      weight: 905,
      stats: [],
      types: [],
      base_experience: 267,
    };

    mockState.pokedex["pikachu"] = mockPikachu;
    mockState.pokedex["bulbasaur"] = mockBulbasaur;
    mockState.pokedex["charizard"] = mockCharizard;

    await commandPokedex(mockState);

    expect(consoleLogSpy).toHaveBeenCalledWith("Your Pokedex:");
    expect(consoleLogSpy).toHaveBeenCalledWith(" - pikachu");
    expect(consoleLogSpy).toHaveBeenCalledWith(" - bulbasaur");
    expect(consoleLogSpy).toHaveBeenCalledWith(" - charizard");
    expect(consoleLogSpy).toHaveBeenCalledTimes(4);
  });

  it("should work without any arguments", async () => {
    mockState.pokedex["pidgey"] = {
      id: 16,
      name: "pidgey",
      height: 3,
      weight: 18,
      stats: [],
      types: [],
      base_experience: 50,
    };

    // Call with no arguments
    await commandPokedex(mockState);

    expect(consoleLogSpy).toHaveBeenCalledWith("Your Pokedex:");
    expect(consoleLogSpy).toHaveBeenCalledWith(" - pidgey");
  });

  it("should ignore extra arguments if provided", async () => {
    mockState.pokedex["caterpie"] = {
      id: 10,
      name: "caterpie",
      height: 3,
      weight: 29,
      stats: [],
      types: [],
      base_experience: 39,
    };

    // Call with extra arguments (should be ignored)
    await commandPokedex(mockState, "extra", "args");

    expect(consoleLogSpy).toHaveBeenCalledWith("Your Pokedex:");
    expect(consoleLogSpy).toHaveBeenCalledWith(" - caterpie");
    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
  });

  it("should display Pokemon in the order they appear in the object", async () => {
    // Add Pokemon in a specific order
    mockState.pokedex["pidgey"] = {
      id: 16,
      name: "pidgey",
      height: 3,
      weight: 18,
      stats: [],
      types: [],
      base_experience: 50,
    };

    mockState.pokedex["caterpie"] = {
      id: 10,
      name: "caterpie",
      height: 3,
      weight: 29,
      stats: [],
      types: [],
      base_experience: 39,
    };

    await commandPokedex(mockState);

    const calls = consoleLogSpy.mock.calls;
    expect(calls[0][0]).toBe("Your Pokedex:");
    expect(calls[1][0]).toBe(" - pidgey");
    expect(calls[2][0]).toBe(" - caterpie");
  });
});
