'use client';

import React, { useState } from 'react';
import { Sector, UserApp } from '@/types';
import { 
  Building, 
  User, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Mail, 
  Briefcase, 
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';

interface SectorUserManagerProps {
  sectors: Sector[];
  users: UserApp[];
  loading: boolean;
  onRefresh: () => void;
  onSaveSector: (sector: Partial<Sector>) => Promise<void>;
  onDeleteSector: (id: number) => Promise<void>;
  onSaveUser: (user: Partial<UserApp>) => Promise<void>;
  onDeleteUser: (id: number) => Promise<void>;
}

export function SectorUserManager({
  sectors,
  users,
  loading,
  onRefresh,
  onSaveSector,
  onDeleteSector,
  onSaveUser,
  onDeleteUser
}: SectorUserManagerProps) {
  const [activeTab, setActiveTab] = useState<'setores' | 'usuarios'>('setores');
  const [search, setSearch] = useState('');

  // Modais de Cadastro
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [sectorForm, setSectorForm] = useState<Partial<Sector>>({
    name: '',
    code: '',
    description: '',
    color: '#3b82f6'
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserApp | null>(null);
  const [userForm, setUserForm] = useState<Partial<UserApp>>({
    name: '',
    email: '',
    sector_id: undefined,
    sector_name: '',
    role: '',
    avatar_url: ''
  });

  const [saving, setSaving] = useState(false);

  // Setores Handlers
  const handleOpenSectorModal = (sector?: Sector) => {
    if (sector) {
      setEditingSector(sector);
      setSectorForm(sector);
    } else {
      setEditingSector(null);
      setSectorForm({ name: '', code: '', description: '', color: '#3b82f6' });
    }
    setIsSectorModalOpen(true);
  };

  const handleSaveSectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorForm.name?.trim()) return;
    try {
      setSaving(true);
      await onSaveSector(sectorForm);
      setIsSectorModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  // Usuários Handlers
  const handleOpenUserModal = (user?: UserApp) => {
    if (user) {
      setEditingUser(user);
      setUserForm(user);
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        sector_id: sectors[0]?.id,
        sector_name: sectors[0]?.name || '',
        role: 'Analista Protheus',
        avatar_url: ''
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name?.trim()) return;
    try {
      setSaving(true);
      await onSaveUser(userForm);
      setIsUserModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const filteredSectors = sectors.filter((s) =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.sector_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Abas e Barra Superior */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('setores')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'setores'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Setores / Departamentos</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === 'setores' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {sectors.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'usuarios'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Usuários & Solicitantes</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === 'usuarios' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {users.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => (activeTab === 'setores' ? handleOpenSectorModal() : handleOpenUserModal())}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {activeTab === 'setores' ? 'Novo Setor' : 'Novo Usuário'}
          </button>
        </div>
      </div>

      {/* Conteúdo: SETORES */}
      {activeTab === 'setores' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSectors.map((sector) => (
            <div
              key={sector.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sector.color || '#3b82f6' }}
                    />
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {sector.code || 'CTB'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenSectorModal(sector)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir setor ${sector.name}?`)) onDeleteSector(sector.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {sector.name}
                </h3>

                {sector.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {sector.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {users.filter((u) => u.sector_id === sector.id).length} usuário(s) vinculados
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo: USUÁRIOS */}
      {activeTab === 'usuarios' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/90 p-5 shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h3>
                  {user.role && (
                    <span className="text-[11px] text-slate-500 block">
                      {user.role}
                    </span>
                  )}
                  {user.sector_name && (
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {user.sector_name}
                    </span>
                  )}
                  {user.email && (
                    <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenUserModal(user)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Excluir usuário ${user.name}?`)) onDeleteUser(user.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Setor */}
      {isSectorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingSector ? 'Editar Setor' : 'Novo Setor / Departamento'}
              </h3>
              <button onClick={() => setIsSectorModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSectorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Setor *
                </label>
                <input
                  type="text"
                  required
                  value={sectorForm.name || ''}
                  onChange={(e) => setSectorForm({ ...sectorForm, name: e.target.value })}
                  placeholder="Ex: Contabilidade Geral, Fiscal, Financeiro"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código Sigla
                  </label>
                  <input
                    type="text"
                    value={sectorForm.code || ''}
                    onChange={(e) => setSectorForm({ ...sectorForm, code: e.target.value })}
                    placeholder="Ex: CTB, FIS, FIN"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cor Identificadora
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sectorForm.color || '#3b82f6'}
                      onChange={(e) => setSectorForm({ ...sectorForm, color: e.target.value })}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0"
                    />
                    <span className="text-xs font-mono text-slate-500">{sectorForm.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={sectorForm.description || ''}
                  onChange={(e) => setSectorForm({ ...sectorForm, description: e.target.value })}
                  placeholder="Atividades e responsabilidades deste departamento..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSectorModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  {saving ? 'Salvando...' : 'Salvar Setor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Usuário */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário / Solicitante Protheus'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name || ''}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Ex: Mariana Santos (Contabilidade)"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email de Contato
                </label>
                <input
                  type="email"
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="usuario@empresa.com.br"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Setor
                  </label>
                  <select
                    value={userForm.sector_id || ''}
                    onChange={(e) => {
                      const sId = parseInt(e.target.value);
                      const s = sectors.find((x) => x.id === sId);
                      setUserForm({ ...userForm, sector_id: sId, sector_name: s?.name || '' });
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    value={userForm.role || ''}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    placeholder="Ex: Coordenador Contábil"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL do Avatar / Foto (Opcional)
                </label>
                <input
                  type="url"
                  value={userForm.avatar_url || ''}
                  onChange={(e) => setUserForm({ ...userForm, avatar_url: e.target.value })}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  {saving ? 'Salvando...' : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
