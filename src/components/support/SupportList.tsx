'use client';

import React, { useState } from 'react';
import { 
  SupportTicket, 
  Sector, 
  UserApp, 
  Documentation 
} from '@/types';
import { 
  Plus, 
  Search, 
  Filter, 
  LifeBuoy, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Video, 
  Image as ImageIcon,
  Building,
  User
} from 'lucide-react';
import { SupportModal } from './SupportModal';
import { SupportDetailModal } from './SupportDetailModal';

interface SupportListProps {
  tickets: SupportTicket[];
  sectors: Sector[];
  users: UserApp[];
  loading: boolean;
  onRefresh: () => void;
  onSave: (ticket: Partial<SupportTicket>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onConvertToDoc?: (ticket: SupportTicket) => void;
}

export function SupportList({
  tickets,
  sectors,
  users,
  loading,
  onRefresh,
  onSave,
  onDelete,
  onConvertToDoc
}: SupportListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [moduleFilter, setModuleFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
  const [detailTicket, setDetailTicket] = useState<SupportTicket | null>(null);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.problem_description?.toLowerCase().includes(search.toLowerCase()) ||
      t.solution_description?.toLowerCase().includes(search.toLowerCase()) ||
      t.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.sector_name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' || t.status === statusFilter;

    const matchesModule =
      moduleFilter === 'todos' || t.module_protheus === moduleFilter;

    return matchesSearch && matchesStatus && matchesModule;
  });

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ticket: SupportTicket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente remover este chamado de suporte?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Ações, Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por chamado, problema, erro, usuário ou setor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="todos">Todos os Status</option>
              <option value="aberto">🟡 Abertos</option>
              <option value="em_analise">🔵 Em Análise</option>
              <option value="resolvido">🟢 Resolvidos</option>
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
          Novo Chamado / Resolução
        </button>
      </div>

      {/* Grid de Chamados de Suporte */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-52 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
          <LifeBuoy className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Nenhum registro de suporte encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Registre os problemas relatados pelos usuários no Protheus e as resoluções técnicas aplicadas com fotos e vídeos.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Chamado
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Top Bar */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {ticket.module_protheus || 'SIGACTB'}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      ticket.status === 'resolvido'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : ticket.status === 'em_analise'
                        ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {ticket.status === 'resolvido' ? '🟢 Resolvido' : ticket.status === 'em_analise' ? '🔵 Em Análise' : '🟡 Aberto'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDetailTicket(ticket)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Ver Detalhes e Fotos"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(ticket)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setDetailTicket(ticket)}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-1"
                  >
                    {ticket.title}
                  </h3>

                  {/* Usuário e Setor */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{ticket.sector_name || 'Geral'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{ticket.user_name || 'Usuário'}</span>
                    </div>
                  </div>

                  {/* Descrição do Problema */}
                  <div className="p-3 bg-amber-50/40 dark:bg-amber-950/15 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-1">
                      Problema:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                      {ticket.problem_description}
                    </p>
                  </div>

                  {/* Resolução */}
                  {ticket.solution_description && (
                    <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/15 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">
                        Resolução:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                        {ticket.solution_description}
                      </p>
                    </div>
                  )}

                  {/* Badges de Mídia anexada */}
                  <div className="flex items-center gap-2 pt-1">
                    {ticket.problem_media && ticket.problem_media.length > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {ticket.problem_media.length} foto/vídeo do erro
                      </span>
                    )}

                    {ticket.solution_media && ticket.solution_media.length > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {ticket.solution_media.length} demo da solução
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer com Botão de Conversão em Manual */}
              <div className="px-5 py-3 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDetailTicket(ticket)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ver resolução completa →
                </button>

                {ticket.solution_description && onConvertToDoc && (
                  <button
                    type="button"
                    onClick={() => onConvertToDoc(ticket)}
                    className="px-2.5 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Criar Guia Passo a Passo na Documentação"
                  >
                    <Sparkles className="w-3 h-3" />
                    Gerar Manual
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      <SupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        initialData={editingTicket}
        sectors={sectors}
        users={users}
      />

      <SupportDetailModal
        ticket={detailTicket}
        isOpen={!!detailTicket}
        onClose={() => setDetailTicket(null)}
        onConvertToDoc={onConvertToDoc}
      />
    </div>
  );
}
