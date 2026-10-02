'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  LifeBuoy, 
  BookOpen, 
  FileSpreadsheet, 
  CheckSquare, 
  Building,
  X
} from 'lucide-react';
import { MainTab } from './Sidebar';

interface MobileNavProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  ticketCount?: number;
  docCount?: number;
  lpCount?: number;
  taskCount?: number;
}

export function MobileNav({
  currentTab,
  onSelectTab,
  isDrawerOpen,
  onCloseDrawer,
  ticketCount = 0,
  docCount = 0,
  lpCount = 0,
  taskCount = 0
}: MobileNavProps) {
  const navItems = [
    { id: 'dashboard' as MainTab, label: 'Início', icon: LayoutDashboard },
    { id: 'contabil' as MainTab, label: 'LPs Contábil', icon: FileSpreadsheet, count: lpCount },
    { id: 'suporte' as MainTab, label: 'Histórico', icon: LifeBuoy, count: ticketCount },
    { id: 'documentacao' as MainTab, label: 'Manuais', icon: BookOpen, count: docCount },
    { id: 'base' as MainTab, label: 'Setores/Users', icon: Building },
  ];

  return (
    <>
      {/* Barra Inferior Fixa Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Drawer Lateral Mobile */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex">
          <div className="w-72 bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-slate-800 animate-slideInLeft">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    PC
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    ProtContábil
                  </span>
                </div>
                <button
                  onClick={onCloseDrawer}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'dashboard' as MainTab, label: 'Painel Geral', icon: LayoutDashboard },
                  { id: 'contabil' as MainTab, label: 'Sessão Contábil (LPs & Pontos)', icon: FileSpreadsheet },
                  { id: 'suporte' as MainTab, label: 'Histórico & Resoluções', icon: LifeBuoy },
                  { id: 'documentacao' as MainTab, label: 'Manuais & Parametrizações', icon: BookOpen },
                  { id: 'base' as MainTab, label: 'Setores & Usuários', icon: Building },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseDrawer();
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-semibold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
              ProtContábil v1.0 • Neon DB
            </div>
          </div>

          <div className="flex-1" onClick={onCloseDrawer} />
        </div>
      )}
    </>
  );
}
