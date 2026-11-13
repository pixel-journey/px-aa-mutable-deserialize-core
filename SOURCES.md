# Official sources

| Source | Use |
| --- | --- |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Field id = varint(index + 4), type encodings |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | `setassetdata`, serialize/deserialize entry points |
| [WAX: Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | Action parameters (map, not raw bytes) |
| [WAX: How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Standard overview |
| [WAX: Minting NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft) | Initial mutable vs immutable |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | Reading asset rows |

## Stack and related

| Repo | Role |
| --- | --- |
| **This repo** | Layer 1 — byte codec |
| [safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) | Layer 2 — full-map patch |
| [wax-atomic-template-and-schema-explorer](https://github.com/pixel-journey/wax-atomic-template-and-schema-explorer) | Explorer parity for int8/float hex |
| [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md) | Learning order |
