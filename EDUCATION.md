# Education

AtomicAssets does not store the attribute name in `mutable_serialized_data`. It stores a varint id:

```text
id = schemaIndex + 4
```

`0..3` are reserved. A field that is absent from the map is omitted entirely, so the next present field still uses its own schema index. Deserializing therefore **requires the schema format**. Bytes alone are not enough.

An empty vector is not an omitted field. Omitted means the id is absent. Present-but-empty means the id is there and the length varint is `0x00`.

## What a future agent should not invent

- Do not treat `setassetdata` as taking this byte vector. The action argument is the map. Serialization happens inside `atomicassets`.
- Do not assume every schema type is implemented here. `int*`, `float`, `double`, `ipfs`, `bool`, `fixed*`, and `byte` are intentionally absent.
- Do not silently mask an out-of-range uint the way `toVarintBytes(number, original_bytes)` can. This lab throws.
- Do not write a partial map by serializing only the changed key over the old bytes. Deserialize, copy, patch, serialize the full map (`px-aa-mutable-safe-partial-updater`).
