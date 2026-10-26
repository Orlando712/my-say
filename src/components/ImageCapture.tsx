import React, { useRef } from "react";
import { Camera, Upload, RotateCcw, Sparkles, AlertCircle, XCircle } from "lucide-react";
import { ProcessedImage } from "@/lib/imageUtils";

interface ImageCaptureProps {
  image: ProcessedImage | null;
  onImageSelected: (file: File) => void;
  onFindItems: () => void;
  onClearImage: () => void;
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
    // reset input so the same file can be selected again if desired
    e.target.value = "";
  };

  return (
    <section
      aria-label="Photo Input"
      className="rounded-xl border border-stone-300 bg-white p-4 shadow-xs sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900">1. Shop Scene Photo</h2>
        {image && !isAnalyzing && (
          <button
            type="button"
            onClick={onClearImage}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0f4c5c]"
          >
            <RotateCcw className="h-4 w-4" />
            New Photo
          </button>
        )}
      </div>

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
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Take a Photo button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex min-h-[64px] items-center justify-center gap-3 rounded-xl bg-[#0f4c5c] px-4 py-3 text-base font-semibold text-white shadow-xs transition hover:bg-[#0b3b47] active:bg-[#082c35] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
            >
              <Camera className="h-6 w-6 shrink-0" />
              <span>Take a Photo</span>
            </button>

            {/* Upload image button */}
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="flex min-h-[64px] items-center justify-center gap-3 rounded-xl border-2 border-stone-300 bg-stone-50 px-4 py-3 text-base font-semibold text-stone-800 transition hover:bg-stone-100 hover:border-stone-400 active:bg-stone-200 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
            >
              <Upload className="h-6 w-6 shrink-0 text-stone-600" />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Privacy & processing notice */}
          <p className="mt-3 text-xs text-stone-500">
            Note: Photos are securely processed in real-time by the hosted Gemma AI vision model to locate products. Photos are not saved to any database or local storage.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image preview frame */}
          <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-900/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.dataUrl}
              alt="Shop shelf or counter display"
              className="max-h-[380px] w-full object-contain mx-auto"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/70 p-4 text-center text-white backdrop-blur-xs">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                <p className="mt-3 text-sm font-semibold tracking-wide">
                  Scanning products in photo...
                </p>
                <p className="mt-1 font-mono text-xs text-teal-200 font-medium">
                  {elapsedSeconds}s elapsed &bull; Please wait
                </p>
                <p className="mt-0.5 text-[11px] text-stone-300">
                  Identifying up to 4 clearly visible items
                </p>
                <button
                  type="button"
                  onClick={onCancelAnalysis}
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-white/40 bg-white/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Scan
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:flex-row">
            {!isAnalyzing ? (
              <>
                <button
                  type="button"
                  onClick={onFindItems}
                  className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0f4c5c] px-6 py-3 text-base font-bold text-white shadow-xs transition hover:bg-[#0b3b47] active:bg-[#082c35] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Find items</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0f4c5c]/50"
                >
                  <Camera className="h-4 w-4" />
                  <span>Retake</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onCancelAnalysis}
                className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-6 py-3 text-base font-bold text-red-900 transition hover:bg-red-100 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-red-400"
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
          className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-900"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="text-sm">
              <p className="font-semibold">
                {errorCode === "TIMEOUT"
                  ? "Analysis Timeout Notice"
                  : errorCode === "AUTH_ERROR"
                  ? "Authentication Notice"
                  : errorCode === "QUOTA_ERROR"
                  ? "Rate Limit / Quota Notice"
                  : "Analysis Notice"}
              </p>
              <p className="mt-0.5 text-xs text-red-800">{error}</p>
              {errorCode === "MISSING_KEY" && (
                <div className="mt-2 rounded bg-red-100 p-2 text-xs text-red-950 font-medium">
                  Server configuration notice: GEMINI_API_KEY is not set. Add your API key to your environment variables and restart.
                </div>
              )}
              {errorCode === "TIMEOUT" && (
                <p className="mt-1.5 text-xs text-stone-700">
                  Tip: This may take a little while for complex scenes. You can try a closer photo or retry.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
