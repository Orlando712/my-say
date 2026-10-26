import { SupportedLanguage } from "./types";

export interface VoiceStatus {
  available: boolean;
  voiceName?: string;
  langCode: string;
  reason?: string;
}

/**
 * Helper to inspect and retrieve available browser voices.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * Checks whether a suitable speech voice is available for the given language.
 */
export function checkVoiceSupport(
  lang: SupportedLanguage,
  voices = getAvailableVoices()
): VoiceStatus {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return {
      available: false,
      langCode: lang,
      reason: "Speech synthesis is not supported in this browser.",
    };
  }

  if (lang === "te") {
    const teVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("te") ||
        v.lang.toLowerCase().includes("telugu")
    );

    if (teVoice) {
      return {
        available: true,
        voiceName: teVoice.name,
        langCode: teVoice.lang,
      };
    }

    return {
      available: false,
      langCode: "te-IN",
      reason:
        "No Telugu voice found on this device/browser. Large high-contrast text is displayed for pointing.",
    };
  }

  // English
  const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (enVoice) {
    return {
      available: true,
      voiceName: enVoice.name,
      langCode: enVoice.lang,
    };
  }

  // Fallback to any default voice if lang matches
  if (voices.length > 0) {
    return {
      available: true,
      voiceName: voices[0].name,
      langCode: voices[0].lang,
    };
  }

  return {
    available: false,
    langCode: "en-US",
    reason: "No English voice currently loaded in browser.",
  };
}

/**
 * Speaks text using the browser's native SpeechSynthesis API.
 * Ensures existing speech is canceled first.
 * Strictly avoids speaking Telugu using an English voice.
 */
export function speakText(
  text: string,
  lang: SupportedLanguage,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (errMessage: string) => void;
  }
): { started: boolean; error?: string } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    const msg = "Speech synthesis not available in this browser.";
    callbacks?.onError?.(msg);
    return { started: false, error: msg };
  }

  const voices = window.speechSynthesis.getVoices();
  const support = checkVoiceSupport(lang, voices);

  if (!support.available) {
    const msg = support.reason || `No voice available for language: ${lang}`;
    callbacks?.onError?.(msg);
    return { started: false, error: msg };
  }

  // Cancel any ongoing speech immediately before starting
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Slightly deliberate for counter clarity
  utterance.pitch = 1.0;

  if (lang === "te") {
    utterance.lang = "te-IN";
    const voice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("te") ||
        v.lang.toLowerCase().includes("telugu")
    );
    if (voice) {
      utterance.voice = voice;
    }
  } else {
    utterance.lang = "en-US";
    const voice = voices.find(
      (v) =>
        v.lang.toLowerCase() === "en-us" ||
        v.lang.toLowerCase() === "en-gb" ||
        v.lang.toLowerCase().startsWith("en")
    );
    if (voice) {
      utterance.voice = voice;
    }
  }

  utterance.onstart = () => {
    callbacks?.onStart?.();
  };

  utterance.onend = () => {
    callbacks?.onEnd?.();
  };

  utterance.onerror = (e) => {
    // If canceled explicitly, not an actual error
    if (e.error === "canceled" || e.error === "interrupted") {
      callbacks?.onEnd?.();
      return;
    }
    callbacks?.onError?.(`Speech error: ${e.error}`);
  };

  try {
    window.speechSynthesis.speak(utterance);
    return { started: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    callbacks?.onError?.(msg);
    return { started: false, error: msg };
  }
}

/**
 * Stops any speech currently in progress.
 */
export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
