import React, { useRef } from "react";
import { Camera, Upload, RotateCcw, Sparkles, AlertCircle, XCircle } from "lucide-react";
import { ProcessedImage } from "@/lib/imageUtils";

interface ImageCaptureProps {
  image: ProcessedImage | null;
  onImageSelected: (file: File) => void;
  onFindItems: () => void;
  onClearImage: () => void;
  onLoadSample?: () => void;
  isAnalyzing: boolean;
  elapsedSeconds: number;
  onCancelAnalysis: () => void;
  error?: string | null;
  errorCode?: string | null;
}

export function ImageCapture({
  image,
  onImageSelected,
  onFindItems,
  onClearImage,
  onLoadSample,
  isAnalyzing,
  elapsedSeconds,
  onCancelAnalysis,
  error,
  errorCode,
}: ImageCaptureProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="sr-only"
        id="camera-input"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        id="upload-input"
        tabIndex={-1}
        aria-hidden="true"
      />

      {!image ? (
        <div className="rounded-2xl border-2 border-dashed border-[#E2DDD5] bg-[#FAF9F5] p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF2EE] text-[#174C43]">
            <Camera className="h-7 w-7" aria-hidden="true" />
          </div>

          <h3 className="mt-3 text-lg font-bold text-[#202923]">
            What would you like to talk about?
          </h3>
          <p className="mt-1 text-xs text-[#58625B]">
            Photograph a store counter, shelf, or menu to start.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex min-h-[56px] items-center justify-center gap-2.5 rounded-xl bg-[#174C43] px-4 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-[#123C35] active:bg-[#0E2D27] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
            >
              <Camera className="h-5 w-5 shrink-0" />
              <span>Take a photo</span>
            </button>

            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="flex min-h-[56px] items-center justify-center gap-2.5 rounded-xl border-2 border-[#E2DDD5] bg-white px-4 py-3 text-sm font-bold text-[#202923] transition hover:bg-[#FAF9F5] hover:border-[#C4BCB0] active:bg-[#F2EFE9] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
            >
              <Upload className="h-5 w-5 shrink-0 text-[#58625B]" />
              <span>Upload photo</span>
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-[#58625B]">
            Photos are securely processed in real-time by hosted AI vision to locate items. Photos are not saved to any database or local storage.
          </p>

          {onLoadSample && (
            <div className="mt-3 border-t border-[#E2DDD5] pt-3">
              <button
                type="button"
                onClick={onLoadSample}
                className="text-xs font-medium text-[#58625B] underline decoration-[#E2DDD5] underline-offset-4 transition hover:text-[#174C43]"
              >
                Need to test without a camera? Load an illustrated sample shelf
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Compact scene preview (240-280px) preserving aspect ratio */}
          <div className="relative overflow-hidden rounded-2xl border border-[#E2DDD5] bg-[#FAF9F5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.dataUrl}
              alt="Store counter or shelf display"
              className="max-h-[260px] w-full object-contain mx-auto"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#202923]/75 p-4 text-center text-white backdrop-blur-xs">
                <div className="h-9 w-9 animate-spin rounded-full border-3 border-white/25 border-t-white" />
                <p className="mt-2.5 text-sm font-semibold tracking-wide">
                  Scanning products in photo...
                </p>
                <p className="mt-1 font-mono text-xs text-teal-200 font-medium">
                  {elapsedSeconds}s elapsed &bull; Please wait
                </p>
                <button
                  type="button"
                  onClick={onCancelAnalysis}
                  className="mt-3.5 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/40 bg-white/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel scan
                </button>
              </div>
            )}
          </div>

          {/* Scanning and photo action buttons */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            {!isAnalyzing ? (
              <>
                <button
                  type="button"
                  onClick={onFindItems}
                  className="flex min-h-[56px] flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#174C43] px-6 py-3 text-base font-bold text-white shadow-xs transition hover:bg-[#123C35] active:bg-[#0E2D27] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Scan photo</span>
                </button>

                <button
                  type="button"
                  onClick={onClearImage}
                  className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 border-[#E2DDD5] bg-white px-4 py-3 text-sm font-semibold text-[#58625B] transition hover:text-[#202923] hover:border-[#C4BCB0] hover:bg-[#FAF9F5] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#174C43]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Change photo</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onCancelAnalysis}
                className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-6 py-3 text-sm font-bold text-red-900 transition hover:bg-red-100 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-red-400"
              >
                <XCircle className="h-5 w-5 text-red-700" />
                <span>Cancel scan ({elapsedSeconds}s elapsed)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error reporting banner */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-red-900 text-xs"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="space-y-1">
              <p className="font-bold">
                {errorCode === "TIMEOUT"
                  ? "Scan timed out"
                  : errorCode === "AUTH_ERROR"
                  ? "Authentication notice"
                  : errorCode === "QUOTA_ERROR"
                  ? "Service limit notice"
                  : "Scan notice"}
              </p>
              <p className="text-red-800">{error}</p>
              {errorCode === "MISSING_KEY" && (
                <div className="mt-1 rounded bg-red-100 p-2 font-medium text-red-950">
                  Server configuration notice: GEMINI_API_KEY is not set. Add your API key to your server environment.
                </div>
              )}
              {errorCode === "TIMEOUT" && (
                <p className="text-stone-600">
                  Tip: Complex or reflective scenes can take longer. Try a closer photo or retry.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
