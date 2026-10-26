import { BoundingBox } from "./types";

export interface ProcessedImage {
  base64Data: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Resizes an image file in the browser before sending to /api/analyze.
 * Preserves aspect ratio, caps max dimension at 1280px, compresses to JPEG at 0.85 quality.
 */
export async function processAndResizeImage(
  file: File,
  maxDimension = 1280
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file"));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image in browser"));

      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not create 2D canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, 0.85);
        const base64Data = dataUrl.split(",")[1];

        resolve({
          base64Data,
          mimeType,
          dataUrl,
          width,
          height,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Creates an image crop using native Canvas API based on normalized bounding box [0, 1].
 * Gracefully returns null if crop is invalid so the caller can fall back to the full photo.
 */
export async function createCropFromImage(
  sourceDataUrl: string,
  box: BoundingBox
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onerror = () => {
      resolve(null);
    };

    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      if (!origW || !origH) {
        resolve(null);
        return;
      }

      // Convert normalized coordinates to source pixel coordinates
      const sx = Math.max(0, Math.min(origW - 1, Math.round(box.x * origW)));
      const sy = Math.max(0, Math.min(origH - 1, Math.round(box.y * origH)));
      const sw = Math.max(1, Math.min(origW - sx, Math.round(box.width * origW)));
      const sh = Math.max(1, Math.min(origH - sy, Math.round(box.height * origH)));

      if (sw <= 5 || sh <= 5) {
        resolve(null);
        return;
      }

      const canvas = document.createElement("canvas");
      // Give the crop a crisp resolution
      canvas.width = Math.max(120, sw);
      canvas.height = Math.max(120, sh);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      try {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      } catch {
        resolve(null);
      }
    };

    img.src = sourceDataUrl;
  });
}
