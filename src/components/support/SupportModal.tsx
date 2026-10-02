'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  LifeBuoy, 
  User, 
  Building, 
  AlertCircle, 
  Upload, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { SupportTicket, Sector, UserApp, MediaAttachment } from '@/types';
import { MediaUpload } from '@/components/common/MediaUpload';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Partial<SupportTicket>) => Promise<void>;
  initialData?: SupportTicket | null;
  sectors: Sector[];
  users: UserApp[];
}

export function SupportModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  sectors,
  users
}: SupportModalProps) {
  const [formData, setFormData] = useState<Partial<SupportTicket>>({
    title: '',
    sector_id: undefined,
    sector_name: '',
    user_id: undefined,
    user_name: '',
    module_protheus: 'SIGACTB',
    status: 'aberto',
    priority: 'media',
    problem_description: '',
    problem_media: [],
    solution_description: '',
    solution_media: [],
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaultSector = sectors[0]?.name || 'Contabilidade Geral';
      const defaultUser = users[0]?.name || 'Usuário Protheus';
      setFormData({
        title: '',
        sector_id: sectors[0]?.id,
        sector_name: defaultSector,
        user_id: users[0]?.id,
        user_name: defaultUser,
        module_protheus: 'SIGACTB',
        status: 'aberto',
        priority: 'media',
        problem_description: '',
        problem_media: [],
        solution_description: '',
        solution_media: [],
        tags: ['SIGACTB']
      });
    }
    setError('');
  }, [initialData, isOpen, sectors, users]);

  if (!isOpen) return null;

  const handleSectorChange = (sectorId: number) => {
    const selected = sectors.find((s) => s.id === sectorId);
    setFormData((prev) => ({
      ...prev,
      sector_id: sectorId,
      sector_name: selected?.name || ''
    }));
  };

  const handleUserChange = (userId: number) => {
    const selected = users.find((u) => u.id === userId);
    setFormData((prev) => ({
      ...prev,
      user_id: userId,
      user_name: selected?.name || '',
      sector_id: selected?.sector_id || prev.sector_id,
      sector_name: selected?.sector_name || prev.sector_name
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTags = Array.from(new Set([...(formData.tags || []), tagInput.trim()]));
      setFormData({ ...formData, tags: newTags });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.problem_description?.trim()) {
      setError('Preencha o título e a descrição do problema.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar chamado de suporte');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData ? 'Editar Chamado de Suporte Protheus' : 'Novo Registro de Suporte (Problema & Resolução)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cadastre o erro relatado e documente a resolução com fotos e vídeos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Título & Módulo Protheus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título do Chamado / Incidente *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Erro ao contabilizar Documento de Entrada (LP 610)"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Módulo Protheus
              </label>
              <select
                value={formData.module_protheus || 'SIGACTB'}
                onChange={(e) => setFormData({ ...formData, module_protheus: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="SIGACTB">SIGACTB - Contabilidade</option>
                <option value="SIGAFIN">SIGAFIN - Financeiro</option>
                <option value="SIGAFAT">SIGAFAT - Faturamento</option>
                <option value="SIGACOM">SIGACOM - Compras</option>
                <option value="SIGAEST">SIGAEST - Estoque/Custos</option>
                <option value="SIGAFIS">SIGAFIS - Fiscal</option>
                <option value="SIGAPCP">SIGAPCP - Produção</option>
                <option value="SIGARH">SIGAGPE / RH - Folha</option>
                <option value="INFRA">Infra / TSS / DBA</option>
              </select>
            </div>
          </div>

          {/* Setor, Solicitante, Status e Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Setor / Departamento
              </label>
              <select
                value={formData.sector_id || ''}
                onChange={(e) => handleSectorChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Usuário / Solicitante
              </label>
              <select
                value={formData.user_id || ''}
                onChange={(e) => handleUserChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                Status do Chamado
              </label>
              <select
                value={formData.status || 'aberto'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
              >
                <option value="aberto">🟡 Aberto (Aguardando)</option>
                <option value="em_analise">🔵 Em Análise</option>
                <option value="resolvido">🟢 Resolvido</option>
                <option value="fechado">⚪ Fechado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prioridade
              </label>
              <select
                value={formData.priority || 'media'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">🔥 Urgente / Parada</option>
              </select>
            </div>
          </div>

          {/* SEÇÃO 1: DESCRIÇÃO DO PROBLEMA & UPLOAD DE MÍDIA */}
          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                1. Problema do Usuário no Protheus
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Descrição Detalhada do Erro / Comportamento Inesperado *
              </label>
              <textarea
                rows={3}
                value={formData.problem_description || ''}
                onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                placeholder="Descreva o que o usuário tentava fazer no Protheus, mensagens de erro exibidas (ex: LP 610 não encontrou conta), rotina acessada..."
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Upload de Fotos ou Vídeos do Problema */}
            <MediaUpload
              label="Upload de Fotos / Prints / Vídeos demonstrando o Problema"
              sublabel="Anexe capturas de tela com a mensagem de erro do Protheus ou vídeo curto da ocorrência"
              mediaList={formData.problem_media || []}
              onChange={(media) => setFormData({ ...formData, problem_media: media })}
            />
          </div>

          {/* SEÇÃO 2: COMO EU RESOLVI & UPLOAD DE MÍDIA DE RESOLUÇÃO */}
          <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                2. Como Foi Resolvido (Solução Aplicada)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Passo a Passo da Resolução / Correção no Protheus
              </label>
              <textarea
                rows={4}
                value={formData.solution_description || ''}
                onChange={(e) => setFormData({ ...formData, solution_description: e.target.value })}
                placeholder="Explique detalhadamente como o problema foi solucionado (ex: fórmula ajustada no LP, campo preenchido no cadastro SA2/SB1, reprocessamento de lote CTBA500, etc.)..."
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Upload de Fotos ou Vídeos da Resolução */}
            <MediaUpload
              label="Upload de Fotos / Vídeos para Demonstração da Resolução"
              sublabel="Anexe prints do LP corrigido, telas de sucesso ou gravação demonstrando o funcionamento correto"
              mediaList={formData.solution_media || []}
              onChange={(media) => setFormData({ ...formData, solution_media: media })}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tags / Palavras-chave (Pressione Enter para adicionar)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl">
              {(formData.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs rounded-lg flex items-center gap-1.5 font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-400 hover:text-blue-600 dark:hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Adicionar tag..."
                className="text-xs bg-transparent border-none text-slate-900 dark:text-white focus:outline-none px-1 flex-1 min-w-[120px]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              {saving ? 'Salvando...' : <><Check className="w-4 h-4" /> Salvar Registro de Suporte</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
