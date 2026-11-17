# Tips — reading and writing mutable bytes

Field id is `schemaIndex + 4`. Names are **not** in the byte stream. You cannot decode a map without the schema format.

## Do

- Deserialize with the **same format** the collection used.
- Treat **omit** (no id) and **empty vector** (id + length `0x00`) as different states.
- Round-trip in tests before trusting hand-built hex.
- Patch at the **map** layer ([safe partial updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater)), then serialize the full map. Do not splice one field into an old blob.

## Don't

- Guess attribute names from the bytes.
- Read `0x00` after an id as "null" for every type. For a vector it is length 0.
- Treat lab caps (string 256, vector 64) as AtomicAssets consensus limits.
- Send this byte vector as the `setassetdata` argument. The action takes the **map**. Serialization happens inside `atomicassets`.

## Common mistakes

1. Skipping index 0 and still emitting id `4` for the second field. The second field's id is `5` if its schema index is 1.
2. Confusing a wiped key (omitted on the last write) with a codec bug.
3. Implementing uint32 and calling the lab finished. Broader scalars are [primitives](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types).
4. Silently clamping out-of-range values. This lab throws.

## Debugging

1. Dump `mutable_serialized_data` hex from the asset API.
2. List `schema.format` with indices.
3. Walk ids: each present field is `index + 4`.
4. If a key vanished, diff the **map** that was written, not only the codec.

## Nice-to-have (not in this repo)

| Idea | Where |
| --- | --- |
| Every scalar kind | [primitives](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| Vector push/erase | [vector CRUD](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |
| Game rule on top | [RPG XP](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) |

Wiki: [Serialization](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization). Stack: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).
