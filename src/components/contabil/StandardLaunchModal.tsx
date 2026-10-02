'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  BookOpen, 
  FileSpreadsheet, 
  DollarSign, 
  History as HistoryIcon, 
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { StandardLaunch } from '@/types';

interface StandardLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lp: Partial<StandardLaunch>) => Promise<void>;
  initialData?: StandardLaunch | null;
}

type TabType = 'cadastro' | 'entidades' | 'valores' | 'historico' | 'auditoria';

export function StandardLaunchModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: StandardLaunchModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cadastro');
  const [formData, setFormData] = useState<Partial<StandardLaunch>>({
    lp_title: '',
    // ABA Cadastro
    cod_lanc_pad: '',
    sequencial: '001',
    status: '1 - Ativo',
    descricao: '',
    tipo_lcto: '1 - Debito',
    tipo_sld: '1',
    // ABA Entidades (max 250)
    cta_debito: '',
    cta_credito: '',
    c_custo_deb: '',
    c_custo_crd: '',
    item_debito: '',
    item_credito: '',
    cl_vlr_deb: '',
    cl_vlr_cred: '',
    outro_inf_deb: '',
    outro_inf_cred: '',
    moed_fato_db: '',
    moed_fato_cr: '',
    // ABA Valores
    lcto_moedas: '100000',
    vlr_moeda1: '',
    vlr_moeda2: '',
    vlr_moeda3: '',
    vlr_moeda4: '',
    vlr_moeda5: '',
    // ABA Historico
    historico: '',
    hist_aglut: '',
    origem_lcto: '',
    rot_rastrear: '',
    tabela_orig: '',
    reg_origem: '',
    outros: '',
    updated_by: 'Analista Protheus'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        lp_title: '',
        cod_lanc_pad: '',
        sequencial: '001',
        status: '1 - Ativo',
        descricao: '',
        tipo_lcto: '3 - Partida Dobrada',
        tipo_sld: '1',
        cta_debito: '',
        cta_credito: '',
        c_custo_deb: '',
        c_custo_crd: '',
        item_debito: '',
        item_credito: '',
        cl_vlr_deb: '',
        cl_vlr_cred: '',
        outro_inf_deb: '',
        outro_inf_cred: '',
        moed_fato_db: '',
        moed_fato_cr: '',
        lcto_moedas: '100000',
        vlr_moeda1: '',
        vlr_moeda2: '',
        vlr_moeda3: '',
        vlr_moeda4: '',
        vlr_moeda5: '',
        historico: '',
        hist_aglut: '',
        origem_lcto: '',
        rot_rastrear: '',
        tabela_orig: '',
        reg_origem: '',
        outros: '',
        updated_by: 'Analista Protheus'
      });
    }
    setActiveTab('cadastro');
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cod_lanc_pad || !formData.sequencial) {
      setError('Código do Lançamento Padrão (3 dígitos) e Sequencial (3 dígitos) são obrigatórios.');
      setActiveTab('cadastro');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar Lançamento Padrão');
    } finally {
      setSaving(false);
    }
  };

  const handleRestorePrevious = () => {
    if (formData.previous_version && confirm('Deseja restaurar os dados da versão anterior gravada?')) {
      setFormData((prev) => ({
        ...prev,
        ...prev.previous_version
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData ? `Editar LP ${formData.cod_lanc_pad || ''} / ${formData.sequencial || ''}` : 'Novo Lançamento Padrão (LP Protheus)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Parametrização contábil padrão do TOTVS Protheus (CTBA080)
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

        {/* Abas de Navegação (Cadastro, Entidades, Valores, Histórico, Auditoria) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/40 px-6 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('cadastro')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'cadastro'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            ABA Cadastro
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('entidades')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'entidades'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            ABA Entidades
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('valores')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'valores'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            ABA Valores
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('historico')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'historico'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            ABA Histórico & Outros
          </button>

          {formData.previous_version && (
            <button
              type="button"
              onClick={() => setActiveTab('auditoria')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'auditoria'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 dark:border-amber-400 bg-white dark:bg-slate-900 rounded-t-lg'
                  : 'border-transparent text-amber-600 dark:text-amber-400 hover:text-amber-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Comparar Versão Anterior (Antes x Depois)
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA CADASTRO */}
          {/* ======================================================== */}
          {activeTab === 'cadastro' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Dados mestres do Lançamento Padrão Protheus. Códigos devem possuir 3 dígitos numéricos conforme dicionário padrão (ex: 610, 530, 500).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título Resumido / Apelido do LP
                </label>
                <input
                  type="text"
                  value={formData.lp_title || ''}
                  onChange={(e) => setFormData({ ...formData, lp_title: e.target.value })}
                  placeholder="Ex: LP 610/001 - Vlr Mercadorias NF Entrada Fornecedor"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cod Lanc Pad (3 dígitos) *
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.cod_lanc_pad || ''}
                    onChange={(e) => setFormData({ ...formData, cod_lanc_pad: e.target.value })}
                    placeholder="Ex: 610"
                    required
                    className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sequencial (3 dígitos) *
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.sequencial || ''}
                    onChange={(e) => setFormData({ ...formData, sequencial: e.target.value })}
                    placeholder="Ex: 001"
                    required
                    className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || '1 - Ativo'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="1 - Ativo">1 - Ativo</option>
                    <option value="2 - Inativo">2 - Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Descrição (campo texto máx. 250 caracteres)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {(formData.descricao || '').length}/250
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={250}
                  value={formData.descricao || ''}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Valor total das mercadorias da nota fiscal de entrada"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo Lcto
                  </label>
                  <select
                    value={formData.tipo_lcto || '1 - Debito'}
                    onChange={(e) => setFormData({ ...formData, tipo_lcto: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="1 - Debito">1 - Debito</option>
                    <option value="2 - Credito">2 - Credito</option>
                    <option value="3 - Partida Dobrada">3 - Partida Dobrada</option>
                    <option value="4 - Cont Histor">4 - Cont Histor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo SLD (2 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.tipo_sld || ''}
                    onChange={(e) => setFormData({ ...formData, tipo_sld: e.target.value })}
                    placeholder="Ex: 1"
                    className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA ENTIDADES */}
          {/* ======================================================== */}
          {activeTab === 'entidades' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-xs text-indigo-800 dark:text-indigo-300">
                  Contas contábeis, centros de custo, itens e classes de valor. Insira contas fixas (ex: <code className="font-mono font-bold">1.1.01.001</code>) ou fórmulas ADVPL (ex: <code className="font-mono font-bold">{`Posicione("SA2",1,xFilial("SA2")+SF1->F1_FORNECE+SF1->F1_LOJA,"A2_CONTA")`}</code>).
                </p>
              </div>

              {/* Contas Débito e Crédito */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cta Debito (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.cta_debito || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.cta_debito || ''}
                    onChange={(e) => setFormData({ ...formData, cta_debito: e.target.value })}
                    placeholder='Ex: Posicione("SB1",1,xFilial("SB1")+SD1->D1_COD,"B1_CONTA")'
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cta Credito (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.cta_credito || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.cta_credito || ''}
                    onChange={(e) => setFormData({ ...formData, cta_credito: e.target.value })}
                    placeholder='Ex: Posicione("SA2",1,xFilial("SA2")+SF1->F1_FORNECE+SF1->F1_LOJA,"A2_CONTA")'
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Centro de Custo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      c Custo Deb (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.c_custo_deb || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.c_custo_deb || ''}
                    onChange={(e) => setFormData({ ...formData, c_custo_deb: e.target.value })}
                    placeholder="Ex: SD1->D1_CC"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      c Custo Crd (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.c_custo_crd || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.c_custo_crd || ''}
                    onChange={(e) => setFormData({ ...formData, c_custo_crd: e.target.value })}
                    placeholder="Ex: SF1->F1_COND"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Item Débito e Crédito */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Item debito (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.item_debito || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.item_debito || ''}
                    onChange={(e) => setFormData({ ...formData, item_debito: e.target.value })}
                    placeholder="Ex: SD1->D1_ITEMCTA"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Item credito (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.item_credito || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.item_credito || ''}
                    onChange={(e) => setFormData({ ...formData, item_credito: e.target.value })}
                    placeholder="Ex: SD1->D1_ITEMCTA"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Classe de Valor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cl Vlr Deb (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.cl_vlr_deb || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.cl_vlr_deb || ''}
                    onChange={(e) => setFormData({ ...formData, cl_vlr_deb: e.target.value })}
                    placeholder="Ex: SD1->D1_CLVL"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Cl Vlr Cred (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.cl_vlr_cred || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.cl_vlr_cred || ''}
                    onChange={(e) => setFormData({ ...formData, cl_vlr_cred: e.target.value })}
                    placeholder="Ex: SD1->D1_CLVL"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Outras Informações e Moedas Fato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Outro Inf Deb (máx. 250 caracteres)
                  </label>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.outro_inf_deb || ''}
                    onChange={(e) => setFormData({ ...formData, outro_inf_deb: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Outro Inf Cred (máx. 250 caracteres)
                  </label>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.outro_inf_cred || ''}
                    onChange={(e) => setFormData({ ...formData, outro_inf_cred: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Moed fato DB (máx. 250 caracteres)
                  </label>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.moed_fato_db || ''}
                    onChange={(e) => setFormData({ ...formData, moed_fato_db: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Moed fato CR (máx. 250 caracteres)
                  </label>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.moed_fato_cr || ''}
                    onChange={(e) => setFormData({ ...formData, moed_fato_cr: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* ABA VALORES */}
          {/* ======================================================== */}
          {activeTab === 'valores' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Configure a máscara de moedas ativas (6 dígitos, ex: <code className="font-mono font-bold">100000</code> para Moeda 1 ativa) e as fórmulas ADVPL para cálculo dos valores das Moedas 1 a 5.
                </p>
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  lcto Moedas (6 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.lcto_moedas || ''}
                  onChange={(e) => setFormData({ ...formData, lcto_moedas: e.target.value })}
                  placeholder="100000"
                  className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Vlr Moeda 1 a 5 */}
              {[1, 2, 3, 4, 5].map((m) => {
                const key = `vlr_moeda${m}` as keyof StandardLaunch;
                const value = (formData[key] as string) || '';
                return (
                  <div key={m}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Vlr Moeda{m} (máx. 250 caracteres)
                      </label>
                      <span className="text-[10px] text-slate-400">{value.length}/250</span>
                    </div>
                    <input
                      type="text"
                      maxLength={250}
                      value={value}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder={m === 1 ? 'Ex: SD1->D1_TOTAL' : `Ex: Fórmula Moeda ${m}`}
                      className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA HISTORICO & OUTROS */}
          {/* ======================================================== */}
          {activeTab === 'historico' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                <p className="text-xs text-purple-800 dark:text-purple-300">
                  Campos de rastreabilidade contábil, histórico de lançamento e informações complementares do Protheus.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Histórico (máx. 250 caracteres)
                  </label>
                  <span className="text-[10px] text-slate-400">{(formData.historico || '').length}/250</span>
                </div>
                <input
                  type="text"
                  maxLength={250}
                  value={formData.historico || ''}
                  onChange={(e) => setFormData({ ...formData, historico: e.target.value })}
                  placeholder='Ex: "NF " + AllTrim(SF1->F1_DOC) + " SERIE " + AllTrim(SF1->F1_SERIE)'
                  className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Hist Aglut (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.hist_aglut || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.hist_aglut || ''}
                    onChange={(e) => setFormData({ ...formData, hist_aglut: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Origem Lcto (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.origem_lcto || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.origem_lcto || ''}
                    onChange={(e) => setFormData({ ...formData, origem_lcto: e.target.value })}
                    placeholder="Ex: MATA103"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rot Rastrear (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.rot_rastrear || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.rot_rastrear || ''}
                    onChange={(e) => setFormData({ ...formData, rot_rastrear: e.target.value })}
                    placeholder="Ex: CTBA500"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tabela Orig (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.tabela_orig || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.tabela_orig || ''}
                    onChange={(e) => setFormData({ ...formData, tabela_orig: e.target.value })}
                    placeholder="Ex: SD1"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Reg Origem (máx. 250 caracteres)
                    </label>
                    <span className="text-[10px] text-slate-400">{(formData.reg_origem || '').length}/250</span>
                  </div>
                  <input
                    type="text"
                    maxLength={250}
                    value={formData.reg_origem || ''}
                    onChange={(e) => setFormData({ ...formData, reg_origem: e.target.value })}
                    placeholder="Ex: SD1->(RecNo())"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Campo Outros com 500 caracteres */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Outros (máx. 500 caracteres para outras informações a mais que houver)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(formData.outros || '').length}/500
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={formData.outros || ''}
                  onChange={(e) => setFormData({ ...formData, outros: e.target.value })}
                  placeholder="Informações adicionais sobre regras de negócio, exceções por filial, tratamentos para TES específica ou chamados TOTVS relacionados..."
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* ABA AUDITORIA / COMPARADOR ANTES X DEPOIS */}
          {/* ======================================================== */}
          {activeTab === 'auditoria' && formData.previous_version && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-300">
                    Esta visualização compara o snapshot anterior com a configuração atual do LP.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRestorePrevious}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Restaurar Versão Anterior
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Versão Anterior */}
                <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 border-b border-amber-200 dark:border-amber-900/50 pb-1">
                    Como estava (Antes)
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p><strong>Conta Débito:</strong> {formData.previous_version.cta_debito || '(Vazio)'}</p>
                    <p><strong>Conta Crédito:</strong> {formData.previous_version.cta_credito || '(Vazio)'}</p>
                    <p><strong>Vlr Moeda 1:</strong> {formData.previous_version.vlr_moeda1 || '(Vazio)'}</p>
                    <p><strong>Histórico:</strong> {formData.previous_version.historico || '(Vazio)'}</p>
                    <p><strong>Outros:</strong> {formData.previous_version.outros || '(Vazio)'}</p>
                  </div>
                </div>

                {/* Versão Atual */}
                <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 border-b border-emerald-200 dark:border-emerald-900/50 pb-1">
                    Como está agora (Atual)
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p className={formData.cta_debito !== formData.previous_version.cta_debito ? 'bg-yellow-200/50 dark:bg-yellow-900/40 p-0.5 rounded font-bold' : ''}>
                      <strong>Conta Débito:</strong> {formData.cta_debito || '(Vazio)'}
                    </p>
                    <p className={formData.cta_credito !== formData.previous_version.cta_credito ? 'bg-yellow-200/50 dark:bg-yellow-900/40 p-0.5 rounded font-bold' : ''}>
                      <strong>Conta Crédito:</strong> {formData.cta_credito || '(Vazio)'}
                    </p>
                    <p className={formData.vlr_moeda1 !== formData.previous_version.vlr_moeda1 ? 'bg-yellow-200/50 dark:bg-yellow-900/40 p-0.5 rounded font-bold' : ''}>
                      <strong>Vlr Moeda 1:</strong> {formData.vlr_moeda1 || '(Vazio)'}
                    </p>
                    <p className={formData.historico !== formData.previous_version.historico ? 'bg-yellow-200/50 dark:bg-yellow-900/40 p-0.5 rounded font-bold' : ''}>
                      <strong>Histórico:</strong> {formData.historico || '(Vazio)'}
                    </p>
                    <p className={formData.outros !== formData.previous_version.outros ? 'bg-yellow-200/50 dark:bg-yellow-900/40 p-0.5 rounded font-bold' : ''}>
                      <strong>Outros:</strong> {formData.outros || '(Vazio)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">
                Aba atual: <strong className="capitalize">{activeTab}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-3">
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
                {saving ? 'Salvando...' : <><Check className="w-4 h-4" /> Salvar Lançamento Padrão</>}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
