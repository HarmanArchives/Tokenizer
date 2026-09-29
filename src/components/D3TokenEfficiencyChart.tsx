import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TokenizerModelId, TokenizerModelOption } from '../types/tokenizer';
import { TOKENIZER_MODELS, tokenizeText } from '../tokenizer';
import { BarChart3, ArrowDownUp, Info, Check, Sparkles } from 'lucide-react';

interface D3TokenEfficiencyChartProps {
  inputText: string;
  selectedModel: TokenizerModelId;
  onSelectModel: (id: TokenizerModelId) => void;
}

interface ModelDataPoint {
  id: TokenizerModelId;
  name: string;
  shortName: string;
  category: string;
  tokenCount: number;
  charsPerToken: number;
  vocabSize: string;
  contextWindow: number;
  isSelected: boolean;
}

export const D3TokenEfficiencyChart: React.FC<D3TokenEfficiencyChartProps> = ({
  inputText,
  selectedModel,
  onSelectModel,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sortBy, setSortBy] = useState<'efficiency' | 'chronological' | 'vocab'>('efficiency');
  const [hoveredModel, setHoveredModel] = useState<ModelDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Compute token count for every model on current text
  const chartData: ModelDataPoint[] = useMemo(() => {
    return TOKENIZER_MODELS.map((model) => {
      const { stats } = tokenizeText(inputText, model.id);
      return {
        id: model.id,
        name: model.name,
        shortName: model.name.split(' (')[0],
        category: model.howItWorks.category,
        tokenCount: stats.tokenCount,
        charsPerToken: stats.charsPerToken,
        vocabSize: model.vocabSize,
        contextWindow: model.contextWindow,
        isSelected: model.id === selectedModel,
      };
    });
  }, [inputText, selectedModel]);

  // Sorted data according to user control
  const sortedData = useMemo(() => {
    const list = [...chartData];
    if (sortBy === 'efficiency') {
      // Fewest tokens (most compressed) first
      return list.sort((a, b) => a.tokenCount - b.tokenCount);
    }
    if (sortBy === 'vocab') {
      // Largest vocabulary first
      return list.sort((a, b) => {
        const vocabA = TOKENIZER_MODELS.find((m) => m.id === a.id)?.vocabCount || 0;
        const vocabB = TOKENIZER_MODELS.find((m) => m.id === b.id)?.vocabCount || 0;
        return vocabB - vocabA;
      });
    }
    // Chronological / default order in TOKENIZER_MODELS
    return list;
  }, [chartData, sortBy]);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 800;
    const height = Math.max(380, sortedData.length * 36 + 70);
    const margin = { top: 24, right: 90, bottom: 36, left: 160 };
    const width = containerWidth - margin.left - margin.right;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', containerWidth)
      .attr('height', height)
      .attr('viewBox', `0 0 ${containerWidth} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxCount = Math.max(d3.max(sortedData, (d) => d.tokenCount) || 1, 4);

    // Scales
    const x = d3
      .scaleLinear()
      .domain([0, maxCount * 1.08])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.name))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.24);

    // Subtle background grid lines
    const xGrid = d3
      .axisBottom(x)
      .ticks(Math.min(8, maxCount))
      .tickSize(height - margin.top - margin.bottom)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(xGrid)
      .selectAll('line')
      .attr('stroke', '#f0f0f0')
      .attr('stroke-dasharray', '2,2');

    g.select('.grid .domain').remove();

    // Bottom Axis
    const xAxis = d3
      .axisBottom(x)
      .ticks(Math.min(8, maxCount))
      .tickFormat((d) => `${d} tok`);

    g.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis)
      .attr('color', '#a3a3a3')
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', '#737373');

    // Left Axis (Model Names)
    const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

    const yAxisGroup = g.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();

    yAxisGroup
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('font-weight', (d) => {
        const item = sortedData.find((m) => m.name === d);
        return item?.isSelected ? '700' : '500';
      })
      .attr('fill', (d) => {
        const item = sortedData.find((m) => m.name === d);
        return item?.isSelected ? '#0a0a0a' : '#525252';
      })
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        const item = sortedData.find((m) => m.name === d);
        if (item) onSelectModel(item.id);
      });

    // Bars
    const barGroups = g
      .selectAll('.bar-group')
      .data(sortedData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(0,${y(d.name) || 0})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => onSelectModel(d.id))
      .on('mouseenter', (event, d) => {
        setHoveredModel(d);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      })
      .on('mousemove', (event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      })
      .on('mouseleave', () => {
        setHoveredModel(null);
        setTooltipPos(null);
      });

    // Background track
    barGroups
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', y.bandwidth())
      .attr('fill', '#f5f5f5')
      .attr('rx', 3);

    // Active fill bar with animated transition
    barGroups
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', y.bandwidth())
      .attr('rx', 3)
      .attr('fill', (d) => {
        if (d.isSelected) return '#0f172a'; // Deep primary dark for selected model
        if (d.id === 'byte-level') return '#94a3b8'; // Neutral slate for raw byte baseline
        return '#3b82f6'; // Clean developer blue for comparative models
      })
      .attr('fill-opacity', (d) => (d.isSelected ? 1 : 0.82))
      .attr('width', 0)
      .transition()
      .duration(450)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => Math.max(3, x(d.tokenCount)));

    // Value Labels on right side of bars
    barGroups
      .append('text')
      .attr('x', (d) => x(d.tokenCount) + 8)
      .attr('y', y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '11px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', (d) => (d.isSelected ? '700' : '500'))
      .attr('fill', (d) => (d.isSelected ? '#0f172a' : '#525252'))
      .text((d) => `${d.tokenCount} tok`);

    // "Active" pill indicator next to label if selected
    barGroups
      .filter((d) => d.isSelected)
      .append('text')
      .attr('x', (d) => x(d.tokenCount) + 52)
      .attr('y', y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '9px')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('font-weight', '700')
      .attr('fill', '#059669')
      .text('● ACTIVE');

  }, [sortedData, onSelectModel]);

  const bestModel = useMemo(() => {
    return [...chartData].sort((a, b) => a.tokenCount - b.tokenCount)[0];
  }, [chartData]);

  const worstModel = useMemo(() => {
    return [...chartData].sort((a, b) => b.tokenCount - a.tokenCount)[0];
  }, [chartData]);

  const savingsPct =
    worstModel && worstModel.tokenCount > 0 && bestModel
      ? Math.round(((worstModel.tokenCount - bestModel.tokenCount) / worstModel.tokenCount) * 100)
      : 0;

  return (
    <section id="efficiency-chart" className="border-b border-neutral-200 bg-white px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-neutral-800" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                06. D3 Token Efficiency & Compression Bar Chart
              </h2>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Live token counts for &ldquo;{inputText.slice(0, 30)}{inputText.length > 30 ? '…' : ''}&rdquo; across all models. Shorter bar = higher token compression.
            </p>
          </div>

          {/* Controls: Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
              <ArrowDownUp className="h-3 w-3" />
              Sort:
            </span>
            <div className="flex items-center rounded border border-neutral-200 bg-neutral-50 p-0.5">
              <button
                onClick={() => setSortBy('efficiency')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  sortBy === 'efficiency'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Efficiency (Fewest Tokens)
              </button>
              <button
                onClick={() => setSortBy('chronological')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  sortBy === 'chronological'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Model Lineage
              </button>
              <button
                onClick={() => setSortBy('vocab')}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  sortBy === 'vocab'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Vocabulary Size
              </button>
            </div>
          </div>
        </div>

        {/* Insight Banner */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50/70 px-4 py-2.5 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">Compression Leader: </span>
            <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {bestModel.name} ({bestModel.tokenCount} tokens)
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-500 font-mono">
              {bestModel.charsPerToken} chars/token
            </span>
          </div>

          <div className="text-[11px] text-neutral-500 font-mono">
            {savingsPct > 0 ? (
              <span>
                Saves <strong className="text-emerald-700 font-bold">{savingsPct}%</strong> sequence length vs {worstModel.shortName}
              </span>
            ) : (
              <span>Identical token sequence length</span>
            )}
          </div>
        </div>

        {/* D3 Canvas Container */}
        <div ref={containerRef} className="relative rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs overflow-hidden">
          <svg ref={svgRef} className="w-full overflow-visible" />

          {/* Interactive Tooltip */}
          {hoveredModel && tooltipPos && (
            <div
              className="pointer-events-none absolute z-20 rounded-md border border-neutral-300 bg-white/95 p-3 shadow-lg backdrop-blur-xs font-sans text-xs text-neutral-900 min-w-[210px] -translate-y-full -translate-x-1/2"
              style={{
                left: `${Math.min(Math.max(tooltipPos.x, 110), (containerRef.current?.clientWidth || 600) - 110)}px`,
                top: `${Math.max(tooltipPos.y - 12, 10)}px`,
              }}
            >
              <div className="font-bold text-xs text-neutral-900 border-b border-neutral-100 pb-1 mb-1.5 flex items-center justify-between">
                <span>{hoveredModel.name}</span>
                {hoveredModel.isSelected && (
                  <span className="text-[9px] font-mono text-emerald-600 uppercase font-bold">
                    Active
                  </span>
                )}
              </div>

              <div className="space-y-1 font-mono text-[11px] text-neutral-600">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Token Count:</span>
                  <span className="font-bold text-neutral-900 tabular-nums">
                    {hoveredModel.tokenCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Density:</span>
                  <span className="font-semibold text-neutral-800 tabular-nums">
                    {hoveredModel.charsPerToken} chars/tok
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Vocab Size:</span>
                  <span className="text-neutral-700">{hoveredModel.vocabSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Context Window:</span>
                  <span className="text-neutral-700 tabular-nums">
                    {hoveredModel.contextWindow.toLocaleString()} tok
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-neutral-100 text-[10px] text-neutral-400 font-sans">
                Click bar to select as active tokenizer
              </div>
            </div>
          )}
        </div>

        {/* Footer Notes */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-neutral-400">
          <span>Click any bar or axis label to set as active tokenizer</span>
          <span className="font-mono">Rendered natively with D3.js scaleLinear & scaleBand</span>
        </div>
      </div>
    </section>
  );
};
