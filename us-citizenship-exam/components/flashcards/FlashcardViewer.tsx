"use client";
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/lib/store';

type Card = {
  id: string;
  text: string;
  options: string[];
  answer: number;
};

export default function FlashcardViewer({ cards }: { cards: Card[] }) {
  const t = useTranslations('flashcards');
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState<'all'|'starred'|'missed'>('all');
  const { starredIds, toggleStar, lastIncorrectIds } = useQuizStore();
  const visibleCards = useMemo(() => {
    if (filter === 'starred') return cards.filter(c => starredIds.has(c.id));
    if (filter === 'missed') return cards.filter(c => lastIncorrectIds.has(c.id));
    return cards;
  }, [filter, cards, starredIds, lastIncorrectIds]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setShow(v => !v); }
      if (e.key === 'ArrowRight') { setIndex(v => Math.min(cards.length - 1, v + 1)); setShow(false); }
      if (e.key === 'ArrowLeft') { setIndex(v => Math.max(0, v - 1)); setShow(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cards.length]);

  if (visibleCards.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-slate-600">{t('noCards')}</p>
      </div>
    );
  }

  const c = visibleCards[index];
  const answerText = c.options[c.answer];
  const pct = ((index + 1) / visibleCards.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Filters + Progress */}
      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => { setFilter('all'); setIndex(0); }} className={`rounded border px-3 py-1 text-xs ${filter==='all'?'bg-blue-50 border-blue-300':'hover:bg-slate-50'}`}>All</button>
        <button onClick={() => { setFilter('starred'); setIndex(0); }} className={`rounded border px-3 py-1 text-xs ${filter==='starred'?'bg-blue-50 border-blue-300':'hover:bg-slate-50'}`}>Starred</button>
        <button onClick={() => { setFilter('missed'); setIndex(0); }} className={`rounded border px-3 py-1 text-xs ${filter==='missed'?'bg-blue-50 border-blue-300':'hover:bg-slate-50'}`}>Missed</button>
      </div>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            {t('cardCount', { current: index + 1, total: visibleCards.length })}
          </span>
          <span className="text-sm font-medium text-slate-600">{Math.round(pct)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-6">
        <div
          onClick={() => setShow(v => !v)}
          className="group relative mx-auto aspect-[4/3] w-full cursor-pointer select-none [perspective:1000px]"
        >
          <div
            className={`absolute inset-0 rounded-2xl bg-white shadow-lg transition-transform duration-700 [transform-style:preserve-3d] ${
              show ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* Front Side - Question */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 [backface-visibility:hidden]">
              <div className="mb-4 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {t('question')}
              </div>
              <p className="max-w-xl text-center text-2xl font-bold leading-relaxed text-slate-900">
                {c.text}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <RotateCw className="h-4 w-4" />
                <span>{t('clickToFlip')}</span>
              </div>
            </div>

            {/* Back Side - Answer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="mb-4 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                {t('answer')}
              </div>
              <p className="max-w-xl text-center text-2xl font-bold leading-relaxed text-green-700">
                {answerText}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <RotateCw className="h-4 w-4" />
                <span>{t('clickToFlipBack')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { setIndex((v) => Math.max(0, v - 1)); setShow(false); }}
          disabled={index === 0}
          className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('previous')}
        </button>

        <button
          onClick={() => toggleStar(c.id)}
          className="rounded-xl border-2 border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
        >
          {starredIds.has(c.id) ? '★ Starred' : '☆ Star'}
        </button>

        <button
          onClick={() => { setIndex((v) => Math.min(visibleCards.length - 1, v + 1)); setShow(false); }}
          disabled={index === visibleCards.length - 1}
          className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          {t('next')}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Keyboard Tip */}
      <p className="mt-4 text-center text-xs text-slate-500">{t('tip')}</p>
    </div>
  );
}
