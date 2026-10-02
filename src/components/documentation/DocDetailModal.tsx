'use client';

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Building, 
  User, 
  Calendar, 
  Tag, 
  Printer, 
  Share2, 
  Eye, 
  Video, 
  Image as ImageIcon,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Documentation, MediaAttachment } from '@/types';

interface DocDetailModalProps {
  doc: Documentation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocDetailModal({
  doc,
  isOpen,
  onClose
}: DocDetailModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);

  if (!isOpen || !doc) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {doc.category || 'Manual Técnico'}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {doc.module_protheus || 'Protheus'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                {doc.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Imprimir / Salvar em PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content (Print-Friendly) */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Building className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Setor</span>
                <strong className="text-slate-900 dark:text-white">{doc.sector_name || 'Geral'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <User className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Especialista</span>
                <strong className="text-slate-900 dark:text-white">{doc.user_name || 'Usuário'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Publicação</span>
                <strong className="text-slate-900 dark:text-white">
                  {doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : 'Hoje'}
                </strong>
              </div>
            </div>
          </div>

          {/* Introdução / Conteúdo */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Objetivo & Visão Geral
            </h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
              {doc.content}
            </p>
          </div>

          {/* Etapas Passo a Passo */}
          {doc.steps && doc.steps.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Procedimento Passo a Passo
              </h3>
              <div className="space-y-3">
                {doc.steps.map((step) => (
                  <div
                    key={step.step_number}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {step.step_number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line pl-8">
                      {step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anexos de Mídia */}
          {doc.media_attachments && doc.media_attachments.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Imagens & Demonstrações Anexadas ({doc.media_attachments.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {doc.media_attachments.map((media, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMedia(media)}
                    className="group relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-900 aspect-video shadow-xs hover:shadow-md transition-all text-left cursor-pointer"
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

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {doc.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg font-medium border border-emerald-200 dark:border-emerald-900/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 print:hidden">
          <span className="text-xs text-slate-500">
            Documento Técnico Protheus #{doc.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
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
