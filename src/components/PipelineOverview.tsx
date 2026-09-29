import React from 'react';
import { TokenMapping, TokenizationStats } from '../types/tokenizer';
import { ArrowRight, Cpu, Layers, Binary, Hash, FileText, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface PipelineOverviewProps {
  stats: TokenizationStats;
  tokens: TokenMapping[];
  onSelectStage?: (stage: string) => void;
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({ stats, tokens, onSelectStage }) => {
  const sampleTokenIds = tokens.slice(0, 4).map((t) => t.tokenId).join(', ') + (tokens.length > 4 ? '…' : '');
  const sampleHex = tokens.slice(0, 3).map((t) => t.tokenIdHex).join(' ') + (tokens.length > 3 ? '…' : '');
  const sampleBinary = tokens[0]?.tokenIdBinary.slice(0, 8) + '…' || '0000…';

  const stages = [
    {
      id: 'text',
      title: 'Human Text',
      icon: FileText,
      metric: `${stats.characterCount} chars`,
      sub: 'UTF-8 string',
      preview: tokens.length > 0 ? `"${tokens.map((t) => t.text).join('').slice(0, 16)}…"` : 'Empty',
    },
    {
      id: 'tokens',
      title: 'Tokens',
      icon: Layers,
      metric: `${stats.tokenCount} tokens`,
      sub: `${stats.charsPerToken} chars/token`,
      preview: tokens.slice(0, 3).map((t) => `[${t.displayValue}]`).join(' ') || '[]',
    },
    {
      id: 'tokenIds',
      title: 'Token IDs',
      icon: Hash,
      metric: `${stats.tokenCount} integers`,
      sub: 'Vocab Indices',
      preview: sampleTokenIds || 'None',
    },
    {
      id: 'bytes',
      title: 'UTF-8 Bytes',
      icon: Database,
      metric: `${stats.byteCount} bytes`,
      sub: `${stats.bytesPerToken} B/token`,
      preview: tokens[0]?.hexList.slice(0, 4).join(' ') || '00',
    },
    {
      id: 'hex',
      title: 'Hexadecimal',
      icon: Hash,
      metric: sampleHex || '0x00',
      sub: 'Base-16',
      preview: sampleHex,
    },
    {
      id: 'binary',
      title: 'Binary Stream',
      icon: Binary,
      metric: `${stats.binaryBitLength} bits`,
      sub: 'Raw 0s & 1s',
      preview: sampleBinary,
    },
    {
      id: 'llm',
      title: 'Model Input',
      icon: Cpu,
      metric: `dim=d_model`,
      sub: 'Embedding lookup',
      preview: 'W_embed[id]',
    },
  ];

  return (
    <section id="pipeline" className="border-b border-neutral-200 bg-neutral-50/60 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            01. Data Transformation Pipeline
          </h2>
          <span className="text-xs text-neutral-400">
            Synchronous left-to-right representation pipeline
          </span>
        </div>

        {/* Horizontal scrollable pipeline strip */}
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[980px] items-stretch gap-2">
            {stages.map((st, i) => {
              const Icon = st.icon;
              return (
                <React.Fragment key={st.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    onClick={() => onSelectStage && onSelectStage(st.id)}
                    className="flex-1 rounded-md border border-neutral-200 bg-white p-3 shadow-2xs hover:border-neutral-400 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-neutral-500 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                        <Icon className="h-3.5 w-3.5 text-neutral-600" />
                        <span>{st.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">0{i + 1}</span>
                    </div>

                    <div className="text-sm font-semibold text-neutral-900 tabular-nums">
                      {st.metric}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{st.sub}</span>
                    </div>

                    <div className="mt-2 rounded bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 truncate border border-neutral-100">
                      {st.preview}
                    </div>
                  </motion.div>

                  {i < stages.length - 1 && (
                    <div className="flex items-center text-neutral-300 self-center">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
