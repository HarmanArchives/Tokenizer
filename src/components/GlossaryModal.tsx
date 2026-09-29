import React, { useState } from 'react';
import { GLOSSARY_TERMS, GlossaryItem } from '../data/glossary';
import { X, Search, BookOpen } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const termsList = Object.values(GLOSSARY_TERMS);

  const filtered = termsList.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.detailed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-neutral-300 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-neutral-700" />
            <h2 className="text-sm font-semibold text-neutral-900">Technical Glossary & Reference</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-3 space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts (e.g. BPE, Token ID, Byte, Embedding)..."
              className="w-full rounded border border-neutral-300 bg-white py-1.5 pl-8 pr-3 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'LLM & Model', 'Data & Encoding', 'Algorithms'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-200/70 border border-neutral-200'
                }`}
              >
                {cat === 'all' ? 'All Concepts' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 italic">
              No matching terms found.
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="rounded border border-neutral-200 p-3.5 hover:border-neutral-300 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-neutral-900">{item.term}</h3>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600 font-medium">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-neutral-800 mb-1.5">{item.shortDef}</p>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{item.detailed}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50 flex justify-between items-center text-[11px] text-neutral-500">
          <span>{filtered.length} terms shown</span>
          <button
            onClick={onClose}
            className="rounded bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
