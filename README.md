# TokenLab

An interactive laboratory for LLM tokenization and encoding. Paste text, pick a
tokenizer, and watch the same input move through every stage of the pipeline:
characters become tokens, tokens become ids, and ids become UTF-8 bytes,
hexadecimal and binary.

## Features

- Synchronized terminals showing the input as text, as token ids and as raw
  bytes, with cross-panel hover and lock
- Byte-level inspector with high and low nibble breakdowns per character
- Eleven tokenizers, from GPT-1 through o200k, plus BERT WordPiece and a
  token-free raw byte stream
- Cross-model comparison matrix and D3 chart of token cost for the same text
- Dictionary compression lab showing tokenization as a compression scheme
- Context window consumption and characters-per-token efficiency metrics
- JSON and CSV export of the current analysis, plus an in-app glossary

## Tech stack

React 19, TypeScript, Vite 8, Tailwind CSS 4, D3, and gpt-tokenizer. Everything
runs in the browser; there is no backend and no API key is required to
tokenize text.

## Run locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev
```

The dev server runs on port 3000 and binds to all interfaces.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `dist/` and `server.js` |

## Project structure

```
src/
  encoding/   UTF-8, hex and binary conversion helpers
  tokenizer/  Byte-level, BPE and WordPiece tokenizers plus the model catalog
  compression/ Dictionary compression analysis
  data/       Glossary reference content
  components/ UI sections and dialogs
  types/      Shared TypeScript contracts
```
