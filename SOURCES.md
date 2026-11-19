# Sources

| Source | Use |
| --- | --- |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | `setassetdata` and ATTRIBUTE_MAP |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Field id = index + 4 |
| [Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | Action arguments |
| [How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Overview |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | Read `mutable_serialized_data` |

## Product facts locked by this lab

- Field id is **schemaIndex + 4**. Names are **not** in the byte stream. You cannot decode a map without the schema format.
- **Omit** (no id written) and **empty vector** (id + length `0x00`) are different states.
- The action argument is the **map**. The contract serializes it. Do not send this lab's byte vector as the `setassetdata` argument.
- Patch at the map layer ([safe partial](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater)), then serialize the full map. Do not splice one field into an old blob.
- Lab caps (string 256, vector 64) are teaching limits, not consensus claims.
- Out-of-range values throw. This lab does not clamp.

Stack: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

## Related labs

| Lab | Role |
| --- | --- |
| [safe partial](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) | Full-map patch / wipe |
| [primitives](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) | Scalar kinds |
| [vector CRUD](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) | Push / erase / clear |
| [RPG XP](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) | Game rule on top |
