# Worked examples — ATTRIBUTE_MAP bytes

Schema used in most tests:

```text
0: id uint64
1: name string
2: scores uint64[]
```

## Example A — wiki uint64 300

```text
serialize({ id: 300n }) → [0x04, 0xac, 0x02]
deserialize → { id: 300n }
toVarint(300n) → [0xac, 0x02]
toVarint(0n) → [0x00]
```

## Example B — skip field 0

```text
serialize({ name: "Tom" }) → [0x05, 0x03, 0x54, 0x6f, 0x6d]
// 0x05 = index 1 + 4
// 0x03 = string length
// 54 6f 6d = T o m
```

## Example C — empty vs omitted vector

| Intent | Bytes | Deserialize |
| --- | --- | --- |
| scores present, empty | `06 00` | `{ scores: [] }` |
| scores omitted | (no `06…`) | no `scores` key |

## Example D — vector [1, 300]

```text
[0x06, 0x02, 0x01, 0xac, 0x02]
// id 6, length 2, uint64 1, uint64 300
```

## Example E — int8 + float (explorer parity)

```text
format: flag int8, score float
serialize({ flag: -1, score: 1 }) → 04 01 05 00 00 80 3f
```

## Example F — refused inputs

| Input | Error |
| --- | --- |
| `{ nope: 1n }` | not in format |
| bytes starting `0x03` | reserved |
| bytes `0x04` alone | truncated |

## Example G — full-map discipline

If you only re-serialize `{ id: 301 }` after the chain held `id` and `name`, the new blob will **not** contain `name`. Layer 2 ([safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater)) exists for that rule.
