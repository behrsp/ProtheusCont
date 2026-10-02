'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, Eye, Plus, Link as LinkIcon } from 'lucide-react';
import { MediaAttachment } from '@/types';

interface MediaUploadProps {
  label: string;
  sublabel?: string;
  mediaList: MediaAttachment[];
  onChange: (media: MediaAttachment[]) => void;
  maxFiles?: number;
}

export function MediaUpload({
  label,
  sublabel = 'Anexe prints de tela do Protheus ou pequenos vídeos demonstrativos',
  mediaList,
  onChange,
  maxFiles = 6
}: MediaUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlType, setUrlType] = useState<'image' | 'video'>('image');
  const [urlName, setUrlName] = useState('');
  const [previewMedia, setPreviewMedia] = useState<MediaAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: MediaAttachment[] = [];
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const newMedia: MediaAttachment = {
            id: Math.random().toString(36).substring(2, 9),
            url: event.target.result as string,
            type: isVideo ? 'video' : 'image',
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`
          };
          onChange([...mediaList, newMedia].slice(0, maxFiles));
        }
      };

      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInputValue.trim()) return;

    const newMedia: MediaAttachment = {
      id: Math.random().toString(36).substring(2, 9),
      url: urlInputValue.trim(),
      type: urlType,
      name: urlName.trim() || (urlType === 'image' ? 'Imagem Externa' : 'Vídeo Externo'),
      size: 'URL Externa'
    };

    onChange([...mediaList, newMedia].slice(0, maxFiles));
    setUrlInputValue('');
    setUrlName('');
    setShowUrlInput(false);
  };

  const handleRemove = (index: number) => {
    const updated = mediaList.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
            {label}
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">{sublabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlInput ? 'Ocultar URL' : '+ Inserir Link/URL'}
        </button>
      </div>

      {showUrlInput && (
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <select
              value={urlType}
              onChange={(e) => setUrlType(e.target.value as 'image' | 'video')}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="image">🖼️ Imagem / Print</option>
              <option value="video">🎥 Vídeo / Demo</option>
            </select>
            <input
              type="text"
              placeholder="Nome descritivo (opcional)"
              value={urlName}
              onChange={(e) => setUrlName(e.target.value)}
              className="text-xs flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://exemplo.com/screenshot.png ou video.mp4"
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              className="text-xs flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Grid de anexos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
        {mediaList.map((media, index) => (
          <div
            key={index}
            className="group relative rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/70 overflow-hidden shadow-xs hover:shadow-md transition-all aspect-video flex flex-col items-center justify-center"
          >
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={media.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/400x300/1e293b/white?text=Preview+Indisponivel';
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-2 text-center">
                <Video className="w-8 h-8 text-blue-400 mb-1 animate-pulse" />
                <span className="text-[11px] text-slate-300 line-clamp-1 px-1">
                  {media.name}
                </span>
              </div>
            )}

            {/* Overlay ações */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={() => setPreviewMedia(media)}
                className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-xs transition-colors"
                title="Visualizar"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-xs transition-colors"
                title="Remover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge de tipo */}
            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 pointer-events-none">
              {media.type === 'image' ? <ImageIcon className="w-2.5 h-2.5" /> : <Video className="w-2.5 h-2.5" />}
              <span className="truncate max-w-[80px]">{media.name}</span>
            </div>
          </div>
        ))}

        {mediaList.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all aspect-video cursor-pointer"
          >
            <div className="p-2 rounded-full bg-slate-200/60 dark:bg-slate-800">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-center">Carregar Foto/Vídeo</span>
            <span className="text-[10px] text-slate-400">PNG, JPG, MP4</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,video/*"
        multiple
        className="hidden"
      />

      {/* Modal de Preview de Mídia em Alta Resolução */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2 text-white">
                {previewMedia.type === 'image' ? (
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                ) : (
                  <Video className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-sm font-medium truncate">{previewMedia.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[75vh]">
              {previewMedia.type === 'image' ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.name}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
