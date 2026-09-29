/**
 * Educational WordPiece Tokenizer (BERT-style subword matching).
 * Implements standard greedy longest-prefix matching with '##' subword continuation prefixes.
 */

export interface WordPieceToken {
  id: number;
  text: string;
}

// Curated vocabulary covering common prefixes, roots, suffixes, code keywords, and ASCII characters
const WORDPIECE_VOCAB: Record<string, number> = {
  '[PAD]': 0,
  '[UNK]': 1,
  '[CLS]': 2,
  '[SEP]': 3,
  '[MASK]': 4,
  'hello': 7592,
  'world': 2088,
  'the': 1996,
  'quick': 4248,
  'brown': 2829,
  'fox': 4419,
  'jumps': 14523,
  'over': 2058,
  'lazy': 13971,
  'dog': 3899,
  'machine': 3698,
  'learning': 4083,
  'deep': 2784,
  'neural': 15756,
  'network': 2897,
  'token': 19204,
  '##ization': 3989,
  'un': 4895,
  'believable': 15422,
  '##believable': 15423,
  'java': 8950,
  '##script': 11740,
  'script': 5698,
  'is': 2003,
  'interesting': 5874,
  'interactive': 11425,
  'transformer': 10938,
  'attention': 3086,
  'vector': 8493,
  'embed': 20498,
  '##ding': 4638,
  'model': 2944,
  'input': 7953,
  'output': 8694,
  'binary': 14605,
  'hex': 25890,
  'data': 2951,
  'byte': 23412,
  'bytes': 14041,
  'bit': 4106,
  'bits': 7001,
  'computer': 3274,
  'science': 2671,
  'art': 2396,
  'code': 3642,
  'function': 3853,
  'return': 2709,
  'const': 18742,
  'true': 2995,
  'false': 6270,
};

// Add single ASCII characters 32..126 to guarantee character fallback
let charIdCounter = 100;
for (let c = 32; c <= 126; c++) {
  const char = String.fromCharCode(c);
  if (!(char in WORDPIECE_VOCAB)) {
    WORDPIECE_VOCAB[char] = charIdCounter++;
  }
}

// Add common subword continuations '##a' .. '##z'
for (let c = 97; c <= 122; c++) {
  const sub = '##' + String.fromCharCode(c);
  if (!(sub in WORDPIECE_VOCAB)) {
    WORDPIECE_VOCAB[sub] = charIdCounter++;
  }
}

export function tokenizeWordPiece(text: string): WordPieceToken[] {
  if (!text) return [];

  const tokens: WordPieceToken[] = [];
  // Split on whitespace while keeping delimiters or splitting words and symbols
  const words = text.match(/\w+|[^\w\s]|\s+/g) || [text];

  for (const rawSegment of words) {
    // If it's pure whitespace
    if (/^\s+$/.test(rawSegment)) {
      tokens.push({
        id: WORDPIECE_VOCAB[' '] ?? 100,
        text: rawSegment,
      });
      continue;
    }

    // WordPiece greedy matching on lowercased or exact tokens
    const segment = rawSegment;
    const lower = segment.toLowerCase();
    let isBad = false;
    let start = 0;
    const subTokens: WordPieceToken[] = [];

    while (start < segment.length) {
      let end = segment.length;
      let curSubStr: string | null = null;
      let curId: number | null = null;

      while (start < end) {
        let substr = segment.slice(start, end);
        if (start > 0) {
          substr = '##' + substr;
        }

        const lowerSubstr = substr.toLowerCase();
        if (substr in WORDPIECE_VOCAB) {
          curSubStr = substr;
          curId = WORDPIECE_VOCAB[substr];
          break;
        } else if (lowerSubstr in WORDPIECE_VOCAB) {
          curSubStr = substr;
          curId = WORDPIECE_VOCAB[lowerSubstr];
          break;
        }
        end--;
      }

      if (curSubStr === null || curId === null) {
        // Fallback to character or [UNK]
        const singleChar = segment[start];
        const singleCharId = WORDPIECE_VOCAB[singleChar] ?? WORDPIECE_VOCAB['[UNK]'] ?? 1;
        subTokens.push({
          id: singleCharId,
          text: singleChar,
        });
        start++;
      } else {
        subTokens.push({
          id: curId,
          text: curSubStr,
        });
        start = end;
      }
    }

    tokens.push(...subTokens);
  }

  return tokens;
}
