import React from 'react';
import { TokenizerModelOption, TokenizerModelId } from '../types/tokenizer';
import { TOKENIZER_MODELS } from '../tokenizer';
import {
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building,
  Hash,
  Maximize2,
  AlertCircle,
  Code,
  Globe2,
  Space,
} from 'lucide-react';

interface ModelArchitectureProfileProps {
  currentModel: TokenizerModelOption;
  onSelectModel: (id: TokenizerModelId) => void;
}

export const ModelArchitectureProfile: React.FC<ModelArchitectureProfileProps> = ({
  currentModel,
  onSelectModel,
}) => {
  const hw = currentModel.howItWorks;

  return (
    <section className="border-b border-neutral-200 bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              04. Model Profile & Architecture Mechanics
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Deep dive into how <strong className="text-neutral-900 font-semibold">{currentModel.name}</strong> tokenizes language, handles whitespace, and scales context.
            </p>
          </div>

          {/* Quick Model Selector Pills / Clean Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-neutral-400 mr-1 text-[11px] uppercase tracking-wider font-semibold">
              Select Model:
            </span>
            {TOKENIZER_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                className={`rounded border px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                  currentModel.id === m.id
                    ? 'border-neutral-900 bg-neutral-900 text-white font-medium shadow-2xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Architecture Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Key Specifications */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                  {hw.category}
                </span>
                <span className="rounded bg-neutral-200/80 px-2 py-0.5 text-[11px] font-mono text-neutral-700">
                  {hw.era}
                </span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 mb-1">{currentModel.name}</h3>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">{currentModel.description}</p>

              <div className="space-y-2.5 border-t border-neutral-200/80 pt-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Developer:</span>
                  <span className="font-semibold text-neutral-900">{hw.developer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Algorithm:</span>
                  <span className="font-semibold text-neutral-900">{currentModel.family}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Vocabulary Size:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {currentModel.vocabSize}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Context Window:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {currentModel.contextWindow.toLocaleString()} tokens
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] text-neutral-500">
              Embedding lookup matrix size: <strong className="text-neutral-800 font-mono">{currentModel.vocabCount.toLocaleString()} × d_model</strong>
            </div>
          </div>

          {/* Card 2: How It Operates (Whitespace, Multilingual, Code) */}
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-neutral-700" />
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Tokenizer Mechanics & Behaviors
              </h4>
            </div>

            {/* Whitespace Behavior */}
            <div className="rounded border border-neutral-200 bg-neutral-50/50 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1">
                <Space className="h-3.5 w-3.5 text-neutral-600" />
                <span>Whitespace & Indentation</span>
              </div>
              <p className="text-[12px] text-neutral-600 leading-relaxed">
                {hw.whitespaceBehavior}
              </p>
            </div>

            {/* Multilingual Efficiency */}
            <div className="rounded border border-neutral-200 bg-neutral-50/50 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1">
                <Globe2 className="h-3.5 w-3.5 text-neutral-600" />
                <span>Multilingual & Non-Latin Scripts</span>
              </div>
              <p className="text-[12px] text-neutral-600 leading-relaxed">
                {hw.multilingualEfficiency}
              </p>
            </div>

            {/* Code and Mathematics */}
            <div className="rounded border border-neutral-200 bg-neutral-50/50 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 mb-1">
                <Code className="h-3.5 w-3.5 text-neutral-600" />
                <span>Code, Math & Special Delimiters</span>
              </div>
              <p className="text-[12px] text-neutral-600 leading-relaxed">
                {hw.codeAndMath}
              </p>
            </div>
          </div>

          {/* Card 3: Key Innovations, Strengths & Trade-offs */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                  Milestone Innovation
                </span>
                <p className="text-xs text-neutral-800 mt-1 leading-relaxed bg-white p-3 rounded border border-neutral-200 font-medium">
                  &ldquo;{hw.keyInnovations}&rdquo;
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-mono block mb-1.5">
                  Architectural Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  {hw.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200/80">
              <div className="flex items-start gap-1.5 text-[11px] text-neutral-600 bg-amber-50/60 border border-amber-200/80 rounded p-2.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.2" />
                <span>
                  <strong className="text-amber-950 font-semibold">Trade-off: </strong>
                  {hw.tradeoffs}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
