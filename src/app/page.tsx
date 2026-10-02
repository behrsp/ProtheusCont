'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sector, 
  UserApp, 
  SupportTicket, 
  Documentation, 
  LaunchPoint, 
  StandardLaunch, 
  DashboardStats 
} from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar, MainTab } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { OverviewStats } from '@/components/dashboard/OverviewStats';
import { SupportList } from '@/components/support/SupportList';
import { DocList } from '@/components/documentation/DocList';
import { ContabilView } from '@/components/contabil/ContabilView';
import { SectorUserManager } from '@/components/base/SectorUserManager';
import { SearchPaletteModal } from '@/components/common/SearchPaletteModal';
import { SupportModal } from '@/components/support/SupportModal';
import { LaunchPointModal } from '@/components/contabil/LaunchPointModal';
import { StandardLaunchModal } from '@/components/contabil/StandardLaunchModal';
import { DocModal } from '@/components/documentation/DocModal';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<MainTab>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState(false);

  // Estados de Dados
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    totalDocs: 0,
    totalLPs: 0,
    totalLaunchPoints: 0,
    totalTasks: 0,
    pendingTasks: 0,
    totalUsers: 0,
    totalSectors: 0,
  });

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [users, setUsers] = useState<UserApp[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [docs, setDocs] = useState<Documentation[]>([]);
  const [launchPoints, setLaunchPoints] = useState<LaunchPoint[]>([]);
  const [standardLaunches, setStandardLaunches] = useState<StandardLaunch[]>([]);

  // Estados de Loading
  const [loadingData, setLoadingData] = useState(true);

  // Preset para conversão de Suporte em Documentação
  const [presetDoc, setPresetDoc] = useState<Partial<Documentation> | null>(null);

  // Modais de Criação Rápida no Topo
  const [isQuickTicketOpen, setIsQuickTicketOpen] = useState(false);
  const [isQuickPointOpen, setIsQuickPointOpen] = useState(false);
  const [isQuickLpOpen, setIsQuickLpOpen] = useState(false);
  const [isQuickDocOpen, setIsQuickDocOpen] = useState(false);

  // Inicialização de Tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('protcontabil_theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('protcontabil_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('protcontabil_theme', 'light');
    }
  };

  // Carregar todos os dados do Neon DB
  const fetchAllData = async () => {
    try {
      setLoadingData(true);
      const [
        statsRes,
        sectorsRes,
        usersRes,
        ticketsRes,
        docsRes,
        pointsRes,
        lpsRes
      ] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()).catch(() => null),
        fetch('/api/sectors').then((r) => r.json()).catch(() => []),
        fetch('/api/users').then((r) => r.json()).catch(() => []),
        fetch('/api/support').then((r) => r.json()).catch(() => []),
        fetch('/api/documentation').then((r) => r.json()).catch(() => []),
        fetch('/api/launch-points').then((r) => r.json()).catch(() => []),
        fetch('/api/standard-launches').then((r) => r.json()).catch(() => [])
      ]);

      if (statsRes) setStats(statsRes);
      if (Array.isArray(sectorsRes)) setSectors(sectorsRes);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(ticketsRes)) setTickets(ticketsRes);
      if (Array.isArray(docsRes)) setDocs(docsRes);
      if (Array.isArray(pointsRes)) setLaunchPoints(pointsRes);
      if (Array.isArray(lpsRes)) setStandardLaunches(lpsRes);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers para Suporte
  const handleSaveTicket = async (ticket: Partial<SupportTicket>) => {
    const isEdit = !!ticket.id;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch('/api/support', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao salvar chamado');
    }
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    fetchAllData();
  };

  const handleDeleteTicket = async (id: number) => {
    await fetch(`/api/support?id=${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Conversão de Suporte em Documentação
  const handleConvertToDoc = (ticket: SupportTicket) => {
    setPresetDoc({
      title: `Manual: ${ticket.title}`,
      category: 'Guia Passo a Passo',
      module_protheus: ticket.module_protheus || 'SIGACTB',
      sector_id: ticket.sector_id,
      sector_name: ticket.sector_name,
      user_id: ticket.user_id,
      user_name: ticket.user_name,
      support_ticket_id: ticket.id,
      content: `Este manual foi gerado a partir da resolução do chamado #${ticket.id}.\n\nProblema original: ${ticket.problem_description}\n\nSolução aplicada: ${ticket.solution_description}`,
      steps: [
        {
          step_number: 1,
          title: 'Diagnóstico do Problema',
          instruction: ticket.problem_description
        },
        {
          step_number: 2,
          title: 'Aplicação da Correção no Protheus',
          instruction: ticket.solution_description || 'Executar parametrização conforme demonstrado.'
        }
      ],
      media_attachments: [...ticket.problem_media, ...ticket.solution_media],
      tags: [...(ticket.tags || []), 'SolucaoProtheus']
    });
    setCurrentTab('documentacao');
  };

  // Handlers para Documentação
  const handleSaveDoc = async (doc: Partial<Documentation>) => {
    const isEdit = !!doc.id;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch('/api/documentation', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao salvar documentação');
    }
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    fetchAllData();
  };

  const handleDeleteDoc = async (id: number) => {
    await fetch(`/api/documentation?id=${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Handlers para Pontos de Lançamento (Antes x Depois)
  const handleSavePoint = async (point: Partial<LaunchPoint>) => {
    const isEdit = !!point.id;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch('/api/launch-points', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(point)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao salvar ponto');
    }
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    fetchAllData();
  };

  const handleDeletePoint = async (id: number) => {
    await fetch(`/api/launch-points?id=${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Handlers para Lançamento Padrão (LPs)
  const handleSaveLp = async (lp: Partial<StandardLaunch>) => {
    const isEdit = !!lp.id;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch('/api/standard-launches', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lp)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao salvar LP');
    }
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    fetchAllData();
  };

  const handleDeleteLp = async (id: number) => {
    await fetch(`/api/standard-launches?id=${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Handlers para Setores e Usuários
  const handleSaveSector = async (sector: Partial<Sector>) => {
    const isEdit = !!sector.id;
    const method = isEdit ? 'PUT' : 'POST';
    await fetch('/api/sectors', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sector)
    });
    fetchAllData();
  };

  const handleDeleteSector = async (id: number) => {
    await fetch(`/api/sectors?id=${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  const handleSaveUser = async (user: Partial<UserApp>) => {
    const isEdit = !!user.id;
    const method = isEdit ? 'PUT' : 'POST';
    await fetch('/api/users', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    fetchAllData();
  };

  const handleDeleteUser = async (id: number) => {
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 antialiased font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        onOpenSearch={() => setIsSearchPaletteOpen(true)}
        onQuickAdd={() => setIsQuickLpOpen(true)}
        currentTab={currentTab}
      />

      <div className="flex-1 flex pb-16 md:pb-0">
        
        {/* Sidebar Desktop */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          ticketCount={tickets.length}
          docCount={docs.length}
          lpCount={standardLaunches.length + launchPoints.length}
        />

        {/* Conteúdo Principal Dinâmico */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {currentTab === 'dashboard' && (
            <OverviewStats
              stats={stats}
              recentTickets={tickets}
              recentLps={standardLaunches}
              recentPoints={launchPoints}
              onNavigate={setCurrentTab}
              onOpenNewTicket={() => setIsQuickTicketOpen(true)}
              onOpenNewLp={() => setIsQuickLpOpen(true)}
              onOpenNewPoint={() => setIsQuickPointOpen(true)}
              onOpenNewDoc={() => setIsQuickDocOpen(true)}
            />
          )}

          {currentTab === 'contabil' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Sessão Contábil: Pontos de Lançamento & LPs Protheus
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Gestão e gravação segura de LPs Protheus com visualizador Antes x Depois, abas completas e histórico de versões.
                </p>
              </div>

              <ContabilView
                launchPoints={launchPoints}
                standardLaunches={standardLaunches}
                loadingPoints={loadingData}
                loadingLps={loadingData}
                onRefreshPoints={fetchAllData}
                onRefreshLps={fetchAllData}
                onSavePoint={handleSavePoint}
                onDeletePoint={handleDeletePoint}
                onSaveLp={handleSaveLp}
                onDeleteLp={handleDeleteLp}
              />
            </div>
          )}

          {currentTab === 'suporte' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Histórico de Ocorrências & Resoluções
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Cadastre o erro relatado no Protheus com fotos/vídeos e documente como foi solucionado.
                </p>
              </div>

              <SupportList
                tickets={tickets}
                sectors={sectors}
                users={users}
                loading={loadingData}
                onRefresh={fetchAllData}
                onSave={handleSaveTicket}
                onDelete={handleDeleteTicket}
                onConvertToDoc={handleConvertToDoc}
              />
            </div>
          )}

          {currentTab === 'documentacao' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Manuais Técnicos & Regras de Parametrização
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Base de conhecimento com guias passo a passo, setor e usuário associados para cada procedimento contábil.
                </p>
              </div>

              <DocList
                documents={docs}
                sectors={sectors}
                users={users}
                loading={loadingData}
                onRefresh={fetchAllData}
                onSave={handleSaveDoc}
                onDelete={handleDeleteDoc}
                presetDoc={presetDoc}
                onClearPreset={() => setPresetDoc(null)}
              />
            </div>
          )}

          {currentTab === 'base' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Base Cadastral: Setores & Usuários
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Cadastro centralizado dos setores da empresa e usuários/solicitantes do ERP Protheus.
                </p>
              </div>

              <SectorUserManager
                sectors={sectors}
                users={users}
                loading={loadingData}
                onRefresh={fetchAllData}
                onSaveSector={handleSaveSector}
                onDeleteSector={handleDeleteSector}
                onSaveUser={handleSaveUser}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          )}

        </main>
      </div>

      {/* Navegação Mobile Inferior e Drawer */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDrawerOpen={isMobileDrawerOpen}
        onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        ticketCount={tickets.length}
        docCount={docs.length}
        lpCount={standardLaunches.length + launchPoints.length}
      />

      {/* Modal de Busca Global (Ctrl + K) */}
      <SearchPaletteModal
        isOpen={isSearchPaletteOpen}
        onClose={() => setIsSearchPaletteOpen(false)}
        tickets={tickets}
        docs={docs}
        lps={standardLaunches}
        points={launchPoints}
        onSelectResult={(tab) => setCurrentTab(tab)}
      />

      {/* Modais de Ação Rápida */}
      <SupportModal
        isOpen={isQuickTicketOpen}
        onClose={() => setIsQuickTicketOpen(false)}
        onSave={handleSaveTicket}
        sectors={sectors}
        users={users}
      />

      <LaunchPointModal
        isOpen={isQuickPointOpen}
        onClose={() => setIsQuickPointOpen(false)}
        onSave={handleSavePoint}
      />

      <StandardLaunchModal
        isOpen={isQuickLpOpen}
        onClose={() => setIsQuickLpOpen(false)}
        onSave={handleSaveLp}
      />

      <DocModal
        isOpen={isQuickDocOpen}
        onClose={() => setIsQuickDocOpen(false)}
        onSave={handleSaveDoc}
        sectors={sectors}
        users={users}
      />

    </div>
  );
}
