import React, { useState, useMemo } from 'react';
import { TokenMapping, TokenizationStats, TokenizerModelOption } from '../types/tokenizer';
import { X, Copy, Download, Check, FileJson, SlidersHorizontal } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputText: string;
  tokens: TokenMapping[];
  stats: TokenizationStats;
  currentModel: TokenizerModelOption;
}

export type ExportScope = 'full' | 'compact' | 'ids-only';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  inputText,
  tokens,
  stats,
  currentModel,
}) => {
  const [scope, setScope] = useState<ExportScope>('full');
  const [prettyPrint, setPrettyPrint] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const exportPayload = useMemo(() => {
    if (scope === 'ids-only') {
      return tokens.map((t) => t.tokenId);
    }

    if (scope === 'compact') {
      return {
        model: currentModel.id,
        tokenCount: stats.tokenCount,
        tokens: tokens.map((t) => ({
          text: t.text,
          id: t.tokenId,
          hex: t.tokenIdHex,
        })),
      };
    }

    // 'full' scope
    return {
      metadata: {
        exportedAt: new Date().toISOString(),
        application: 'TokenLab',
        model: {
          id: currentModel.id,
          name: currentModel.name,
          family: currentModel.family,
          vocabSize: currentModel.vocabSize,
        },
      },
      input: {
        rawText: inputText,
        length: inputText.length,
      },
      statistics: {
        tokenCount: stats.tokenCount,
        characterCount: stats.characterCount,
        byteCount: stats.byteCount,
        charsPerToken: stats.charsPerToken,
        bytesPerToken: stats.bytesPerToken,
        binaryBitLength: stats.binaryBitLength,
      },
      tokens: tokens.map((t) => ({
        index: t.tokenIndex,
        text: t.text,
        displayValue: t.displayValue,
        charRange: [t.charStart, t.charEnd],
        tokenId: t.tokenId,
        tokenIdHex: t.tokenIdHex,
        tokenIdBinary: t.tokenIdBinary,
        utf8Bytes: t.bytes,
        hexBytes: t.hexList,
        binaryBytes: t.binaryList,
        byteBreakdown: t.byteDetails.map((bd) => ({
          byteValue: bd.byteValue,
          hex: bd.hex,
          binary: bd.binary,
          char: bd.char,
          highNibbleHex: bd.highNibbleHex,
          lowNibbleHex: bd.lowNibbleHex,
        })),
      })),
    };
  }, [scope, currentModel, inputText, stats, tokens]);

  const jsonString = useMemo(() => {
    return prettyPrint
      ? JSON.stringify(exportPayload, null, 2)
      : JSON.stringify(exportPayload);
  }, [exportPayload, prettyPrint]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = url;
    a.download = `tokenlab-${currentModel.id}-${scope}-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col rounded-lg border border-neutral-300 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileJson className="h-4 w-4 text-neutral-800" />
            <h2 className="text-sm font-semibold text-neutral-900">
              Export Tokenization Data & Statistics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-6 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px]">
              Payload Scope:
            </span>
            <div className="flex items-center rounded border border-neutral-200 bg-white p-0.5 shadow-2xs">
              <button
                onClick={() => setScope('full')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  scope === 'full'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Full Analysis ({tokens.length} tokens)
              </button>
              <button
                onClick={() => setScope('compact')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  scope === 'compact'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Compact (Tokens + IDs)
              </button>
              <button
                onClick={() => setScope('ids-only')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  scope === 'ids-only'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                IDs Array Only
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600 select-none">
              <input
                type="checkbox"
                checked={prettyPrint}
                onChange={(e) => setPrettyPrint(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span>Pretty print (2-space indent)</span>
            </label>
          </div>
        </div>

        {/* Code Preview Area */}
        <div className="relative flex-1 overflow-hidden bg-neutral-950 p-4">
          <pre className="h-full max-h-[380px] overflow-auto font-mono text-xs leading-relaxed text-neutral-200 select-all p-2">
            {jsonString}
          </pre>
          <div className="absolute bottom-3 right-4 rounded bg-neutral-900/80 px-2 py-1 text-[10px] font-mono text-neutral-400 backdrop-blur-xs border border-neutral-800">
            {new Blob([jsonString]).size.toLocaleString()} bytes
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 bg-white px-6 py-3.5">
          <div className="text-[11px] text-neutral-500 font-mono">
            Model: {currentModel.name} · {tokens.length} tokens · {stats.byteCount} UTF-8 bytes
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied JSON to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
