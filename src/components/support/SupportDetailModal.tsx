'use client';

import React, { useState } from 'react';
import { 
  X, 
  LifeBuoy, 
  Building, 
  User, 
  Calendar, 
  Tag, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Video, 
  Image as ImageIcon,
  Share2,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SupportTicket, MediaAttachment } from '@/types';

interface SupportDetailModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToDoc?: (ticket: SupportTicket) => void;
}

export function SupportDetailModal({
  ticket,
  isOpen,
  onClose,
  onConvertToDoc
}: SupportDetailModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white shadow-md ${
              ticket.status === 'resolvido' ? 'bg-emerald-600' : 'bg-amber-500'
            }`}>
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {ticket.module_protheus || 'Protheus'}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  ticket.status === 'resolvido'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}>
                  Status: {ticket.status.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Prioridade: {ticket.priority}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                {ticket.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Metadados Setor e Usuário */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Building className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Setor</span>
                <strong className="text-slate-900 dark:text-white">{ticket.sector_name || 'Geral'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <User className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Solicitante</span>
                <strong className="text-slate-900 dark:text-white">{ticket.user_name || 'Usuário'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Data de Registro</span>
                <strong className="text-slate-900 dark:text-white">
                  {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-BR') : 'Hoje'}
                </strong>
              </div>
            </div>
          </div>

          {/* 1. SEÇÃO DO PROBLEMA & MÍDIAS */}
          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                1. Problema Relatado no Protheus
              </h3>
            </div>

            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
              {ticket.problem_description}
            </p>

            {/* Galeria de Fotos e Vídeos do Problema */}
            {ticket.problem_media && ticket.problem_media.length > 0 && (
              <div className="pt-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Evidências do Problema ({ticket.problem_media.length} anexo(s)):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ticket.problem_media.map((media, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedMedia(media)}
                      className="group relative rounded-xl border border-amber-300 dark:border-amber-800/80 overflow-hidden bg-slate-900 aspect-video shadow-xs hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-900">
                          <Video className="w-6 h-6 text-amber-400 mb-1" />
                          <span className="text-[10px] text-white line-clamp-1">{media.name}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. SEÇÃO DA SOLUÇÃO & MÍDIAS */}
          <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  2. Solução Aplicada
                </h3>
              </div>
              {ticket.solution_description && onConvertToDoc && (
                <button
                  onClick={() => onConvertToDoc(ticket)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Transformar em Manual Técnico
                </button>
              )}
            </div>

            {ticket.solution_description ? (
              <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {ticket.solution_description}
              </p>
            ) : (
              <p className="text-xs italic text-slate-500 dark:text-slate-400">
                Solução ainda em andamento / não preenchida.
              </p>
            )}

            {/* Galeria de Fotos e Vídeos da Resolução */}
            {ticket.solution_media && ticket.solution_media.length > 0 && (
              <div className="pt-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Demonstração da Resolução ({ticket.solution_media.length} anexo(s)):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ticket.solution_media.map((media, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedMedia(media)}
                      className="group relative rounded-xl border border-emerald-300 dark:border-emerald-800/80 overflow-hidden bg-slate-900 aspect-video shadow-xs hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-900">
                          <Video className="w-6 h-6 text-emerald-400 mb-1" />
                          <span className="text-[10px] text-white line-clamp-1">{media.name}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {ticket.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <span className="text-xs text-slate-500">
            ID Chamado: #{ticket.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>

      {/* Lightbox / Video Player Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950">
              <span className="text-xs font-medium text-white truncate">{selectedMedia.name}</span>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[80vh]">
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="max-h-[75vh] max-w-full object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-h-[75vh] max-w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
