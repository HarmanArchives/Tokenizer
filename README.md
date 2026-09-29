# TokenLab

An interactive laboratory for LLM tokenization and encoding. Paste text, pick a
tokenizer, and watch the same input move through every stage of the pipeline:
characters become tokens, tokens become ids, and ids become UTF-8 bytes,
hexadecimal and binary.

Everything runs in the browser. There is no backend and no API key is required.

<!-- prettier-ignore -->
| | |
| --- | --- |
| **Stack** | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| **Visualization** | D3 7, Motion, lucide-react |
| **Tokenization** | gpt-tokenizer (r50k, cl100k, o200k) plus local WordPiece and byte-level engines |
| **License** | See repository metadata |

## Features

- **Synchronized terminals** — the same token stream shown three ways, as
  source text, as token ids and as raw bytes, with cross-panel hover and lock
- **Byte-level inspector** — per-character hex, binary and high/low nibble
  breakdown for any selected token
- **Eleven tokenizers** — from GPT-1 through o200k, plus Llama 3, Claude 3.5,
  Gemini, DeepSeek, BERT WordPiece and a token-free raw byte stream
- **Cross-model comparison** — a matrix and a D3 chart showing what the same
  text costs in tokens under every tokenizer
- **Compression lab** — dictionary substitution analysis showing tokenization
  as a compression scheme, including dictionary overhead
- **Context window budget** — how much of a model's window the current input
  consumes, plus characters-per-token efficiency
- **Export** — the current analysis as JSON or CSV
- **Glossary** — in-app reference for the terminology used throughout

## Quick start

**Prerequisites:** Node.js (npm or bun)

```bash
npm install
npm run dev
```

The dev server runs on port 3000 and binds to all interfaces, so it is reachable
from other devices on your network.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `dist/` and `server.js` |

## How it works

Type any text into the input area and pick a tokenizer. TokenLab re-tokenizes
synchronously on every keystroke and renders the result across every section.

1. **Text** — the raw input string, with each token highlighted in place so you
   can see exactly which characters a token claimed.
2. **Tokens** — each token with its id, in both decimal and hexadecimal.
3. **Bytes** — the UTF-8 encoding of the input, byte by byte, in hex and binary.

Hover a token anywhere to highlight the same range in all three views. Click to
lock a token so it stays selected while you inspect its individual bytes.

For proprietary vocabularies whose merge tables are not public, token IDs are
approximated by remapping a public encoding into the target ID range. Token
boundaries are exact for the public encodings (r50k, cl100k, o200k) and for the
WordPiece and byte-level engines.

## Tokenizers compared

| Model | Family | Vocabulary | Context |
| --- | --- | --- | --- |
| GPT-1 (2018) | BPE | 40,000 | 512 |
| GPT-2 (r50k_base) | Byte-level BPE | 50,257 | 1,024 |
| GPT-3 (p50k_base) | Byte-level BPE | 50,281 | 4,096 |
| GPT-4 / 3.5 (cl100k_base) | BPE | 100,000 | 8,192 |
| GPT-4o / o1 (o200k_base) | BPE | 200,000 | 128,000 |
| Llama 3.1 / 3.2 | Byte-level BPE | 128,256 | 128,000 |
| Claude 3.5 Sonnet | Byte-level BPE | ~65,000 | 200,000 |
| Gemini 1.5 / 2.0 | SentencePiece | 256,000 | 1,000,000 |
| DeepSeek-V3 / R1 | Byte-level BPE | 128,000 | 128,000 |
| BERT WordPiece | WordPiece subword | 30,522 | 512 |
| ByT5 / raw byte stream | Token-free bytes | 256 | 1,024 |

## Project structure

```
src/
  encoding/     UTF-8, hex and binary conversion helpers
  tokenizer/    Byte-level, BPE and WordPiece engines plus the model catalog
  compression/  Dictionary compression analysis
  data/         Glossary reference content
  components/   UI sections and dialogs
  types/        Shared TypeScript contracts
  App.tsx       Application shell and section state
  main.tsx      Entry point
  index.css     Tailwind theme and base styles
```

The layering runs bottom-up: `types` defines the contracts, `encoding` converts
text to bytes, the `tokenizer` engines produce raw token pairs, and
`tokenizer/index.ts` enriches them into the `TokenMapping` records and aggregate
statistics the UI consumes. `tokenizeText` is the single entry point every
section calls.

## Design

Restrained, technical and documentation-like: a near-white background, neutral
greys, and colour reserved for token differentiation and state. Two typefaces —
Plus Jakarta Sans for UI, JetBrains Mono for anything numeric, hex or binary —
so values stay legible in dense grids. Layout is built on Tailwind utilities
with D3 reserved for the efficiency chart.
