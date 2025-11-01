import { loadQuestions } from '@/lib/questions';
import QuizRunner from '@/components/quiz/QuizRunner';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }
): Promise<Metadata> {
  const { locale } = await params;
  const dict = {
    en: {
      title: 'Quiz Mode | U.S. Civics Study Hub',
      desc: 'Test your U.S. civics knowledge with multiple-choice practice aligned to the naturalization test.'
    },
    es: {
      title: 'Modo Examen | Centro de Estudio Cívico de EE. UU.',
      desc: 'Pon a prueba tus conocimientos de cívica con preguntas de opción múltiple.'
    },
    zh: {
      title: '测验模式 | 美国入籍考试练习中心',
      desc: '通过多项选择题测试您的美国公民知识。'
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

export default async function QuizPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: 'en' | 'es' | 'zh' }>;
  searchParams: Promise<{ mode?: string; category?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quiz' });
  const { mode, category } = await searchParams;
  
  const selectedMode = (mode as string) ?? 'practice';
  const selectedCategory = (category as string) ?? 'gov';

  let questions;
  if (selectedMode === 'test') {
    // Official test: up to 20 random questions from all categories
    questions = await loadQuestions(locale, 'all', 'test');
  } else {
    // Practice mode: 10 questions from selected category
    const catKey = selectedCategory as 'gov'|'history'|'civics';
    questions = await loadQuestions(locale, catKey, 'trial');
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-4 text-center text-3xl font-bold text-slate-900">{t('title')}</h1>
        
        {/* Mode Selection */}
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-center text-sm font-medium text-slate-600">{t('selectMode')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href={`?mode=practice${selectedCategory ? `&category=${selectedCategory}` : ''}`}
              className={`flex flex-col rounded-lg border-2 px-6 py-3 text-left transition-all ${
                selectedMode === 'practice'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="font-semibold text-slate-900">{t('practiceMode')}</span>
              <span className="mt-1 text-xs text-slate-600">{t('practiceDesc')}</span>
            </a>
            <a 
              href={`?mode=test`}
              className={`flex flex-col rounded-lg border-2 px-6 py-3 text-left transition-all ${
                selectedMode === 'test'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="font-semibold text-slate-900">{t('testMode')}</span>
              <span className="mt-1 text-xs text-slate-600">{t('testDesc')}</span>
            </a>
          </div>
        </div>

        {/* Category Selection (only for practice mode) */}
        {selectedMode === 'practice' && (
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-center text-sm font-medium text-slate-600">{t('selectCategory')}</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a 
                href={`?mode=practice&category=gov`} 
                className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === 'gov'
                    ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                    : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {t('categoryGov')}
              </a>
              <a 
                href={`?mode=practice&category=history`} 
                className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === 'history'
                    ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                    : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {t('categoryHistory')}
              </a>
              <a 
                href={`?mode=practice&category=civics`} 
                className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === 'civics'
                    ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                    : 'border-blue-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {t('categoryCivics')}
              </a>
            </div>
          </div>
        )}
      </div>
      <QuizRunner 
        questions={questions} 
        storageKey={`${locale}:${selectedMode}:${selectedCategory}`}
        mode={selectedMode as 'practice'|'test'}
      />
    </div>
  );
}
