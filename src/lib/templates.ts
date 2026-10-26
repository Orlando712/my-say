import { ComposeRequestBody } from "./types";

/**
 * Deterministic local sentence generator used as an explicit fallback
 * when model access is unconfigured, times out, or fails.
 * Never invents preferences, prices, or health claims.
 */
export function buildLocalTemplateMessage(data: ComposeRequestBody): string {
  const { item, intention, quantity, language, isCorrection, previousItem } = data;

  if (language === "te") {
    // Telugu deterministic templates
    if (isCorrection) {
      if (previousItem) {
        return `క్షమించండి, నాకు అది కాదు, ఈ ${item.labelTe} కావాలి.`;
      }
      return `క్షమించండి, నాకు ఈ ${item.labelTe} కావాలి.`;
    }

    if (intention === "ask_price") {
      if (quantity === 1) {
        return `ఈ ${item.labelTe} ధర ఎంత?`;
      }
      return `ఈ ${item.labelTe} ${quantity} కొనడానికి ఎంత అవుతుంది?`;
    }

    if (intention === "want_this") {
      if (quantity === 1) {
        return `దయచేసి నాకు ఒక ${item.labelTe} ఇవ్వండి.`;
      }
      return `దయచేసి నాకు ${quantity} ${item.labelTe} ఇవ్వండి.`;
    }

    return `ఈ ${item.labelTe}.`;
  }

  // English deterministic templates
  if (isCorrection) {
    if (previousItem) {
      return `Sorry, I meant this ${item.labelEn}, not the other item.`;
    }
    return `Sorry, I meant this ${item.labelEn}.`;
  }

  if (intention === "ask_price") {
    if (quantity === 1) {
      return `How much is this ${item.labelEn}?`;
    }
    return `How much are ${quantity} of this ${item.labelEn}?`;
  }

  if (intention === "want_this") {
    if (quantity === 1) {
      return `I would like 1 of this ${item.labelEn}, please.`;
    }
    return `I would like ${quantity} of this ${item.labelEn}, please.`;
  }

  return `This ${item.labelEn}, please.`;
}

/**
 * Quick reply deterministic phrases for one-tap replies.
 */
export const QUICK_REPLIES: Record<
  "yes" | "no" | "thank_you",
  { en: string; te: string }
> = {
  yes: {
    en: "Yes",
    te: "అవును",
  },
  no: {
    en: "No",
    te: "కాదు",
  },
  thank_you: {
    en: "Thank you",
    te: "ధన్యవాదాలు",
  },
};
