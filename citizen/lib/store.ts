import {create} from 'zustand';

type Language = 'en' | 'zh';

interface StoreState {
  language: Language;
  toggleLanguage: () => void;
}

export const useStore = create<StoreState>((set) => ({
  language: 'en',
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === 'en' ? 'zh' : 'en',
    })),
}));