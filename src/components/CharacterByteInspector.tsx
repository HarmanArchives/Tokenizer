import React, { useState } from 'react';
import { TokenMapping, ByteDetail } from '../types/tokenizer';
import { Binary, Layers, Info, ArrowDown, ChevronRight, Hash } from 'lucide-react';

interface CharacterByteInspectorProps {
  selectedToken: TokenMapping | null;
  onSelectByte?: (byteIndex: number | null) => void;
}

export const CharacterByteInspector: React.FC<CharacterByteInspectorProps> = ({
  selectedToken,
  onSelectByte,
}) => {
  const [activeByteIndex, setActiveByteIndex] = useState<number | null>(null);
  const [activeBitPos, setActiveBitPos] = useState<number | null>(null); // 7..0

  if (!selectedToken) {
    return (
      <section id="inspector" className="border-b border-neutral-200 bg-neutral-50/40 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-500">
            Select or hover any token in the terminals above to inspect character, byte, hex, and bit-level decomposition.
          </div>
        </div>
      </section>
    );
  }

  const inspectedByte: ByteDetail =
    activeByteIndex !== null && selectedToken.byteDetails[activeByteIndex]
      ? selectedToken.byteDetails[activeByteIndex]
      : selectedToken.byteDetails[0];

  const handleByteHover = (idx: number | null) => {
    setActiveByteIndex(idx);
    if (onSelectByte) onSelectByte(idx);
  };

  return (
    <section id="inspector" className="border-b border-neutral-200 bg-neutral-50/40 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              03. Character, Byte & Bit-Level Inspector
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Deep-dive inspection for selected Token #{selectedToken.tokenIndex + 1}: &ldquo;{selectedToken.displayValue}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            <div>
              <span className="text-neutral-400">Token ID: </span>
              <span className="font-semibold text-neutral-900 tabular-nums">{selectedToken.tokenId}</span>
            </div>
            <span>·</span>
            <div>
              <span className="text-neutral-400">Hex ID: </span>
              <span className="font-semibold text-neutral-900">{selectedToken.tokenIdHex}</span>
            </div>
            <span>·</span>
            <div>
              <span className="text-neutral-400">Bytes: </span>
              <span className="font-semibold text-neutral-900 tabular-nums">{selectedToken.bytes.length}</span>
            </div>
          </div>
        </div>

        {/* Main Inspector Card */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-2xs space-y-6">
          {/* 1. Character-to-Byte-to-Hex-to-Binary Correspondence Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-700">
                A. Character-to-Byte Correspondence Stream
              </span>
              <span className="text-[11px] text-neutral-400">
                Hover any column to trace Character ⇄ Byte ⇄ Hex ⇄ Binary
              </span>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-stretch gap-3 min-w-max">
                {selectedToken.byteDetails.map((bDetail, idx) => {
                  const isHovered = activeByteIndex === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => handleByteHover(idx)}
                      onMouseLeave={() => handleByteHover(null)}
                      className={`flex flex-col items-center rounded border p-3 cursor-pointer transition-all duration-100 ${
                        isHovered
                          ? 'border-amber-400 bg-amber-50/70 shadow-2xs scale-[1.02]'
                          : 'border-neutral-200 bg-neutral-50/40 hover:border-neutral-300 hover:bg-neutral-100/50'
                      }`}
                    >
                      {/* Character row */}
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">Char</span>
                      <span className="mt-1 font-mono text-base font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200 min-w-[28px] text-center">
                        {bDetail.char === ' ' ? '␣' : bDetail.char}
                      </span>

                      {/* Arrow */}
                      <ArrowDown className="my-1.5 h-3 w-3 text-neutral-300" />

                      {/* Decimal Byte */}
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">Byte (Dec)</span>
                      <span className="mt-0.5 font-mono text-xs font-semibold text-neutral-800 tabular-nums">
                        {bDetail.byteValue}
                      </span>

                      {/* Arrow */}
                      <ArrowDown className="my-1.5 h-3 w-3 text-neutral-300" />

                      {/* Hex */}
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">Hex (8-bit)</span>
                      <span className="mt-0.5 rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-xs text-white tabular-nums">
                        0x{bDetail.hex}
                      </span>

                      {/* Arrow */}
                      <ArrowDown className="my-1.5 h-3 w-3 text-neutral-300" />

                      {/* Binary */}
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">Binary</span>
                      <span className="mt-0.5 font-mono text-[11px] text-neutral-700 tracking-wider tabular-nums">
                        {bDetail.binary}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* 2. Bit-Level Visualization & Nibble Decomposition */}
          {inspectedByte && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Binary className="h-4 w-4 text-neutral-700" />
                  <span className="text-xs font-semibold text-neutral-800">
                    B. Bit-Level Architecture (Byte: {inspectedByte.byteValue} · 0x{inspectedByte.hex} · &lsquo;{inspectedByte.char}&rsquo;)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px]">
                    1 Byte = 8 Bits
                  </span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px]">
                    1 Hex Digit = 4 Bits (Nibble)
                  </span>
                </div>
              </div>

              {/* Bit Grid & Nibble Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: 8 Interactive Bit Cells */}
                <div className="rounded border border-neutral-200 bg-neutral-50/60 p-4">
                  <div className="flex justify-between items-center text-xs text-neutral-600 mb-2">
                    <span className="font-medium">Individual Bit Cells (MSB → LSB)</span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {activeBitPos !== null ? `Bit ${activeBitPos} highlighted` : 'Hover a bit'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 py-3">
                    {Array.from(inspectedByte.binary).map((bit, bitIdx) => {
                      const bitPower = 7 - bitIdx; // 7 down to 0
                      const isBitHovered = activeBitPos === bitPower;
                      const isHighNibble = bitIdx < 4;

                      return (
                        <div
                          key={bitIdx}
                          onMouseEnter={() => setActiveBitPos(bitPower)}
                          onMouseLeave={() => setActiveBitPos(null)}
                          className={`flex flex-col items-center cursor-pointer transition-all duration-100 ${
                            isBitHovered ? 'scale-110' : ''
                          }`}
                        >
                          <span className="text-[10px] font-mono text-neutral-400 mb-1">
                            b{bitPower}
                          </span>
                          <div
                            className={`flex h-10 w-9 items-center justify-center rounded border font-mono text-sm font-bold transition-colors ${
                              isBitHovered
                                ? 'bg-amber-400 text-neutral-950 border-amber-500 shadow-2xs'
                                : bit === '1'
                                ? 'bg-neutral-900 text-white border-neutral-950'
                                : 'bg-white text-neutral-400 border-neutral-300'
                            }`}
                          >
                            {bit}
                          </div>
                          <span className="text-[9px] font-mono text-neutral-400 mt-1">
                            2^{bitPower}={Math.pow(2, bitPower)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 text-center text-[11px] text-neutral-500">
                    Decimal Sum: {inspectedByte.binary.split('').map((b, i) => b === '1' ? Math.pow(2, 7 - i) : 0).filter(Boolean).join(' + ') || '0'} = <strong className="text-neutral-900">{inspectedByte.byteValue}</strong>
                  </div>
                </div>

                {/* Right: Nibble-to-Hex Transformation */}
                <div className="rounded border border-neutral-200 bg-neutral-50/60 p-4">
                  <div className="text-xs font-medium text-neutral-600 mb-2">
                    Hexadecimal Nibble Mapping (4 bits = 1 Hex digit)
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2">
                    {/* High Nibble */}
                    <div className="rounded border border-neutral-200 bg-white p-3 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                        High Nibble (Bits 7..4)
                      </div>
                      <div className="my-1 font-mono text-sm font-bold text-neutral-800 tracking-widest">
                        {inspectedByte.highNibbleBinary}
                      </div>
                      <ArrowDown className="mx-auto my-1 h-3 w-3 text-neutral-300" />
                      <div className="text-xs font-semibold text-neutral-900">
                        Hex Digit: <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded">{inspectedByte.highNibbleHex}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Dec: {parseInt(inspectedByte.highNibbleBinary, 2)}
                      </div>
                    </div>

                    {/* Low Nibble */}
                    <div className="rounded border border-neutral-200 bg-white p-3 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                        Low Nibble (Bits 3..0)
                      </div>
                      <div className="my-1 font-mono text-sm font-bold text-neutral-800 tracking-widest">
                        {inspectedByte.lowNibbleBinary}
                      </div>
                      <ArrowDown className="mx-auto my-1 h-3 w-3 text-neutral-300" />
                      <div className="text-xs font-semibold text-neutral-900">
                        Hex Digit: <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded">{inspectedByte.lowNibbleHex}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Dec: {parseInt(inspectedByte.lowNibbleBinary, 2)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 rounded bg-white px-3 py-2 text-center text-xs font-mono text-neutral-700 border border-neutral-200">
                    Combined Hex Byte: <strong className="text-neutral-950 font-bold">0x{inspectedByte.hex}</strong> · Character: &lsquo;<strong className="text-neutral-950">{inspectedByte.char}</strong>&rsquo;
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
