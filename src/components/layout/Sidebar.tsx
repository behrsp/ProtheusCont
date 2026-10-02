'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  LifeBuoy, 
  BookOpen, 
  FileSpreadsheet, 
  CheckSquare, 
  Building, 
  Layers, 
  ArrowRightLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type MainTab = 'dashboard' | 'contabil' | 'suporte' | 'documentacao' | 'base';

interface SidebarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  ticketCount?: number;
  docCount?: number;
  lpCount?: number;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  ticketCount = 0,
  docCount = 0,
  lpCount = 0
}: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard' as MainTab,
      label: 'Painel Geral',
      icon: LayoutDashboard,
      color: 'text-blue-500'
    },
    {
      id: 'contabil' as MainTab,
      label: 'Sessão CONTÁBIL (LPs)',
      sublabel: 'Pontos & LPs (Antes x Depois)',
      icon: FileSpreadsheet,
      count: lpCount,
      color: 'text-indigo-500'
    },
    {
      id: 'suporte' as MainTab,
      label: 'Histórico & Resoluções',
      sublabel: 'Problemas & Soluções c/ Fotos/Vídeos',
      icon: LifeBuoy,
      count: ticketCount,
      color: 'text-amber-500'
    },
    {
      id: 'documentacao' as MainTab,
      label: 'Manuais & Documentação',
      sublabel: 'Guias e Parametrizações Protheus',
      icon: BookOpen,
      count: docCount,
      color: 'text-emerald-500'
    },
    {
      id: 'base' as MainTab,
      label: 'Setores & Usuários',
      sublabel: 'Base Cadastral',
      icon: Building,
      color: 'text-cyan-500'
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        
        {/* Menu de Navegação */}
        <div className="space-y-1.5">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Módulos Principais
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : `bg-white dark:bg-slate-900 ${item.color} shadow-2xs`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs truncate">{item.label}</span>
                    {item.sublabel && (
                      <span className={`block text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Card Inferior: Suporte TOTVS ERP Protheus */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold">Protheus LP Manager</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Pronto para produção e deploy Vercel com persistência no Neon DB.
        </p>
      </div>

    </aside>
  );
}
