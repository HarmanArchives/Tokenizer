import React from 'react';
import { TOKENIZER_MODELS } from '../tokenizer';
import { TokenizerModelId, TokenizationStats } from '../types/tokenizer';
import { ChevronDown, CornerDownLeft, X, Copy, Check, FileJson } from 'lucide-react';

interface QueryInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  selectedModel: TokenizerModelId;
  onSelectModel: (model: TokenizerModelId) => void;
  stats: TokenizationStats;
  onOpenExport?: () => void;
}

export const PRESET_QUERIES = [
  { label: 'Hello world', text: 'hello world' },
  { label: 'Punctuation test', text: 'Tokenization is interesting!' },
  { label: 'Subword (Compound)', text: 'unbelievable JavaScript' },
  { label: 'Multilingual (Hindi)', text: 'Hello, दुनिया!' },
  { label: 'Quick brown fox', text: 'The quick brown fox jumps over the lazy dog.' },
  { label: 'TypeScript Code', text: 'function calculate(x: number) { return x * 2; }' },
];

export const QueryInput: React.FC<QueryInputProps> = ({
  inputText,
  onChangeText,
  selectedModel,
  onSelectModel,
  stats,
  onOpenExport,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const currentModelObj = TOKENIZER_MODELS.find((m) => m.id === selectedModel) || TOKENIZER_MODELS[0];

  return (
    <section className="border-b border-neutral-200 bg-white px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header row: Model Selector & Capabilities */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Tokenizer Architecture
            </span>
            <div className="relative inline-block">
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value as TokenizerModelId)}
                className="appearance-none rounded border border-neutral-300 bg-neutral-50 py-1.5 pl-3 pr-8 text-xs font-medium text-neutral-800 focus:border-neutral-900 focus:bg-white focus:outline-none cursor-pointer"
              >
                <optgroup label="OpenAI GPT Evolution">
                  {TOKENIZER_MODELS.filter((m) => m.howItWorks.category === 'OpenAI GPT Series').map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} — {model.vocabSize}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Frontier LLMs">
                  {TOKENIZER_MODELS.filter((m) => m.howItWorks.category === 'Frontier LLM').map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} — {model.vocabSize}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Encoder & Byte-Level">
                  {TOKENIZER_MODELS.filter((m) => m.howItWorks.category === 'Encoder & Byte-Level').map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} — {model.vocabSize}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
            </div>
            <span className="hidden text-xs text-neutral-400 sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="hidden text-xs text-neutral-500 sm:inline">
              {currentModelObj.family}
            </span>
          </div>

          {/* Quick Metrics display and direct Export action */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-600">
              <div>
                <span className="text-neutral-400">Tokens: </span>
                <span className="font-semibold text-neutral-900 tabular-nums">{stats.tokenCount}</span>
              </div>
              <span className="text-neutral-300" aria-hidden="true">|</span>
              <div>
                <span className="text-neutral-400">Chars: </span>
                <span className="tabular-nums">{stats.characterCount}</span>
              </div>
              <span className="text-neutral-300" aria-hidden="true">|</span>
              <div>
                <span className="text-neutral-400">UTF-8: </span>
                <span className="tabular-nums">{stats.byteCount} B</span>
              </div>
            </div>

            {onOpenExport && (
              <>
                <span className="text-neutral-300 hidden sm:inline" aria-hidden="true">|</span>
                <button
                  onClick={onOpenExport}
                  className="flex items-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-900 px-2 py-1 text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
                  title="Export results as JSON"
                >
                  <FileJson className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Export</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Big Input Area */}
        <div className="relative rounded-lg border border-neutral-300 bg-white transition-all focus-within:border-neutral-800 focus-within:ring-1 focus-within:ring-neutral-800 shadow-2xs">
          <textarea
            value={inputText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Type or paste any text, sentence, code snippet, or unicode characters here to inspect..."
            rows={3}
            className="w-full resize-y rounded-lg p-3.5 font-mono text-sm leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />

          <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/70 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <CornerDownLeft className="h-3 w-3 text-neutral-400" />
              <span>Real-time synchronous tokenization & bitstream decomposition</span>
            </div>

            <div className="flex items-center gap-2">
              {inputText.length > 0 && (
                <>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200/60 transition-colors cursor-pointer"
                    title="Copy input text"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => onChangeText('')}
                    className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900 transition-colors cursor-pointer"
                    title="Clear input"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Preset Queries (Clean segmented controls / filter tabs) */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-neutral-400 mr-1 text-[11px] uppercase tracking-wider font-semibold">
            Examples:
          </span>
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChangeText(preset.text)}
              className={`rounded border px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                inputText === preset.text
                  ? 'border-neutral-800 bg-neutral-900 text-white font-medium shadow-2xs'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
