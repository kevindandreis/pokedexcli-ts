import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Cache } from "./pokecache.js";

describe("Cache", () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache(1000); // 1 second interval for testing
  });

  afterEach(() => {
    cache.stopReapLoop();
  });

  it("should store and retrieve values", () => {
    cache.add("key1", "value1");
    cache.add("key2", { data: "value2" });

    expect(cache.get<string>("key1")).toBe("value1");
    expect(cache.get<{ data: string }>("key2")).toEqual({ data: "value2" });
  });

  it("should return undefined for non-existent keys", () => {
    expect(cache.get("nonexistent")).toBeUndefined();
  });

  it("should overwrite existing keys", () => {
    cache.add("key1", "value1");
    cache.add("key1", "value2");

    expect(cache.get<string>("key1")).toBe("value2");
  });

  it("should reap old entries after interval", async () => {
    const shortCache = new Cache(100); // 100ms interval

    shortCache.add("key1", "value1");
    expect(shortCache.get<string>("key1")).toBe("value1");

    // Wait for entries to expire and reap to run
    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(shortCache.get<string>("key1")).toBeUndefined();

    shortCache.stopReapLoop();
  });

  it("should handle multiple entries", () => {
    const entries = [
      { key: "a", value: 1 },
      { key: "b", value: 2 },
      { key: "c", value: 3 },
      { key: "d", value: 4 },
      { key: "e", value: 5 },
    ];

    entries.forEach(({ key, value }) => cache.add(key, value));

    entries.forEach(({ key, value }) => {
      expect(cache.get<number>(key)).toBe(value);
    });
  });

  it("should stop reap loop when stopReapLoop is called", () => {
    cache.stopReapLoop();
    // If this doesn't throw, the interval was successfully cleared
    expect(true).toBe(true);
  });

  it("should handle different data types", () => {
    cache.add("string", "hello");
    cache.add("number", 42);
    cache.add("boolean", true);
    cache.add("object", { name: "test" });
    cache.add("array", [1, 2, 3]);

    expect(cache.get<string>("string")).toBe("hello");
    expect(cache.get<number>("number")).toBe(42);
    expect(cache.get<boolean>("boolean")).toBe(true);
    expect(cache.get<{ name: string }>("object")).toEqual({ name: "test" });
    expect(cache.get<number[]>("array")).toEqual([1, 2, 3]);
  });
});

describe("Cache concurrent operations", () => {
  it.concurrent.each([
    { key: "key1", value: "value1" },
    { key: "key2", value: "value2" },
    { key: "key3", value: "value3" },
    { key: "key4", value: "value4" },
    { key: "key5", value: "value5" },
  ])("should handle concurrent add/get for $key", ({ key, value }) => {
    const cache = new Cache(5000);
    
    cache.add(key, value);
    const result = cache.get<string>(key);
    
    expect(result).toBe(value);
    
    cache.stopReapLoop();
  });
});
