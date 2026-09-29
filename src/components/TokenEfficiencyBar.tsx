import React, { useState } from 'react';
import { TokenMapping, TokenizationStats } from '../types/tokenizer';
import { BarChart3, Gauge, Layers, Info } from 'lucide-react';

interface TokenEfficiencyBarProps {
  stats: TokenizationStats;
  tokens: TokenMapping[];
  defaultContextWindow?: number;
}

const CONTEXT_WINDOW_PRESETS = [
  { label: '4,096 (GPT-3)', value: 4096 },
  { label: '8,192 (GPT-4)', value: 8192 },
  { label: '32,768 (Mistral)', value: 32768 },
  { label: '128,000 (GPT-4o)', value: 128000 },
  { label: '1,000,000 (Gemini 1.5)', value: 1000000 },
];

export const TokenEfficiencyBar: React.FC<TokenEfficiencyBarProps> = ({
  stats,
  tokens,
  defaultContextWindow = 128000,
}) => {
  const [contextCapacity, setContextCapacity] = useState<number>(defaultContextWindow);

  const usedTokens = stats.tokenCount;
  const remainingTokens = Math.max(0, contextCapacity - usedTokens);
  const utilizationPercent = Math.min(100, (usedTokens / contextCapacity) * 100);

  // Character vs token comparison metrics
  const charRatio = stats.charsPerToken > 0 ? stats.charsPerToken : 1;
  const charBarWidth = 100;
  const tokenBarWidth = stats.characterCount > 0 ? Math.max(4, (stats.tokenCount / stats.characterCount) * 100) : 0;

  return (
    <section className="border-b border-neutral-200 bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            04. Token Efficiency & Context Window Allocation
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Observing how subword grouping reduces sequence length and fits inside finite attention context windows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Characters vs Tokens Compression Comparison */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-neutral-700" />
                <span className="text-xs font-semibold text-neutral-800">
                  Sequence Density (Characters vs Tokens)
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-900 tabular-nums">
                {charRatio} chars / token
              </span>
            </div>

            {/* Visual Bars Comparison */}
            <div className="space-y-3.5 my-4">
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span className="font-medium">Raw Characters ({stats.characterCount})</span>
                  <span className="font-mono text-neutral-500">100% sequence length</span>
                </div>
                <div className="h-4 w-full rounded bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-neutral-800 rounded transition-all duration-300 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span className="font-medium">Subword Tokens ({stats.tokenCount})</span>
                  <span className="font-mono text-neutral-500 tabular-nums">
                    {tokenBarWidth.toFixed(1)}% of character count
                  </span>
                </div>
                <div className="h-4 w-full rounded bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded transition-all duration-300"
                    style={{ width: `${tokenBarWidth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Token Distribution Preview Strip */}
            <div className="mt-4 pt-3 border-t border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 block mb-2">
                Subword Chunk Distribution (Proportional visual width):
              </span>
              <div className="flex flex-wrap gap-1 items-center max-h-24 overflow-y-auto p-1 bg-white rounded border border-neutral-200">
                {tokens.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-mono text-neutral-800"
                    title={`Token #${idx + 1}: ${t.displayValue} (${t.text.length} chars)`}
                  >
                    {t.displayValue}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Context Window Capacity */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-neutral-700" />
                <span className="text-xs font-semibold text-neutral-800">
                  Context Window Consumption
                </span>
              </div>

              {/* Preset Selector */}
              <select
                value={contextCapacity}
                onChange={(e) => setContextCapacity(Number(e.target.value))}
                className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 focus:outline-none cursor-pointer"
              >
                {CONTEXT_WINDOW_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity Progress Bar */}
            <div className="my-4">
              <div className="flex justify-between text-xs text-neutral-600 mb-1.5 font-mono">
                <span>
                  Used: <strong className="text-neutral-900 tabular-nums">{usedTokens.toLocaleString()}</strong> tokens
                </span>
                <span>
                  Remaining: <strong className="text-neutral-900 tabular-nums">{remainingTokens.toLocaleString()}</strong> tokens
                </span>
              </div>

              <div className="h-4 w-full rounded bg-neutral-200 overflow-hidden relative">
                <div
                  className="h-full bg-neutral-900 transition-all duration-300 rounded"
                  style={{ width: `${Math.max(1, utilizationPercent)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-1 font-mono">
                <span>0 tokens</span>
                <span>Capacity: {contextCapacity.toLocaleString()} tokens</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-200 text-center font-mono">
              <div className="rounded bg-white p-2 border border-neutral-200">
                <div className="text-[10px] text-neutral-400 uppercase">Utilized</div>
                <div className="text-xs font-bold text-neutral-800 tabular-nums">
                  {utilizationPercent < 0.01 && usedTokens > 0 ? '<0.01%' : `${utilizationPercent.toFixed(2)}%`}
                </div>
              </div>
              <div className="rounded bg-white p-2 border border-neutral-200">
                <div className="text-[10px] text-neutral-400 uppercase">Active Tokens</div>
                <div className="text-xs font-bold text-neutral-800 tabular-nums">
                  {usedTokens.toLocaleString()}
                </div>
              </div>
              <div className="rounded bg-white p-2 border border-neutral-200">
                <div className="text-[10px] text-neutral-400 uppercase">Headroom</div>
                <div className="text-xs font-bold text-emerald-700 tabular-nums">
                  {remainingTokens.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
