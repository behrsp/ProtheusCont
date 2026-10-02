'use client';

import React, { useState } from 'react';
import { LaunchPoint, StandardLaunch } from '@/types';
import { ArrowRightLeft, FileSpreadsheet, Layers, Sparkles } from 'lucide-react';
import { LaunchPointsList } from './LaunchPointsList';
import { StandardLaunchList } from './StandardLaunchList';

interface ContabilViewProps {
  launchPoints: LaunchPoint[];
  standardLaunches: StandardLaunch[];
  loadingPoints: boolean;
  loadingLps: boolean;
  onRefreshPoints: () => void;
  onRefreshLps: () => void;
  onSavePoint: (point: Partial<LaunchPoint>) => Promise<void>;
  onDeletePoint: (id: number) => Promise<void>;
  onSaveLp: (lp: Partial<StandardLaunch>) => Promise<void>;
  onDeleteLp: (id: number) => Promise<void>;
}

export function ContabilView({
  launchPoints,
  standardLaunches,
  loadingPoints,
  loadingLps,
  onRefreshPoints,
  onRefreshLps,
  onSavePoint,
  onDeletePoint,
  onSaveLp,
  onDeleteLp
}: ContabilViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pontos' | 'lancamentos'>('pontos');

  return (
    <div className="space-y-6">
      {/* Sub-Header com Abas Contábeis */}
      <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('pontos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'pontos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>PONTOS DE LANÇAMENTOS (Antes x Depois)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeSubTab === 'pontos' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {launchPoints.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('lancamentos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'lancamentos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>LANÇAMENTO PADRÃO (LPs Protheus)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeSubTab === 'lancamentos' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {standardLaunches.length}
            </span>
          </button>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      {activeSubTab === 'pontos' ? (
        <LaunchPointsList
          launchPoints={launchPoints}
          loading={loadingPoints}
          onRefresh={onRefreshPoints}
          onSave={onSavePoint}
          onDelete={onDeletePoint}
        />
      ) : (
        <StandardLaunchList
          launches={standardLaunches}
          loading={loadingLps}
          onRefresh={onRefreshLps}
          onSave={onSaveLp}
          onDelete={onDeleteLp}
        />
      )}
    </div>
  );
}
