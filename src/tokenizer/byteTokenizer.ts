import { textToUtf8Bytes } from '../encoding/binaryHexUtils';

export interface ByteToken {
  id: number;
  text: string;
}

/**
 * Tokenizes text strictly as individual UTF-8 bytes (0-255).
 * Highlights how models like ByT5 or raw byte tokenizers operate without a precomputed BPE dictionary.
 */
export function tokenizeByteLevel(text: string): ByteToken[] {
  if (!text) return [];

  const bytes = textToUtf8Bytes(text);
  const tokens: ByteToken[] = [];
  const decoder = new TextDecoder('utf-8', { fatal: false });

  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    // Decoded display representation
    const charDisplay = decoder.decode(new Uint8Array([b])) || `\\x${b.toString(16).toUpperCase()}`;

    tokens.push({
      id: b,
      text: charDisplay,
    });
  }

  return tokens;
}
