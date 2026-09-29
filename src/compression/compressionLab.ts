export interface CompressionPreset {
  id: string;
  name: string;
  category: string;
  text: string;
  description: string;
}

export interface DictionaryEntry {
  symbol: string; // e.g. "§A", "§B"
  pattern: string;
  occurrences: number;
  length: number;
  savings: number; // approximate byte savings
  color: string;
}

export interface CompressionAnalysis {
  originalText: string;
  originalBytes: number;
  dictionary: DictionaryEntry[];
  compressedText: string;
  compressedStreamTokens: Array<{
    type: 'literal' | 'reference';
    value: string;
    symbol?: string;
  }>;
  dictionaryBytes: number;
  compressedBytes: number;
  totalSavedBytes: number;
  savingsPercentage: number;
  highlightedPatternSegments: Array<{
    text: string;
    matchedSymbol?: string;
  }>;
}

export const COMPRESSION_PRESETS: CompressionPreset[] = [
  {
    id: 'rhyme-cat',
    name: 'Repeated Prose (The Cat)',
    category: 'Prose',
    text: `the cat is on the table\nthe cat is on the chair\nthe cat is on the floor`,
    description: 'Classic linguistic repetition demonstrating shared phrases across lines.',
  },
  {
    id: 'server-logs',
    name: 'Structured Web Logs',
    category: 'Telemetry',
    text: `2026-09-29 [INFO] status=200 path=/api/v1/tokens latency=12ms\n2026-09-29 [INFO] status=200 path=/api/v1/health latency=4ms\n2026-09-29 [INFO] status=200 path=/api/v1/tokens latency=15ms`,
    description: 'High repetitive structure common in logs, JSON responses, and API streams.',
  },
  {
    id: 'code-boilerplate',
    name: 'Code Boilerplate',
    category: 'Code',
    text: `export function handleEvent(event: CustomEvent) {\n  if (!event) return;\n  console.log("Processing:", event.type);\n}\nexport function handleAction(action: CustomEvent) {\n  if (!action) return;\n  console.log("Processing:", action.type);\n}`,
    description: 'Repeated keywords, types, and logic structures in programming languages.',
  },
  {
    id: 'dna-motifs',
    name: 'Genomic Motifs',
    category: 'Biology',
    text: `ATGCGATCGATCGATCGATCGATCGATCGAACGTGATCGATCGATCGACTGA`,
    description: 'Repeated nucleotide sequences where dictionary patterns compress long sequences.',
  },
];

const SYMBOLS = ['§A', '§B', '§C', '§D', '§E', '§F', '§G', '§H'];
const SYMBOL_COLORS = [
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-blue-100 text-blue-900 border-blue-300',
  'bg-emerald-100 text-emerald-900 border-emerald-300',
  'bg-purple-100 text-purple-900 border-purple-300',
  'bg-rose-100 text-rose-900 border-rose-300',
  'bg-cyan-100 text-cyan-900 border-cyan-300',
  'bg-indigo-100 text-indigo-900 border-indigo-300',
  'bg-orange-100 text-orange-900 border-orange-300',
];

/**
 * Conceptual Lempel-Ziv / BPE-style dictionary compressor.
 * Finds repeating n-grams that yield positive compression savings.
 */
