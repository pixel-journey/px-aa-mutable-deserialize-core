# px-aa-mutable-deserialize-core

> **Trust:** private educational lab (Tier B)  
> **Quest:** 021 — deserialize mutable `ATTRIBUTE_MAP`, including the empty vector  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach the AtomicAssets byte layout: field id `varint(index + 4)`, missing keys skipped, empty `uint64[]` is the single byte `0x00`.

**Real code:** `npm test`. Subset of types: `uint32`, `uint64`, `string`, `uint64[]`. Not float, ipfs, fixed-width, or zigzag integers.

This repo does **not** call `atomicassets`. The chain action is:

```cpp
setassetdata(name authorized_editor, name asset_owner, uint64_t asset_id, ATTRIBUTE_MAP new_mutable_data)
```

That action takes the **ABI map**. `atomicassets` then runs `serialize(new_mutable_data, schema.format)` into `assets.mutable_serialized_data`. These tests cover that byte vector, not the action call.

---

## What is true (executed)

| Bytes | Meaning |
|-------|---------|
| `04 AC 02` | field 0, uint64 **300** (wiki example) |
| `05 03 54 6F 6D` | field 1 only, string `Tom` (field 0 skipped) |
| `06 00` | field 2, **empty** `uint64[]` |
| `06 02 01 AC 02` | field 2, `[1, 300]` |
| empty buffer | empty map |

```bash
npm test
```

Sibling that patches one key without wiping the others: `px-aa-mutable-safe-partial-updater`. That lab is the map. This lab is the bytes.

## License

MIT — Pixel Journey
