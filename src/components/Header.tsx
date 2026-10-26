import React from "react";
import { SupportedLanguage } from "@/lib/types";
import { MessageSquareQuote, Languages } from "lucide-react";

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export function Header({
  language,
  onLanguageChange,
}: HeaderProps) {
  return (
    <header className="border-b border-[#E2DDD5] bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        {/* Compact MySay Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174C43] text-white shadow-xs">
            <MessageSquareQuote className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#202923]">
              MySay
            </span>
            <p className="text-xs text-[#58625B]">
              Your surroundings. Your words.
            </p>
          </div>
        </div>

        {/* English / Telugu Segmented Control */}
        <div
          role="group"
          aria-label="Language selection"
          className="flex items-center rounded-xl border border-[#E2DDD5] bg-[#F6F4EE] p-1"
        >
          <button
            type="button"
            onClick={() => onLanguageChange("en")}
            aria-pressed={language === "en"}
            className={`flex min-h-[40px] min-w-[76px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#174C43] ${
              language === "en"
                ? "bg-[#174C43] text-white shadow-xs"
                : "text-[#58625B] hover:text-[#202923]"
            }`}
          >
            <Languages className="h-3.5 w-3.5" />
            English
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("te")}
            aria-pressed={language === "te"}
            className={`flex min-h-[40px] min-w-[76px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#174C43] ${
              language === "te"
                ? "bg-[#174C43] text-white shadow-xs"
                : "text-[#58625B] hover:text-[#202923]"
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>
    </header>
  );
}