export function analyzeCompression(text: string): CompressionAnalysis {
  const encoder = new TextEncoder();
  const originalBytes = encoder.encode(text).length;

  if (!text || text.length < 10) {
    return {
      originalText: text,
      originalBytes,
      dictionary: [],
      compressedText: text,
      compressedStreamTokens: [{ type: 'literal', value: text }],
      dictionaryBytes: 0,
      compressedBytes: originalBytes,
      totalSavedBytes: 0,
      savingsPercentage: 0,
      highlightedPatternSegments: [{ text }],
    };
  }

  // Find candidate repeating substrings (length >= 3, occurring >= 2 times)
  const candidateCounts = new Map<string, number>();
  const minLen = 3;
  const maxLen = Math.min(30, Math.floor(text.length / 2));

  for (let len = maxLen; len >= minLen; len--) {
    for (let i = 0; i <= text.length - len; i++) {
      const sub = text.slice(i, i + len);
      // Skip pure newlines or pure spaces
      if (/^\s+$/.test(sub)) continue;

      let count = 0;
      let pos = 0;
      while ((pos = text.indexOf(sub, pos)) !== -1) {
        count++;
        pos += sub.length; // non-overlapping count
      }

      if (count >= 2) {
        const existing = candidateCounts.get(sub) || 0;
        if (count > existing) {
          candidateCounts.set(sub, count);
        }
      }
    }
  }

  // Rank patterns by theoretical net byte savings: (count * (len - 1)) - (len + 2)
  const candidates: Array<{ pattern: string; count: number; savings: number }> = [];

  candidateCounts.forEach((count, pattern) => {
    const rawLen = encoder.encode(pattern).length;
    // Each reference replaces rawLen bytes with 1 byte reference symbol
    // Overhead to define the dictionary entry is ~ rawLen + 2 bytes
    const saved = count * (rawLen - 1) - (rawLen + 2);
    if (saved > 0) {
      candidates.push({ pattern, count, savings: saved });
    }
  });

  // Sort descending by net savings
  candidates.sort((a, b) => b.savings - a.savings);

  // Greedily pick up to 5 non-subsumed dictionary entries
  const chosen: DictionaryEntry[] = [];
  let availableSymbols = [...SYMBOLS];
  let colorIdx = 0;

  for (const cand of candidates) {
    if (chosen.length >= 4) break;
    // Avoid picking identical or heavily nested patterns if already covered
    const alreadySubsumed = chosen.some(
      (c) => c.pattern.includes(cand.pattern) && c.occurrences === cand.count
    );
    if (!alreadySubsumed) {
      const sym = availableSymbols.shift() || `§${chosen.length + 1}`;
      chosen.push({
        symbol: sym,
        pattern: cand.pattern,
        occurrences: cand.count,
        length: cand.pattern.length,
        savings: cand.savings,
        color: SYMBOL_COLORS[colorIdx % SYMBOL_COLORS.length],
      });
      colorIdx++;
    }
  }

  // Build substituted compressed stream
  // Perform replacement in text
  let substituted = text;
  for (const entry of chosen) {
    // Replace all occurrences
    substituted = substituted.split(entry.pattern).join(`[${entry.symbol}]`);
  }

  // Build compressed stream tokens for rich rendering
  const streamTokens: Array<{ type: 'literal' | 'reference'; value: string; symbol?: string }> = [];
  const parts = substituted.split(/(\[§[A-H]\])/g);

  for (const part of parts) {
    if (!part) continue;
    const match = part.match(/^\[(§[A-H])\]$/);
    if (match) {
      streamTokens.push({
        type: 'reference',
        value: match[1],
        symbol: match[1],
      });
    } else {
      streamTokens.push({
        type: 'literal',
        value: part,
      });
    }
  }

  // Calculate realistic byte storage
  // 1. Dictionary storage: For each entry: Symbol (1 byte) + Length (1 byte) + Pattern (N bytes)
  const dictionaryBytes = chosen.reduce((acc, curr) => acc + 2 + encoder.encode(curr.pattern).length, 0);
  // 2. Encoded stream: Literals (UTF-8 bytes) + References (1 byte each for dictionary index)
  let streamBytes = 0;
  for (const t of streamTokens) {
    if (t.type === 'reference') {
      streamBytes += 1;
    } else {
      streamBytes += encoder.encode(t.value).length;
    }
  }

  const compressedBytes = dictionaryBytes + streamBytes;
  const totalSavedBytes = Math.max(0, originalBytes - compressedBytes);
  const savingsPercentage =
    originalBytes > 0 ? parseFloat(((totalSavedBytes / originalBytes) * 100).toFixed(1)) : 0;

  // Build highlighted segments for original text view
  const highlightedSegments: Array<{ text: string; matchedSymbol?: string }> = [];
  // Quick tokenization of original text with pattern marks
  let remaining = text;
  while (remaining.length > 0) {
    let bestMatch: { entry: DictionaryEntry; index: number } | null = null;
    for (const entry of chosen) {
      const idx = remaining.indexOf(entry.pattern);
      if (idx !== -1 && (bestMatch === null || idx < bestMatch.index)) {
        bestMatch = { entry, index: idx };
      }
    }

    if (bestMatch && bestMatch.index === 0) {
      highlightedSegments.push({
        text: bestMatch.entry.pattern,
        matchedSymbol: bestMatch.entry.symbol,
      });
      remaining = remaining.slice(bestMatch.entry.pattern.length);
    } else if (bestMatch && bestMatch.index > 0) {
      highlightedSegments.push({
        text: remaining.slice(0, bestMatch.index),
      });
      remaining = remaining.slice(bestMatch.index);
    } else {
      highlightedSegments.push({ text: remaining });
      remaining = '';
    }
  }

  return {
    originalText: text,
    originalBytes,
    dictionary: chosen,
    compressedText: substituted,
    compressedStreamTokens: streamTokens,
    dictionaryBytes,
    compressedBytes,
    totalSavedBytes,
    savingsPercentage,
    highlightedPatternSegments: highlightedSegments,
  };
}
