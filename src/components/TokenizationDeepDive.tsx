import React from 'react';
import { TokenizerModelId } from '../types/tokenizer';
import { tokenizeText } from '../tokenizer';
import { HelpCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface TokenizationDeepDiveProps {
  currentModel: TokenizerModelId;
  onLoadExample: (text: string) => void;
}

export const TokenizationDeepDive: React.FC<TokenizationDeepDiveProps> = ({
  currentModel,
  onLoadExample,
}) => {
  const caseStudies = [
    {
      title: 'Punctuation Appends & Boundary Splitting',
      textA: 'hello',
      textB: 'hello!',
      explanation: 'Punctuation often triggers a split into a separate token because punctuation marks are vocabulary entries of their own.',
    },
    {
      title: 'Morphological Subword Stems & Affixes',
      textA: 'unbelievable',
      textB: 'tokenization',
      explanation: 'Rare or compound words decompose into root words, prefixes, and suffixes rather than remaining a single atomic token.',
    },
    {
      title: 'Leading Whitespace Sensitivity',
      textA: 'cat',
      textB: ' cat',
      explanation: 'In Byte-Pair Encoding, words with leading spaces (" cat") map to distinct token IDs from words without leading spaces ("cat").',
    },
    {
      title: 'Multilingual Script Representation',
      textA: 'Hello world',
      textB: 'Hello, दुनिया!',
      explanation: 'Non-Latin scripts use multi-byte UTF-8 sequences. Older tokenizers often required 2–3 tokens per character; modern tokenizers (like o200k) greatly improve this.',
    },
  ];

  return (
    <section className="border-b border-neutral-200 bg-neutral-50/40 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            05. Educational Deep Dive · Why &ldquo;One Word ≠ One Token&rdquo;
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Real tokenizer behavior under current model: <strong className="text-neutral-900">{currentModel}</strong>
          </p>
        </div>

        {/* 4 Interactive Comparison Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {caseStudies.map((cs, idx) => {
            const tokensA = tokenizeText(cs.textA, currentModel).tokens;
            const tokensB = tokenizeText(cs.textB, currentModel).tokens;

            return (
              <div key={idx} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-800">
                      {cs.title}
                    </span>
                  </div>

                  <p className="text-[12px] text-neutral-500 mb-3 leading-relaxed">
                    {cs.explanation}
                  </p>

                  {/* Comparison A vs B */}
                  <div className="space-y-2 bg-neutral-50 p-2.5 rounded border border-neutral-100 font-mono text-xs">
                    {/* Item A */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-neutral-400 text-[10px]">A:</span>
                        <span className="font-semibold text-neutral-900">&ldquo;{cs.textA}&rdquo;</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {tokensA.map((t, i) => (
                          <span
                            key={i}
                            className="bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-[11px] text-neutral-800"
                          >
                            {t.displayValue} <span className="text-[10px] text-neutral-400">({t.tokenId})</span>
                          </span>
                        ))}
                        <span className="text-[10px] text-neutral-400 ml-1 font-sans">
                          [{tokensA.length} {tokensA.length === 1 ? 'tok' : 'toks'}]
                        </span>
                      </div>
                    </div>

                    {/* Item B */}
                    <div className="flex items-center justify-between border-t border-neutral-200/60 pt-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-neutral-400 text-[10px]">B:</span>
                        <span className="font-semibold text-neutral-900">&ldquo;{cs.textB}&rdquo;</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {tokensB.map((t, i) => (
                          <span
                            key={i}
                            className="bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-[11px] text-neutral-800"
                          >
                            {t.displayValue} <span className="text-[10px] text-neutral-400">({t.tokenId})</span>
                          </span>
                        ))}
                        <span className="text-[10px] text-neutral-400 ml-1 font-sans">
                          [{tokensB.length} {tokensB.length === 1 ? 'tok' : 'toks'}]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => onLoadExample(cs.textA)}
                    className="text-neutral-600 hover:text-neutral-950 underline font-medium text-[11px] cursor-pointer"
                  >
                    Inspect A
                  </button>
                  <span className="text-neutral-300">·</span>
                  <button
                    onClick={() => onLoadExample(cs.textB)}
                    className="text-neutral-600 hover:text-neutral-950 underline font-medium text-[11px] cursor-pointer"
                  >
                    Inspect B
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear Technical Distinction Table */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-neutral-700" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
              Crucial Conceptual Distinctions in LLM Data Flow
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-medium">
                  <th className="py-2 pr-4">Concept</th>
                  <th className="py-2 pr-4">What It Actually Is</th>
                  <th className="py-2 pr-4">Concrete Example</th>
                  <th className="py-2">Common Misconception</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-neutral-900">Character</td>
                  <td className="py-2.5 pr-4 text-neutral-600">A human-readable typographical glyph (Unicode code point).</td>
                  <td className="py-2.5 pr-4 font-mono text-neutral-800">'h' (U+0068)</td>
                  <td className="py-2.5 text-neutral-500">Assuming 1 character = 1 byte (Unicode takes 1–4 bytes).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-neutral-900">UTF-8 Byte</td>
                  <td className="py-2.5 pr-4 text-neutral-600">8 bits stored in memory/disk encoding a character.</td>
                  <td className="py-2.5 pr-4 font-mono text-neutral-800">0x68 (104)</td>
                  <td className="py-2.5 text-neutral-500">Confusing byte values with Token IDs.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-neutral-900">Token</td>
                  <td className="py-2.5 pr-4 text-neutral-600">A sequence of 1 or more bytes recognized by the vocabulary.</td>
                  <td className="py-2.5 pr-4 font-mono text-neutral-800">"hello", " un", "##ing"</td>
                  <td className="py-2.5 text-neutral-500">Assuming tokens are strictly whole words.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-neutral-900">Token ID</td>
                  <td className="py-2.5 pr-4 text-neutral-600">An integer array index pointing into the model's vocabulary list.</td>
                  <td className="py-2.5 pr-4 font-mono text-neutral-800">15339</td>
                  <td className="py-2.5 text-neutral-500">Thinking the Token ID is binary ASCII or general compression.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-neutral-900">Embedding Vector</td>
                  <td className="py-2.5 pr-4 text-neutral-600">Continuous high-dimensional weights matrix row (e.g. 4,096 floats).</td>
                  <td className="py-2.5 pr-4 font-mono text-neutral-800">[+0.12, -0.44, ...]</td>
                  <td className="py-2.5 text-neutral-500">Believing the model computes on raw binary tokens directly.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
