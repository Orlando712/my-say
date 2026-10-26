import React from "react";
import { SupportedLanguage } from "@/lib/types";
import { QUICK_REPLIES } from "@/lib/templates";
import { RefreshCw, Check, X, ThumbsUp, AlertCircle } from "lucide-react";

interface CorrectionBarProps {
  onDifferentItem: () => void;
  onOnlyOne: () => void;
  onQuickReply: (text: string) => void;
  language: SupportedLanguage;
  isCorrectionMode: boolean;
  hasSelectedProduct: boolean;
}

export function CorrectionBar({
  onDifferentItem,
  onOnlyOne,
  onQuickReply,
  language,
  isCorrectionMode,
  hasSelectedProduct,
}: CorrectionBarProps) {
  const isTe = language === "te";

  return (
    <section
      aria-label="Quick Replies and Misunderstanding Corrections"
      className="rounded-xl border border-stone-300 bg-white p-4 shadow-xs sm:p-5"
    >
      <div className="mb-3">
        <h2 className="text-base font-bold text-stone-900">
          5. Corrections &amp; Quick Replies
        </h2>
        <p className="text-xs text-stone-600">
          Instant responses for common counter misunderstandings
        </p>
      </div>

      {isCorrectionMode && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-200 p-2.5 text-xs text-teal-900 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#0f4c5c]" />
          <span>
            {isTe
              ? "సవరణ మోడ్: పై చిత్రంలో సరైన వస్తువును ఎంచుకోండి."
              : "Correction active: Select the replacement item above to speak a correction."}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {/* Misunderstanding corrections */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* No, a different item */}
          <button
            type="button"
            onClick={onDifferentItem}
            className={`flex min-h-[56px] items-center gap-2.5 rounded-xl border-2 px-4 py-2.5 text-left font-bold transition focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50 ${
              isCorrectionMode
                ? "border-[#0f4c5c] bg-teal-50 text-[#0f4c5c]"
                : "border-stone-300 bg-stone-50 text-stone-900 hover:bg-stone-100 hover:border-stone-400"
            }`}
          >
            <RefreshCw className="h-5 w-5 shrink-0 text-[#0f4c5c]" />
            <div>
              <div className="text-sm">No, a different item</div>
              <div className="text-[11px] font-normal text-stone-600">
                కాదు, వేరే వస్తువు
              </div>
            </div>
          </button>

          {/* Only one */}
          <button
            type="button"
            onClick={onOnlyOne}
            disabled={!hasSelectedProduct}
            className="flex min-h-[56px] items-center gap-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 px-4 py-2.5 text-left font-bold text-stone-900 transition hover:bg-stone-100 hover:border-stone-400 disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-xs font-black text-stone-800">
              1
            </span>
            <div>
              <div className="text-sm">Only one</div>
              <div className="text-[11px] font-normal text-stone-600">
                ఒక్కటి మాత్రమే
              </div>
            </div>
          </button>
        </div>

        {/* Quick single-word replies */}
        <div className="grid grid-cols-3 gap-2">
          {/* Yes */}
          <button
            type="button"
            onClick={() =>
              onQuickReply(isTe ? QUICK_REPLIES.yes.te : QUICK_REPLIES.yes.en)
            }
            className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-stone-300 bg-stone-50 p-2 font-bold text-stone-800 transition hover:bg-stone-100 hover:border-stone-400 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
          >
            <Check className="h-5 w-5 text-emerald-700" />
            <span className="text-sm">{isTe ? "అవును" : "Yes"}</span>
          </button>

          {/* No */}
          <button
            type="button"
            onClick={() =>
              onQuickReply(isTe ? QUICK_REPLIES.no.te : QUICK_REPLIES.no.en)
            }
            className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-stone-300 bg-stone-50 p-2 font-bold text-stone-800 transition hover:bg-stone-100 hover:border-stone-400 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
          >
            <X className="h-5 w-5 text-red-700" />
            <span className="text-sm">{isTe ? "కాదు" : "No"}</span>
          </button>

          {/* Thank you */}
          <button
            type="button"
            onClick={() =>
              onQuickReply(
                isTe ? QUICK_REPLIES.thank_you.te : QUICK_REPLIES.thank_you.en
              )
            }
            className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-stone-300 bg-stone-50 p-2 font-bold text-stone-800 transition hover:bg-stone-100 hover:border-stone-400 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
          >
            <ThumbsUp className="h-5 w-5 text-[#0f4c5c]" />
            <span className="text-sm">{isTe ? "ధన్యవాదాలు" : "Thank you"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
