import React from "react";
import { DetectedProduct, SupportedLanguage } from "@/lib/types";
import { Check, Image as ImageIcon } from "lucide-react";

interface ProductCardProps {
  product: DetectedProduct;
  isSelected: boolean;
  onSelect: (product: DetectedProduct) => void;
  fullImageDataUrl?: string;
  language: SupportedLanguage;
}

export function ProductCard({
  product,
  isSelected,
  onSelect,
  fullImageDataUrl,
  language,
}: ProductCardProps) {
  // Use crop if available; if crop failed or is missing, use full image safely
  const imageSrc = product.cropDataUrl || fullImageDataUrl;

  return (
    <button
      type="button"
      role="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(product)}
      className={`group relative flex min-h-[110px] w-full items-center gap-3.5 rounded-xl border-2 p-3 text-left transition-all focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50 ${
        isSelected
          ? "border-[#0f4c5c] bg-teal-50/60 shadow-sm"
          : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      {/* Product Image Crop / Thumbnail */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 sm:h-24 sm:w-24">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={product.labelEn}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}

        {product.cropFailed && (
          <span
            title="Full photo used (crop box was outside bounds)"
            className="absolute bottom-1 right-1 rounded bg-stone-900/75 px-1 py-0.5 text-[9px] font-medium text-white"
          >
            Scene
          </span>
        )}
      </div>

      {/* Product Labels (Bilingual) */}
      <div className="flex-1 pr-6">
        <p
          className={`text-base font-bold leading-tight ${
            language === "te"
              ? "text-stone-900 text-lg"
              : "text-[#0f4c5c] text-base"
          }`}
        >
          {language === "te" ? product.labelTe : product.labelEn}
        </p>

        <p className="mt-1 text-xs text-stone-600 font-medium">
          {language === "te" ? product.labelEn : product.labelTe}
        </p>

        <span className="mt-2 inline-block rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600">
          Item #{product.id}
        </span>
      </div>

      {/* Selected Indicator Badge */}
      <div
        className={`absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
          isSelected
            ? "border-[#0f4c5c] bg-[#0f4c5c] text-white"
            : "border-stone-300 bg-white text-transparent group-hover:border-stone-400"
        }`}
      >
        <Check className="h-4 w-4 stroke-[3]" />
      </div>
    </button>
  );
}
