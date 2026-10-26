import React from "react";
import { DetectedProduct, SupportedLanguage } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Info } from "lucide-react";

interface ProductGridProps {
  products: DetectedProduct[];
  selectedProduct: DetectedProduct | null;
  onSelectProduct: (product: DetectedProduct) => void;
  fullImageDataUrl?: string;
  language: SupportedLanguage;
  explanation?: string;
}

export function ProductGrid({
  products,
  selectedProduct,
  onSelectProduct,
  fullImageDataUrl,
  language,
  explanation,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="pt-2">
        {explanation ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-[#E2DDD5] bg-[#FAF9F5] p-3 text-xs text-[#58625B]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#174C43]" />
            <div>
              <span className="font-semibold text-[#202923]">Scene note:</span> {explanation}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#E2DDD5] bg-[#FAF9F5] p-3 text-center text-xs text-[#58625B]">
            Choose or take a photo above, then tap &ldquo;Scan photo&rdquo; to detect items.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#202923]">
            Choose an item
          </h3>
          <p className="text-xs text-[#58625B]">
            Tap the item you want to speak about
          </p>
        </div>
        <span className="rounded-full bg-[#EBF2EE] px-2.5 py-0.5 text-xs font-bold text-[#174C43]">
          {products.length} found
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            onSelect={onSelectProduct}
            fullImageDataUrl={fullImageDataUrl}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}
