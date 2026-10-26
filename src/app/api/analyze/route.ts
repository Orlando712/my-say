import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeShopImage, getGemmaConfig } from "@/lib/server/gemini";
import { AnalyzeApiResponse } from "@/lib/types";

export const maxDuration = 60; // Allow up to 60s for vision model inference on serverless hosts

const MAX_BASE64_LENGTH = 7 * 1024 * 1024; // ~5MB file limit in base64

const AnalyzeRequestSchema = z.object({
  imageBase64: z.string().min(10).max(MAX_BASE64_LENGTH),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          items: [],
          error: "Invalid JSON in request body.",
          errorCode: "INVALID_IMAGE",
        },
        { status: 400 }
      );
    }

    const validation = AnalyzeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          items: [],
          error: `Invalid request payload: ${validation.error.issues.map((i) => i.message).join(", ")}. Accepted formats: JPEG, PNG, WebP up to 5MB.`,
          errorCode: "INVALID_IMAGE",
        },
        { status: 400 }
      );
    }

    const { imageBase64, mimeType } = validation.data;
    // Strip data URL header if present
    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");

    const result = await analyzeShopImage(cleanBase64, mimeType);
    return NextResponse.json<AnalyzeApiResponse>(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const { modelName } = getGemmaConfig();
    return NextResponse.json<AnalyzeApiResponse>(
      {
        success: false,
        items: [],
        error: `Unexpected server error: ${message}`,
        errorCode: "MODEL_ACCESS_ERROR",
        modelUsed: modelName,
      },
      { status: 500 }
    );
  }
}
