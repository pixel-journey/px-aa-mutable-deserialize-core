/**
 * AtomicAssets ATTRIBUTE_MAP bytes (educational subset).
 *
 * Layout, matching pinknetworkx atomicdata.hpp / the Serialization wiki:
 * - RESERVED = 4. Field i is prefixed by varint(i + 4).
 * - Fields follow schema order. A missing key is skipped (no bytes).
 * - A present vector is prefixed by varint(length). Length 0 is the byte 0x00.
 * - This file implements uint32, uint64, string, uint64[], int8, and float.
 *   String length 256 and vector length 64 are this file's caps, not the contract's.
 *
 * It does not call atomicassets::setassetdata. The on-chain action takes an
 * ABI map; the contract itself runs serialize() into mutable_serialized_data.
 */

export const RESERVED = 4;

export type FieldType = "uint32" | "uint64" | "string" | "uint64[]" | "int8" | "float";

export type FormatLine = {
  name: string;
  type: FieldType;
};

export type AttrValue = bigint | number | string | bigint[];

export type AttrMap = Readonly<Record<string, AttrValue>>;

const NAME = /^[a-zA-Z][a-zA-Z0-9_]{0,31}$/;

export function toVarint(value: bigint): number[] {
  if (typeof value !== "bigint" || value < 0n) throw new Error("varint must be an unsigned bigint");
  const out: number[] = [];
  let n = value;
  for (let i = 0; i < 10; i++) {
    const byte = Number(n & 0x7fn);
    n >>= 7n;
    if (n === 0n) {
      out.push(byte);
      return out;
    }
    out.push(byte | 0x80);
  }
  throw new Error("varint too long");
}

export function readVarint(bytes: Uint8Array, offset: number): { value: bigint; offset: number } {
  let value = 0n;
  let shift = 0n;
  for (let i = 0; i < 10; i++) {
    if (offset >= bytes.length) throw new Error("truncated varint");
    const byte = bytes[offset];
    offset += 1;
    value |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return { value, offset };
    shift += 7n;
  }
  throw new Error("varint too long");
}

function assertFormat(format: readonly FormatLine[]): void {
  if (format.length === 0) throw new Error("format must not be empty");
  if (format.length > 64) throw new Error("format too long");
  const seen = new Set<string>();
  for (const line of format) {
    if (!NAME.test(line.name)) throw new Error("bad attribute name");
    if (seen.has(line.name)) throw new Error("duplicate format name");
    seen.add(line.name);
    if (!["uint32", "uint64", "string", "uint64[]", "int8", "float"].includes(line.type)) {
      throw new Error("unsupported type");
    }
  }
}

function encodeValue(type: FieldType, value: AttrValue): number[] {
  if (type === "uint32" || type === "uint64") {
    if (typeof value !== "bigint" || value < 0n) throw new Error(`${type} must be an unsigned bigint`);
    const max = type === "uint32" ? 0xffff_ffffn : (1n << 64n) - 1n;
    if (value > max) throw new Error(`${type} out of range`);
    return toVarint(value);
  }
  if (type === "string") {
    if (typeof value !== "string") throw new Error("string expected");
    const raw = [...new TextEncoder().encode(value)];
    if (raw.length > 256) throw new Error("string too long");
    return [...toVarint(BigInt(raw.length)), ...raw];
  }
  if (type === "int8") {
    if (typeof value !== "number" || !Number.isInteger(value) || value < -128 || value > 127) {
      throw new Error("int8 out of range");
    }
    const zigzagged = value < 0 ? (-1 * (value + 1)) * 2 + 1 : value * 2;
    return toVarint(BigInt(zigzagged & 0xff));
  }
  if (type === "float") {
    if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("float expected");
    const buf = new Uint8Array(4);
    new DataView(buf.buffer).setFloat32(0, value, true);
    return [...buf];
  }
  if (!Array.isArray(value)) throw new Error("uint64[] expected");
  if (value.length > 64) throw new Error("vector too long");
  const out = [...toVarint(BigInt(value.length))];
  for (const item of value) {
    if (typeof item !== "bigint" || item < 0n || item > (1n << 64n) - 1n) {
      throw new Error("uint64[] element out of range");
    }
    out.push(...toVarint(item));
  }
  return out;
}

function decodeValue(type: FieldType, bytes: Uint8Array, offset: number): { value: AttrValue; offset: number } {
  if (type === "uint32" || type === "uint64") {
    const read = readVarint(bytes, offset);
    const max = type === "uint32" ? 0xffff_ffffn : (1n << 64n) - 1n;
    if (read.value > max) throw new Error(`${type} out of range`);
    return { value: read.value, offset: read.offset };
  }
  if (type === "string") {
    const len = readVarint(bytes, offset);
    if (len.value > 256n) throw new Error("string too long");
    const n = Number(len.value);
    const start = len.offset;
    const end = start + n;
    if (end > bytes.length) throw new Error("truncated string");
    const value = new TextDecoder().decode(bytes.subarray(start, end));
    return { value, offset: end };
  }
  if (type === "int8") {
    const read = readVarint(bytes, offset);
    const n = Number(read.value);
    const decoded = n % 2 === 0 ? n / 2 : -((n / 2) | 0) - 1;
    if (decoded < -128 || decoded > 127) throw new Error("int8 out of range");
    return { value: decoded, offset: read.offset };
  }
  if (type === "float") {
    if (offset + 4 > bytes.length) throw new Error("truncated float");
    const value = new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getFloat32(0, true);
    return { value, offset: offset + 4 };
  }
  const len = readVarint(bytes, offset);
  if (len.value > 64n) throw new Error("vector too long");
  const n = Number(len.value);
  const items: bigint[] = [];
  let cursor = len.offset;
  for (let i = 0; i < n; i++) {
    const item = readVarint(bytes, cursor);
    if (item.value > (1n << 64n) - 1n) throw new Error("uint64[] element out of range");
    items.push(item.value);
    cursor = item.offset;
  }
  return { value: items, offset: cursor };
}

/** Serialize in schema order. Missing keys are omitted. Unknown keys are refused. */
export function serialize(map: AttrMap, format: readonly FormatLine[]): Uint8Array {
  assertFormat(format);
  const known = new Set(format.map((line) => line.name));
  for (const key of Object.keys(map)) {
    if (!known.has(key)) throw new Error("attribute not in format: " + key);
  }
  const out: number[] = [];
  format.forEach((line, index) => {
    if (!Object.prototype.hasOwnProperty.call(map, line.name)) return;
    out.push(...toVarint(BigInt(index + RESERVED)));
    out.push(...encodeValue(line.type, map[line.name]));
  });
  return Uint8Array.from(out);
}

/** Empty bytes are an empty map. Reads until the buffer ends. */
export function deserialize(data: Uint8Array, format: readonly FormatLine[]): AttrMap {
  assertFormat(format);
  const map: Record<string, AttrValue> = {};
  let offset = 0;
  while (offset < data.length) {
    const id = readVarint(data, offset);
    offset = id.offset;
    if (id.value < BigInt(RESERVED)) throw new Error("identifier in reserved range");
    const index = Number(id.value - BigInt(RESERVED));
    if (!Number.isInteger(index) || index < 0 || index >= format.length) {
      throw new Error("identifier out of format");
    }
    const line = format[index];
    if (Object.prototype.hasOwnProperty.call(map, line.name)) throw new Error("duplicate field");
    const decoded = decodeValue(line.type, data, offset);
    map[line.name] = decoded.value;
    offset = decoded.offset;
  }
  return map;
}
