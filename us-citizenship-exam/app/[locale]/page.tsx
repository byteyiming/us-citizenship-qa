import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { FileText, BookOpen } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }
): Promise<Metadata> {
  const { locale } = await params;
  const dict = {
    en: {
      title: 'U.S. Civics Study Hub | Practice Quiz & Flashcards',
      desc: 'Practice for the U.S. naturalization civics test with our free quiz and flashcard tool. Available in English, Spanish, and Chinese.'
    },
    es: {
      title: 'U.S. Civics Study Hub | Examen y Tarjetas',
      desc: 'Practique para el examen de civismo de naturalización con nuestro quiz y tarjetas. Disponible en inglés, español y chino.'
    },
    zh: {
      title: '美国入籍考试练习中心 | 测验与闪卡',
      desc: '使用我们的免费测验与闪卡工具练习美国入籍公民知识题，支持中文、英文与西语。'
    }
  } as const;
  const lang = (locale === 'en' || locale === 'es' || locale === 'zh') ? locale : 'en';
  const meta = dict[lang];
  return {
    title: meta.title,
    description: meta.desc,
    openGraph: {
      title: meta.title,
      description: meta.desc,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.desc
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-xl text-slate-600 sm:text-2xl">
          {t('subtitle')}
        </p>
        <p className="mt-6 text-lg font-medium text-slate-700">
          {t('question')}
        </p>
        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 items-stretch">
          <Link
            href={`/${locale}/quiz`}
            className="group h-full min-h-[220px] min-w-[260px] rounded-2xl border-2 border-slate-200 bg-white px-8 py-8 text-left shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('quizTitle')}
              </div>
            </div>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {t('quizDescription')}
            </p>
          </Link>
          <Link
            href={`/${locale}/flashcards`}
            className="group h-full min-h-[220px] min-w-[260px] rounded-2xl border-2 border-slate-200 bg-white px-8 py-8 text-left shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('flashcardsTitle')}
              </div>
            </div>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {t('flashcardsDescription')}
            </p>
          </Link>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          {t('suggestion')}
        </p>
        <FeedbackForm />
      </div>
    </div>
  );
}


