import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { composeMessageWithGemma, getGemmaConfig } from "@/lib/server/gemini";
import { buildLocalTemplateMessage } from "@/lib/templates";
import { ComposeApiResponse, ComposeRequestBody } from "@/lib/types";

export const maxDuration = 120; // Accommodates serverless function execution on Vercel Fluid Compute

const ComposeRequestSchema = z.object({
  item: z.object({
    id: z.string(),
    labelEn: z.string().min(1),
    labelTe: z.string().min(1),
  }),
  intention: z.enum(["ask_price", "want_this"]),
  quantity: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  language: z.enum(["en", "te"]),
  isCorrection: z.boolean().optional(),
  previousItem: z
    .object({
      id: z.string(),
      labelEn: z.string(),
      labelTe: z.string(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ComposeApiResponse>(
      {
        success: false,
        text: "",
        error: "Invalid JSON in request body.",
        isFallback: true,
        fallbackReason: "Malformed request JSON",
      },
      { status: 400 }
    );
  }

  const validation = ComposeRequestSchema.safeParse(body);
  if (!validation.success) {
    const errorMsg = `Invalid request fields: ${validation.error.issues.map((i) => i.message).join(", ")}`;
    return NextResponse.json<ComposeApiResponse>(
      {
        success: false,
        text: "",
        error: errorMsg,
        isFallback: true,
        fallbackReason: "Schema validation failure",
      },
      { status: 400 }
    );
  }

  const composeData: ComposeRequestBody = validation.data;

  try {
    const result = await composeMessageWithGemma(composeData);
    return NextResponse.json<ComposeApiResponse>(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const { modelName } = getGemmaConfig();
    const fallbackText = buildLocalTemplateMessage(composeData);
    return NextResponse.json<ComposeApiResponse>(
      {
        success: false,
        text: fallbackText,
        error: `Compose error: ${message}`,
        isFallback: true,
        fallbackReason: `Server error: ${message}`,
        modelUsed: modelName,
      },
      { status: 200 }
    );
  }
}
