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
      className={`group relative flex min-h-[96px] w-full items-center gap-3.5 rounded-2xl border-2 p-3 text-left transition-all focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43] ${
        isSelected
          ? "border-[#174C43] bg-[#EBF2EE] shadow-xs"
          : "border-[#E2DDD5] bg-white hover:border-[#C4BCB0] hover:bg-[#FAF9F5]"
      }`}
    >
      {/* Real Product Image Crop / Thumbnail */}
      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-[#E2DDD5] bg-[#F6F4EE] sm:h-20 sm:w-20">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={product.labelEn}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#58625B]">
            <ImageIcon className="h-7 w-7" />
          </div>
        )}

        {product.cropFailed && (
          <span
            title="Full photo used (crop box was outside bounds)"
            className="absolute bottom-1 right-1 rounded bg-[#202923]/80 px-1 py-0.5 text-[9px] font-medium text-white"
          >
            Scene
          </span>
        )}
      </div>

      {/* Product Labels (Bilingual) */}
      <div className="min-w-0 flex-1 pr-7">
        <p className="truncate text-base font-bold text-[#202923]">
          {language === "te" ? product.labelTe : product.labelEn}
        </p>

        <p className="mt-0.5 truncate text-xs text-[#58625B]">
          {language === "te" ? product.labelEn : product.labelTe}
        </p>
      </div>

      {/* Unmistakable Checkmark Indicator */}
      <div
        className={`absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
          isSelected
            ? "border-[#174C43] bg-[#174C43] text-white shadow-xs"
            : "border-[#C4BCB0] bg-white text-transparent group-hover:border-[#174C43]/60"
        }`}
        aria-hidden="true"
      >
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </div>
    </button>
  );
}
