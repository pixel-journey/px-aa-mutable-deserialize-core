# Tips — reading and writing mutable bytes

## Do

- Always deserialize with the **same schema format** the collection used at mint/update time.
- Treat **omit** and **empty vector** as different states.
- Round-trip in tests before trusting a hand-built hex string.
- Use layer 2 for safe multi-key maps; this layer only explains the bytes.

## Don’t

- Guess attribute names from the byte stream.
- Splice a single field’s encoding into the middle of an old blob.
- Assume `0x00` after a field id is “null” for scalars — for vectors it is length 0.
- Confuse lab caps (string 256, vector 64) with AtomicAssets consensus limits.

## Debugging

1. Dump `mutable_serialized_data` hex from the asset API.
2. List schema.format with indices.
3. Walk ids: each should be `index + 4`.
4. If a key “vanished,” check whether the last write’s map omitted it (wipe), not only whether the codec is wrong.

## Next

[safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) → [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) → [vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) → [rpg-xp](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling).
