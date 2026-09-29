import React, { useState, useMemo, useEffect } from 'react';
import {
  analyzeCompression,
  COMPRESSION_PRESETS,
  CompressionAnalysis,
} from '../compression/compressionLab';
import {
  Layers,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle,
  FileText,
  Database,
  Sliders,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CompressionLabView: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rhyme-cat');
  const [customText, setCustomText] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const initialPreset = COMPRESSION_PRESETS.find((p) => p.id === selectedPresetId) || COMPRESSION_PRESETS[0];
  const activeSourceText = customText.trim() ? customText : initialPreset.text;

  const analysis: CompressionAnalysis = useMemo(() => {
    return analyzeCompression(activeSourceText);
  }, [activeSourceText]);

  // Step auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 4;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const stepLabels = [
    { title: '1. Raw Repeated Text', desc: 'Input text with natural redundancy' },
    { title: '2. Detect Patterns', desc: 'Identify frequent co-occurring sequences' },
    { title: '3. Construct Dictionary', desc: 'Map patterns to lightweight symbol pointers' },
    { title: '4. Substitute References', desc: 'Replace repeating segments with pointers' },
    { title: '5. Compare Storage', desc: 'Net byte savings analysis' },
  ];

  return (
    <section id="compression" className="border-b border-neutral-200 bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              06. Laboratory · How Compression Saves Space
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Visualizing how dictionary-based algorithms replace redundant string patterns with compact references.
            </p>
          </div>

          <div className="rounded bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-600 font-mono">
            Conceptual Algorithm Demo
          </div>
        </div>

        {/* Presets and Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-neutral-400 mr-1 text-[11px] uppercase tracking-wider font-semibold">
              Sample Texts:
            </span>
            {COMPRESSION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPresetId(preset.id);
                  setCustomText('');
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className={`rounded border px-2.5 py-1 text-xs transition-colors ${
                  selectedPresetId === preset.id && !customText
                    ? 'border-neutral-800 bg-neutral-900 text-white font-medium shadow-2xs'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentStep >= 4) setCurrentStep(0);
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-neutral-700" />
              <span>{isPlaying ? 'Pause' : currentStep >= 4 ? 'Replay' : 'Auto Play'}</span>
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              className="rounded border border-neutral-200 p-1.5 text-neutral-500 hover:bg-neutral-100 transition-colors"
              title="Reset Steps"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Step Bar */}
        <div className="mb-6 grid grid-cols-5 gap-2">
          {stepLabels.map((st, i) => (
            <button
              key={i}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(i);
              }}
              className={`rounded border p-2 text-left transition-all ${
                currentStep === i
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                  : currentStep > i
                  ? 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  : 'border-neutral-100 bg-white text-neutral-400 hover:border-neutral-200'
              }`}
            >
              <div className="text-[11px] font-semibold truncate">{st.title}</div>
              <div className={`text-[10px] truncate ${currentStep === i ? 'text-neutral-300' : 'text-neutral-400'}`}>
                {st.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Main Step Demonstration Box */}
        <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-6 shadow-2xs min-h-[300px]">
          {/* STEP 0: Raw Repeated Text */}
          {currentStep === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Original Uncompressed Text</span>
                <span className="font-mono">{analysis.originalBytes} bytes</span>
              </div>
              <pre className="rounded border border-neutral-200 bg-white p-4 font-mono text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap">
                {analysis.originalText}
              </pre>
              <p className="text-xs text-neutral-500">
                Notice the repeated sentences and phrases. In raw storage, each character requires 1 full byte, storing identical byte sequences over and over.
              </p>
            </motion.div>
          )}

          {/* STEP 1: Pattern Identification */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Highlighted Redundant Patterns</span>
                <span className="font-mono">{analysis.dictionary.length} major patterns detected</span>
              </div>

              <div className="rounded border border-neutral-200 bg-white p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {analysis.highlightedPatternSegments.map((seg, idx) => {
                  if (seg.matchedSymbol) {
                    const dictEntry = analysis.dictionary.find((d) => d.symbol === seg.matchedSymbol);
                    return (
                      <span
                        key={idx}
                        className={`rounded px-1.5 py-0.5 border ${dictEntry?.color || 'bg-amber-100 text-amber-900 border-amber-300'}`}
                        title={`Pattern: "${seg.text}" (${seg.matchedSymbol})`}
                      >
                        {seg.text}
                      </span>
                    );
                  }
                  return <span key={idx}>{seg.text}</span>;
                })}
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {analysis.dictionary.map((entry) => (
                  <span key={entry.symbol} className={`rounded px-2 py-0.5 border font-mono ${entry.color}`}>
                    {entry.symbol} : &ldquo;{entry.pattern}&rdquo; ({entry.occurrences}×)
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Dictionary Construction */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="text-xs font-semibold text-neutral-700">
                Dictionary Lookup Table (Codebook)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analysis.dictionary.map((entry) => (
                  <div key={entry.symbol} className="rounded border border-neutral-200 bg-white p-3 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded border ${entry.color}`}>
                        {entry.symbol}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {entry.occurrences} matches
                      </span>
                    </div>
                    <div className="font-mono text-xs text-neutral-800 bg-neutral-50 p-1.5 rounded truncate">
                      &ldquo;{entry.pattern}&rdquo;
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-neutral-400 font-mono">
                      <span>Pattern: {entry.length} B</span>
                      <span>Saved: +{entry.savings} B</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-neutral-500">
                The dictionary table itself takes <strong className="text-neutral-900">{analysis.dictionaryBytes} bytes</strong> of metadata overhead. It is only profitable to compress when the repeated occurrences save more bytes than this overhead!
              </div>
            </motion.div>
          )}

          {/* STEP 3: Substitute References */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Substituted Stream (Pointers replacing patterns)</span>
                <span className="font-mono">Reference Stream</span>
              </div>

              <div className="rounded border border-neutral-200 bg-white p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {analysis.compressedStreamTokens.map((t, idx) => {
                  if (t.type === 'reference') {
                    const dictEntry = analysis.dictionary.find((d) => d.symbol === t.symbol);
                    return (
                      <span
                        key={idx}
                        className={`rounded px-1.5 py-0.5 font-bold border mx-0.5 ${dictEntry?.color || 'bg-amber-100 text-amber-900 border-amber-300'}`}
                      >
                        [{t.symbol}]
                      </span>
                    );
                  }
                  return <span key={idx}>{t.value}</span>;
                })}
              </div>

              <div className="text-xs text-neutral-500">
                Each multi-character sequence is replaced by a 1-byte pointer symbol pointing back to the dictionary index.
              </div>
            </motion.div>
          )}

          {/* STEP 4: Smaller Representation & Quantitative Stats */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="rounded border border-neutral-200 bg-white p-3 text-center">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">Original Size</div>
                  <div className="text-lg font-bold text-neutral-900 tabular-nums font-mono mt-0.5">
                    {analysis.originalBytes} <span className="text-xs font-normal text-neutral-500">bytes</span>
                  </div>
                </div>

                <div className="rounded border border-neutral-200 bg-white p-3 text-center">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">Compressed Size</div>
                  <div className="text-lg font-bold text-neutral-900 tabular-nums font-mono mt-0.5">
                    {analysis.compressedBytes} <span className="text-xs font-normal text-neutral-500">bytes</span>
                  </div>
                </div>

                <div className="rounded border border-neutral-200 bg-white p-3 text-center">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">Net Saved</div>
                  <div className="text-lg font-bold text-emerald-600 tabular-nums font-mono mt-0.5">
                    {analysis.totalSavedBytes} <span className="text-xs font-normal text-neutral-500">bytes</span>
                  </div>
                </div>

                <div className="rounded border border-neutral-200 bg-white p-3 text-center">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">Space Saved</div>
                  <div className="text-lg font-bold text-emerald-600 tabular-nums font-mono mt-0.5">
                    {analysis.savingsPercentage}%
                  </div>
                </div>
              </div>

              {/* Visual Reduction Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-600 font-mono">
                  <span>Size Comparison (Before vs After)</span>
                  <span>{analysis.savingsPercentage}% Reduction</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[10px] font-mono text-neutral-400">Before</span>
                    <div className="h-4 flex-1 rounded bg-neutral-200 overflow-hidden">
                      <div className="h-full bg-neutral-800 w-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-[10px] font-mono text-neutral-400">After</span>
                    <div className="h-4 flex-1 rounded bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${Math.max(5, 100 - analysis.savingsPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Step Forward / Backward Footer */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.max(0, p - 1));
            }}
            disabled={currentStep === 0}
            className="rounded border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 disabled:opacity-40 hover:bg-neutral-50 transition-colors"
          >
            ← Previous Step
          </button>

          <span className="text-neutral-500 font-mono text-[11px]">
            Step {currentStep + 1} of 5
          </span>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.min(4, p + 1));
            }}
            disabled={currentStep === 4}
            className="rounded border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-white disabled:opacity-40 hover:bg-neutral-800 transition-colors"
          >
            Next Step →
          </button>
        </div>

        {/* Conceptual Disclaimer Banner as required by Prompt */}
        <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-[11px] text-neutral-500 leading-relaxed">
          <strong className="text-neutral-700 font-semibold">Educational Distinction: </strong>
          This is a conceptual dictionary compression demonstration illustrating how replacing repeated sub-strings saves byte storage.
          LLM tokenization (such as BPE) solves a related but distinct task: constructing a static subword vocabulary so an autoregressive transformer can process text efficiently without open-ended character sequence lengths.
        </div>
      </div>
    </section>
  );
};
