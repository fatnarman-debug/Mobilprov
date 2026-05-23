'use client';

import React, { useState, useEffect, useRef } from 'react';
import { translateText } from '@/actions/translate.actions';

type SelectionTranslatorProps = {
  language: string;
};

export default function SelectionTranslator({ language }: SelectionTranslatorProps) {
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = async () => {
      // Small delay to allow selection API to update correctly
      setTimeout(async () => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        // Only translate if selection is between 2 and 100 characters
        if (!selection || !text || text.length < 2 || text.length > 100) {
          // If the click was not inside the popup, close it
          return;
        }

        // Get selection coordinates
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Position popover above selection center
          setPosition({
            top: rect.top + window.scrollY - 10,
            left: rect.left + window.scrollX + rect.width / 2,
          });
          
          setSelectedText(text);
          setTranslation('');
          setError('');
          setLoading(true);

          const res = await translateText(text, language);
          setLoading(false);
          
          if (res.error) {
            setError(res.error);
          } else if (res.translation) {
            setTranslation(res.translation);
          }
        }
      }, 50);
    };

    const handleDocumentClick = (e: MouseEvent) => {
      // Close popover if clicked outside
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPosition(null);
        setSelectedText('');
        setTranslation('');
        setError('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [language]);

  if (!position || !selectedText) return null;

  return (
    <div 
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999,
      }}
      className="bg-inverse-surface text-inverse-on-surface p-4 rounded-2xl shadow-2xl text-xs w-64 border border-outline-variant/20 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-center justify-between border-b border-inverse-on-surface/20 pb-1.5 mb-1.5">
        <span className="font-bold text-[10px] uppercase tracking-wider text-secondary-container">
          🔎 Çeviri ({language})
        </span>
        <button 
          onClick={() => setSelectedText('')}
          className="text-inverse-on-surface opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined !text-[14px]">close</span>
        </button>
      </div>

      <div className="space-y-sm">
        <div>
          <span className="text-[10px] text-inverse-on-surface/50 block font-semibold">Orijinal:</span>
          <p className="italic font-body-sm font-semibold truncate">"{selectedText}"</p>
        </div>

        <div>
          <span className="text-[10px] text-inverse-on-surface/50 block font-semibold">Karşılığı:</span>
          {loading ? (
            <div className="flex items-center gap-xs mt-xs text-[10px] font-bold">
              <span className="material-symbols-outlined animate-spin !text-[12px]">progress_activity</span>
              Çevriliyor…
            </div>
          ) : error ? (
            <p className="text-error font-body-sm mt-xs">{error}</p>
          ) : (
            <p className="font-body-md text-[13px] font-bold text-secondary-container leading-relaxed">
              {translation}
            </p>
          )}
        </div>
      </div>
      {/* Pointing arrow */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-inverse-surface"></span>
    </div>
  );
}
