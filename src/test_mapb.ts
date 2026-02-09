import { initState } from "./state.js";

const state = initState();

console.log("Initial prevLocationsURL:", state.prevLocationsURL);
console.log("Is null?", state.prevLocationsURL === null);
console.log("Is falsy?", !state.prevLocationsURL);

if (!state.prevLocationsURL) {
  console.log("You're on the first page");
}
