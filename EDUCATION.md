# Education — mutable ATTRIBUTE_MAP bytes

> **Rung:** `npm test` passes. Nothing calls AtomicAssets on a live network.  
> **The test is the rule.** Schema format is required; bytes alone are not enough.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Read field id = schema index + 4, and explain a skipped key |
| Intermediate | Round-trip uint64, string, empty and non-empty vectors |
| Masterclass | Explain why partial-byte “patches” cannot work and what types this lab omits |

Stack: layer **1 of 5** — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

---

## Beginner — one scene

AtomicAssets does **not** store attribute **names** in `mutable_serialized_data`. It stores a varint **id**:

```text
id = schemaIndex + 4
```

`0..3` are reserved. A field absent from the map is **omitted entirely**, so the next present field still uses its own schema index. Deserializing therefore **requires the schema format**.

Example format: `id` (uint64, index 0), `name` (string, index 1), `scores` (uint64[], index 2).

| Map | Bytes (hex) |
| --- | --- |
| `{ id: 300 }` | `04 ac 02` |
| `{ name: "Tom" }` | `05 03 54 6f 6d` (field 0 skipped) |
| `{ scores: [] }` | `06 00` |
| `{ scores: [1, 300] }` | `06 02 01 ac 02` |
| `{}` | empty buffer |

### Words

| Word | Meaning here |
| --- | --- |
| Schema index | Position of the attribute in `schema.format` (0-based) |
| Field id | `index + 4`, encoded as a varint |
| Omitted | Id not present in the byte stream |
| Empty vector | Id present, length varint `0x00` |

### Predict, then run

```bash
npm test
```

1. `toVarint(300n)` is `[0xac, 0x02]` (wiki example).
2. Empty map serializes to length 0; empty buffer deserializes to `{}`.
3. Reserved id `0x03` throws.

---

## Intermediate — the codec

Source: `invariants/attrmap.ts`. Tests: `invariants/attrmap.test.ts`.

- **Serialize** walks format order; only keys present in the map emit bytes.
- **Deserialize** reads id → maps back to format entry → reads the typed value.
- **Lab caps:** string length 256, vector length 64 (not consensus limits).
- **Covered types here:** `uint32`/`uint64`, `string`, `uint64[]`, `int8`, `float`.
- Unknown key on serialize → `not in format`.
- Truncated value after a valid id → `truncated`.

`int8` -1 and `float` 1 together encode as `04 01 05 00 00 80 3f`, matching [wax-atomic-template-and-schema-explorer](https://github.com/pixel-journey/wax-atomic-template-and-schema-explorer).

### Attack → test

| Mistake | Lab behavior |
| --- | --- |
| Treat bytes as self-describing names | Need format; ids are indices |
| Confuse omit with empty vector | Empty vector still has id + `0x00` |
| Reserved id in stream | refused |
| Key not in format | refused |

---

## Masterclass — what this course will not invent

- **`setassetdata` does not take this byte vector.** The action argument is the **map**. Serialization happens inside `atomicassets`.
- **Not every schema type is implemented here.** Broader scalars live in [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types); vector CRUD in [vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud).
- **Do not silently mask out-of-range values** the way some helpers that take `original_bytes` can. This lab throws.
- **Do not patch by splicing only the changed key’s bytes** over an old blob. Deserialize → copy → patch → serialize the **full** map ([safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater)).

### Exercise

Format indices 0=`a` uint64, 1=`b` string. Map `{ b: "x" }`:

- Emitted id for `b` is `1 + 4 = 5`.
- Stream starts with `0x05`, not `0x04`.

---

## What this course will not teach

- Live `setassetdata` or table reads
- Full AtomicAssets type matrix
- That lab string/vector caps equal on-chain limits
