'use client';

import React, { useState } from 'react';
import { StandardLaunch } from '@/types';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Edit3, 
  Trash2, 
  Eye, 
  Code2, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Copy,
  Download
} from 'lucide-react';
import { StandardLaunchModal } from './StandardLaunchModal';

interface StandardLaunchListProps {
  launches: StandardLaunch[];
  loading: boolean;
  onRefresh: () => void;
  onSave: (lp: Partial<StandardLaunch>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function StandardLaunchList({
  launches,
  loading,
  onRefresh,
  onSave,
  onDelete
}: StandardLaunchListProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLaunch, setEditingLaunch] = useState<StandardLaunch | null>(null);
  const [viewingLaunch, setViewingLaunch] = useState<StandardLaunch | null>(null);

  const filteredLaunches = launches.filter((lp) => {
    const matchesSearch =
      !search ||
      lp.cod_lanc_pad?.toLowerCase().includes(search.toLowerCase()) ||
      lp.sequencial?.toLowerCase().includes(search.toLowerCase()) ||
      lp.lp_title?.toLowerCase().includes(search.toLowerCase()) ||
      lp.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      lp.cta_debito?.toLowerCase().includes(search.toLowerCase()) ||
      lp.cta_credito?.toLowerCase().includes(search.toLowerCase()) ||
      lp.historico?.toLowerCase().includes(search.toLowerCase()) ||
      lp.outros?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === 'todos' ||
      (filterType === 'debito' && lp.tipo_lcto?.includes('Debito')) ||
      (filterType === 'credito' && lp.tipo_lcto?.includes('Credito')) ||
      (filterType === 'partida' && lp.tipo_lcto?.includes('Partida Dobrada'));

    return matchesSearch && matchesType;
  });

  const handleOpenCreate = () => {
    setEditingLaunch(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lp: StandardLaunch) => {
    setEditingLaunch(lp);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente remover este Lançamento Padrão?')) {
      await onDelete(id);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(launches, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `LPs_Protheus_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
              placeholder="Buscar por código LP (ex: 610), sequencial, conta, histórico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os Tipos de Lcto</option>
            <option value="debito">Apenas Débito</option>
            <option value="credito">Apenas Crédito</option>
            <option value="partida">Partida Dobrada</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            title="Exportar LPs em JSON"
            className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo LP Protheus
          </button>
        </div>
      </div>

      {/* Tabela Responsiva de LPs */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredLaunches.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
          <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Nenhum Lançamento Padrão cadastrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Cadastre os LPs com regras de débitos, créditos, centros de custo, moedas e históricos do Protheus.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar LP 610/001
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLaunches.map((lp) => (
            <div
              key={lp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              {/* Top Banner */}
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-mono text-sm font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                    <span>LP {lp.cod_lanc_pad}</span>
                    <span className="text-slate-400">/</span>
                    <span>Seq {lp.sequencial}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    lp.status?.includes('Ativo')
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {lp.status}
                  </span>

                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium">
                    {lp.tipo_lcto}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingLaunch(lp)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Visualizar Detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(lp)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Editar LP"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lp.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lp.lp_title || lp.descricao || `Lançamento Padrão ${lp.cod_lanc_pad}/${lp.sequencial}`}
                  </h3>
                  {lp.tabela_orig && (
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Tab Orig: {lp.tabela_orig}
                    </span>
                  )}
                </div>

                {lp.descricao && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {lp.descricao}
                  </p>
                )}

                {/* Grid de Fórmulas e Regras */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 text-xs">
                  {lp.cta_debito && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                        Conta Débito
                      </span>
                      <code className="font-mono text-xs text-blue-700 dark:text-blue-400 break-all">
                        {lp.cta_debito}
                      </code>
                    </div>
                  )}

                  {lp.cta_credito && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                        Conta Crédito
                      </span>
                      <code className="font-mono text-xs text-emerald-700 dark:text-emerald-400 break-all">
                        {lp.cta_credito}
                      </code>
                    </div>
                  )}

                  {lp.vlr_moeda1 && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                        Valor Moeda 1
                      </span>
                      <code className="font-mono text-xs text-purple-700 dark:text-purple-400 break-all">
                        {lp.vlr_moeda1}
                      </code>
                    </div>
                  )}
                </div>

                {/* Histórico preview */}
                {lp.historico && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 pt-1 flex items-start gap-1.5 font-mono">
                    <span className="text-[10px] font-sans font-bold uppercase text-slate-500 shrink-0">
                      Histórico:
                    </span>
                    <span className="line-clamp-1 break-all">{lp.historico}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <StandardLaunchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        initialData={editingLaunch}
      />

      {/* Modal de Visualização Detalhada */}
      {viewingLaunch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-base px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
                  LP {viewingLaunch.cod_lanc_pad} / {viewingLaunch.sequencial}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {viewingLaunch.lp_title || 'Detalhes do Lançamento'}
                </h3>
              </div>
              <button
                onClick={() => setViewingLaunch(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5 text-xs font-mono">
              {/* Cadastro */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase font-sans text-xs">
                  Aba Cadastro
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <p><strong>Descrição:</strong> {viewingLaunch.descricao || '-'}</p>
                  <p><strong>Tipo Lcto:</strong> {viewingLaunch.tipo_lcto || '-'}</p>
                  <p><strong>Status:</strong> {viewingLaunch.status || '-'}</p>
                  <p><strong>Tipo SLD:</strong> {viewingLaunch.tipo_sld || '-'}</p>
                </div>
              </div>

              {/* Entidades */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase font-sans text-xs">
                  Aba Entidades
                </h4>
                <div className="space-y-1.5 text-slate-700 dark:text-slate-300 break-all">
                  <p><strong>Cta Débito:</strong> <span className="text-blue-600 dark:text-blue-400">{viewingLaunch.cta_debito || '-'}</span></p>
                  <p><strong>Cta Crédito:</strong> <span className="text-emerald-600 dark:text-emerald-400">{viewingLaunch.cta_credito || '-'}</span></p>
                  <p><strong>CC Débito:</strong> {viewingLaunch.c_custo_deb || '-'}</p>
                  <p><strong>CC Crédito:</strong> {viewingLaunch.c_custo_crd || '-'}</p>
                  <p><strong>Item Débito:</strong> {viewingLaunch.item_debito || '-'}</p>
                  <p><strong>Item Crédito:</strong> {viewingLaunch.item_credito || '-'}</p>
                  <p><strong>Cl Vlr Déb:</strong> {viewingLaunch.cl_vlr_deb || '-'}</p>
                  <p><strong>Cl Vlr Crd:</strong> {viewingLaunch.cl_vlr_cred || '-'}</p>
                </div>
              </div>

              {/* Valores */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase font-sans text-xs">
                  Aba Valores
                </h4>
                <div className="space-y-1.5 text-slate-700 dark:text-slate-300 break-all">
                  <p><strong>Lcto Moedas:</strong> {viewingLaunch.lcto_moedas || '100000'}</p>
                  <p><strong>Vlr Moeda 1:</strong> <span className="text-purple-600 dark:text-purple-400">{viewingLaunch.vlr_moeda1 || '-'}</span></p>
                  {viewingLaunch.vlr_moeda2 && <p><strong>Vlr Moeda 2:</strong> {viewingLaunch.vlr_moeda2}</p>}
                  {viewingLaunch.vlr_moeda3 && <p><strong>Vlr Moeda 3:</strong> {viewingLaunch.vlr_moeda3}</p>}
                  {viewingLaunch.vlr_moeda4 && <p><strong>Vlr Moeda 4:</strong> {viewingLaunch.vlr_moeda4}</p>}
                  {viewingLaunch.vlr_moeda5 && <p><strong>Vlr Moeda 5:</strong> {viewingLaunch.vlr_moeda5}</p>}
                </div>
              </div>

              {/* Histórico e Outros */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase font-sans text-xs">
                  Aba Histórico & Outros
                </h4>
                <div className="space-y-1.5 text-slate-700 dark:text-slate-300 break-all">
                  <p><strong>Histórico:</strong> {viewingLaunch.historico || '-'}</p>
                  <p><strong>Origem Lcto:</strong> {viewingLaunch.origem_lcto || '-'}</p>
                  <p><strong>Rot Rastrear:</strong> {viewingLaunch.rot_rastrear || '-'}</p>
                  <p><strong>Tabela Orig:</strong> {viewingLaunch.tabela_orig || '-'}</p>
                  <p><strong>Reg Origem:</strong> {viewingLaunch.reg_origem || '-'}</p>
                  {viewingLaunch.outros && <p><strong>Outros (500 chars):</strong> {viewingLaunch.outros}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewingLaunch(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs rounded-xl hover:bg-slate-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
