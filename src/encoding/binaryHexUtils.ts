import { ByteDetail } from '../types/tokenizer';

const textEncoder = new TextEncoder();

export function textToUtf8Bytes(text: string): Uint8Array {
  return textEncoder.encode(text);
}

export function byteToHex(b: number): string {
  return b.toString(16).toUpperCase().padStart(2, '0');
}

export function byteToBinary(b: number): string {
  return b.toString(2).padStart(8, '0');
}

export function tokenIdToHex(id: number): string {
  return '0x' + id.toString(16).toUpperCase();
}

export function tokenIdToBinary(id: number, minBits: number = 16): string {
  const raw = id.toString(2);
  const targetLength = Math.max(minBits, Math.ceil(raw.length / 4) * 4);
  return raw.padStart(targetLength, '0');
}

export function formatBitsWithSpacing(binaryStr: string, groupSize: number = 4): string {
  const parts: string[] = [];
  for (let i = 0; i < binaryStr.length; i += groupSize) {
    parts.push(binaryStr.slice(i, i + groupSize));
  }
  return parts.join(' ');
}

export function getPrintableRepresentation(str: string): {
  display: string;
  isWhitespaceOrControl: boolean;
  annotation?: string;
} {
  if (str === ' ') return { display: '␣', isWhitespaceOrControl: true, annotation: 'space' };
  if (str === '\n') return { display: '↵', isWhitespaceOrControl: true, annotation: 'newline' };
  if (str === '\t') return { display: '⇥', isWhitespaceOrControl: true, annotation: 'tab' };
  if (str === '\r') return { display: '␍', isWhitespaceOrControl: true, annotation: 'carriage return' };

  // Check if starts with a leading space (standard in BPE like " world")
  if (str.startsWith(' ') && str.length > 1) {
    return {
      display: '␣' + str.slice(1),
      isWhitespaceOrControl: true,
      annotation: 'leading space',
    };
  }

  return { display: str, isWhitespaceOrControl: false };
}

/**
 * Builds ByteDetail records linking individual bytes back to characters and nibbles.
 * Correctly accounts for multi-byte UTF-8 sequences (e.g. Emoji, Devanagari, accented chars).
 */
export function buildByteDetails(text: string, startingGlobalByteIndex: number): ByteDetail[] {
  const bytes = textToUtf8Bytes(text);
  const details: ByteDetail[] = [];

  // Map each character in the string to its UTF-8 bytes
  // We can step through code points to find character boundaries
  const chars = Array.from(text);
  let byteOffset = 0;

  for (let cIdx = 0; cIdx < chars.length; cIdx++) {
    const char = chars[cIdx];
    const charBytes = textEncoder.encode(char);

    for (let i = 0; i < charBytes.length; i++) {
      const b = charBytes[i];
      const binary = byteToBinary(b);
      const hex = byteToHex(b);
      const isPrintable = b >= 32 && b <= 126;

      details.push({
        byteIndex: byteOffset,
        globalByteIndex: startingGlobalByteIndex + byteOffset,
        byteValue: b,
        hex,
        binary,
        highNibbleHex: hex[0],
        lowNibbleHex: hex[1],
        highNibbleBinary: binary.slice(0, 4),
        lowNibbleBinary: binary.slice(4, 8),
        char: i === 0 ? char : `↳ ${char}[${i + 1}/${charBytes.length}]`,
        isPrintable,
        parentCharIndex: cIdx,
      });

      byteOffset++;
    }
  }

  return details;
}
