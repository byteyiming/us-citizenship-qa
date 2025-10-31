"use client";
import { create } from "zustand";

type QuizState = {
  answersByQuestionId: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  setAllAnswers: (map: Record<string, string>) => void;
  reset: () => void;
  starredIds: Set<string>;
  toggleStar: (id: string) => void;
  isStarred: (id: string) => boolean;
  lastIncorrectIds: Set<string>;
  setIncorrect: (ids: string[]) => void;
};

export const useQuizStore = create<QuizState>((set, get) => ({
  answersByQuestionId: {},
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answersByQuestionId: { ...state.answersByQuestionId, [questionId]: answer }
    })),
  setAllAnswers: (map) => set({ answersByQuestionId: map }),
  reset: () => set({ answersByQuestionId: {} }),
  starredIds: new Set<string>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('starredIds') ?? '[]') : []),
  toggleStar: (id: string) => set((state) => {
    const next = new Set(state.starredIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    try { localStorage.setItem('starredIds', JSON.stringify(Array.from(next))); } catch {}
    return { starredIds: next } as Partial<QuizState>;
  }),
  isStarred: (id: string) => get().starredIds.has(id),
  lastIncorrectIds: new Set<string>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('lastIncorrectIds') ?? '[]') : []),
  setIncorrect: (ids: string[]) => {
    const s = new Set(ids);
    try { localStorage.setItem('lastIncorrectIds', JSON.stringify(Array.from(s))); } catch {}
    set({ lastIncorrectIds: s });
  }
}));


