import React from "react";
import { SupportedLanguage } from "@/lib/types";
import { Languages, Volume2, ShieldCheck } from "lucide-react";

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  modelUsed?: string;
}

export function Header({
  language,
  onLanguageChange,
}: HeaderProps) {
  return (
    <header className="border-b border-stone-300 bg-white shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0f4c5c] text-white">
            <Volume2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                MySay
              </h1>
              <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                <ShieldCheck className="h-3 w-3 text-[#0f4c5c]" />
                Counter Board
              </span>
            </div>
            <p className="text-xs text-stone-600 sm:text-sm">
              Photo-grounded communication for shop counters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language selector toggle */}
          <div
            role="group"
            aria-label="Language selection"
            className="flex items-center rounded-lg border border-stone-300 bg-stone-100 p-1"
          >
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              aria-pressed={language === "en"}
              className={`flex min-h-[44px] min-w-[76px] items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f4c5c] ${
                language === "en"
                  ? "bg-[#0f4c5c] text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <Languages className="h-4 w-4" />
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("te")}
              aria-pressed={language === "te"}
              className={`flex min-h-[44px] min-w-[76px] items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f4c5c] ${
                language === "te"
                  ? "bg-[#0f4c5c] text-white shadow-xs"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
