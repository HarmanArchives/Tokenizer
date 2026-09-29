import React, { useMemo } from 'react';
import { TokenizerModelId } from '../types/tokenizer';
import { TOKENIZER_MODELS, tokenizeText } from '../tokenizer';
import { Layers, ArrowRight, BarChart2, Check, Sparkles } from 'lucide-react';

interface ModelComparisonMatrixProps {
  inputText: string;
  selectedModel: TokenizerModelId;
  onSelectModel: (id: TokenizerModelId) => void;
}

export const ModelComparisonMatrix: React.FC<ModelComparisonMatrixProps> = ({
  inputText,
  selectedModel,
  onSelectModel,
}) => {
  // Compute tokenizations across key representative models
  const comparisonModels: TokenizerModelId[] = [
    'gpt-2',
    'gpt-4',
    'gpt-4o',
    'llama-3',
    'gemini-1.5',
    'wordpiece',
    'byte-level',
  ];

  const results = useMemo(() => {
    return comparisonModels.map((id) => {
      const modelMeta = TOKENIZER_MODELS.find((m) => m.id === id) || TOKENIZER_MODELS[0];
      const { tokens, stats } = tokenizeText(inputText, id);
      return {
        id,
        modelMeta,
        tokens,
        stats,
      };
    });
  }, [inputText]);

  const maxTokens = Math.max(...results.map((r) => r.stats.tokenCount), 1);

  return (
    <section className="border-b border-neutral-200 bg-neutral-50/50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              05. Live Cross-Model Comparison Matrix
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Compare how the exact same query (&ldquo;{inputText.slice(0, 32)}{inputText.length > 32 ? '…' : ''}&rdquo;) is segmented across model generations.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            {inputText.length} characters · {new TextEncoder().encode(inputText).length} UTF-8 bytes
          </span>
        </div>

        {/* Comparison Table / List */}
        <div className="space-y-3">
          {results.map(({ id, modelMeta, tokens, stats }) => {
            const isSelected = selectedModel === id;
            const barWidthPercent = Math.max(6, (stats.tokenCount / maxTokens) * 100);

            return (
              <div
                key={id}
                onClick={() => onSelectModel(id)}
                className={`rounded-lg border p-4 transition-all duration-150 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/70'
                }`}
              >
                {/* Header row of model entry */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-xs text-neutral-900 font-mono">
                      {modelMeta.name}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-[11px] text-neutral-500">
                      Vocab: <strong className="text-neutral-800 font-mono">{modelMeta.vocabSize}</strong>
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-[11px] text-neutral-500 hidden sm:inline">
                      {modelMeta.family}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div>
                      <span className="text-neutral-400">Tokens: </span>
                      <span className="font-bold text-neutral-900 tabular-nums">{stats.tokenCount}</span>
                    </div>
                    <span className="text-neutral-300">|</span>
                    <div>
                      <span className="text-neutral-400">Chars/Tok: </span>
                      <span className="font-semibold text-neutral-700 tabular-nums">
                        {stats.charsPerToken}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] text-white font-sans uppercase tracking-wider font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Relative Token Count Visual Bar */}
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-300 ${
                        isSelected ? 'bg-neutral-900' : 'bg-neutral-400'
                      }`}
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 w-16 text-right tabular-nums">
                    {stats.tokenCount} {stats.tokenCount === 1 ? 'tok' : 'toks'}
                  </span>
                </div>

                {/* Visual Tokens Strip */}
                <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
                  {tokens.length === 0 ? (
                    <span className="text-neutral-400 italic text-[11px]">Empty</span>
                  ) : (
                    tokens.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        className={`rounded border px-1.5 py-0.5 text-[11px] transition-colors ${
                          isSelected
                            ? 'border-amber-300 bg-amber-50 text-amber-950 font-medium'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-800'
                        }`}
                        title={`Token #${tIdx + 1}: "${token.text}" | ID: ${token.tokenId}`}
                      >
                        {token.displayValue}
                        <span className="text-[9px] text-neutral-400 ml-1 font-sans">
                          {token.tokenId}
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
