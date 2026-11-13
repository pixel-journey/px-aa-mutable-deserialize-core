# Security notes — deserialize core

This lab is a **codec**. It does not authorize editors or call `setassetdata`.

## Mitigated in the lab

| Issue | Behavior |
| --- | --- |
| Reserved field ids 0–3 | refused |
| Truncated value payload | refused |
| Key not in schema format | refused on serialize |
| Overlong string / vector (lab caps) | refused |

## Production risks this lab does not cover

| Risk | Mitigation elsewhere |
| --- | --- |
| Partial map wipe on write | [safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) |
| Wrong editor / collection auth | Collection authorized_editor + require_auth |
| Type confusion (string into uint) | Schema-aware serialize; [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| Trusting client-supplied “previous” bytes | Load asset row on contract |
| Hand-edited hex without format | Always pair bytes with schema.format |

Malformed bytes should **fail closed** (throw), never invent default attribute values.
