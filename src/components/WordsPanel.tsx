import React from "react";
import {
  DetectedProduct,
  IntentionType,
  SupportedLanguage,
} from "@/lib/types";
import { QUICK_REPLIES } from "@/lib/templates";
import {
  HelpCircle,
  ShoppingCart,
  Send,
  Sparkles,
  Volume2,
  Square,
  RotateCcw,
  RefreshCw,
  Check,
  X,
  ThumbsUp,
  AlertTriangle,
  Edit3,
  ShoppingBag,
} from "lucide-react";

interface WordsPanelProps {
  selectedProduct: DetectedProduct | null;
  intention: IntentionType;
  onIntentionChange: (intention: IntentionType) => void;
  quantity: 1 | 2 | 3;
  onQuantityChange: (qty: 1 | 2 | 3) => void;
  onBuildMessage: () => void;
  isBuilding: boolean;
  isStale: boolean;
  message: string;
  onMessageChange: (msg: string) => void;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStop: () => void;
  onRepeat: () => void;
  isFallback?: boolean;
  speechUnavailableReason?: string | null;
  onDifferentItem: () => void;
  onOnlyOne: () => void;
  isCorrectionMode: boolean;
  onQuickReply: (text: string) => void;
  language: SupportedLanguage;
  fullImageDataUrl?: string;
}

