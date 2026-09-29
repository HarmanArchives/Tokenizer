export type TokenizerModelId =
  | 'gpt-1'       // Radford et al. 2018 (40k BPE)
  | 'gpt-2'       // r50k_base (50,257 vocab)
  | 'gpt-3'       // Davinci / p50k (50,281 vocab)
  | 'gpt-4'       // cl100k_base (100,000 vocab)
  | 'gpt-4o'      // o200k_base (200,000 vocab)
  | 'claude-3'    // Anthropic BPE (~65k vocab)
  | 'llama-3'     // Meta Llama 3.1/3.2 (128,256 vocab)
  | 'gemini-1.5'  // Google DeepMind (256,000 vocab)
  | 'deepseek-v3' // DeepSeek BPE (128,000 vocab)
  | 'wordpiece'   // BERT-style subword (30,522 vocab)
  | 'byte-level'; // ByT5 / UTF-8 byte stream (256 vocab)

export interface ModelHowItWorks {
  algorithm: string;
  category: 'OpenAI GPT Series' | 'Frontier LLM' | 'Encoder & Byte-Level';
  era: string;
  developer: string;
  keyInnovations: string;
  whitespaceBehavior: string;
  multilingualEfficiency: string;
  codeAndMath: string;
  strengths: string[];
  tradeoffs: string;
}

export interface TokenizerModelOption {
  id: TokenizerModelId;
  name: string;
  family: string;
  vocabSize: string;
  vocabCount: number;
  description: string;
  contextWindow: number;
  howItWorks: ModelHowItWorks;
}

export interface ByteDetail {
  byteIndex: number;
  globalByteIndex: number;
  byteValue: number;
  hex: string;
  binary: string; // 8-bit string e.g. "01101000"
  highNibbleHex: string;
  lowNibbleHex: string;
  highNibbleBinary: string;
  lowNibbleBinary: string;
  char: string;
  isPrintable: boolean;
  parentCharIndex?: number;
}

export interface TokenMapping {
  tokenIndex: number;
  text: string;
  displayValue: string; // Printable representation (e.g. '•' for spaces, '\n' for returns)
  hasLeadingSpace: boolean;
  charStart: number;
  charEnd: number;
  tokenId: number;
  tokenIdHex: string;     // e.g. "0x3BEB"
  tokenIdBinary: string;  // e.g. "0011101111101011"
  bytes: number[];
  hexList: string[];
  binaryList: string[];
  byteDetails: ByteDetail[];
  colorThemeIndex: number; // for visual differentiation
}

export interface InteractionState {
  hoveredTokenIndex: number | null;
  lockedTokenIndex: number | null;
  hoveredByteGlobalIndex: number | null;
  hoveredBitIndex: number | null; // 0..7
  sourcePanel: 'text' | 'token' | 'binary' | 'inspector' | null;
}

export interface TokenizationStats {
  characterCount: number;
  byteCount: number;
  tokenCount: number;
  charsPerToken: number;
  bytesPerToken: number;
  tokenDensityPercent: number; // compression relative to chars
  binaryBitLength: number;
}
