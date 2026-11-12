# px-aa-mutable-deserialize-core

> **Trust:** private educational lab (Tier B)  
> **Stack:** layer 1 of 5 — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach the AtomicAssets byte layout: field id `varint(index + 4)`, missing keys skipped, empty `uint64[]` is the single byte `0x00`.

**Real code:** `npm test`. Subset of types: `uint32`, `uint64`, `string`, `uint64[]`, `int8`, and `float`. String length 256 and vector length 64 are this file's caps, not the contract's. `int8` -1 and `float` 1 together are `0401050000803f`, the same bytes as [wax-atomic-template-and-schema-explorer](https://github.com/pixel-journey/wax-atomic-template-and-schema-explorer). A full-map write that keeps siblings is [px-aa-mutable-safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater). An XP rule on top of that write is [px-aa-mutable-rpg-xp-and-leveling](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling).

This repo does **not** call `atomicassets`. The chain action is:

```text
setassetdata(authorized_editor, asset_owner, asset_id, new_mutable_data)
```

AtomicAssets then runs `serialize(new_mutable_data, schema.format)` into `assets.mutable_serialized_data`. These tests cover that **byte vector**, not the action call. Ground truth: [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) and [contract source](https://github.com/pinknetworkx/atomicassets-contract).

Official links: [SOURCES.md](SOURCES.md).

---

## What is true (executed)

| Bytes | Meaning |
|-------|---------|
| `04 AC 02` | field 0, uint64 **300** (wiki-style example) |
| `05 03 54 6F 6D` | field 1 only, string `Tom` (field 0 skipped) |
| `06 00` | field 2, **empty** `uint64[]` |
| `06 02 01 AC 02` | field 2, `[1, 300]` |
| empty buffer | empty map |

```bash
npm test
```

## Next in the stack

| Layer | Repo |
| --- | --- |
| 2 | [px-aa-mutable-safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) — patch one key without wiping siblings |
| 3 | [px-aa-mutable-all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| 4 | [px-aa-mutable-vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |
| 5 | [px-aa-mutable-rpg-xp-and-leveling](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) |

## License

MIT — Pixel Journey
