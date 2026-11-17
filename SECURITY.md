# Security — mutable ATTRIBUTE_MAP codec

This lab is a **codec**. It does not authorize editors or call `setassetdata`.

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Reserved field ids 0–3 | refused |
| Truncated value payload | refused |
| Key not in schema format | refused on serialize |
| Overlong string / vector (lab caps) | refused |

Malformed bytes **fail closed** (throw). The codec never invents default attribute values.

## Not closed (production)

| Risk | Mitigation |
| --- | --- |
| Partial map wipe on write | [safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) |
| Wrong editor / collection auth | Collection authorized_editor + `require_auth` |
| Type confusion (string into uint) | Schema-aware serialize; [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| Trusting client-supplied “previous” bytes | Load asset row on contract |
| Hand-edited hex without format | Always pair bytes with `schema.format` |
| Lab caps as consensus | String/vector limits are teaching caps — check AtomicAssets |

## Attack angles

1. Treating omit and empty vector as the same (empty vector still writes id + `0x00`).
2. Splicing only the changed key’s bytes over an old blob (desyncs later fields).
3. Decoding without the schema format (ids are indices, not names).
4. Silently masking out-of-range values instead of throwing.

## Honesty limits

Codec only. Official: [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) · [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract). Stack: [MUTABLE-STACK](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).
