import React from "react";
import { DetectedProduct, SupportedLanguage } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ShoppingBag, Info } from "lucide-react";

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
      <section
        aria-label="Detected Products"
        className="rounded-xl border border-stone-300 bg-white p-5 text-center shadow-xs"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h2 className="mt-3 text-base font-bold text-stone-900">
          2. Selectable Shop Items
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Take a photo of a shelf or counter display, then press &ldquo;Find items&rdquo; to detect products.
        </p>

        {explanation && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-stone-50 p-3 text-left text-xs text-stone-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0f4c5c]" />
            <div>
              <span className="font-semibold">Scene note:</span> {explanation}
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      aria-label="Detected Products"
      className="rounded-xl border border-stone-300 bg-white p-4 shadow-xs sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            2. Choose Product ({products.length} found)
          </h2>
          <p className="text-xs text-stone-600">
            Tap the item you want to ask about or buy
          </p>
        </div>
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
    </section>
  );
}
