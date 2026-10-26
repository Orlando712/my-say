import React from "react";
import { DetectedProduct, SupportedLanguage } from "@/lib/types";
import {
  Volume2,
  Square,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Edit3,
} from "lucide-react";

interface MessageDisplayProps {
  message: string;
  onMessageChange: (msg: string) => void;
  selectedProduct: DetectedProduct | null;
  fullImageDataUrl?: string;
  language: SupportedLanguage;
  isBuilding: boolean;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStop: () => void;
  onRepeat: () => void;
  isFallback?: boolean;
  fallbackReason?: string;
  speechUnavailableReason?: string | null;
  isStale: boolean;
}

export function MessageDisplay({
  message,
  onMessageChange,
  selectedProduct,
  fullImageDataUrl,
  language,
  isBuilding,
  isSpeaking,
  onSpeak,
  onStop,
  onRepeat,
  isFallback,
  speechUnavailableReason,
  isStale,
}: MessageDisplayProps) {
  const hasText = message.trim().length > 0;
  const imageSrc = selectedProduct?.cropDataUrl || fullImageDataUrl;

  return (
    <section
      aria-label="Message Preview and Speech"
      className="rounded-xl border border-stone-300 bg-white p-4 shadow-xs sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-stone-900">
            4. Message &amp; Speech
          </h2>
          {isFallback && hasText && (
            <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
              Standard phrasing
            </span>
          )}
          {!isFallback && hasText && (
            <span className="inline-flex items-center gap-1 rounded bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-900">
              <Sparkles className="h-3 w-3" />
              Ready
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Pointing Item Card: Rendered beside/above message so the person can point to it */}
        {selectedProduct && (
          <div className="flex items-center gap-3.5 rounded-xl border border-teal-200 bg-teal-50/50 p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-teal-200 bg-white">
              {imageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={selectedProduct.labelEn}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold tracking-wide uppercase text-[#0f4c5c]">
                Point here at counter
              </span>
              <p className="truncate text-base font-bold text-stone-900">
                {language === "te"
                  ? selectedProduct.labelTe
                  : selectedProduct.labelEn}
              </p>
              <p className="truncate text-xs text-stone-600">
                {language === "te"
                  ? selectedProduct.labelEn
                  : selectedProduct.labelTe}
              </p>
            </div>
          </div>
        )}

        {/* Large Editable Text Display */}
        <div className="relative">
          <label
            htmlFor="message-preview-textarea"
            className="mb-1 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-600"
          >
            <span className="flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5 text-stone-500" />
              Spoken Message (Editable)
            </span>
            <span className="text-[11px] font-normal lowercase text-stone-500">
              Tap to adjust wording if needed
            </span>
          </label>
          <textarea
            id="message-preview-textarea"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            disabled={isBuilding}
            rows={3}
            placeholder={
              isBuilding
                ? "Composing message..."
                : "Select an item and press 'Build message' or pick a quick reply..."
            }
            className={`w-full rounded-xl border-2 p-4 text-xl font-medium leading-relaxed tracking-wide text-stone-900 transition focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50 ${
              isStale
                ? "border-amber-300 bg-amber-50/40 text-stone-700"
                : "border-stone-300 bg-white"
            } ${isSpeaking ? "ring-2 ring-[#0f4c5c] bg-teal-50/30" : ""}`}
          />

          {isStale && (
            <p className="mt-1 text-xs text-amber-800">
              Selection changed. Rebuild message or edit text before speaking.
            </p>
          )}
        </div>

        {/* Telugu Voice Unavailable Warning Banner */}
        {speechUnavailableReason && language === "te" && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-950"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div className="text-xs">
              <p className="font-bold">Telugu Audio Voice Unavailable</p>
              <p className="mt-0.5 text-amber-900">
                {speechUnavailableReason}. The Telugu sentence above is displayed in large high-contrast text for the shopkeeper to read.
              </p>
            </div>
          </div>
        )}

        {/* Speech Controls (Prominent Speak + Accessible Stop and Repeat) */}
        <div className="space-y-2.5">
          {/* Main Speak button - Extra Prominent */}
          <button
            type="button"
            onClick={onSpeak}
            disabled={!hasText || isBuilding || isSpeaking}
            className="flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-[#0f4c5c] px-6 py-3.5 text-lg font-bold text-white shadow-md transition hover:bg-[#0b3b47] active:bg-[#082c35] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
          >
            <Volume2 className="h-7 w-7" />
            <span>{isSpeaking ? "Speaking..." : "Speak Message"}</span>
          </button>

          {/* Secondary Controls: Stop & Repeat */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onStop}
              disabled={!isSpeaking}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-stone-300 bg-stone-50 px-4 py-2.5 text-sm font-bold text-stone-800 transition hover:bg-stone-100 hover:border-stone-400 active:bg-stone-200 disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
            >
              <Square className="h-4 w-4 fill-current text-red-600" />
              <span>Stop</span>
            </button>

            <button
              type="button"
              onClick={onRepeat}
              disabled={!hasText || isBuilding}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-stone-300 bg-stone-50 px-4 py-2.5 text-sm font-bold text-stone-800 transition hover:bg-stone-100 hover:border-stone-400 active:bg-stone-200 disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
            >
              <RotateCcw className="h-4 w-4 text-stone-700" />
              <span>Repeat</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
