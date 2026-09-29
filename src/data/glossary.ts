export interface GlossaryItem {
  id: string;
  term: string;
  shortDef: string;
  detailed: string;
  category: 'LLM & Model' | 'Data & Encoding' | 'Algorithms';
}

export const GLOSSARY_TERMS: Record<string, GlossaryItem> = {
  token: {
    id: 'token',
    term: 'Token',
    category: 'LLM & Model',
    shortDef: 'The basic atomic unit of text that a language model reads and generates.',
    detailed:
      'A token can be a whole word, a subword fragment (like "ing" or "pre"), punctuation, or even single raw bytes. In typical English text, 1 token is approximately 4 characters or 0.75 words.',
  },
  tokenId: {
    id: 'tokenId',
    term: 'Token ID',
    category: 'LLM & Model',
    shortDef: 'A unique numerical integer index identifying a specific token in the vocabulary.',
    detailed:
      'For example, in OpenAI’s o200k_base tokenizer, the token "hello" maps to token ID 15339. The model never reads characters directly; it only receives arrays of integer Token IDs.',
  },
  vocabulary: {
    id: 'vocabulary',
    term: 'Vocabulary',
    category: 'LLM & Model',
    shortDef: 'The finite set of all recognized tokens and their assigned integer IDs.',
    detailed:
      'Vocabulary sizes range from 32,000 (Llama-1) to 100,000 (GPT-4) up to 200,000 (GPT-4o). A larger vocabulary allows longer phrases to be captured in a single token, reducing sequence length at the cost of larger embedding matrix memory.',
  },
  bpe: {
    id: 'bpe',
    term: 'Byte-Pair Encoding (BPE)',
    category: 'Algorithms',
    shortDef: 'An iterative subword tokenization algorithm that merges frequently co-occurring byte pairs.',
    detailed:
      'Beginning with individual raw UTF-8 bytes as base vocabulary, BPE repeatedly finds the most frequent adjacent pair of tokens across a training corpus and adds the merged pair as a new vocabulary entry.',
  },
  wordpiece: {
    id: 'wordpiece',
    term: 'WordPiece',
    category: 'Algorithms',
    shortDef: 'Subword segmentation algorithm used by BERT that greedily matches prefixes and marked suffixes.',
    detailed:
      'WordPiece splits words into stems and marked suffixes using "##" (e.g. "token" + "##ization"). Unlike BPE which maximizes raw frequency, WordPiece optimizes language model likelihood when adding merge candidates.',
  },
  utf8: {
    id: 'utf8',
    term: 'UTF-8',
    category: 'Data & Encoding',
    shortDef: 'A variable-length character encoding standard representing Unicode characters in 1 to 4 bytes.',
    detailed:
      'Standard ASCII characters (0–127) take exactly 1 byte. Accented European letters take 2 bytes, Devanagari and East Asian characters typically take 3 bytes, and emojis take 4 bytes.',
  },
  byte: {
    id: 'byte',
    term: 'Byte',
    category: 'Data & Encoding',
    shortDef: 'A basic digital storage unit composed of exactly 8 binary bits (values 0–255).',
    detailed:
      'Every character in computer memory is stored as one or more bytes. In hexadecimal notation, a byte is neatly expressed by two hex digits (00 through FF).',
  },
  bit: {
    id: 'bit',
    term: 'Bit',
    category: 'Data & Encoding',
    shortDef: 'The fundamental binary digit in computing, holding a value of either 0 or 1.',
    detailed:
      '8 bits comprise 1 byte. 4 bits are referred to as a "nibble", which corresponds directly to 1 hexadecimal digit.',
  },
  hexadecimal: {
    id: 'hexadecimal',
    term: 'Hexadecimal (Hex)',
    category: 'Data & Encoding',
    shortDef: 'Base-16 numeral system using digits 0–9 and letters A–F.',
    detailed:
      'Hex provides a human-readable shorthand for binary data. Exactly 4 binary bits map to 1 hex digit (e.g. 1010₂ = A₁₆, 1111₂ = F₁₆).',
  },
  binary: {
    id: 'binary',
    term: 'Binary',
    category: 'Data & Encoding',
    shortDef: 'Base-2 numeral system using only 0 and 1, representing digital hardware states.',
    detailed:
      'All computational data is stored in binary. In this tool, you can inspect the exact binary bitstream of individual characters and token IDs.',
  },
  embedding: {
    id: 'embedding',
    term: 'Embedding',
    category: 'LLM & Model',
    shortDef: 'A continuous high-dimensional vector representation of a token ID.',
    detailed:
      'The model uses the integer Token ID to look up an illustrative continuous vector (e.g. 4,096 dimensions) from its Embedding Matrix. This places words in a geometric semantic space.',
  },
  contextWindow: {
    id: 'contextWindow',
    term: 'Context Window',
    category: 'LLM & Model',
    shortDef: 'The maximum total count of tokens a model can accept and process in a single inference call.',
    detailed:
      'Modern LLM context windows range from 4,096 tokens (GPT-3) to 128,000 tokens (GPT-4o) and up to 1,000,000+ tokens (Gemini 1.5). Exceeding this limit results in truncation.',
  },
  transformer: {
    id: 'transformer',
    term: 'Transformer',
    category: 'LLM & Model',
    shortDef: 'The deep learning neural network architecture powering modern foundation models.',
    detailed:
      'Transformers process entire token sequences concurrently via Multi-Head Self-Attention layers, computing dynamic relationships between all tokens across the context window.',
  },
  compression: {
    id: 'compression',
    term: 'Compression',
    category: 'Algorithms',
    shortDef: 'Encoding information using fewer bits than the original uncompressed representation.',
    detailed:
      'While tokenization condenses character sequences into single subword IDs, general-purpose compression algorithms (like gzip or zstd) use sliding-window dictionaries to eliminate arbitrary repetition.',
  },
};
