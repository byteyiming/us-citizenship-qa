import { loadQuestionsPaged, loadQuestions } from '@/lib/questions';
import FlashcardViewer from '@/components/flashcards/FlashcardViewer';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { locale: 'en'|'es'|'zh' } }
): Promise<Metadata> {
  const { locale } = params;
  const dict = {
    en: {
      title: 'Flashcards | U.S. Civics Study Hub',
      desc: 'Review U.S. civics test questions with interactive flashcards.'
    },
    es: {
      title: 'Tarjetas de Estudio (Flashcards) | Centro de Estudio Cívico de EE. UU.',
      desc: 'Revise las preguntas del examen de cívica con tarjetas de estudio interactivas.'
    },
    zh: {
      title: '闪卡 | 美国入籍考试练习中心',
      desc: '通过交互式闪卡复习美国公民考试题目。'
    }
  } as const;
  const lang = (locale === 'en' || locale === 'es' || locale === 'zh') ? locale : 'en';
  const meta = dict[lang];
  return {
    title: meta.title,
    description: meta.desc,
    openGraph: { title: meta.title, description: meta.desc, type: 'website' },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.desc }
  };
}

export default async function FlashcardsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
  searchParams: Promise<{ category?: string; page?: string; pageSize?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'flashcards' });
  const { category, page, pageSize } = await searchParams;
  const selected = (category as string) ?? 'all';
  const key = (selected === 'all' ? 'all' : selected) as 'gov'|'history'|'civics'|'all';
  const current = Math.max(1, parseInt((page as string) ?? '1', 10));
  const size = Math.max(1, Math.min(50, parseInt((pageSize as string) ?? '25', 10)));
  const offset = (current - 1) * size;
  let cards;
  let totalPages = 1;
  if (key === 'all') {
    // Show all cards when "All" is selected (no pagination)
    cards = await loadQuestions(locale, 'all', 'all');
  } else {
    const paged = await loadQuestionsPaged(locale, key, offset, size);
    cards = paged.items;
    totalPages = Math.max(1, Math.ceil(paged.total / size));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-4 text-center text-3xl font-bold text-slate-900">{t('title')}</h1>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-center text-sm font-medium text-slate-600">{t('selectCategory')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href={`?category=all`} className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${selected==='all' ? 'border-blue-500 bg-blue-600 text-white shadow-md' : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'}`}>{t('all')}</a>
            <a href={`?category=gov`} className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${selected==='gov' ? 'border-blue-500 bg-blue-600 text-white shadow-md' : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'}`}>{t('categoryGov')}</a>
            <a href={`?category=history`} className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${selected==='history' ? 'border-blue-500 bg-blue-600 text-white shadow-md' : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'}`}>{t('categoryHistory')}</a>
            <a href={`?category=civics`} className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${selected==='civics' ? 'border-blue-500 bg-blue-600 text-white shadow-md' : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'}`}>{t('categoryCivics')}</a>
          </div>
        </div>
      </div>
      <FlashcardViewer cards={cards} />
      {selected !== 'all' && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href={`?category=${selected}&page=${Math.max(1, current - 1)}&pageSize=${size}`}
            className={`rounded border px-3 py-1 text-sm ${current===1 ? 'pointer-events-none opacity-40' : 'hover:bg-slate-50'}`}
          >
            ← Prev
          </a>
          <span className="text-xs text-slate-600">Page {current} / {totalPages}</span>
          <a
            href={`?category=${selected}&page=${Math.min(totalPages, current + 1)}&pageSize=${size}`}
            className={`rounded border px-3 py-1 text-sm ${current===totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-slate-50'}`}
          >
            Next →
          </a>
        </div>
      )}
    </div>
  );
}


