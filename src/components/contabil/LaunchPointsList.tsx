'use client';

import React, { useState } from 'react';
import { LaunchPoint } from '@/types';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Edit3, 
  Trash2, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { LaunchPointModal } from './LaunchPointModal';

interface LaunchPointsListProps {
  launchPoints: LaunchPoint[];
  loading: boolean;
  onRefresh: () => void;
  onSave: (point: Partial<LaunchPoint>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function LaunchPointsList({
  launchPoints,
  loading,
  onRefresh,
  onSave,
  onDelete
}: LaunchPointsListProps) {
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<LaunchPoint | null>(null);

  const filteredPoints = launchPoints.filter((lp) => {
    const matchesSearch =
      !search ||
      lp.title?.toLowerCase().includes(search.toLowerCase()) ||
      lp.before_codigo?.toLowerCase().includes(search.toLowerCase()) ||
      lp.after_codigo?.toLowerCase().includes(search.toLowerCase()) ||
      lp.before_descricao?.toLowerCase().includes(search.toLowerCase()) ||
      lp.after_descricao?.toLowerCase().includes(search.toLowerCase()) ||
      lp.notes?.toLowerCase().includes(search.toLowerCase());

    const matchesModule =
      selectedModule === 'todos' || lp.module_origin === selectedModule;

    return matchesSearch && matchesModule;
  });

  const handleOpenCreate = () => {
    setEditingPoint(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (point: LaunchPoint) => {
    setEditingPoint(point);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente remover este registro de Ponto de Lançamento?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Ações e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código (ex: 610), descrição ou notas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          Novo Ponto (Antes x Depois)
        </button>
      </div>

      {/* Grid de Cards Comparativos */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredPoints.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Nenhum ponto de lançamento encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Cadastre os pontos de lançamentos contábeis para comparar as parametrizações antes e depois de alterações no Protheus.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Primeiro Ponto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredPoints.map((lp) => (
            <div
              key={lp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Top */}
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {lp.module_origin || 'SIGACTB'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lp.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(lp)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body: Comparativo Lado a Lado */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                
                {/* Lado ANTES */}
                <div className="pt-3 md:pt-0 md:pr-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Como estava (Antes)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      Cód: {lp.before_codigo || '---'} | Op: {lp.before_operacao || '---'}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {lp.before_descricao || 'Sem descrição cadastrada'}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                    <span className={`px-2 py-0.5 rounded font-medium ${lp.before_cfg_online ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
                      CfgOnLine: {lp.before_cfg_online ? 'SIM' : 'NÃO'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
                      Integ: {lp.before_tipo_integ || '1 - On Line'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium">
                      Movto: {lp.before_tipo_movto || '1 - Inclusao'}
                    </span>
                  </div>
                </div>

                {/* Lado DEPOIS */}
                <div className="pt-4 md:pt-0 md:pl-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Como ficou (Depois)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                      Cód: {lp.after_codigo || '---'} | Op: {lp.after_operacao || '---'}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {lp.after_descricao || 'Sem descrição cadastrada'}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                    <span className={`px-2 py-0.5 rounded font-medium ${lp.after_cfg_online ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
                      CfgOnLine: {lp.after_cfg_online ? 'SIM' : 'NÃO'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
                      Integ: {lp.after_tipo_integ || '1 - On Line'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium">
                      Movto: {lp.after_tipo_movto || '1 - Inclusao'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Observações / Notas */}
              {lp.notes && (
                <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">Justificativa: </strong>
                  {lp.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <LaunchPointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        initialData={editingPoint}
      />
    </div>
  );
}
