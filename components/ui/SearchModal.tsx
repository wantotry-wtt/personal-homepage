"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, ExternalLink } from 'lucide-react';
import { useI18n } from '../providers/I18nProvider';

type Engine = 'Google' | 'Bing' | 'Baidu' | 'Internal';

export function SearchModal() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<Engine>('Google');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (engine !== 'Internal' || !query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, engine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    if (engine === 'Internal') {
      // Internal search already shows results in dropdown
      return;
    }

    let url = '';
    if (engine === 'Google') url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    if (engine === 'Bing') url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    if (engine === 'Baidu') url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;

    if (url) {
      window.open(url, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-500 bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-black/40 border border-black/5 dark:border-white/10 rounded-full backdrop-blur-md transition-all"
      >
        <Search className="w-4 h-4" />
        <span>{t('search.placeholder')}</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 font-sans text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
            >
              <form onSubmit={handleSubmit} className="flex items-center px-4 py-4 border-b border-black/5 dark:border-white/5">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value as Engine)}
                  className="bg-transparent text-sm font-medium text-zinc-600 dark:text-zinc-300 outline-none border-r border-black/10 dark:border-white/10 pr-2 mr-3"
                >
                  <option value="Google">Google</option>
                  <option value="Bing">Bing</option>
                  <option value="Baidu">Baidu</option>
                  <option value="Internal">{t('search.internal')}</option>
                </select>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="flex-1 bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 text-lg"
                />
                <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </form>

              {engine === 'Internal' && results.length > 0 && (
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {results.map((item) => (
                    <a
                      key={item.id}
                      href={item.link || '#'}
                      target={item.link?.startsWith('http') ? '_blank' : '_self'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.title}</h4>
                        {item.description && <p className="text-xs text-zinc-500 mt-1">{item.description}</p>}
                      </div>
                      {item.link?.startsWith('http') && <ExternalLink className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </a>
                  ))}
                </div>
              )}
              
              {engine === 'Internal' && query && results.length === 0 && (
                <div className="p-8 text-center text-sm text-zinc-500">
                  No results found.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
