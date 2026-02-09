import { cleanInput } from "./repl.js";
import { describe, expect, test } from "vitest";

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "",
    expected: [],
  },
  {
    input: "   ",
    expected: [],
  },
  {
    input: "hello",
    expected: ["hello"],
  },
  {
    input: "hello world",
    expected: ["hello", "world"],
  },
  {
    input: "hello world!",
    expected: ["hello", "world!"],
  },
  {
    input: "my name is Test",
    expected: ["my", "name", "is", "test"],
  },
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);

    expect(actual).toHaveLength(expected.length);
    for (let i = 0; i < expected.length; i++) {
        expect(actual[i]).toBe(expected[i]);
    }
  });
});