'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, Sector, UserApp } from '@/types';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Building, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  ChevronLeft,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  sectors: Sector[];
  users: UserApp[];
  loading: boolean;
  onRefresh: () => void;
  onSaveTask: (task: Partial<Task>) => Promise<void>;
  onPatchStatus: (id: number, status: TaskStatus) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

const COLUMNS: { id: TaskStatus; title: string; color: string; badge: string }[] = [
  { id: 'todo', title: 'A Fazer', color: 'border-slate-300 dark:border-slate-700', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'in_progress', title: 'Em Andamento', color: 'border-blue-300 dark:border-blue-900', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  { id: 'waiting_totvs', title: 'Aguardando TOTVS / Validação', color: 'border-amber-300 dark:border-amber-900', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'done', title: 'Concluído', color: 'border-emerald-300 dark:border-emerald-900', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
];

export function TaskManager({
  tasks,
  sectors,
  users,
  loading,
  onRefresh,
  onSaveTask,
  onPatchStatus,
  onDeleteTask
}: TaskManagerProps) {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'media',
    assigned_to: undefined,
    assigned_name: '',
    sector_id: undefined,
    sector_name: '',
    module_protheus: 'SIGACTB',
    due_date: ''
  });

  const [saving, setSaving] = useState(false);

  const handleOpenModal = (task?: Task, defaultStatus?: TaskStatus) => {
    if (task) {
      setEditingTask(task);
      setTaskForm(task);
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        status: defaultStatus || 'todo',
        priority: 'media',
        assigned_to: users[0]?.id,
        assigned_name: users[0]?.name || '',
        sector_id: sectors[0]?.id,
        sector_name: sectors[0]?.name || '',
        module_protheus: 'SIGACTB',
        due_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title?.trim()) return;
    try {
      setSaving(true);
      await onSaveTask(taskForm);
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.assigned_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.sector_name?.toLowerCase().includes(search.toLowerCase());

    const matchesSector =
      sectorFilter === 'todos' || t.sector_name === sectorFilter;

    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Header com Filtros e Ações */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tarefas por título, responsável ou setor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os Setores</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Lista
            </button>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Visualização: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-100/70 dark:bg-slate-900/50 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[450px]"
              >
                {/* Header da Coluna */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {col.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenModal(undefined, col.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    title={`Nova tarefa em ${col.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards na Coluna */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {task.module_protheus || 'Protheus'}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          task.priority === 'urgente' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                          task.priority === 'alta' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[90px]">{task.assigned_name || 'Equipe'}</span>
                        </span>

                        {task.due_date && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </span>
                        )}
                      </div>

                      {/* Ações Rápidas de Mover Status */}
                      <div className="pt-1 flex items-center justify-between gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button
                              type="button"
                              onClick={() => onPatchStatus(task.id, col.id === 'done' ? 'waiting_totvs' : col.id === 'waiting_totvs' ? 'in_progress' : 'todo')}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Mover para coluna anterior"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              type="button"
                              onClick={() => onPatchStatus(task.id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'waiting_totvs' : 'done')}
                              className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Avançar status"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenModal(task)}
                            className="p-1 text-slate-400 hover:text-blue-500 rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Excluir esta tarefa?')) onDeleteTask(task.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-10 text-[11px] text-slate-400 italic">
                      Nenhuma tarefa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visualização: LISTA */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    COLUMNS.find((c) => c.id === task.status)?.badge
                  }`}>
                    {COLUMNS.find((c) => c.id === task.status)?.title}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 self-end sm:self-auto">
                <span>{task.assigned_name || 'Sem responsável'}</span>
                <span>{task.sector_name || 'Geral'}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenModal(task)} className="p-1 hover:text-blue-500">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteTask(task.id)} className="p-1 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição de Tarefas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTask ? 'Editar Tarefa Colaborativa' : 'Nova Tarefa Protheus'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title || ''}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Ex: Ajustar LP 530 para baixa de títulos bancários"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={taskForm.status || 'todo'}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">A Fazer</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="waiting_totvs">Aguardando TOTVS / Validação</option>
                    <option value="done">Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={taskForm.priority || 'media'}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">🔥 Urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Responsável
                  </label>
                  <select
                    value={taskForm.assigned_to || ''}
                    onChange={(e) => {
                      const uId = parseInt(e.target.value);
                      const u = users.find((x) => x.id === uId);
                      setTaskForm({ ...taskForm, assigned_to: uId, assigned_name: u?.name || '' });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Setor
                  </label>
                  <select
                    value={taskForm.sector_id || ''}
                    onChange={(e) => {
                      const sId = parseInt(e.target.value);
                      const s = sectors.find((x) => x.id === sId);
                      setTaskForm({ ...taskForm, sector_id: sId, sector_name: s?.name || '' });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Módulo Protheus
                  </label>
                  <select
                    value={taskForm.module_protheus || 'SIGACTB'}
                    onChange={(e) => setTaskForm({ ...taskForm, module_protheus: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SIGACTB">SIGACTB - Contabilidade</option>
                    <option value="SIGAFIN">SIGAFIN - Financeiro</option>
                    <option value="SIGAFAT">SIGAFAT - Faturamento</option>
                    <option value="SIGACOM">SIGACOM - Compras</option>
                    <option value="SIGAEST">SIGAEST - Estoque</option>
                    <option value="SIGAFIS">SIGAFIS - Fiscal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prazo / Vencimento
                  </label>
                  <input
                    type="date"
                    value={taskForm.due_date ? new Date(taskForm.due_date).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detalhes / Instruções
                </label>
                <textarea
                  rows={3}
                  value={taskForm.description || ''}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Detalhamento do que deve ser ajustado no ERP ou validado com o usuário..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  {saving ? 'Salvando...' : 'Salvar Tarefa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
