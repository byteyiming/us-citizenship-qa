"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FeedbackForm() {
  const t = useTranslations('feedback');
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const to = "g1097420948@gmail.com";
  const subject = encodeURIComponent("Civics Practice Feedback");
  const body = encodeURIComponent(`From: ${email || '(no email)'}\n\n${message}`);
  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

  return (
    <div className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900">{t('title')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('subtitle')}</p>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="block">
          {/* <span className="mb-1 block text-xs font-medium text-slate-600">{t('email')}</span> */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="block">
          {/* <span className="mb-1 block text-xs font-medium text-slate-600">{t('message')}</span> */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('message')}
            rows={5}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="flex justify-center">
          <a href={mailto} className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700">
            {t('submit')}
          </a>
        </div>
      </div>
    </div>
  );
}


