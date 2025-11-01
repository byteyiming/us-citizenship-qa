"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Locale } from './questions';

// Map app locales to SpeechSynthesis language codes (with fallbacks)
const LOCALE_TO_SPEECH_LANGS: Record<Locale, string[]> = {
  en: ['en-US', 'en-GB', 'en'],
  es: ['es-ES', 'es-MX', 'es-US', 'es'],
  zh: ['zh-CN', 'zh-TW', 'zh']
};

// Helper function to find an available voice for a language
function findVoiceForLang(synth: SpeechSynthesis, langCodes: string[]): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  
  // Try each language code in order
  for (const langCode of langCodes) {
    // Try exact match first
    const exactMatch = voices.find(v => v.lang === langCode);
    if (exactMatch) return exactMatch;
    
    // Try prefix match (e.g., 'es' matches 'es-ES', 'es-MX', etc.)
    const prefix = langCode.split('-')[0];
    const prefixMatch = voices.find(v => v.lang.startsWith(prefix));
    if (prefixMatch) return prefixMatch;
  }
  
  return null;
}

export type TTSState = 'idle' | 'speaking' | 'paused';

export function useTTS(locale: Locale = 'en') {
  const [state, setState] = useState<TTSState>('idle');
  const [isSupported, setIsSupported] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check browser support and initialize, wait for voices to load
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
      
      // Voices might not be loaded immediately, so we check if they're available
      const checkVoices = () => {
        if (synthRef.current && synthRef.current.getVoices().length > 0) {
          setVoicesLoaded(true);
        }
      };
      
      // Check immediately
      checkVoices();
      
      // Also listen for voices changed event (some browsers need this)
      synthRef.current.addEventListener('voiceschanged', checkVoices);
      
      return () => {
        synthRef.current?.removeEventListener('voiceschanged', checkVoices);
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if (!isSupported || !synthRef.current) {
      console.warn('Speech Synthesis is not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a voice for the locale, with fallbacks
    const langCodes = LOCALE_TO_SPEECH_LANGS[locale];
    const voice = findVoiceForLang(synthRef.current, langCodes);
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Fallback: use the first language code
      utterance.lang = langCodes[0];
    }
    
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;

    // Set up event handlers
    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    utterance.onerror = (e) => {
      console.warn('TTS Error:', e);
      setState('idle');
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [isSupported, locale]);

  const pause = useCallback(() => {
    if (synthRef.current && state === 'speaking') {
      synthRef.current.pause();
      setState('paused');
    }
  }, [state]);

  const resume = useCallback(() => {
    if (synthRef.current && state === 'paused') {
      synthRef.current.resume();
      setState('speaking');
    }
  }, [state]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState('idle');
    }
  }, []);

  const toggle = useCallback((text: string) => {
    if (state === 'speaking') {
      pause();
    } else if (state === 'paused') {
      resume();
    } else {
      speak(text);
    }
  }, [state, speak, pause, resume]);

  return {
    isSupported,
    state,
    speak,
    pause,
    resume,
    stop,
    toggle
  };
}

