# AI handoff — mutable deserialize core

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
# AtomicAssets skills (not MCP): pin commit, AGENTS.md
# https://github.com/atomicassets/atomic-knowledge
```

| Tool | Role |
| --- | --- |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Field id = schemaIndex + 4 |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | ATTRIBUTE_MAP / setassetdata |
| [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk) | Official TS serialize |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Network before action |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit for a later host |
| Stack | [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md) |

## Non-negotiables

1. Field id is **schemaIndex + 4**. Names are not in the byte stream.
2. **Omit** and **empty vector** (id + length `0x00`) are different states.
3. The action argument is the **map**. The contract serializes it.
4. Patch at the map layer, then serialize the **full** map — do not splice bytes.
5. Lab caps (string 256, vector 64) are teaching limits, not consensus.
6. Serialization rule ports wherever AtomicAssets is deployed; ABI version is chain-local.

## Prompt seeds

- "Format indices 0=a uint64, 1=b string. Map `{ b: \"x\" }` — which field id is first?"
- "Show omit vs empty vector for a uint64[] key."
- "Refuse a byte-splice patch that keeps an old tail after one field changes."
- "Hand off to safe-partial-updater for the wipe rule."

## Do not

- Claim lab string length 256 is consensus.
- Open a micro-repo for one scalar type (that is layer 3).
- Broadcast or load a live asset row in this pure lab.
