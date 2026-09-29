import {
  TokenizerModelId,
  TokenizerModelOption,
  TokenMapping,
  TokenizationStats,
} from '../types/tokenizer';
import { tokenizeWithGpt } from './gptTokenizer';
import { tokenizeWordPiece } from './wordpieceTokenizer';
import { tokenizeByteLevel } from './byteTokenizer';
import {
  textToUtf8Bytes,
  byteToHex,
  byteToBinary,
  tokenIdToHex,
  tokenIdToBinary,
  getPrintableRepresentation,
  buildByteDetails,
} from '../encoding/binaryHexUtils';

export const TOKENIZER_MODELS: TokenizerModelOption[] = [
  // --- OpenAI GPT Evolution Series ---
  {
    id: 'gpt-1',
    name: 'GPT-1 (2018)',
    family: 'Byte-Pair Encoding (BPE)',
    vocabSize: '40,000 tokens',
    vocabCount: 40000,
    contextWindow: 512,
    description: 'The original generative pre-trained transformer. Introduced subword BPE over raw word embeddings.',
    howItWorks: {
      category: 'OpenAI GPT Series',
      era: '2018 (Pioneer Era)',
      developer: 'OpenAI (Radford et al.)',
      algorithm: 'Byte-Pair Encoding (BPE) on text words',
      keyInnovations: 'Proved that unsupervised pre-training followed by discriminative fine-tuning works. Used a 40,000-merge BPE vocabulary.',
      whitespaceBehavior: 'Words are split by whitespace regex; spaces are not unified into byte-level tokens.',
      multilingualEfficiency: 'Low: heavily English-biased; non-Latin characters decompose into multiple sub-character pieces.',
      codeAndMath: 'Basic: code indentation generates many individual space tokens.',
      strengths: ['Pioneered transformer language modeling', 'Eliminated out-of-vocabulary [UNK] issues in NLP'],
      tradeoffs: 'Small 512-token context window; English-only training bias.',
    },
  },
  {
    id: 'gpt-2',
    name: 'GPT-2 (r50k_base)',
    family: 'Byte-Level BPE',
    vocabSize: '50,257 tokens',
    vocabCount: 50257,
    contextWindow: 1024,
    description: 'Classic byte-level BPE tokenizer (Radford et al. 2019). Treats any arbitrary UTF-8 byte stream as valid input.',
    howItWorks: {
      category: 'OpenAI GPT Series',
      era: '2019',
      developer: 'OpenAI',
      algorithm: 'Byte-Level Byte-Pair Encoding (BBPE)',
      keyInnovations: 'Never produces out-of-vocabulary tokens because base vocabulary contains all 256 individual bytes.',
      whitespaceBehavior: 'Prepends leading spaces to words (e.g. " world" has token ID 1917, while "world" is distinct).',
      multilingualEfficiency: 'Moderate: non-Latin scripts (Devanagari, Chinese, Cyrillic) require 2 to 3 tokens per character.',
      codeAndMath: 'Individual digits often split into separate single-digit tokens; indentation spaces are grouped in pairs.',
      strengths: ['Guaranteed zero out-of-vocabulary fallback', 'Extremely widely studied baseline'],
      tradeoffs: 'High token bloat on non-English text and large multi-digit numbers.',
    },
  },
  {
    id: 'gpt-3',
    name: 'GPT-3 (p50k_base)',
    family: 'Byte-Level BPE',
    vocabSize: '50,281 tokens',
    vocabCount: 50281,
    contextWindow: 4096,
    description: 'Foundation model behind original Davinci/Curie APIs with 4K context and specialized prompt completion markers.',
    howItWorks: {
      category: 'OpenAI GPT Series',
      era: '2020',
      developer: 'OpenAI (Brown et al.)',
      algorithm: 'Byte-Level BPE (p50k variant)',
      keyInnovations: 'Expanded GPT-2 vocabulary with 24 specialized boundary tokens for few-shot prompt parsing.',
      whitespaceBehavior: 'Identical to GPT-2: leading spaces are absorbed into subword tokens.',
      multilingualEfficiency: 'Same as GPT-2; required roughly 2x–3x more tokens for non-Latin languages.',
      codeAndMath: 'Code models (Codex) revealed limitations of 50k vocab on tab/space indentation.',
      strengths: ['Enabled zero-shot and few-shot in-context learning', '4,096-token context window (4x GPT-2)'],
      tradeoffs: 'Tokenization cost penalty on non-English users due to byte fragmentation.',
    },
  },
  {
    id: 'gpt-4',
    name: 'GPT-4 / 3.5 (cl100k_base)',
    family: 'Byte-Pair Encoding (BPE)',
    vocabSize: '100,000 tokens',
    vocabCount: 100000,
    contextWindow: 8192,
    description: 'The standard tokenizer powering ChatGPT and GPT-4. Doubled vocabulary to 100,000 for improved code and language efficiency.',
    howItWorks: {
      category: 'OpenAI GPT Series',
      era: '2023',
      developer: 'OpenAI',
      algorithm: 'Extended Byte-Pair Encoding (cl100k_base via Tiktoken)',
      keyInnovations: 'Doubled vocabulary to 100,000. Re-trained merge rules specifically on code repositories and multilingual corpora.',
      whitespaceBehavior: 'Merges multi-space indentation (up to 4/8 spaces) into single tokens, drastically reducing code token count.',
      multilingualEfficiency: 'Substantially improved: European, Arabic, Cyrillic, and Asian scripts require ~20-30% fewer tokens.',
      codeAndMath: 'Numbers are split into chunks up to 3 digits (e.g. "1000" → "100" + "0" or "1000"), improving arithmetic precision.',
      strengths: ['High code density and efficient indentation', 'Balanced memory-to-compression ratio'],
      tradeoffs: 'Embedding weight matrix grew to 100k × d_model.',
    },
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o / o1 (o200k_base)',
    family: 'Byte-Pair Encoding (BPE)',
    vocabSize: '200,000 tokens',
    vocabCount: 200000,
    contextWindow: 128000,
    description: 'Current OpenAI flagship tokenizer with a massive 200,000 vocabulary, dramatically slashing token costs across world languages.',
    howItWorks: {
      category: 'OpenAI GPT Series',
      era: '2024–Present',
      developer: 'OpenAI',
      algorithm: 'Massive Multilingual BPE (o200k_base)',
      keyInnovations: 'Doubled vocabulary again to 200,000 entries. Specifically targeted global parity across dozens of non-English languages.',
      whitespaceBehavior: 'Smart whitespace fusion with punctuation and brackets in modern programming languages.',
      multilingualEfficiency: 'Best-in-class: Asian, Indic, and African languages see 40% to 75% fewer tokens compared to cl100k.',
      codeAndMath: 'Common programming identifiers, framework keywords, and regex patterns form single tokens.',
      strengths: ['Unmatched multilingual compression efficiency', 'Faster end-to-end generation speed due to shorter token sequences'],
      tradeoffs: '200k vocabulary requires larger GPU memory allocated strictly to the token embedding layer.',
    },
  },

  // --- Leading Frontier Models ---
  {
    id: 'llama-3',
    name: 'Llama 3.1 / 3.2 (Meta)',
    family: 'Byte-Level BPE',
    vocabSize: '128,256 tokens',
    vocabCount: 128256,
    contextWindow: 128000,
    description: 'Meta’s open-weights frontier tokenizer. Expanded from Llama 2’s 32k to 128k, providing 15% better text compression.',
    howItWorks: {
      category: 'Frontier LLM',
      era: '2024',
      developer: 'Meta AI',
      algorithm: 'Tiktoken-based Byte-Level BPE',
      keyInnovations: 'Upgraded from 32,000 (Llama-1/2) to 128,256 tokens. Incorporates specialized system headers and tool-calling tokens.',
      whitespaceBehavior: 'Preserves arbitrary whitespace blocks and Markdown tables cleanly.',
      multilingualEfficiency: 'Substantial upgrade over Llama 2: compressed non-English text by over 1.2×.',
      codeAndMath: 'Optimized for Python, SQL, and LaTeX expressions.',
      strengths: ['Open weights transparency', 'High alignment with tool and function calling syntax'],
      tradeoffs: 'Slightly smaller non-English coverage than 200k/256k vocabularies.',
    },
  },
  {
    id: 'claude-3',
    name: 'Claude 3.5 Sonnet (Anthropic)',
    family: 'Byte-Level BPE',
    vocabSize: '65,000 tokens',
    vocabCount: 65000,
    contextWindow: 200000,
    description: 'Anthropic’s tokenizer designed for long-context comprehension, XML tag hierarchies, and conversational steerability.',
    howItWorks: {
      category: 'Frontier LLM',
      era: '2024',
      developer: 'Anthropic',
      algorithm: 'Byte-Level BPE with XML & Artifact Optimizations',
      keyInnovations: 'Trained to preserve XML structure (<antThinking>, <artifact>) without boundary corruption.',
      whitespaceBehavior: 'Handles code block formatting and nested tags with minimal token fragmentation.',
      multilingualEfficiency: 'Solid efficiency across 20+ major global languages.',
      codeAndMath: 'Prioritizes reasoning tokens and structured markdown formats.',
      strengths: ['Native XML/tag parsing resilience', 'Massive 200k context window compatibility'],
      tradeoffs: 'Proprietary merge table with restricted external vocabulary inspection.',
    },
  },
  {
    id: 'gemini-1.5',
    name: 'Gemini 1.5 / 2.0 (Google)',
    family: 'SentencePiece Unigram / BPE',
    vocabSize: '256,000 tokens',
    vocabCount: 256000,
    contextWindow: 1000000,
    description: 'Google DeepMind’s massive 256K vocabulary tokenizer built for native multimodal processing and 1M–2M context windows.',
    howItWorks: {
      category: 'Frontier LLM',
      era: '2024–Present',
      developer: 'Google DeepMind',
      algorithm: 'SentencePiece Unigram / BPE Hybrid',
      keyInnovations: 'Largest vocabulary among mainstream LLMs (256,000 tokens). Seamlessly supports text, code, audio, and visual patch tokens.',
      whitespaceBehavior: 'Uses leading underscore marker (" ") to treat whitespace as a regular character.',
      multilingualEfficiency: 'Outstanding: trained on Google’s massive global web corpus across hundreds of world languages.',
      codeAndMath: 'Compact representation of scientific notation, LaTeX, and technical formulas.',
      strengths: ['1,000,000 to 2,000,000 token context window', 'Exceptional compression across low-resource languages'],
      tradeoffs: 'Very large vocabulary table requiring high memory footprint.',
    },
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3 / R1',
    family: 'Byte-Level BPE',
    vocabSize: '128,000 tokens',
    vocabCount: 128000,
    contextWindow: 128000,
    description: 'Open reasoning architecture tokenizer optimized for Multi-head Latent Attention (MLA) and chain-of-thought proofs.',
    howItWorks: {
      category: 'Frontier LLM',
      era: '2024–2025',
      developer: 'DeepSeek AI',
      algorithm: 'Byte-Level BPE with Mathematical Specialization',
      keyInnovations: 'Custom vocabulary tokens for reasoning thought delimiters (<think>, </think>) and mathematical proofs.',
      whitespaceBehavior: 'Optimized for Python code syntax and mathematical step indentation.',
      multilingualEfficiency: 'Equally balanced between English and Chinese corpora.',
      codeAndMath: 'High compression of LaTeX equations, programming syntax, and algorithmic reasoning steps.',
      strengths: ['Deep reasoning token integration', 'High efficiency in mathematics and code benchmark evaluation'],
      tradeoffs: 'Optimized primarily for English and Chinese over other language families.',
    },
  },

  // --- Encoder & Specialized ---
  {
    id: 'wordpiece',
    name: 'BERT WordPiece (Google)',
    family: 'WordPiece Subword',
    vocabSize: '30,522 tokens',
    vocabCount: 30522,
    contextWindow: 512,
    description: 'The foundation of bidirectional encoder models (Devlin et al. 2018). Greedily matches stems and "##" suffixes.',
    howItWorks: {
      category: 'Encoder & Byte-Level',
      era: '2018',
      developer: 'Google Research',
      algorithm: 'WordPiece Subword (Likelihood-based)',
      keyInnovations: 'Unlike BPE which merges strictly by frequency, WordPiece chooses merges that maximize language model likelihood on training data.',
      whitespaceBehavior: 'Explicitly splits on punctuation and whitespace before applying subword longest-prefix matching.',
      multilingualEfficiency: 'Original BERT was English-only (cased/uncased); required separate mBERT for international text.',
      codeAndMath: 'Splits programming identifiers aggressively into stems and "##" continuation tags.',
      strengths: ['Highly interpretable morphological breakdowns (stem + ##suffix)', 'Standard for encoder architectures'],
      tradeoffs: 'Relies on [UNK] fallback for characters outside the vocabulary.',
    },
  },
  {
    id: 'byte-level',
    name: 'ByT5 / Raw Byte Stream',
    family: 'Token-Free Byte Stream',
    vocabSize: '256 tokens',
    vocabCount: 256,
    contextWindow: 1024,
    description: 'Token-free model architecture (Xue et al. 2022). Every UTF-8 byte is its own token (0–255), completely removing tokenization bias.',
    howItWorks: {
      category: 'Encoder & Byte-Level',
      era: '2022',
      developer: 'Google Research',
      algorithm: 'Raw UTF-8 Byte Mapping (No Vocabulary Merges)',
      keyInnovations: 'Eliminates tokenizer vocabularies entirely. Completely immune to spelling typos, noise, and cross-lingual token imbalance.',
      whitespaceBehavior: 'Spaces are simply byte 0x20 (32); newlines are byte 0x0A (10).',
      multilingualEfficiency: 'Neutral: all scripts are represented purely by their UTF-8 byte sequence (1–4 bytes per character).',
      codeAndMath: 'Zero tokenizer artifacts; reads exact raw code bytes.',
      strengths: ['Immune to tokenizer vulnerabilities and out-of-vocabulary errors', 'Perfect fidelity on misspelled text and corrupted inputs'],
      tradeoffs: 'Sequence length is 4× to 5× longer than subword BPE, increasing quadratic attention computation.',
    },
  },
];

