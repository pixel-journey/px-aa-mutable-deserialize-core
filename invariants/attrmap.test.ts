import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deserialize, serialize, toVarint } from "./attrmap.ts";

const format = [
  { name: "id", type: "uint64" as const },
  { name: "name", type: "string" as const },
  { name: "scores", type: "uint64[]" as const },
];

describe("toVarint", () => {
  it("encodes 300 the way the AtomicAssets wiki does", () => {
    assert.deepEqual(toVarint(300n), [0xac, 0x02]);
    assert.deepEqual(toVarint(0n), [0x00]);
  });
});

describe("serialize / deserialize", () => {
  it("writes the wiki uint64 example and reads it back", () => {
    const bytes = serialize({ id: 300n }, format);
    assert.deepEqual([...bytes], [0x04, 0xac, 0x02]);
    assert.deepEqual(deserialize(bytes, format), { id: 300n });
  });

  it("skips a missing field and still numbers the later id from the schema index", () => {
    const bytes = serialize({ name: "Tom" }, format);
    // index 1 + RESERVED 4 = 5, then varint length 3, then T o m
    assert.deepEqual([...bytes], [0x05, 0x03, 0x54, 0x6f, 0x6d]);
    assert.deepEqual(deserialize(bytes, format), { name: "Tom" });
  });

  it("encodes an empty vector as a single 0x00 length", () => {
    const bytes = serialize({ scores: [] }, format);
    assert.deepEqual([...bytes], [0x06, 0x00]);
    const back = deserialize(bytes, format);
    assert.deepEqual(back.scores, []);
  });

  it("round-trips a non-empty uint64 vector", () => {
    const bytes = serialize({ scores: [1n, 300n] }, format);
    // id 6, length 2, uint64 1, uint64 300
    assert.deepEqual([...bytes], [0x06, 0x02, 0x01, 0xac, 0x02]);
    assert.deepEqual(deserialize(bytes, format).scores, [1n, 300n]);
  });

  it("treats an empty byte vector as an empty map", () => {
    assert.deepEqual(deserialize(new Uint8Array(), format), {});
    assert.equal(serialize({}, format).length, 0);
  });

  it("refuses a key that is not in the format", () => {
    assert.throws(() => serialize({ nope: 1n }, format), /not in format/);
  });

  it("refuses a reserved identifier and a truncated value", () => {
    assert.throws(() => deserialize(Uint8Array.of(0x03), format), /reserved/);
    assert.throws(() => deserialize(Uint8Array.of(0x04), format), /truncated/);
  });
});
