import React, { useState, useMemo } from 'react';
import { TokenizerModelId, TokenMapping } from './types/tokenizer';
import { tokenizeText, TOKENIZER_MODELS } from './tokenizer';
import { TopBar } from './components/TopBar';
import { QueryInput } from './components/QueryInput';
import { PipelineOverview } from './components/PipelineOverview';
import { ThreeTerminalView } from './components/ThreeTerminalView';
import { CharacterByteInspector } from './components/CharacterByteInspector';
import { TokenEfficiencyBar } from './components/TokenEfficiencyBar';
import { ModelArchitectureProfile } from './components/ModelArchitectureProfile';
import { ModelComparisonMatrix } from './components/ModelComparisonMatrix';
import { D3TokenEfficiencyChart } from './components/D3TokenEfficiencyChart';
import { TokenizationDeepDive } from './components/TokenizationDeepDive';
import { CompressionLabView } from './components/CompressionLabView';
import { ModelInputPipeline } from './components/ModelInputPipeline';
import { GlossaryModal } from './components/GlossaryModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [inputText, setInputText] = useState<string>('hello world');
  const [selectedModel, setSelectedModel] = useState<TokenizerModelId>('gpt-4o');
  const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null);
  const [lockedTokenIndex, setLockedTokenIndex] = useState<number | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Synchronous real-time tokenization computation
  const { tokens, stats } = useMemo(() => {
    return tokenizeText(inputText, selectedModel);
  }, [inputText, selectedModel]);

  // Determine currently active or locked token for the deep character/bit inspector
  const currentTokenForInspector: TokenMapping | null = useMemo(() => {
    if (lockedTokenIndex !== null && tokens[lockedTokenIndex]) {
      return tokens[lockedTokenIndex];
    }
    if (activeTokenIndex !== null && tokens[activeTokenIndex]) {
      return tokens[activeTokenIndex];
    }
    return tokens[0] || null;
  }, [lockedTokenIndex, activeTokenIndex, tokens]);

  const handleToggleLockToken = (index: number) => {
    if (lockedTokenIndex === index) {
      setLockedTokenIndex(null);
    } else {
      setLockedTokenIndex(index);
    }
  };

  const handleResetToDefault = () => {
    setInputText('hello world');
    setSelectedModel('gpt-4o');
    setActiveTokenIndex(null);
    setLockedTokenIndex(null);
  };

  const handleLoadExample = (text: string) => {
    setInputText(text);
    setActiveTokenIndex(null);
    setLockedTokenIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentModelObj = TOKENIZER_MODELS.find((m) => m.id === selectedModel) || TOKENIZER_MODELS[0];

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans selection:bg-neutral-200">
      {/* 3-Zone Top Navigation Bar */}
      <TopBar
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onResetToDefault={handleResetToDefault}
        selectedModelName={currentModelObj.name}
      />

      <main className="flex-1">
        {/* Large Text / Query Input & Tokenizer Selector */}
        <QueryInput
          inputText={inputText}
          onChangeText={setInputText}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          stats={stats}
          onOpenExport={() => setIsExportOpen(true)}
        />

        {/* Section 01: Horizontal Transformation Pipeline */}
        <PipelineOverview
          stats={stats}
          tokens={tokens}
          onSelectStage={(stageId) => {
            const element = document.getElementById(
              stageId === 'llm' ? 'model-input' : stageId === 'text' || stageId === 'tokens' ? 'terminals' : 'inspector'
            );
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Section 02: Three-Synchronized-Terminal View (Text, Token/Numeric, Binary/Hex) */}
        <ThreeTerminalView
          tokens={tokens}
          activeTokenIndex={activeTokenIndex}
          lockedTokenIndex={lockedTokenIndex}
          onHoverToken={setActiveTokenIndex}
          onToggleLockToken={handleToggleLockToken}
          onSelectTokenForDetails={(idx) => {
            setActiveTokenIndex(idx);
          }}
        />

        {/* Section 03: Character-Level & Bit-Level Inspector */}
        <CharacterByteInspector
          selectedToken={currentTokenForInspector}
        />

        {/* Section 04: Token Efficiency & Context Window Allocation */}
        <TokenEfficiencyBar
          stats={stats}
          tokens={tokens}
          defaultContextWindow={currentModelObj.contextWindow}
        />

        {/* Section 05: Model Architecture & How It Works Profile */}
        <div id="models">
          <ModelArchitectureProfile
            currentModel={currentModelObj}
            onSelectModel={setSelectedModel}
          />
        </div>

        {/* Section 06: D3 Token Efficiency & Compression Bar Chart */}
        <div id="efficiency-chart">
          <D3TokenEfficiencyChart
            inputText={inputText}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>

        {/* Section 07: Live Cross-Model Comparison Matrix */}
        <div id="matrix">
          <ModelComparisonMatrix
            inputText={inputText}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>

        {/* Section 08: Educational Deep Dive ("Why One Word ≠ One Token") */}
        <TokenizationDeepDive
          currentModel={selectedModel}
          onLoadExample={handleLoadExample}
        />

        {/* Section 08: Compression Laboratory ("How Compression Saves Space") */}
        <CompressionLabView />

        {/* Section 09: "What Actually Goes Into the LLM?" */}
        <ModelInputPipeline tokens={tokens} />
      </main>

      {/* Footer conforming to domain-native restraint */}
      <footer className="border-t border-neutral-200 bg-white py-6 px-4 sm:px-8 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">TokenLab</span>
            <span>·</span>
            <span>Developer Laboratory for Tokenization & Encoding</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>Synchronous Browser Tokenizer</span>
            <span>·</span>
            <span>UTF-8 Bitstream Inspector</span>
            <span>·</span>
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="text-neutral-700 hover:text-neutral-950 underline font-medium cursor-pointer"
            >
              Glossary
            </button>
          </div>
        </div>
      </footer>

      {/* Technical Glossary Dialog */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Export Data Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        inputText={inputText}
        tokens={tokens}
        stats={stats}
        currentModel={currentModelObj}
      />
    </div>
  );
}
