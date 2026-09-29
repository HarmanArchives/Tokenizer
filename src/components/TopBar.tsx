import React from 'react';
import { BookOpen, RefreshCw, FileJson } from 'lucide-react';

interface TopBarProps {
  onOpenGlossary: () => void;
  onOpenExport: () => void;
  onResetToDefault: () => void;
  selectedModelName: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenGlossary,
  onOpenExport,
  onResetToDefault,
  selectedModelName,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8">
      {/* Zone 1: Single text element wordmark in clean display typography */}
      <a href="/" className="text-base font-semibold tracking-tight text-neutral-900">
        TokenLab
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden items-center gap-6 text-xs font-medium text-neutral-600 md:flex">
        <a href="#pipeline" className="transition-colors hover:text-neutral-950">
          Pipeline
        </a>
        <a href="#terminals" className="transition-colors hover:text-neutral-950">
          Synchronized Terminals
        </a>
        <a href="#inspector" className="transition-colors hover:text-neutral-950">
          Character & Bit View
        </a>
        <a href="#matrix" className="transition-colors hover:text-neutral-950">
          Model Comparison
        </a>
        <a href="#compression" className="transition-colors hover:text-neutral-950">
          Compression Lab
        </a>
        <a href="#model-input" className="transition-colors hover:text-neutral-950">
          Model Input
        </a>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-mono text-neutral-600 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="truncate max-w-[130px]">{selectedModelName}</span>
        </div>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
          title="Export Tokenization Data & Statistics"
        >
          <FileJson className="h-3.5 w-3.5 text-neutral-600" />
          <span>Export JSON</span>
        </button>

        <button
          onClick={onOpenGlossary}
          className="flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
          title="Open Technical Glossary"
        >
          <BookOpen className="h-3.5 w-3.5 text-neutral-500" />
          <span className="hidden sm:inline">Glossary</span>
        </button>

        <button
          onClick={onResetToDefault}
          className="flex items-center gap-1 rounded bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Reset to default example"
        >
          <RefreshCw className="h-3 w-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};

