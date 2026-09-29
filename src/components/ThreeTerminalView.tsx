import React, { useState } from 'react';
import { TokenMapping } from '../types/tokenizer';
import { Terminal, Lock, Unlock, Hash, Binary, FileText } from 'lucide-react';

interface ThreeTerminalViewProps {
  tokens: TokenMapping[];
  activeTokenIndex: number | null;
  lockedTokenIndex: number | null;
  onHoverToken: (index: number | null) => void;
  onToggleLockToken: (index: number) => void;
  onSelectTokenForDetails: (index: number) => void;
}

export const ThreeTerminalView: React.FC<ThreeTerminalViewProps> = ({
  tokens,
  activeTokenIndex,
  lockedTokenIndex,
  onHoverToken,
  onToggleLockToken,
  onSelectTokenForDetails,
}) => {
  const [binaryMode, setBinaryMode] = useState<'token-id' | 'utf8-bytes'>('token-id');

  // Effective highlighted token (locked takes precedence if hover is null)
  const currentHighlightIndex = activeTokenIndex !== null ? activeTokenIndex : lockedTokenIndex;

  return (
    <section id="terminals" className="border-b border-neutral-200 bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              02. Synchronized Three-Terminal Inspector
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Hover over any word, token ID, or binary digits to highlight its corresponding representation across all panels. Click to lock selection.
            </p>
          </div>

          {lockedTokenIndex !== null && (
            <div className="flex items-center gap-2 rounded bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs text-amber-900">
              <Lock className="h-3 w-3 text-amber-700" />
              <span>
                Selection locked on Token #{lockedTokenIndex + 1} ({tokens[lockedTokenIndex]?.displayValue})
              </span>
              <button
                onClick={() => onToggleLockToken(lockedTokenIndex)}
                className="ml-1 text-[11px] underline hover:text-amber-950 font-medium cursor-pointer"
              >
                Unlock
              </button>
            </div>
          )}
        </div>

        {/* The 3 Synchronized Terminals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* TERMINAL 1: TEXT */}
          <div className="flex flex-col rounded-lg border border-neutral-200 bg-neutral-50/50 shadow-2xs overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Terminal 1 · Original Text
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {tokens.length} tokens
              </span>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 bg-white/70 overflow-y-auto max-h-[360px] font-mono text-sm leading-relaxed">
              {tokens.length === 0 ? (
                <div className="text-neutral-400 italic py-8 text-center text-xs">
                  No input text entered
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline gap-y-1.5 gap-x-0.5">
                  {tokens.map((token) => {
                    const isSelected = currentHighlightIndex === token.tokenIndex;
                    const isLocked = lockedTokenIndex === token.tokenIndex;

                    return (
                      <span
                        key={token.tokenIndex}
                        onMouseEnter={() => onHoverToken(token.tokenIndex)}
                        onMouseLeave={() => onHoverToken(null)}
                        onClick={() => {
                          onToggleLockToken(token.tokenIndex);
                          onSelectTokenForDetails(token.tokenIndex);
                        }}
                        className={`cursor-pointer rounded px-1 py-0.5 transition-all duration-100 ${
                          isSelected
                            ? 'bg-amber-100 text-amber-950 font-medium ring-1 ring-amber-400 shadow-2xs'
                            : 'hover:bg-neutral-200/80 text-neutral-800'
                        } ${isLocked ? 'ring-2 ring-amber-500' : ''}`}
                        title={`Token #${token.tokenIndex + 1} | ID: ${token.tokenId} | Click to lock`}
                      >
                        {token.displayValue}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Terminal Footer Info */}
            <div className="border-t border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] text-neutral-500 flex justify-between">
              <span>Hover words to trace</span>
              <span>Click word to lock inspection</span>
            </div>
          </div>

          {/* TERMINAL 2: TOKEN / NUMERIC */}
          <div className="flex flex-col rounded-lg border border-neutral-200 bg-neutral-50/50 shadow-2xs overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Terminal 2 · Token / Numeric
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                Word → Token ID
              </span>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-3 bg-white/70 overflow-y-auto max-h-[360px] font-mono text-xs">
              {tokens.length === 0 ? (
                <div className="text-neutral-400 italic py-8 text-center text-xs">
                  No tokens to display
                </div>
              ) : (
                <div className="space-y-1">
                  {tokens.map((token) => {
                    const isSelected = currentHighlightIndex === token.tokenIndex;
                    const isLocked = lockedTokenIndex === token.tokenIndex;

                    return (
                      <div
                        key={token.tokenIndex}
                        onMouseEnter={() => onHoverToken(token.tokenIndex)}
                        onMouseLeave={() => onHoverToken(null)}
                        onClick={() => {
                          onToggleLockToken(token.tokenIndex);
                          onSelectTokenForDetails(token.tokenIndex);
                        }}
                        className={`flex items-center justify-between rounded px-2.5 py-1.5 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-100 text-amber-950 font-medium ring-1 ring-amber-300'
                            : 'hover:bg-neutral-100 text-neutral-700'
                        } ${isLocked ? 'ring-2 ring-amber-500' : ''}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] text-neutral-400 tabular-nums w-5">
                            #{token.tokenIndex + 1}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[11px] truncate max-w-[120px]">
                            {token.displayValue}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <span className="text-neutral-400">→</span>
                          <span className="font-semibold text-neutral-900 tabular-nums">
                            {token.tokenId.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            ({token.tokenIdHex})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Terminal Footer Info */}
            <div className="border-t border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] text-neutral-500 flex justify-between">
              <span>Vocabulary Index</span>
              <span>Base-10 integer representation</span>
            </div>
          </div>

          {/* TERMINAL 3: BINARY / HEX */}
          <div className="flex flex-col rounded-lg border border-neutral-200 bg-neutral-50/50 shadow-2xs overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <Binary className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Terminal 3 · Binary / Hex
                </span>
              </div>

              {/* View Switch: Token ID vs UTF-8 Bytes */}
              <div className="flex items-center rounded border border-neutral-200 bg-neutral-50 p-0.5 text-[10px]">
                <button
                  onClick={() => setBinaryMode('token-id')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    binaryMode === 'token-id' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Token ID
                </button>
                <button
                  onClick={() => setBinaryMode('utf8-bytes')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    binaryMode === 'utf8-bytes' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  UTF-8 Bytes
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-3 bg-white/70 overflow-y-auto max-h-[360px] font-mono text-xs">
              {tokens.length === 0 ? (
                <div className="text-neutral-400 italic py-8 text-center text-xs">
                  No binary stream to display
                </div>
              ) : (
                <div className="space-y-1">
                  {tokens.map((token) => {
                    const isSelected = currentHighlightIndex === token.tokenIndex;
                    const isLocked = lockedTokenIndex === token.tokenIndex;

                    return (
                      <div
                        key={token.tokenIndex}
                        onMouseEnter={() => onHoverToken(token.tokenIndex)}
                        onMouseLeave={() => onHoverToken(null)}
                        onClick={() => {
                          onToggleLockToken(token.tokenIndex);
                          onSelectTokenForDetails(token.tokenIndex);
                        }}
                        className={`rounded px-2.5 py-1.5 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-100 text-amber-950 font-medium ring-1 ring-amber-300'
                            : 'hover:bg-neutral-100 text-neutral-700'
                        } ${isLocked ? 'ring-2 ring-amber-500' : ''}`}
                      >
                        {binaryMode === 'token-id' ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-neutral-500 tabular-nums">
                              {token.tokenIdHex}
                            </span>
                            <span className="text-neutral-300">→</span>
                            <span className="text-[11px] font-mono tracking-tight text-neutral-900 tabular-nums">
                              {token.tokenIdBinary}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[11px] text-neutral-500 flex gap-1">
                              {token.hexList.map((h, i) => (
                                <span key={i} className="bg-neutral-100 px-1 py-0.2 rounded text-[10px]">
                                  {h}
                                </span>
                              ))}
                            </div>
                            <span className="text-neutral-300">→</span>
                            <div className="text-[11px] font-mono tracking-tight text-neutral-900 truncate">
                              {token.binaryList.join(' ')}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Terminal Footer Info */}
            <div className="border-t border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] text-neutral-500 flex justify-between">
              <span>{binaryMode === 'token-id' ? 'ID (16/24-bit)' : 'UTF-8 byte stream'}</span>
              <span>Hover bit groups to synchronize</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
