# Sources

## Official AtomicAssets / WAX

| Source | Use |
| --- | --- |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | `setassetdata`, ATTRIBUTE_MAP |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Field id = index + 4 |
| [Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | Action arguments |
| [How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Overview |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | Read `mutable_serialized_data` |
| [atomicassets org](https://github.com/atomicassets) | Contract, API, SDKs |
| [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk) | Official TS read / serialize / v2 actions |

## WharfKit (client, sessions, codegen)

| Source | Use |
| --- | --- |
| [WharfKit](https://wharfkit.com/) | SessionKit, ContractKit, Antelope types |
| [@wharfkit/atomicassets](https://www.npmjs.com/package/@wharfkit/atomicassets) | Typed AA / AtomicMarket client (v2 optional fields) |
| [@wharfkit/session](https://www.npmjs.com/package/@wharfkit/session) | Login / `transact` |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | Pre-wired WAX SessionKit |
| [wharfkit/skill](https://github.com/wharfkit/skill) | **Claude Code skill** — Session, Contract, patterns, PowerUp |
| [Wharf CLI](https://www.npmjs.com/package/@wharfkit/cli) | `npx @wharfkit/cli generate atomicassets` |

Install the Wharf skill (agent handoff):

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

## Product facts locked by this lab

- Field id is **schemaIndex + 4**. Names are **not** in the byte stream.
- **Omit** vs **empty vector** (id + length `0x00`) are different states.
- The action argument is the **map**. The contract serializes it.
- Patch at the map layer, then serialize the full map — do not splice bytes.
- Lab caps (string 256, vector 64) are teaching limits, not consensus claims.

Stack: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

## Related labs

| Lab | Role |
| --- | --- |
| [safe partial](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) | Full-map patch / wipe |
| [primitives](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) | Scalar kinds |
| [vector CRUD](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) | Push / erase / clear |
| [RPG XP](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) | Game rule on top |
