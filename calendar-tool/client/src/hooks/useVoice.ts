import { useState, useRef, useCallback } from 'react';

export type VoiceState = 'idle' | 'listening' | 'unsupported';

export function useVoice(onTranscript: (text: string) => void) {
  const [state, setState] = useState<VoiceState>(
    typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
      ? 'idle'
      : 'unsupported'
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const start = useCallback(() => {
    if (state === 'unsupported') return;
    const SR = (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition })
      .SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
    };
    rec.onend = () => setState('idle');
    rec.onerror = () => setState('idle');

    rec.start();
    recognitionRef.current = rec;
    setState('listening');
  }, [state, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState('idle');
  }, []);

  return { state, start, stop };
}
