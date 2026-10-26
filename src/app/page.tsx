"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/Header";
import { ImageCapture } from "@/components/ImageCapture";
import { ProductGrid } from "@/components/ProductGrid";
import { SelectionControls } from "@/components/SelectionControls";
import { MessageDisplay } from "@/components/MessageDisplay";
import { CorrectionBar } from "@/components/CorrectionBar";
import {
  DetectedProduct,
  IntentionType,
  SupportedLanguage,
  AnalyzeApiResponse,
  ComposeApiResponse,
} from "@/lib/types";
import {
  processAndResizeImage,
  createCropFromImage,
  ProcessedImage,
} from "@/lib/imageUtils";
import { generateSampleShelfImage } from "@/lib/sampleImage";
import {
  speakText,
  stopSpeech,
  checkVoiceSupport,
  getAvailableVoices,
} from "@/lib/speech";
import { buildLocalTemplateMessage } from "@/lib/templates";
import { Image as ImageIcon } from "lucide-react";

export default function Home() {
  // Application State
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [analyzeErrorCode, setAnalyzeErrorCode] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<DetectedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<DetectedProduct | null>(
    null
  );
  const [previousProduct, setPreviousProduct] = useState<DetectedProduct | null>(
    null
  );
  const [isCorrectionMode, setIsCorrectionMode] = useState<boolean>(false);
  const [intention, setIntention] = useState<IntentionType>("ask_price");
  const [quantity, setQuantity] = useState<1 | 2 | 3>(1);

  // Message & Speech State
  const [message, setMessage] = useState<string>("");
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [fallbackReason, setFallbackReason] = useState<string | undefined>(
    undefined
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechUnavailableReason, setSpeechUnavailableReason] = useState<
    string | null
  >(null);
  const [analyzeElapsedSeconds, setAnalyzeElapsedSeconds] = useState<number>(0);

  // Race condition & abort guard refs
  const composeReqIdRef = useRef<number>(0);
  const analyzeReqIdRef = useRef<number>(0);
  const analyzeAbortControllerRef = useRef<AbortController | null>(null);
  const composeAbortControllerRef = useRef<AbortController | null>(null);
  const analyzeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Listen to speech synthesis voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoiceStatus = () => {
      const voices = getAvailableVoices();
      const support = checkVoiceSupport(language, voices);
      if (!support.available) {
        setSpeechUnavailableReason(
          support.reason || "No suitable voice found in browser."
        );
      } else {
        setSpeechUnavailableReason(null);
      }
    };

    updateVoiceStatus();
    window.speechSynthesis.onvoiceschanged = updateVoiceStatus;
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [language]);

  // Cleanup timer and abort controller on unmount
  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) {
        clearInterval(analyzeTimerRef.current);
      }
      if (analyzeAbortControllerRef.current) {
        analyzeAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Cancel any running analysis
  const handleCancelAnalysis = useCallback(() => {
    if (analyzeAbortControllerRef.current) {
      analyzeAbortControllerRef.current.abort();
      analyzeAbortControllerRef.current = null;
    }
    if (analyzeTimerRef.current) {
      clearInterval(analyzeTimerRef.current);
      analyzeTimerRef.current = null;
    }
    analyzeReqIdRef.current += 1;
    setIsAnalyzing(false);
    setAnalyzeElapsedSeconds(0);
  }, []);

  // Handle Photo Selection
  const handleImageFile = async (file: File) => {
    handleCancelAnalysis();
    stopSpeech();
    setIsSpeaking(false);
    analyzeReqIdRef.current += 1;
    composeReqIdRef.current += 1;

    try {
      const processed = await processAndResizeImage(file);
      setImage(processed);
      // Reset downstream state upon new photo
      setProducts([]);
      setSelectedProduct(null);
      setPreviousProduct(null);
      setIsCorrectionMode(false);
      setMessage("");
      setIsStale(false);
      setAnalyzeError(null);
      setAnalyzeErrorCode(null);
      setExplanation(undefined);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAnalyzeError(`Failed to process image: ${msg}`);
      setAnalyzeErrorCode("INVALID_IMAGE");
    }
  };

  // Quick load of sample scene for testing
  const handleLoadSample = async () => {
    handleCancelAnalysis();
    stopSpeech();
    setIsSpeaking(false);
    analyzeReqIdRef.current += 1;
    composeReqIdRef.current += 1;

    const sample = await generateSampleShelfImage();
    setImage(sample);
    setProducts([]);
    setSelectedProduct(null);
    setPreviousProduct(null);
    setIsCorrectionMode(false);
    setMessage("");
    setIsStale(false);
    setAnalyzeError(null);
    setAnalyzeErrorCode(null);
    setExplanation(undefined);
  };

  // Clear / Retake Photo
  const handleClearImage = () => {
    handleCancelAnalysis();
    stopSpeech();
    setIsSpeaking(false);
    setImage(null);
    setProducts([]);
    setSelectedProduct(null);
    setPreviousProduct(null);
    setIsCorrectionMode(false);
    setMessage("");
    setIsStale(false);
    setAnalyzeError(null);
    setAnalyzeErrorCode(null);
    setExplanation(undefined);
  };

  // Find Items via /api/analyze (no automatic retries, no overlapping calls)
  const handleFindItems = async () => {
    if (!image || isAnalyzing) return;

    handleCancelAnalysis();
    stopSpeech();
    setIsSpeaking(false);
    setIsAnalyzing(true);
    setAnalyzeElapsedSeconds(0);
    setAnalyzeError(null);
    setAnalyzeErrorCode(null);
    setExplanation(undefined);

    const currentReqId = ++analyzeReqIdRef.current;
    const controller = new AbortController();
    analyzeAbortControllerRef.current = controller;

    analyzeTimerRef.current = setInterval(() => {
      setAnalyzeElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image.base64Data,
          mimeType: image.mimeType,
        }),
        signal: controller.signal,
      });

      const data: AnalyzeApiResponse = await res.json();

      // Discard late response if photo or selection changed
      if (currentReqId !== analyzeReqIdRef.current) return;

      if (!data.success) {
        setAnalyzeError(data.error);
        setAnalyzeErrorCode(data.errorCode);
        setExplanation(data.explanation);
        setProducts([]);
        return;
      }

      setExplanation(data.explanation);

      // Generate crops using native Canvas API
      const itemsWithCrops: DetectedProduct[] = await Promise.all(
        data.items.map(async (item) => {
          if (item.cropFailed) {
            return item;
          }
          const cropUrl = await createCropFromImage(image.dataUrl, item.box);
          return {
            ...item,
            cropDataUrl: cropUrl || undefined,
            cropFailed: !cropUrl,
          };
        })
      );

      // Verify again in case user loaded another image or canceled while crops were rendering
      if (currentReqId !== analyzeReqIdRef.current) return;

      setProducts(itemsWithCrops);

      // Auto-select first item if available
      if (itemsWithCrops.length > 0) {
        setSelectedProduct(itemsWithCrops[0]);
        setIsStale(true);
      }
    } catch (err: unknown) {
      if (currentReqId !== analyzeReqIdRef.current) return;
      if (err instanceof Error && err.name === "AbortError") {
        return; // Canceled explicitly by user
      }
      const msg = err instanceof Error ? err.message : String(err);
      setAnalyzeError(`Network/Analysis error: ${msg}`);
      setAnalyzeErrorCode("TIMEOUT");
    } finally {
      if (analyzeTimerRef.current) {
        clearInterval(analyzeTimerRef.current);
        analyzeTimerRef.current = null;
      }
      if (currentReqId === analyzeReqIdRef.current) {
        setIsAnalyzing(false);
        setAnalyzeElapsedSeconds(0);
      }
    }
  };

  // Build Sentence via /api/compose
  const handleBuildMessage = useCallback(
    async (
      overrideProduct?: DetectedProduct,
      overrideQty?: 1 | 2 | 3,
      overrideIntention?: IntentionType,
      overrideLang?: SupportedLanguage,
      overrideCorrection?: boolean
    ) => {
      const activeProduct = overrideProduct ?? selectedProduct;
      const activeQty = overrideQty ?? quantity;
      const activeIntention = overrideIntention ?? intention;
      const activeLang = overrideLang ?? language;
      const activeCorrection = overrideCorrection ?? isCorrectionMode;

      if (!activeProduct) return;

      if (composeAbortControllerRef.current) {
        composeAbortControllerRef.current.abort();
      }
      const controller = new AbortController();
      composeAbortControllerRef.current = controller;

      stopSpeech();
      setIsSpeaking(false);
      setIsBuilding(true);
      const currentReqId = ++composeReqIdRef.current;

      const payload = {
        item: {
          id: activeProduct.id,
          labelEn: activeProduct.labelEn,
          labelTe: activeProduct.labelTe,
        },
        intention: activeIntention,
        quantity: activeQty,
        language: activeLang,
        isCorrection: activeCorrection,
        previousItem: previousProduct
          ? {
              id: previousProduct.id,
              labelEn: previousProduct.labelEn,
              labelTe: previousProduct.labelTe,
            }
          : undefined,
      };

      try {
        const res = await fetch("/api/compose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const data: ComposeApiResponse = await res.json();

        // Discard stale response if selection or quick reply changed
        if (currentReqId !== composeReqIdRef.current) return;

        setMessage(data.text);
        setIsFallback(Boolean(data.isFallback));
        setFallbackReason(data.fallbackReason);
        setIsStale(false);
      } catch (err: unknown) {
        if (currentReqId !== composeReqIdRef.current) return;
        if (err instanceof Error && err.name === "AbortError") {
          return; // Aborted by quick reply or new selection
        }
        const fallbackText = buildLocalTemplateMessage(payload);
        const msg = err instanceof Error ? err.message : String(err);
        setMessage(fallbackText);
        setIsFallback(true);
        setFallbackReason(`Network error (${msg}) - Deterministic template loaded`);
        setIsStale(false);
      } finally {
        if (currentReqId === composeReqIdRef.current) {
          setIsBuilding(false);
          if (activeCorrection) {
            setIsCorrectionMode(false);
          }
        }
      }
    },
    [
      selectedProduct,
      quantity,
      intention,
      language,
      isCorrectionMode,
      previousProduct,
    ]
  );

  // Selection change handlers (invalidate old message immediately)
  const handleSelectProduct = (product: DetectedProduct) => {
    stopSpeech();
    setIsSpeaking(false);
    if (selectedProduct?.id !== product.id) {
      if (isCorrectionMode && selectedProduct) {
        setPreviousProduct(selectedProduct);
      }
      setSelectedProduct(product);
      setIsStale(true);
    }
  };

  const handleIntentionChange = (newIntention: IntentionType) => {
    stopSpeech();
    setIsSpeaking(false);
    if (intention !== newIntention) {
      setIntention(newIntention);
      setIsStale(true);
    }
  };

  const handleQuantityChange = (newQty: 1 | 2 | 3) => {
    stopSpeech();
    setIsSpeaking(false);
    if (quantity !== newQty) {
      setQuantity(newQty);
      setIsStale(true);
    }
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    stopSpeech();
    setIsSpeaking(false);
    if (language !== newLang) {
      setLanguage(newLang);
      setIsStale(true);
      // Rebuild message in new language if an item is already selected
      if (selectedProduct && message) {
        handleBuildMessage(selectedProduct, quantity, intention, newLang);
      }
    }
  };

  // Correction Actions
  const handleDifferentItem = () => {
    stopSpeech();
    setIsSpeaking(false);
    setIsCorrectionMode(true);
    if (selectedProduct) {
      setPreviousProduct(selectedProduct);
    }
    // Scroll smoothly to product grid
    const el = document.getElementById("product-selection-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOnlyOne = () => {
    stopSpeech();
    setIsSpeaking(false);
    setQuantity(1);
    setIsStale(true);
    // Invalidate previous message and immediately build single-quantity message
    if (selectedProduct) {
      handleBuildMessage(selectedProduct, 1, intention, language, false);
    }
  };

  const handleQuickReply = (phrase: string) => {
    stopSpeech();
    setIsSpeaking(false);
    // Invalidate and abort any in-flight composition request so it can NEVER overwrite this quick reply
    if (composeAbortControllerRef.current) {
      composeAbortControllerRef.current.abort();
      composeAbortControllerRef.current = null;
    }
    composeReqIdRef.current += 1;
    setIsBuilding(false);

    // Directly put exact phrase in preview without auto-speaking
    setMessage(phrase);
    setIsStale(false);
    setIsFallback(false);
    setFallbackReason(undefined);
  };

  // Speech actions (User Gesture only)
  const handleSpeak = () => {
    if (!message.trim() || isBuilding) return;

    const result = speakText(message, language, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: (err) => {
        setIsSpeaking(false);
        setSpeechUnavailableReason(err);
      },
    });

    if (!result.started && result.error) {
      setSpeechUnavailableReason(result.error);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const handleRepeat = () => {
    handleSpeak();
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-900 antialiased">
      {/* Top Navigation */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        modelUsed="gemma-4-26b-a4b-it"
      />

      {/* Main Workspace Layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Sample Scene Quick Loader Bar (helps direct evaluation without hunting for shelf photos) */}
        {!image && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs text-stone-700">
              <ImageIcon className="h-4 w-4 text-[#0f4c5c]" />
              <span>
                Want to test immediately? Load our synthetic shop shelf scene:
              </span>
            </div>
            <button
              type="button"
              onClick={handleLoadSample}
              className="min-h-[44px] rounded-lg border border-[#0f4c5c] bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-[#0f4c5c] transition hover:bg-teal-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f4c5c]"
            >
              Load Sample Shop Shelf
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Visual Scene & Product Grounding */}
          <div className="space-y-6 lg:col-span-7">
            {/* 1. Shop Photo Capture & Preview */}
            <ImageCapture
              image={image}
              onImageSelected={handleImageFile}
              onFindItems={handleFindItems}
              onClearImage={handleClearImage}
              isAnalyzing={isAnalyzing}
              elapsedSeconds={analyzeElapsedSeconds}
              onCancelAnalysis={handleCancelAnalysis}
              error={analyzeError}
              errorCode={analyzeErrorCode}
            />

            {/* Anchor for returning from "No, a different item" */}
            <div id="product-selection-anchor" />

            {/* 2. Detected Products Grid */}
            <ProductGrid
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
              fullImageDataUrl={image?.dataUrl}
              language={language}
              explanation={explanation}
            />
          </div>

          {/* Right Column: Communication Composer & Speech Board */}
          <div className="space-y-6 lg:col-span-5">
            {/* 3. Intention & Quantity */}
            <SelectionControls
              selectedProduct={selectedProduct}
              intention={intention}
              onIntentionChange={handleIntentionChange}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onBuildMessage={() => handleBuildMessage()}
              isBuilding={isBuilding}
              language={language}
              isStale={isStale}
            />

            {/* 4. Large Message Preview & Speech Controls */}
            <MessageDisplay
              message={message}
              onMessageChange={(text) => {
                setMessage(text);
                setIsStale(false);
              }}
              selectedProduct={selectedProduct}
              fullImageDataUrl={image?.dataUrl}
              language={language}
              isBuilding={isBuilding}
              isSpeaking={isSpeaking}
              onSpeak={handleSpeak}
              onStop={handleStop}
              onRepeat={handleRepeat}
              isFallback={isFallback}
              fallbackReason={fallbackReason}
              speechUnavailableReason={speechUnavailableReason}
              isStale={isStale}
            />

            {/* 5. Corrections & Quick Replies */}
            <CorrectionBar
              onDifferentItem={handleDifferentItem}
              onOnlyOne={handleOnlyOne}
              onQuickReply={handleQuickReply}
              language={language}
              isCorrectionMode={isCorrectionMode}
              hasSelectedProduct={Boolean(selectedProduct)}
            />
          </div>
        </div>
      </main>

      {/* Accessible Footer - Technical Details Outside Communication Flow */}
      <footer className="mt-12 border-t border-stone-300 bg-white py-6 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 space-y-1">
          <p className="font-medium text-stone-600">
            MySay &bull; Photo-Grounded Speech Board for Counter Interactions
          </p>
          <p className="text-[11px] text-stone-400">
            AI Vision: <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-stone-600">gemma-4-26b-a4b-it</code> (ThinkingLevel.MINIMAL) &bull; Voice: Browser Web Speech API &bull; Ephemeral processing only
          </p>
        </div>
      </footer>
    </div>
  );
}
