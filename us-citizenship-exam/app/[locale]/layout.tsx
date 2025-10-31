import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Naturalization Practice Hub',
  description: 'Practice for the U.S. naturalization test'
};

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isValid = ['en', 'es', 'zh'].includes(locale);
  if (!isValid) return notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body suppressHydrationWarning className={`bg-slate-50 text-slate-900 antialiased ${inter.className}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar locale={locale as 'en'|'es'|'zh'} />
          <main className="min-h-[calc(100vh-3.5rem)] px-4 py-8">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


