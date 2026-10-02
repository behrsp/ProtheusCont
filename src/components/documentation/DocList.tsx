'use client';

import React, { useState } from 'react';
import { Documentation, Sector, UserApp } from '@/types';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Eye, 
  Edit3, 
  Trash2, 
  Building, 
  User, 
  Layers, 
  ListOrdered,
  FileText,
  Printer
} from 'lucide-react';
import { DocModal } from './DocModal';
import { DocDetailModal } from './DocDetailModal';

interface DocListProps {
  documents: Documentation[];
  sectors: Sector[];
  users: UserApp[];
  loading: boolean;
  onRefresh: () => void;
  onSave: (doc: Partial<Documentation>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  presetDoc?: Partial<Documentation> | null;
  onClearPreset?: () => void;
}

export function DocList({
  documents,
  sectors,
  users,
  loading,
  onRefresh,
  onSave,
  onDelete,
  presetDoc,
  onClearPreset
}: DocListProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [moduleFilter, setModuleFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<Documentation> | null>(null);
  const [detailDoc, setDetailDoc] = useState<Documentation | null>(null);

  // Se veio presetDoc de um chamado de suporte
  React.useEffect(() => {
    if (presetDoc) {
      setEditingDoc(presetDoc);
      setIsModalOpen(true);
      if (onClearPreset) onClearPreset();
    }
  }, [presetDoc, onClearPreset]);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.content?.toLowerCase().includes(search.toLowerCase()) ||
      doc.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.sector_name?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'todos' || doc.category === categoryFilter;

    const matchesModule =
      moduleFilter === 'todos' || doc.module_protheus === moduleFilter;

    return matchesSearch && matchesCategory && matchesModule;
  });

  const handleOpenCreate = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: Documentation) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente remover esta documentação?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Busca e Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por manual, instrução, setor ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="todos">Todas as Categorias</option>
              <option value="Manual Técnico">Manual Técnico</option>
              <option value="Guia Passo a Passo">Guia Passo a Passo</option>
              <option value="Procedimento Operacional">Procedimento Operacional</option>
              <option value="FAQ Protheus">FAQ Protheus</option>
            </select>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="todos">Todos os Módulos</option>
              <option value="SIGACTB">SIGACTB - Contabilidade</option>
              <option value="SIGAFIN">SIGAFIN - Financeiro</option>
              <option value="SIGAFAT">SIGAFAT - Faturamento</option>
              <option value="SIGACOM">SIGACOM - Compras</option>
              <option value="SIGAEST">SIGAEST - Estoque</option>
              <option value="SIGAFIS">SIGAFIS - Fiscal</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Manual / Guia
        </button>
      </div>

      {/* Grid de Manuais e Guias */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Nenhum manual técnico ou guia cadastrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Documente manuais e tutoriais passo a passo a partir das soluções de problemas Protheus.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Criar Primeiro Manual
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Top Banner */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      {doc.category}
                    </span>
                    {doc.module_protheus && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                        {doc.module_protheus}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDetailDoc(doc)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Visualizar Manual"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(doc)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setDetailDoc(doc)}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2"
                  >
                    {doc.title}
                  </h3>

                  {/* Usuário e Setor */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{doc.sector_name || 'Geral'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{doc.user_name || 'Usuário'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {doc.content}
                  </p>

                  {/* Badges de Etapas */}
                  {doc.steps && doc.steps.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      <ListOrdered className="w-4 h-4" />
                      <span>{doc.steps.length} etapa(s) documentada(s)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDetailDoc(doc)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Abrir Guia Passo a Passo →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      <DocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        initialData={editingDoc}
        sectors={sectors}
        users={users}
      />

      <DocDetailModal
        doc={detailDoc}
        isOpen={!!detailDoc}
        onClose={() => setDetailDoc(null)}
      />
    </div>
  );
}
