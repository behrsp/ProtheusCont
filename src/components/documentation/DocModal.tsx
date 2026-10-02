'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  BookOpen, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Layers, 
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { Documentation, DocStep, Sector, UserApp } from '@/types';
import { MediaUpload } from '@/components/common/MediaUpload';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Partial<Documentation>) => Promise<void>;
  initialData?: Partial<Documentation> | null;
  sectors: Sector[];
  users: UserApp[];
}

export function DocModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  sectors,
  users
}: DocModalProps) {
  const [formData, setFormData] = useState<Partial<Documentation>>({
    title: '',
    category: 'Manual Técnico',
    module_protheus: 'SIGACTB',
    sector_id: undefined,
    sector_name: '',
    user_id: undefined,
    user_name: '',
    content: '',
    steps: [],
    media_attachments: [],
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Manual Técnico',
        module_protheus: initialData.module_protheus || 'SIGACTB',
        sector_id: initialData.sector_id || sectors[0]?.id,
        sector_name: initialData.sector_name || sectors[0]?.name || '',
        user_id: initialData.user_id || users[0]?.id,
        user_name: initialData.user_name || users[0]?.name || '',
        content: initialData.content || '',
        steps: initialData.steps || [],
        media_attachments: initialData.media_attachments || [],
        tags: initialData.tags || ['Protheus'],
        support_ticket_id: initialData.support_ticket_id
      });
    } else {
      setFormData({
        title: '',
        category: 'Manual Técnico',
        module_protheus: 'SIGACTB',
        sector_id: sectors[0]?.id,
        sector_name: sectors[0]?.name || '',
        user_id: users[0]?.id,
        user_name: users[0]?.name || '',
        content: '',
        steps: [
          { step_number: 1, title: 'Acessar Rotina no Protheus', instruction: 'Navegue no menu do Protheus até a rotina desejada...' }
        ],
        media_attachments: [],
        tags: ['Manual', 'SIGACTB']
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

  const handleAddStep = () => {
    const currentSteps = formData.steps || [];
    const nextNumber = currentSteps.length + 1;
    setFormData({
      ...formData,
      steps: [
        ...currentSteps,
        {
          step_number: nextNumber,
          title: `Passo ${nextNumber}`,
          instruction: ''
        }
      ]
    });
  };

  const handleRemoveStep = (index: number) => {
    const updated = (formData.steps || [])
      .filter((_, i) => i !== index)
      .map((step, idx) => ({ ...step, step_number: idx + 1 }));
    setFormData({ ...formData, steps: updated });
  };

  const handleStepChange = (index: number, field: keyof DocStep, val: any) => {
    const updated = [...(formData.steps || [])];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, steps: updated });
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
    if (!formData.title?.trim() || !formData.content?.trim()) {
      setError('Preencha o título e o conteúdo geral do manual.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar documentação');
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
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData?.id ? 'Editar Manual / Guia Técnico' : 'Novo Manual Técnico & Guia Passo a Passo'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Documente procedimentos técnicos e operacionais do Protheus
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

          {/* Título, Categoria e Módulo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título do Manual / Procedimento *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Manual de Configuração de LP 610 e Contabilização CTBA500"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={formData.category || 'Manual Técnico'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Manual Técnico">Manual Técnico</option>
                <option value="Guia Passo a Passo">Guia Passo a Passo</option>
                <option value="Procedimento Operacional">Procedimento Operacional</option>
                <option value="FAQ Protheus">FAQ Protheus</option>
              </select>
            </div>
          </div>

          {/* Setor, Solicitante / Autor, Módulo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Setor Responsável
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
                Autor / Especialista
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
                Módulo Protheus
              </label>
              <select
                value={formData.module_protheus || 'SIGACTB'}
                onChange={(e) => setFormData({ ...formData, module_protheus: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="SIGACTB">SIGACTB - Contabilidade</option>
                <option value="SIGAFIN">SIGAFIN - Financeiro</option>
                <option value="SIGAFAT">SIGAFAT - Faturamento</option>
                <option value="SIGACOM">SIGACOM - Compras</option>
                <option value="SIGAEST">SIGAEST - Estoque/Custos</option>
                <option value="SIGAFIS">SIGAFIS - Fiscal</option>
                <option value="OUTROS">Outros Módulos</option>
              </select>
            </div>
          </div>

          {/* Visão Geral / Conteúdo Principal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Visão Geral / Introdução do Procedimento *
            </label>
            <textarea
              rows={3}
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Descreva o objetivo deste manual, quando deve ser executado e pré-requisitos necessários no Protheus..."
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* ESTRUTURAÇÃO PASSO A PASSO (GUIAS TÉCNICOS) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Etapas do Passo a Passo (Instruções Detalhadas)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Passo
              </button>
            </div>

            {(formData.steps || []).map((step, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      {step.step_number}
                    </span>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                      placeholder={`Título da Etapa ${step.step_number}`}
                      className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    title="Remover etapa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={step.instruction}
                  onChange={(e) => handleStepChange(index, 'instruction', e.target.value)}
                  placeholder="Instrução detalhada desta etapa (ex: Clique na opção 'Ações Relacionadas' -> 'Auditar Lançamentos')..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
          </div>

          {/* Anexos de Mídia Gerais */}
          <MediaUpload
            label="Anexos Gerais de Imagens e Vídeos do Manual"
            sublabel="Adicione fluxogramas, diagramas de LPs ou gravações de procedimentos completos"
            mediaList={formData.media_attachments || []}
            onChange={(media) => setFormData({ ...formData, media_attachments: media })}
          />

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tags / Palavras-chave
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl">
              {(formData.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-1.5 font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-emerald-500 hover:text-emerald-700"
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
              {saving ? 'Salvando...' : <><Check className="w-4 h-4" /> Salvar Manual</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
