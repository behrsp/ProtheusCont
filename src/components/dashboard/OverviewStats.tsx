'use client';

import React from 'react';
import { 
  LifeBuoy, 
  BookOpen, 
  FileSpreadsheet, 
  Building, 
  User, 
  ArrowRightLeft, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  History
} from 'lucide-react';
import { DashboardStats, SupportTicket, StandardLaunch, LaunchPoint } from '@/types';
import { MainTab } from '../layout/Sidebar';

interface OverviewStatsProps {
  stats: DashboardStats;
  recentTickets: SupportTicket[];
  recentLps: StandardLaunch[];
  recentPoints: LaunchPoint[];
  onNavigate: (tab: MainTab) => void;
  onOpenNewTicket: () => void;
  onOpenNewLp: () => void;
  onOpenNewPoint: () => void;
  onOpenNewDoc: () => void;
}

export function OverviewStats({
  stats,
  recentTickets,
  recentLps,
  recentPoints,
  onNavigate,
  onOpenNewTicket,
  onOpenNewLp,
  onOpenNewPoint,
  onOpenNewDoc
}: OverviewStatsProps) {
  return (
    <div className="space-y-6">
      
      {/* Banner Principal do Cofre Contábil Protheus */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Cofre & Repositório Seguro de LPs Protheus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestão & Manutenção de LPs Contábeis
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Consulte e grave com segurança todas as parametrizações de Lançamento Padrão, histórico de versões (Antes x Depois) e manuais técnicos de qualquer dispositivo.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-3">
            <button
              onClick={onOpenNewLp}
              className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-700" />
              + Novo LP Protheus
            </button>
            <button
              onClick={onOpenNewPoint}
              className="px-4 py-2 bg-indigo-600/70 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-300" />
              + Ponto (Antes x Depois)
            </button>
            <button
              onClick={onOpenNewDoc}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              + Manual / Regra CTB
            </button>
            <button
              onClick={onOpenNewTicket}
              className="px-4 py-2 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <LifeBuoy className="w-4 h-4 text-amber-300" />
              + Registrar Manutenção / Ocorrência
            </button>
          </div>
        </div>

        {/* Efeito visual background */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid de Métricas do Cofre Contábil */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: LPs Protheus */}
        <div 
          onClick={() => onNavigate('contabil')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Lançamentos Padrão
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalLPs}
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">
            LPs Salvos no Neon DB
          </div>
        </div>

        {/* KPI 2: Pontos de Lançamento */}
        <div 
          onClick={() => onNavigate('contabil')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Pontos de Lcto
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 group-hover:scale-110 transition-transform">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalLaunchPoints}
          </div>
          <div className="text-[10px] text-indigo-600 font-medium mt-1">
            Comparações Antes x Depois
          </div>
        </div>

        {/* KPI 3: Documentação */}
        <div 
          onClick={() => onNavigate('documentacao')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Manuais & Guias
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalDocs}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            Procedimentos & Regras
          </div>
        </div>

        {/* KPI 4: Histórico & Manutenções */}
        <div 
          onClick={() => onNavigate('suporte')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Histórico & Ocorrências
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 group-hover:scale-110 transition-transform">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalTickets}
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-1">
            Manutenções Registradas
          </div>
        </div>

        {/* KPI 5: Setores / Base */}
        <div 
          onClick={() => onNavigate('base')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Setores & Users
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 group-hover:scale-110 transition-transform">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalUsers}
          </div>
          <div className="text-[10px] text-cyan-600 font-medium mt-1">
            em {stats.totalSectors} setor(es)
          </div>
        </div>

      </div>

      {/* Grid Principal: LPs Recentes & Pontos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card: Lançamentos Padrão Recentes (LPs) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lançamentos Padrão Cadastrados (LPs)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('contabil')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentLps.slice(0, 4).map((lp) => (
                <div
                  key={lp.id}
                  onClick={() => onNavigate('contabil')}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800/80 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                      LP {lp.cod_lanc_pad} / Seq {lp.sequencial}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {lp.tipo_lcto}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {lp.lp_title || lp.descricao}
                  </h4>

                  {lp.cta_debito && (
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      <strong>D:</strong> {lp.cta_debito}
                    </div>
                  )}
                </div>
              ))}

              {recentLps.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  Nenhum LP cadastrado ainda.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onOpenNewLp}
            className="w-full mt-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Novo LP Protheus
          </button>
        </div>

        {/* Card: Pontos de Lançamento (Antes x Depois) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pontos de Lançamento (Antes x Depois)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('contabil')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentPoints.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigate('contabil')}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800/80 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {p.module_origin || 'SIGACTB'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Antes: {p.before_codigo || '-'} → Depois: {p.after_codigo || '-'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {p.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {p.notes || p.after_descricao}
                  </p>
                </div>
              ))}

              {recentPoints.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  Nenhum ponto comparativo cadastrado ainda.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onOpenNewPoint}
            className="w-full mt-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Ponto (Antes x Depois)
          </button>
        </div>

      </div>

    </div>
  );
}
