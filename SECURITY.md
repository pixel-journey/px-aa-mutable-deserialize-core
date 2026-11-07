# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Key not in the schema | serialize refuses |
| Id in `0..3` or past the format | deserialize refuses |
| Truncated varint or string | refused |
| Duplicate id in one buffer | refused |
| Huge string or vector | caps 256 / 64 |

The real contract trusts `schema.format` from the `schemas` table (scope = collection). A decoder that guesses types from the bytes will mis-read the asset.
