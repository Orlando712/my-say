export interface BoundingBox {
  x: number; // 0 to 1
  y: number; // 0 to 1
  width: number; // 0 to 1
  height: number; // 0 to 1
}

export interface DetectedProduct {
  id: string;
  labelEn: string;
  labelTe: string;
  box: BoundingBox;
  cropDataUrl?: string;
  cropFailed?: boolean;
}

export type IntentionType = "ask_price" | "want_this";

export type SupportedLanguage = "en" | "te";

export interface AnalyzeSuccessResponse {
  success: true;
  items: DetectedProduct[];
  explanation?: string;
  modelUsed?: string;
}

export interface AnalyzeErrorResponse {
  success: false;
  items: [];
  error: string;
  errorCode:
    | "MISSING_KEY"
    | "AUTH_ERROR"
    | "QUOTA_ERROR"
    | "MODEL_ACCESS_ERROR"
    | "SERVICE_UNAVAILABLE"
    | "INVALID_IMAGE"
    | "PARSE_ERROR"
    | "TIMEOUT";
  modelUsed?: string;
  explanation?: string;
}

export type AnalyzeApiResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;

export interface ComposeSuccessResponse {
  success: true;
  text: string;
  isFallback?: boolean;
  fallbackReason?: string;
  modelUsed?: string;
}

export interface ComposeErrorResponse {
  success: false;
  text: string;
  error: string;
  isFallback: true;
  fallbackReason: string;
  modelUsed?: string;
}

export type ComposeApiResponse = ComposeSuccessResponse | ComposeErrorResponse;

export interface ComposeRequestBody {
  item: {
    id: string;
    labelEn: string;
    labelTe: string;
  };
  intention: IntentionType;
  quantity: 1 | 2 | 3;
  language: SupportedLanguage;
  isCorrection?: boolean;
  previousItem?: {
    id: string;
    labelEn: string;
    labelTe: string;
  };
}
