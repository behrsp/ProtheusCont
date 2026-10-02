'use client';

import React from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  Layers, 
  Sparkles, 
  Database, 
  ExternalLink,
  Plus
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onQuickAdd: () => void;
  currentTab: string;
}

export function Navbar({
  darkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
  onOpenSearch,
  onQuickAdd,
  currentTab
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        
        {/* Lado Esquerdo: Mobile Menu + Título */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md font-bold text-sm">
              PC
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                ProtContábil
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Hub Protheus & Neon DB
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Busca, Ações e Alternador de Tema */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Botão de Busca Rápida (Cmd/Ctrl + K) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Pesquisar LPs, Suporte...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* Botão de Novo Rápido */}
          <button
            type="button"
            onClick={onQuickAdd}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar</span>
          </button>

          {/* Alternador de Modo Escuro / Claro */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title={darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Badge de Conexão Neon DB */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Neon DB Conectado</span>
          </div>

        </div>

      </div>
    </header>
  );
}
