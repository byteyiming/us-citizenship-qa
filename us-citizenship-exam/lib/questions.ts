export type Locale = 'en' | 'es' | 'zh';

export type Question = {
  id: string;
  category: string;
  text: string;
  options: string[];
  answer: number;
};

const CATEGORY_BY_LOCALE: Record<Locale, Record<'gov'|'history'|'civics', string>> = {
  en: {
    gov: 'American Government',
    history: 'American History',
    civics: 'Integrated Civics'
  },
  es: {
    gov: 'Gobierno',
    history: 'Historia',
    civics: 'Educación Cívica Integrada'
  },
  zh: {
    gov: '美国政府',
    history: '美国历史',
    civics: '综合公民'
  }
};

function shuffle<T>(items: T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor((Math.random() * (i + 1)));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sampleRandom(items: Question[], count: number): Question[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

export async function loadQuestions(
  locale: Locale,
  categoryKey: 'gov'|'history'|'civics'|'all',
  mode: 'trial'|'all'|'test' = 'trial'
): Promise<Question[]> {
  const all = await loadAllQuestions(locale);
  
  if (mode === 'test') {
    // Official test: balanced across categories (~1/3 each)
    const map = CATEGORY_BY_LOCALE[locale];
    const perCat: Record<'gov'|'history'|'civics', Question[]> = {
      gov: all.filter(q => q.category === map.gov),
      history: all.filter(q => q.category === map.history),
      civics: all.filter(q => q.category === map.civics)
    };
    const targetTotal = 20;
    const base = Math.floor(targetTotal / 3); // 6 each
    let remainder = targetTotal - base * 3;   // 2 remainder
    const picked: Question[] = [];
    (['gov','history','civics'] as const).forEach(k => {
      picked.push(...sampleRandom(perCat[k], base));
    });
    const order: Array<'gov'|'history'|'civics'> = ['gov','history','civics'];
    let idx = 0;
    while (remainder > 0) {
      const k = order[idx % order.length];
      const pool = perCat[k].filter(q => !picked.find(p => p.id === q.id));
      const add = sampleRandom(pool, 1);
      picked.push(...add);
      idx++; remainder--;
    }
    return shuffle(picked);
  }
  
  if (categoryKey === 'all') {
    return mode === 'all' ? all : sampleRandom(all, 10);
  }
  
  const target = CATEGORY_BY_LOCALE[locale][categoryKey];
  const filtered = all.filter(q => q.category === target);
  return mode === 'all' ? filtered : sampleRandom(filtered, 10);
}

export async function loadQuestionsPaged(
  locale: Locale,
  categoryKey: 'gov'|'history'|'civics'|'all',
  offset: number,
  limit: number
): Promise<{ items: Question[]; total: number }>{
  const all = await loadAllQuestions(locale);
  if (categoryKey === 'all') {
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  const target = CATEGORY_BY_LOCALE[locale][categoryKey];
  const filtered = all.filter(q => q.category === target);
  return { items: filtered.slice(offset, offset + limit), total: filtered.length };
}

async function loadAllQuestions(locale: Locale): Promise<Question[]> {
  // Prefer per-category files if they exist to enable smaller loads in the future
  try {
    const [gov, history, civics] = await Promise.all([
      importOptional<Question[]>(`@/data/questions/${locale}/gov.json`),
      importOptional<Question[]>(`@/data/questions/${locale}/history.json`),
      importOptional<Question[]>(`@/data/questions/${locale}/civics.json`)
    ]);
    if (gov && history && civics) {
      return [...gov, ...history, ...civics];
    }
  } catch {}
  // Fallback to single data.json
  const mod = await import(`@/data/questions/${locale}/data.json`);
  return (mod.default ?? []) as Question[];
}

async function importOptional<T>(path: string): Promise<T | null> {
  // Try exact path first
  try {
    const mod: unknown = await import(/* @vite-ignore */ path);
    if (mod && typeof mod === 'object' && 'default' in (mod as Record<string, unknown>)) {
      const d = (mod as { default?: unknown }).default;
      return (d as T) ?? null;
    }
  } catch {}
  // If JSON not found, try corresponding TS module (gov.ts etc.)
  if (path.endsWith('.json')) {
    const alt = path.replace(/\.json$/, '.ts');
    try {
      const mod: unknown = await import(/* @vite-ignore */ alt);
      if (mod && typeof mod === 'object' && 'default' in (mod as Record<string, unknown>)) {
        const d = (mod as { default?: unknown }).default;
        return (d as T) ?? null;
      }
    } catch {}
  }
  return null;
}


