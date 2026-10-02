'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Check, Sparkles, AlertCircle, Copy } from 'lucide-react';
import { LaunchPoint } from '@/types';

interface LaunchPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (point: Partial<LaunchPoint>) => Promise<void>;
  initialData?: LaunchPoint | null;
}

export function LaunchPointModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: LaunchPointModalProps) {
  const [formData, setFormData] = useState<Partial<LaunchPoint>>({
    title: '',
    module_origin: 'SIGACOM',
    notes: '',
    before_codigo: '',
    before_descricao: '',
    before_cfg_online: true,
    before_operacao: '',
    before_tipo_integ: '1 - On Line',
    before_tipo_movto: '1 - Inclusao',
    after_codigo: '',
    after_descricao: '',
    after_cfg_online: true,
    after_operacao: '',
    after_tipo_integ: '1 - On Line',
    after_tipo_movto: '1 - Inclusao',
    status: 'Ativo',
    user_name: 'Analista Protheus'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        module_origin: 'SIGACOM',
        notes: '',
        before_codigo: '',
        before_descricao: '',
        before_cfg_online: true,
        before_operacao: '001',
        before_tipo_integ: '1 - On Line',
        before_tipo_movto: '1 - Inclusao',
        after_codigo: '',
        after_descricao: '',
        after_cfg_online: true,
        after_operacao: '001',
        after_tipo_integ: '1 - On Line',
        after_tipo_movto: '1 - Inclusao',
        status: 'Ativo',
        user_name: 'Analista Protheus'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleCopyBeforeToAfter = () => {
    setFormData((prev) => ({
      ...prev,
      after_codigo: prev.before_codigo,
      after_descricao: prev.before_descricao,
      after_cfg_online: prev.before_cfg_online,
      after_operacao: prev.before_operacao,
      after_tipo_integ: prev.before_tipo_integ,
      after_tipo_movto: prev.before_tipo_movto
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Informe o título do Ponto de Lançamento.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar ponto de lançamento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData ? 'Editar Ponto de Lançamento (Comparativo)' : 'Novo Ponto de Lançamento (Antes x Depois)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare configurações e parametrizações contábeis do Protheus
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

          {/* Dados Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título / Identificação do Ponto *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Ponto 610 - Entrada de NF com Frete FOB"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Módulo Protheus de Origem
              </label>
              <select
                value={formData.module_origin || 'SIGACOM'}
                onChange={(e) => setFormData({ ...formData, module_origin: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="SIGACTB">SIGACTB - Contabilidade Gerencial</option>
                <option value="SIGAFIN">SIGAFIN - Financeiro</option>
                <option value="SIGAFAT">SIGAFAT - Faturamento</option>
                <option value="SIGACOM">SIGACOM - Compras</option>
                <option value="SIGAEST">SIGAEST - Estoque/Custos</option>
                <option value="SIGAFIS">SIGAFIS - Livros Fiscais</option>
                <option value="SIGAGFE">SIGAGFE - Gestão de Frete</option>
                <option value="OUTROS">Outros Módulos</option>
              </select>
            </div>
          </div>

          {/* Botão para clonar Antes para Depois */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCopyBeforeToAfter}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copiar valores de "Como está (Antes)" para "Como ficou (Depois)"
            </button>
          </div>

          {/* COMPARADOR: ANTES vs DEPOIS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CARD: COMO ESTÁ (ANTES) */}
            <div className="p-5 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/15 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 dark:border-amber-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Como está (Antes / Original)
                  </h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold">
                  Origem
                </span>
              </div>

              {/* Codigo Lancamento (3 digitos) & Operacao (3 digitos) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código Lançamento (3 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.before_codigo || ''}
                    onChange={(e) => setFormData({ ...formData, before_codigo: e.target.value })}
                    placeholder="Ex: 610"
                    className="w-full px-3 py-1.5 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operação (3 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.before_operacao || ''}
                    onChange={(e) => setFormData({ ...formData, before_operacao: e.target.value })}
                    placeholder="Ex: 001"
                    className="w-full px-3 py-1.5 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Descricao (250 chars) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Descrição (máx. 250 caracteres)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {(formData.before_descricao || '').length}/250
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={250}
                  value={formData.before_descricao || ''}
                  onChange={(e) => setFormData({ ...formData, before_descricao: e.target.value })}
                  placeholder="Ex: Emissao Docto Entrada Compras"
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* CfgOnLine (SIM/NAO) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  CfgOnLine?
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="before_cfg_online"
                      checked={formData.before_cfg_online === true}
                      onChange={() => setFormData({ ...formData, before_cfg_online: true })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    SIM (Online)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="before_cfg_online"
                      checked={formData.before_cfg_online === false}
                      onChange={() => setFormData({ ...formData, before_cfg_online: false })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    NÃO (Off-line)
                  </label>
                </div>
              </div>

              {/* Tipo Integ & Tipo Movto */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo Integ
                  </label>
                  <select
                    value={formData.before_tipo_integ || '1 - On Line'}
                    onChange={(e) => setFormData({ ...formData, before_tipo_integ: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="1 - On Line">1 - On Line</option>
                    <option value="2 - OffLine">2 - OffLine</option>
                    <option value="3 - Ambos">3 - Ambos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo Movto
                  </label>
                  <select
                    value={formData.before_tipo_movto || '1 - Inclusao'}
                    onChange={(e) => setFormData({ ...formData, before_tipo_movto: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="1 - Inclusao">1 - Inclusao</option>
                    <option value="2 - Estorno">2 - Estorno</option>
                  </select>
                </div>
              </div>

            </div>

            {/* CARD: COMO FICOU (DEPOIS) */}
            <div className="p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/15 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80 dark:border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    Como ficou (Depois / Novo Ajuste)
                  </h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-semibold">
                  Ajustado
                </span>
              </div>

              {/* Codigo Lancamento (3 digitos) & Operacao (3 digitos) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código Lançamento (3 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.after_codigo || ''}
                    onChange={(e) => setFormData({ ...formData, after_codigo: e.target.value })}
                    placeholder="Ex: 610"
                    className="w-full px-3 py-1.5 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operação (3 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.after_operacao || ''}
                    onChange={(e) => setFormData({ ...formData, after_operacao: e.target.value })}
                    placeholder="Ex: 001"
                    className="w-full px-3 py-1.5 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Descricao (250 chars) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Descrição (máx. 250 caracteres)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {(formData.after_descricao || '').length}/250
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={250}
                  value={formData.after_descricao || ''}
                  onChange={(e) => setFormData({ ...formData, after_descricao: e.target.value })}
                  placeholder="Ex: Emissao Docto Entrada c/ Estorno"
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* CfgOnLine (SIM/NAO) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  CfgOnLine?
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="after_cfg_online"
                      checked={formData.after_cfg_online === true}
                      onChange={() => setFormData({ ...formData, after_cfg_online: true })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    SIM (Online)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="after_cfg_online"
                      checked={formData.after_cfg_online === false}
                      onChange={() => setFormData({ ...formData, after_cfg_online: false })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    NÃO (Off-line)
                  </label>
                </div>
              </div>

              {/* Tipo Integ & Tipo Movto */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo Integ
                  </label>
                  <select
                    value={formData.after_tipo_integ || '1 - On Line'}
                    onChange={(e) => setFormData({ ...formData, after_tipo_integ: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="1 - On Line">1 - On Line</option>
                    <option value="2 - OffLine">2 - OffLine</option>
                    <option value="3 - Ambos">3 - Ambos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo Movto
                  </label>
                  <select
                    value={formData.after_tipo_movto || '1 - Inclusao'}
                    onChange={(e) => setFormData({ ...formData, after_tipo_movto: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="1 - Inclusao">1 - Inclusao</option>
                    <option value="2 - Estorno">2 - Estorno</option>
                  </select>
                </div>
              </div>

            </div>

          </div>

          {/* Observações técnicas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Justificativa / Observações da Alteração
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Descreva o motivo da mudança na parametrização contábil, chamado relacionado ou chamado TOTVS..."
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
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
              {saving ? 'Salvando...' : <><Check className="w-4 h-4" /> Salvar Comparativo</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