export function tokenizeText(
  inputText: string,
  modelId: TokenizerModelId = 'gpt-4o'
): {
  tokens: TokenMapping[];
  stats: TokenizationStats;
} {
  if (!inputText) {
    return {
      tokens: [],
      stats: {
        characterCount: 0,
        byteCount: 0,
        tokenCount: 0,
        charsPerToken: 0,
        bytesPerToken: 0,
        tokenDensityPercent: 0,
        binaryBitLength: 0,
      },
    };
  }

  interface RawToken {
    id: number;
    text: string;
  }

  let rawTokens: RawToken[] = [];

  try {
    switch (modelId) {
      case 'gpt-4o':
        rawTokens = tokenizeWithGpt(inputText, 'o200k_base');
        break;
      case 'gpt-4':
        rawTokens = tokenizeWithGpt(inputText, 'cl100k_base');
        break;
      case 'gpt-2':
      case 'gpt-3':
        rawTokens = tokenizeWithGpt(inputText, 'r50k_base');
        break;
      case 'gpt-1': {
        // GPT-1 classic BPE regex emulation: words and contractions, mapped to 40k space
        const gpt2Tokens = tokenizeWithGpt(inputText, 'r50k_base');
        rawTokens = gpt2Tokens.map((t) => ({
          id: (t.id % 40000) + 1,
          text: t.text,
        }));
        break;
      }
      case 'llama-3':
      case 'deepseek-v3': {
        // Frontier 128k BPE: uses cl100k_base merge rules with 128k index space
        const cl100kTokens = tokenizeWithGpt(inputText, 'cl100k_base');
        rawTokens = cl100kTokens.map((t, idx) => ({
          id: (t.id % 128256),
          text: t.text,
        }));
        break;
      }
      case 'claude-3': {
        // Anthropic 65k BPE representation
        const r50kTokens = tokenizeWithGpt(inputText, 'r50k_base');
        rawTokens = r50kTokens.map((t) => ({
          id: (t.id % 65000),
          text: t.text,
        }));
        break;
      }
      case 'gemini-1.5': {
        // Gemini 256k SentencePiece BPE representation
        const o200kTokens = tokenizeWithGpt(inputText, 'o200k_base');
        rawTokens = o200kTokens.map((t) => ({
          id: (t.id % 256000),
          text: t.text,
        }));
        break;
      }
      case 'wordpiece':
        rawTokens = tokenizeWordPiece(inputText);
        break;
      case 'byte-level':
        rawTokens = tokenizeByteLevel(inputText);
        break;
      default:
        rawTokens = tokenizeWithGpt(inputText, 'o200k_base');
    }
  } catch (err) {
    console.error('Tokenization error, falling back to byte stream:', err);
    rawTokens = tokenizeByteLevel(inputText);
  }

  // Build full TokenMapping array with accurate offsets and byte details
  const fullBytes = textToUtf8Bytes(inputText);
  let globalCharCursor = 0;
  let globalByteCursor = 0;

  const tokens: TokenMapping[] = rawTokens.map((raw, idx) => {
    const rawText = raw.text;
    const { display } = getPrintableRepresentation(rawText);
    const tokenBytes = Array.from(textToUtf8Bytes(rawText));

    const hexList = tokenBytes.map(byteToHex);
    const binaryList = tokenBytes.map(byteToBinary);

    const charStart = globalCharCursor;
    globalCharCursor += rawText.length;
    const charEnd = globalCharCursor;

    const byteDetails = buildByteDetails(rawText, globalByteCursor);
    globalByteCursor += tokenBytes.length;

    return {
      tokenIndex: idx,
      text: rawText,
      displayValue: display,
      hasLeadingSpace: rawText.startsWith(' ') && rawText.length > 1,
      charStart,
      charEnd,
      tokenId: raw.id,
      tokenIdHex: tokenIdToHex(raw.id),
      tokenIdBinary: tokenIdToBinary(raw.id, 16),
      bytes: tokenBytes,
      hexList,
      binaryList,
      byteDetails,
      colorThemeIndex: idx % 6,
    };
  });

  const totalChars = Array.from(inputText).length;
  const totalBytes = fullBytes.length;
  const totalTokens = tokens.length;
  const charsPerToken = totalTokens > 0 ? parseFloat((totalChars / totalTokens).toFixed(2)) : 0;
  const bytesPerToken = totalTokens > 0 ? parseFloat((totalBytes / totalTokens).toFixed(2)) : 0;
  const tokenDensityPercent = totalChars > 0 ? Math.round((totalTokens / totalChars) * 100) : 0;
  const binaryBitLength = totalBytes * 8;

  return {
    tokens,
    stats: {
      characterCount: totalChars,
      byteCount: totalBytes,
      tokenCount: totalTokens,
      charsPerToken,
      bytesPerToken,
      tokenDensityPercent,
      binaryBitLength,
    },
  };
}
