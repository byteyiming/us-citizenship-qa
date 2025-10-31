"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' }
];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: 'en'|'es'|'zh' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const onSelect = (code: string) => {
    if (!pathname) return;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) {
      router.push(`/${code}`);
      return;
    }
    parts[0] = code;
    router.push('/' + parts.join('/'));
    setOpen(false);
  };

  const current = locales.find(l => l.code === currentLocale) ?? locales[0];

  return (
    <div className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-50"
      >
        {current.label}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border bg-white shadow-lg"
        >
          {locales.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === currentLocale}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${l.code === currentLocale ? 'bg-zinc-50' : ''}`}
                onClick={() => onSelect(l.code)}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


