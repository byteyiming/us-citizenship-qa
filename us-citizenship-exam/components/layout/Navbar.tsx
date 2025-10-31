"use client";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { BookOpen, FileText, Menu, Link as LinkIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Navbar({ locale }: { locale: 'en'|'es'|'zh' }) {
  const t = useTranslations('navbar');
  const pathname = usePathname();
  const isQuiz = pathname?.includes('/quiz');
  const isFlashcards = pathname?.includes('/flashcards');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstFocusable = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => { body.style.overflow = prev; };
    }
  }, [open]);
  useEffect(() => {
    if (open) firstFocusable.current?.focus();
  }, [open]);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="relative mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        {/* Centered title on mobile */}
        <a href={`/${locale}`} className="absolute left-1/2 -translate-x-1/2 text-center text-lg font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors md:static md:translate-x-0 md:text-xl">
          {t('title')}
        </a>
        <nav className="hidden items-center gap-4 md:flex">
          <a 
            href={`/${locale}`} 
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
          >
            {t('home')}
          </a>
          <a 
            href={`/${locale}/quiz`} 
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isQuiz
                ? 'bg-blue-100 text-blue-700 font-semibold border-b-2 border-blue-600'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
            }`}
          >
            <FileText className="h-4 w-4" />
            {t('quiz')}
          </a>
          <a 
            href={`/${locale}/flashcards`} 
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isFlashcards
                ? 'bg-blue-100 text-blue-700 font-semibold border-b-2 border-blue-600'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t('flashcards')}
          </a>
          <a 
            href={`/${locale}/resources`} 
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600"
          >
            <LinkIcon className="h-4 w-4" />
            {t('resources')}
          </a>
          <LanguageSwitcher currentLocale={locale} />
        </nav>
        {/* Mobile hamburger */}
        <button aria-label="Menu" aria-controls="mobile-menu" aria-expanded={open} onClick={() => setOpen(v => !v)} className="ml-auto inline-flex items-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
        {open && (
          <div
            id="mobile-menu"
            role="menu"
            ref={menuRef}
            className="absolute right-4 top-14 w-52 rounded-xl border bg-white p-2 shadow-lg md:hidden"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setOpen(false);
              }
              if (e.key === 'Tab' && menuRef.current) {
                const focusables = menuRef.current.querySelectorAll<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])');
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  (first as HTMLElement).focus();
                } else if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  (last as HTMLElement).focus();
                }
              }
            }}
          >
            <a href={`/${locale}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setOpen(false)}>
              {t('home')}
            </a>
            <a ref={firstFocusable} href={`/${locale}/quiz`} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isQuiz ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'}`} onClick={() => setOpen(false)}>
              <FileText className="h-4 w-4" /> {t('quiz')}
            </a>
            <a href={`/${locale}/flashcards`} className={`mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isFlashcards ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'}`} onClick={() => setOpen(false)}>
              <BookOpen className="h-4 w-4" /> {t('flashcards')}
            </a>
            <a href={`/${locale}/resources`} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setOpen(false)}>
              <LinkIcon className="h-4 w-4" /> {t('resources')}
            </a>
            <div className="mt-1 border-t pt-2">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        )}
        {/* focus handled via useEffect above */}
      </div>
    </header>
  );
}


