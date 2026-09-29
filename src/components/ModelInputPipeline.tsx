import React, { useState } from 'react';
import { TokenMapping } from '../types/tokenizer';
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  ArrowDown,
  Hash,
  Database,
  Grid,
} from 'lucide-react';

interface ModelInputPipelineProps {
  tokens: TokenMapping[];
}

export const ModelInputPipeline: React.FC<ModelInputPipelineProps> = ({ tokens }) => {
  const [expandedStage, setExpandedStage] = useState<string>('embedding');

  // Generate pseudo-deterministic illustrative vector floats based on Token ID
  const generateIllustrativeEmbedding = (id: number): number[] => {
    const vals: number[] = [];
    for (let i = 0; i < 6; i++) {
      const pseudo = Math.sin(id * 997 + i * 1337) * 0.98;
      vals.push(parseFloat(pseudo.toFixed(3)));
    }
    return vals;
  };

  const stages = [
    {
      id: 'tokenIds',
      title: '1. Integer Token IDs',
      subtitle: 'Discrete vocabulary index array',
      summary: 'The model receives an array of integers, one per token.',
      details:
        'Instead of reading character strings or ASCII, the neural network receives an integer tensor of shape [batch_size, sequence_length]. For example: [' +
        (tokens.slice(0, 4).map((t) => t.tokenId).join(', ') || '15339, 1917') +
        ']. Each integer acts as an index into the model’s static vocabulary lookup table.',
    },
    {
      id: 'embedding',
      title: '2. Embedding Lookup (Weights Matrix W_embed)',
      subtitle: 'Discrete integer → Continuous dense vector',
      summary: 'Each Token ID indexes a row in an embedding table of shape (Vocab × d_model).',
      details:
        'Neural networks cannot perform gradient descent or linear algebra directly on discrete integer IDs. The model retrieves a row vector of dimension d_model (e.g., 4,096 dimensions in 70B models) corresponding to that token ID. This assigns each word a geometric coordinate in semantic vector space.',
    },
    {
      id: 'positional',
      title: '3. Positional Encoding (RoPE / Rotary Embeddings)',
      subtitle: 'Injecting order and sequence distance into vectors',
      summary: 'Self-attention is permutation-invariant without positional indicators.',
      details:
        'Because attention calculates dot products between all tokens in parallel, "dog bites man" would look identical to "man bites dog" without positional information. Modern models apply Rotary Position Embeddings (RoPE) to rotate the query and key vectors in complex 2D subspaces based on token sequence index.',
    },
    {
      id: 'transformer',
      title: '4. Transformer Attention Layers',
      subtitle: 'Contextualizing representations through Self-Attention & MLPs',
      summary: 'Tokens exchange information dynamically with every other token in the prompt.',
      details:
        'Over 32 to 128 transformer blocks, Query-Key-Value attention heads compute dynamic weights: "Which other tokens in this sentence are relevant to understanding this token right now?" The static dictionary vector evolves into a deep contextualized representation.',
    },
    {
      id: 'logits',
      title: '5. Output Projection, Logits & Softmax',
      subtitle: 'Predicting the probability distribution of the next token',
      summary: 'Unembedding matrix maps the final vector back to vocabulary probabilities.',
      details:
        'The final layer vector is multiplied by the unembedding matrix W_vocab to produce raw unnormalized log-probabilities ("logits") for all 200,000 possible tokens. Softmax normalizes them into probabilities [0..1], from which the next token is sampled.',
    },
  ];

  return (
    <section id="model-input" className="border-b border-neutral-200 bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            07. Architecture · What Actually Goes Into the LLM?
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Tracing how discrete Token IDs are translated into continuous high-dimensional vector spaces for neural computation.
          </p>
        </div>

        {/* Conceptual Pipeline Cards */}
        <div className="space-y-3">
          {stages.map((st) => {
            const isExpanded = expandedStage === st.id;
            return (
              <div
                key={st.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50/50 shadow-2xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedStage(isExpanded ? '' : st.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-100/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-neutral-200 font-mono text-xs font-bold text-neutral-800">
                      {st.title.split('.')[0]}
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold text-neutral-900">{st.title}</h3>
                      <p className="text-[11px] text-neutral-500">{st.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 hidden sm:inline">{st.summary}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-neutral-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-neutral-200 bg-white p-5 space-y-4 text-xs">
                    <p className="text-neutral-700 leading-relaxed">{st.details}</p>

                    {/* Interactive Visual Element for Embedding Stage */}
                    {st.id === 'embedding' && (
                      <div className="rounded border border-neutral-200 bg-neutral-50 p-4 font-mono">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-neutral-700">
                            Illustrative Embedding Vector Lookup (W_embed[token_id])
                          </span>
                          <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] text-amber-800">
                            Illustrative Values (Standard d_model = 4096)
                          </span>
                        </div>

                        {tokens.length === 0 ? (
                          <div className="text-neutral-400 italic text-center py-2">
                            Enter text to view simulated embedding lookup
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {tokens.slice(0, 3).map((token) => {
                              const sampleVector = generateIllustrativeEmbedding(token.tokenId);
                              return (
                                <div
                                  key={token.tokenIndex}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded bg-white p-2.5 border border-neutral-200 text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-neutral-400 font-sans text-[11px]">Token:</span>
                                    <span className="font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded">
                                      {token.displayValue}
                                    </span>
                                    <span className="text-neutral-400">→</span>
                                    <span className="font-semibold text-neutral-800">
                                      ID {token.tokenId}
                                    </span>
                                  </div>

                                  <div className="text-[11px] text-neutral-600 bg-neutral-50 px-2 py-1 rounded border border-neutral-100 truncate">
                                    [
                                    {sampleVector.map((v, i) => (
                                      <span
                                        key={i}
                                        className={v >= 0 ? 'text-blue-700' : 'text-rose-700'}
                                      >
                                        {v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3)}
                                        {i < sampleVector.length - 1 ? ', ' : ''}
                                      </span>
                                    ))}
                                    , … <span className="text-neutral-400">4,090 more floats</span>]
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
