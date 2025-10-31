import { getTranslations } from 'next-intl/server';
import FeedbackForm from '@/components/FeedbackForm';

export default async function ResourcesPage({ params }: { params: Promise<{ locale: 'en'|'es'|'zh' }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });

  const youtube = [
    { label: 'USCIS 128 Questions Listening Practice', url: 'https://www.youtube.com/results?search_query=uscis+128+questions+listening' },
    { label: 'Civics Test Practice (Official USCIS)', url: 'https://www.youtube.com/@USCIS' }
  ];

  const official = [
    { label: 'USCIS Civics Test (2020/2025) Overview', url: 'https://www.uscis.gov/citizenship/find-study-materials-and-resources/2020-version-of-the-civics-test' },
    { label: 'USCIS Study Materials', url: 'https://www.uscis.gov/citizenship/find-study-materials-and-resources' }
  ];

  const community = [
    { label: 'r/USCIS Community', url: 'https://www.reddit.com/r/USCIS/' }
  ];

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-900">{t('title')}</h1>

      <Section title={t('youtube')} items={youtube} />
      <Section title={t('official')} items={official} />
      <Section title={t('community')} items={community} />

      <div id="feedback" className="mt-10">
        <FeedbackForm />
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: { label: string; url: string }[] }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-slate-800">{title}</h2>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.url}>
            <a className="text-blue-600 underline" href={it.url} target="_blank" rel="noreferrer">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}