export function WordsPanel({
  selectedProduct,
  intention,
  onIntentionChange,
  quantity,
  onQuantityChange,
  onBuildMessage,
  isBuilding,
  isStale,
  message,
  onMessageChange,
  isSpeaking,
  onSpeak,
  onStop,
  onRepeat,
  isFallback,
  speechUnavailableReason,
  onDifferentItem,
  onOnlyOne,
  isCorrectionMode,
  onQuickReply,
  language,
  fullImageDataUrl,
}: WordsPanelProps) {
  const isTe = language === "te";
  const hasText = message.trim().length > 0;
  const imageSrc = selectedProduct?.cropDataUrl || fullImageDataUrl;

  return (
    <div className="space-y-5">
      {/* Panel Heading */}
      <div className="border-b border-[#E2DDD5] pb-3">
        <h2 className="text-xl font-bold tracking-tight text-[#202923]">
          Your words
        </h2>
        <p className="text-xs text-[#58625B]">
          What you want to say at the counter
        </p>
      </div>

      {!selectedProduct ? (
        /* Empty / Initial State before Product is Selected */
        <div className="rounded-2xl border-2 border-dashed border-[#E2DDD5] bg-[#FAF9F5] p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF2EE] text-[#174C43]">
            <ShoppingBag className="h-7 w-7" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-base font-bold text-[#202923]">
            Choose an item to start
          </h3>
          <p className="mt-1 text-xs text-[#58625B]">
            Tap an item from your surroundings on the left to ask its price or ask to buy it.
          </p>
        </div>
      ) : (
        /* Active Selection State */
        <div className="space-y-4">
          {/* Active Product Bar */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#E2DDD5] bg-[#FAF9F5] p-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E2DDD5] bg-white">
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={selectedProduct.labelEn}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#58625B]">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold tracking-wider uppercase text-[#174C43]">
                Selected Item
              </span>
              <p className="truncate text-base font-bold text-[#202923]">
                {isTe ? selectedProduct.labelTe : selectedProduct.labelEn}
              </p>
              <p className="truncate text-xs text-[#58625B]">
                {isTe ? selectedProduct.labelEn : selectedProduct.labelTe}
              </p>
            </div>
          </div>

          {/* Intention Options (Ask Price vs I Want This) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#58625B]">
              Intention
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                role="button"
                aria-pressed={intention === "ask_price"}
                onClick={() => onIntentionChange("ask_price")}
                className={`flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition-all focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43] ${
                  intention === "ask_price"
                    ? "border-[#174C43] bg-[#EBF2EE] text-[#174C43] shadow-xs"
                    : "border-[#E2DDD5] bg-white text-[#202923] hover:border-[#C4BCB0] hover:bg-[#FAF9F5]"
                }`}
              >
                <HelpCircle className="h-5 w-5 shrink-0 text-[#174C43]" />
                <div>
                  <div className="text-sm font-bold">Ask the price</div>
                  <div className="text-[11px] text-[#58625B]">ధర ఎంత అని అడగండి</div>
                </div>
              </button>

              <button
                type="button"
                role="button"
                aria-pressed={intention === "want_this"}
                onClick={() => onIntentionChange("want_this")}
                className={`flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition-all focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43] ${
                  intention === "want_this"
                    ? "border-[#174C43] bg-[#EBF2EE] text-[#174C43] shadow-xs"
                    : "border-[#E2DDD5] bg-white text-[#202923] hover:border-[#C4BCB0] hover:bg-[#FAF9F5]"
                }`}
              >
                <ShoppingCart className="h-5 w-5 shrink-0 text-[#174C43]" />
                <div>
                  <div className="text-sm font-bold">I want this</div>
                  <div className="text-[11px] text-[#58625B]">ఇది నాకు కావాలి</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#58625B]">
              Quantity
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {([1, 2, 3] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  role="button"
                  aria-pressed={quantity === q}
                  onClick={() => onQuantityChange(q)}
                  className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 text-base font-bold transition-all focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43] ${
                    quantity === q
                      ? "border-[#174C43] bg-[#174C43] text-white shadow-xs"
                      : "border-[#E2DDD5] bg-white text-[#202923] hover:border-[#C4BCB0] hover:bg-[#FAF9F5]"
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
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#174C43] px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-[#123C35] active:bg-[#0E2D27] disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
            >
              {isBuilding ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Composing message...</span>
                </>
              ) : (
                <>
                  {isStale ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Build message</span>
                </>
              )}
            </button>
            {isStale && !isBuilding && (
              <p className="mt-1 text-center text-xs font-medium text-amber-800">
                Selection changed. Tap &ldquo;Build message&rdquo; to update phrase.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Message Preview (The Visual Centerpiece) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="words-preview-textarea"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#58625B]"
          >
            <Edit3 className="h-3.5 w-3.5 text-[#58625B]" />
            <span>Spoken message (editable)</span>
          </label>
          {isFallback && hasText && (
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
              Standard phrasing
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            id="words-preview-textarea"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            disabled={isBuilding}
            rows={3}
            placeholder={
              isBuilding
                ? "Composing message..."
                : "Select an item and press 'Build message' or pick a quick reply..."
            }
            className={`w-full rounded-2xl border-2 p-4 text-xl font-medium leading-relaxed tracking-wide text-[#202923] transition focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43] ${
              isStale
                ? "border-amber-300 bg-amber-50/40 text-stone-700"
                : "border-[#E2DDD5] bg-white"
            } ${isSpeaking ? "ring-2 ring-[#174C43] bg-[#EBF2EE]/40" : ""}`}
          />
        </div>

        {/* Telugu Voice Unavailable Warning Banner */}
        {speechUnavailableReason && isTe && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-[#FEF6EE] p-3 text-amber-950 text-xs"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <p className="font-bold">Telugu Audio Voice Unavailable</p>
              <p className="mt-0.5 text-amber-900">
                {speechUnavailableReason}. The message is displayed in large text above for the counter staff to read.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Speech Controls */}
      <div className="space-y-2.5">
        {/* Speak Message - Prominent Primary Action */}
        <button
          type="button"
          onClick={onSpeak}
          disabled={!hasText || isBuilding || isSpeaking}
          className="flex min-h-[56px] sm:min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-[#174C43] px-6 py-3.5 text-lg font-bold text-white shadow-sm transition hover:bg-[#123C35] active:bg-[#0E2D27] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
        >
          <Volume2 className="h-6 w-6" />
          <span>{isSpeaking ? "Speaking..." : "Speak Message"}</span>
        </button>

        {/* Stop and Repeat Controls */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onStop}
            disabled={!isSpeaking}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#E2DDD5] bg-[#FAF9F5] px-4 py-2 text-sm font-bold text-[#202923] transition hover:bg-[#F2EFE9] hover:border-[#C4BCB0] active:bg-[#EAE6DE] disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
          >
            <Square className="h-4 w-4 fill-current text-red-600" />
            <span>Stop</span>
          </button>

          <button
            type="button"
            onClick={onRepeat}
            disabled={!hasText || isBuilding}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#E2DDD5] bg-[#FAF9F5] px-4 py-2 text-sm font-bold text-[#202923] transition hover:bg-[#F2EFE9] hover:border-[#C4BCB0] active:bg-[#EAE6DE] disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
          >
            <RotateCcw className="h-4 w-4 text-[#58625B]" />
            <span>Repeat</span>
          </button>
        </div>
      </div>

      {/* Misunderstanding Corrections */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#58625B]">
          Corrections
        </label>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Different item */}
          <button
            type="button"
            onClick={onDifferentItem}
            className={`flex min-h-[52px] items-center gap-2.5 rounded-xl border-2 px-4 py-2 text-left font-bold transition focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43] ${
              isCorrectionMode
                ? "border-[#174C43] bg-[#EBF2EE] text-[#174C43]"
                : "border-[#E2DDD5] bg-[#FAF9F5] text-[#202923] hover:bg-[#F2EFE9] hover:border-[#C4BCB0]"
            }`}
          >
            <RefreshCw className="h-4 w-4 shrink-0 text-[#174C43]" />
            <div>
              <div className="text-xs font-bold">Different item</div>
              <div className="text-[10px] font-normal text-[#58625B]">
                కాదు, వేరే వస్తువు
              </div>
            </div>
          </button>

          {/* Only one */}
          <button
            type="button"
            onClick={onOnlyOne}
            disabled={!selectedProduct}
            className="flex min-h-[52px] items-center gap-2.5 rounded-xl border-2 border-[#E2DDD5] bg-[#FAF9F5] px-4 py-2 text-left font-bold text-[#202923] transition hover:bg-[#F2EFE9] hover:border-[#C4BCB0] disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E2DDD5] text-xs font-black text-[#202923]">
              1
            </span>
            <div>
              <div className="text-xs font-bold">Only one</div>
              <div className="text-[10px] font-normal text-[#58625B]">
                ఒక్కటి మాత్రమే
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Replies Row (Always Usable) */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#58625B]">
          Quick replies
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Yes */}
          <button
            type="button"
            onClick={() =>
              onQuickReply(isTe ? QUICK_REPLIES.yes.te : QUICK_REPLIES.yes.en)
            }
            className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border-2 border-[#E2DDD5] bg-[#FAF9F5] p-2 font-bold text-[#202923] transition hover:bg-[#F2EFE9] hover:border-[#C4BCB0] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
          >
            <Check className="h-4 w-4 text-emerald-700" />
            <span className="text-xs">{isTe ? "అవును" : "Yes"}</span>
          </button>

          {/* No */}
          <button
            type="button"
            onClick={() =>
              onQuickReply(isTe ? QUICK_REPLIES.no.te : QUICK_REPLIES.no.en)
            }
            className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border-2 border-[#E2DDD5] bg-[#FAF9F5] p-2 font-bold text-[#202923] transition hover:bg-[#F2EFE9] hover:border-[#C4BCB0] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
          >
            <X className="h-4 w-4 text-red-700" />
            <span className="text-xs">{isTe ? "కాదు" : "No"}</span>
          </button>

          {/* Thank you */}
          <button
            type="button"
            onClick={() =>
              onQuickReply(
                isTe ? QUICK_REPLIES.thank_you.te : QUICK_REPLIES.thank_you.en
              )
            }
            className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border-2 border-[#E2DDD5] bg-[#FAF9F5] p-2 font-bold text-[#202923] transition hover:bg-[#F2EFE9] hover:border-[#C4BCB0] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
          >
            <ThumbsUp className="h-4 w-4 text-[#174C43]" />
            <span className="text-xs">{isTe ? "ధన్యవాదాలు" : "Thank you"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
