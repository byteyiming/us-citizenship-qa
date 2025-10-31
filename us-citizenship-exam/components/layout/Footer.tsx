"use client";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const pathname = usePathname();
  const locale = (pathname?.split('/')?.[1] || 'en') as 'en'|'es'|'zh';
  return (
    <footer className="mt-12 border-t pt-8">
      <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
        <span>{t('text')}</span>
        <a href={`/${locale}/resources#feedback`} className="text-blue-600 hover:underline">{t('feedback')}</a>
      </div>
    </footer>
  );
}


