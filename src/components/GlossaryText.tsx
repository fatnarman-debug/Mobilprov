'use client';

import React, { useState, useRef, useEffect } from 'react';
import { glossaryData } from '@/lib/glossary';
import { translateText } from '@/actions/translate.actions';

type GlossaryTextProps = {
  text: string | null;
  language: string;
};

// Global client-side cache to avoid translating the same word multiple times on the same page load
const translationCache = new Map<string, string>();

function GlossaryTooltip({ term, translation, definition }: { term: string; translation: string; definition: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span 
      ref={containerRef} 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="underline decoration-dashed decoration-primary/60 underline-offset-4 cursor-help font-bold text-primary hover:text-primary-dark active:scale-95 transition-all inline-block"
        aria-expanded={isOpen}
      >
        {term}
      </span>
      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-inverse-surface text-inverse-on-surface rounded-2xl shadow-xl z-[9999] text-left text-xs border border-outline-variant/20 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
          <span className="font-extrabold text-sm block border-b border-inverse-on-surface/20 pb-1.5 mb-1.5 text-secondary-container">
            {translation}
          </span>
          <span className="leading-relaxed opacity-95 block">
            {definition}
          </span>
          {/* Subtle pointing arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-inverse-surface"></span>
        </span>
      )}
    </span>
  );
}

function DynamicWordTooltip({ word, language }: { word: string; language: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLSpanElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Normalize language key
  const targetLang = (language === 'EN' || language === 'TR') ? language : 'TR';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const cleanWord = word.trim().toLowerCase();
    const cacheKey = `${cleanWord}_${targetLang}`;

    console.log(`[Client Hover] Word: "${word}", targetLang: "${targetLang}", cacheKey: "${cacheKey}"`);

    if (translationCache.has(cacheKey)) {
      const cachedVal = translationCache.get(cacheKey) || '';
      console.log(`[Client Hover] Cache hit! Cached value: "${cachedVal}"`);
      setTranslation(cachedVal);
      setIsOpen(true);
      return;
    }

    console.log(`[Client Hover] Cache miss. Initiating debounce timer...`);

    // Debounce translation requests to 200ms to avoid spamming on fast mouse movements
    hoverTimeoutRef.current = setTimeout(async () => {
      console.log(`[Client Hover] Debounce timer fired. Calling translateText Server Action...`);
      setIsOpen(true);
      setLoading(true);
      setError('');
      try {
        const res = await translateText(word, targetLang);
        console.log(`[Client Hover] translateText result:`, res);
        if (res.error) {
          setError(res.error);
        } else if (res.translation) {
          translationCache.set(cacheKey, res.translation);
          setTranslation(res.translation);
        }
      } catch (err) {
        console.error(`[Client Hover] Error:`, err);
        setError('Çeviri hatası');
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    if (hoverTimeoutRef.current) {
      console.log(`[Client Hover] Mouse left. Cancelling debounce timer...`);
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      handleMouseEnter();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        onClick={handleClick}
        className="cursor-help transition-all duration-150 rounded px-[2px] -mx-[2px] hover:bg-primary/10 hover:text-primary active:scale-95 border-b border-dashed border-transparent hover:border-primary/30"
      >
        {word}
      </span>
      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-xl z-[9999] text-left text-xs border border-outline-variant/20 animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-auto">
          {loading ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="material-symbols-outlined animate-spin !text-[12px]">progress_activity</span>
              Çevriliyor…
            </span>
          ) : error ? (
            <span className="text-error text-[10px] block">{error}</span>
          ) : (
            <span className="font-bold text-[13px] block text-secondary-container">
              {translation || word}
            </span>
          )}
          {/* Subtle pointing arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-inverse-surface"></span>
        </span>
      )}
    </span>
  );
}

export default function GlossaryText({ text, language }: GlossaryTextProps) {
  const lang = (language === 'EN' || language === 'TR') ? language : 'TR';
  const langDict = glossaryData[lang] || glossaryData['TR'];

  if (!text) {
    return null;
  }

  // Use Intl.Segmenter to segment text into words and punctuation/whitespace
  let segments: { segment: string; isWordLike: boolean }[] = [];
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter('sv', { granularity: 'word' });
      segments = Array.from(segmenter.segment(text)).map(s => ({
        segment: s.segment,
        isWordLike: !!s.isWordLike
      }));
    } catch (e) {
      // Fallback if Segmenter initialization fails for locale 'sv'
      const wordPattern = /([a-zA-ZåäöÅÄÖ]+)/g;
      const parts = text.split(wordPattern);
      segments = parts.map(part => ({
        segment: part,
        isWordLike: wordPattern.test(part)
      }));
    }
  } else {
    // Fallback regex splitting words and non-words
    const wordPattern = /([a-zA-ZåäöÅÄÖ]+)/g;
    const parts = text.split(wordPattern);
    segments = parts.map(part => ({
      segment: part,
      isWordLike: wordPattern.test(part)
    }));
  }

  return (
    <>
      {segments.map((seg, index) => {
        if (!seg.isWordLike) {
          return <React.Fragment key={index}>{seg.segment}</React.Fragment>;
        }

        const word = seg.segment;
        const lowerWord = word.toLowerCase();

        // Check if this word is in the predefined glossary dictionary
        if (langDict[lowerWord]) {
          const item = langDict[lowerWord];
          return (
            <GlossaryTooltip
              key={index}
              term={word}
              translation={item.translation}
              definition={item.definition}
            />
          );
        }

        // Make it dynamically translatable on hover
        return (
          <DynamicWordTooltip
            key={index}
            word={word}
            language={lang}
          />
        );
      })}
    </>
  );
}
