import React from "react";
import {
  DetectedProduct,
  IntentionType,
  SupportedLanguage,
} from "@/lib/types";
import { HelpCircle, ShoppingCart, Send, Sparkles } from "lucide-react";

interface SelectionControlsProps {
  selectedProduct: DetectedProduct | null;
  intention: IntentionType;
  onIntentionChange: (intention: IntentionType) => void;
  quantity: 1 | 2 | 3;
  onQuantityChange: (qty: 1 | 2 | 3) => void;
  onBuildMessage: () => void;
  isBuilding: boolean;
  language: SupportedLanguage;
  isStale: boolean;
}

export function SelectionControls({
  selectedProduct,
  intention,
  onIntentionChange,
  quantity,
  onQuantityChange,
  onBuildMessage,
  isBuilding,
  language,
  isStale,
}: SelectionControlsProps) {
  if (!selectedProduct) {
    return (
      <section
        aria-label="Intention and Quantity"
        className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-5 text-center"
      >
        <p className="text-sm font-medium text-stone-500">
          Select a product above to choose your intention and quantity.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Intention and Quantity Selection"
      className="rounded-xl border border-stone-300 bg-white p-4 shadow-xs sm:p-5"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-stone-900">
          3. Intention &amp; Quantity
        </h2>
        
        {/* Immediate high-visibility summary of active selection */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-lg border border-teal-200 bg-teal-50/70 p-2.5 text-xs text-stone-800">
          <span className="font-bold text-[#0f4c5c]">Active selection:</span>
          <span className="rounded bg-white px-2 py-0.5 font-bold text-stone-900 border border-teal-200">
            {language === "te" ? selectedProduct.labelTe : selectedProduct.labelEn}
          </span>
          <span className="text-stone-400">&bull;</span>
          <span className="rounded bg-white px-2 py-0.5 font-semibold text-stone-800 border border-teal-200">
            {intention === "ask_price" ? (language === "te" ? "ధర ఎంత?" : "Ask price") : (language === "te" ? "ఇది కావాలి" : "I want this")}
          </span>
          <span className="text-stone-400">&bull;</span>
          <span className="rounded bg-[#0f4c5c] px-2 py-0.5 font-bold text-white">
            Qty: {quantity}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Intention selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
            What do you want to say?
          </label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              role="button"
              aria-pressed={intention === "ask_price"}
              onClick={() => onIntentionChange("ask_price")}
              className={`flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50 ${
                intention === "ask_price"
                  ? "border-[#0f4c5c] bg-teal-50/80 text-[#0f4c5c] shadow-xs"
                  : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <HelpCircle className="h-6 w-6 shrink-0 text-[#0f4c5c]" />
              <div>
                <div className="text-sm font-bold">Ask the price</div>
                <div className="text-xs text-stone-600">ధర ఎంత అని అడగండి</div>
              </div>
            </button>

            <button
              type="button"
              role="button"
              aria-pressed={intention === "want_this"}
              onClick={() => onIntentionChange("want_this")}
              className={`flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50 ${
                intention === "want_this"
                  ? "border-[#0f4c5c] bg-teal-50/80 text-[#0f4c5c] shadow-xs"
                  : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <ShoppingCart className="h-6 w-6 shrink-0 text-[#0f4c5c]" />
              <div>
                <div className="text-sm font-bold">I want this</div>
                <div className="text-xs text-stone-600">ఇది నాకు కావాలి</div>
              </div>
            </button>
          </div>
        </div>

        {/* Quantity selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
            Quantity / పరిమాణం
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {([1, 2, 3] as const).map((q) => (
              <button
                key={q}
                type="button"
                role="button"
                aria-pressed={quantity === q}
                onClick={() => onQuantityChange(q)}
                className={`flex min-h-[56px] items-center justify-center rounded-xl border-2 text-lg font-bold transition-all focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50 ${
                  quantity === q
                    ? "border-[#0f4c5c] bg-[#0f4c5c] text-white shadow-xs"
                    : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Build Message Action Button */}
        <div>
          <button
            type="button"
            onClick={onBuildMessage}
            disabled={isBuilding}
            className={`flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-base font-bold text-white shadow-sm transition-all focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50 disabled:opacity-50 ${
              isStale
                ? "bg-[#0f4c5c] hover:bg-[#0b3b47] active:bg-[#082c35]"
                : "bg-[#0f4c5c] hover:bg-[#0b3b47] active:bg-[#082c35]"
            }`}
          >
            {isBuilding ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Composing message...</span>
              </>
            ) : (
              <>
                {isStale ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span>Build message</span>
              </>
            )}
          </button>
          {isStale && !isBuilding && (
            <p className="mt-1.5 text-center text-xs text-amber-800 font-medium">
              Selection changed. Tap &ldquo;Build message&rdquo; to update phrase.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
