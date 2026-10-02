'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  LifeBuoy, 
  BookOpen, 
  FileSpreadsheet, 
  CheckSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SupportTicket, Documentation, StandardLaunch, LaunchPoint, Task } from '@/types';
import { MainTab } from '../layout/Sidebar';

interface SearchPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: SupportTicket[];
  docs: Documentation[];
  lps: StandardLaunch[];
  points: LaunchPoint[];
  onSelectResult: (tab: MainTab, id?: number) => void;
}

export function SearchPaletteModal({
  isOpen,
  onClose,
  tickets,
  docs,
  lps,
  points,
  onSelectResult
}: SearchPaletteModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTickets = query
    ? tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.problem_description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredDocs = query
    ? docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.content.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredLps = query
    ? lps.filter(
        (lp) =>
          lp.cod_lanc_pad.toLowerCase().includes(query.toLowerCase()) ||
          lp.descricao?.toLowerCase().includes(query.toLowerCase()) ||
          lp.cta_debito?.toLowerCase().includes(query.toLowerCase()) ||
          lp.cta_credito?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredPoints = query
    ? points.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.before_codigo?.toLowerCase().includes(query.toLowerCase()) ||
          p.after_codigo?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults =
    filteredTickets.length > 0 ||
    filteredDocs.length > 0 ||
    filteredLps.length > 0 ||
    filteredPoints.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-scaleIn">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar em Suporte, Documentação, Lançamentos Padrão (LPs)..."
            className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-blue-500 opacity-60" />
              <p>Digite um código de LP (ex: 610), mensagem de erro do Protheus ou manual desejado...</p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          ) : (
            <>
              {/* LPs */}
              {filteredLps.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lançamentos Padrão (LPs)
                  </span>
                  {filteredLps.map((lp) => (
                    <div
                      key={lp.id}
                      onClick={() => {
                        onSelectResult('contabil', lp.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            LP {lp.cod_lanc_pad} / Seq {lp.sequencial}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {lp.descricao || lp.lp_title}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {/* Pontos de Lançamento */}
              {filteredPoints.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pontos de Lançamento (Antes x Depois)
                  </span>
                  {filteredPoints.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectResult('contabil', p.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {p.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Antes: {p.before_codigo} → Depois: {p.after_codigo}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {/* Suporte */}
              {filteredTickets.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Chamados de Suporte
                  </span>
                  {filteredTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectResult('suporte', t.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <LifeBuoy className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {t.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-sm">
                            {t.problem_description}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {/* Documentação */}
              {filteredDocs.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Manuais & Guias Técnicos
                  </span>
                  {filteredDocs.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        onSelectResult('documentacao', d.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {d.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-sm">
                            {d.content}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Pressione ESC para fechar</span>
          <span>Navegue instantaneamente pelo ERP</span>
        </div>

      </div>
    </div>
  );
}
