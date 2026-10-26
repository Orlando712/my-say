/**
 * Generates a crisp synthetic shop shelf scene on client canvas
 * representing realistic shop counter items (Juice carton, Mineral water,
 * Chocolate bar, Potato chips, Milk bottle, Green tea).
 * This provides an immediate image for testing without external downloads.
 */
export function generateSampleShelfImage(): Promise<{
  base64Data: string;
  mimeType: "image/jpeg";
  dataUrl: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      const fallback =
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
      resolve({
        base64Data: fallback.split(",")[1],
        mimeType: "image/jpeg",
        dataUrl: fallback,
        width: 100,
        height: 100,
      });
      return;
    }

    // Wooden shop shelf background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 700);
    bgGrad.addColorStop(0, "#ece5d8");
    bgGrad.addColorStop(0.7, "#dfd5c3");
    bgGrad.addColorStop(1, "#c8baa3");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 700);

    // Shelf boards
    ctx.fillStyle = "#8d6e53";
    ctx.fillRect(0, 380, 1000, 30);
    ctx.fillStyle = "#6d523c";
    ctx.fillRect(0, 410, 1000, 15);

    ctx.fillStyle = "#8d6e53";
    ctx.fillRect(0, 640, 1000, 40);
    ctx.fillStyle = "#5c4330";
    ctx.fillRect(0, 680, 1000, 20);

    // Items array on shelf
    // 1. Orange Juice Carton (top shelf left)
    ctx.fillStyle = "#f97316";
    ctx.fillRect(80, 140, 110, 240);
    ctx.fillStyle = "#ea580c";
    ctx.fillRect(100, 120, 70, 20);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("ORANGE", 100, 230);
    ctx.fillText("JUICE", 110, 260);

    // 2. Bottled Mineral Water (top shelf middle-left)
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(250, 130, 80, 250);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(270, 95, 40, 35);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(250, 220, 80, 60);
    ctx.fillStyle = "#0369a1";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("WATER", 260, 255);

    // 3. Whole Milk Bottle (top shelf middle-right)
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(400, 120, 95, 260);
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(415, 95, 65, 25);
    ctx.fillRect(400, 210, 95, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("MILK", 425, 245);

    // 4. Chocolate Bar (top shelf right)
    ctx.fillStyle = "#451a03";
    ctx.fillRect(570, 170, 140, 210);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(580, 210, 120, 70);
    ctx.fillStyle = "#451a03";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("CHOCOLATE", 590, 250);

    // 5. Potato Chips Bag (bottom shelf left)
    ctx.fillStyle = "#eab308";
    ctx.fillRect(120, 440, 140, 200);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(190, 530, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("CHIPS", 165, 535);

    // 6. Green Tea Bottle (bottom shelf middle)
    ctx.fillStyle = "#15803d";
    ctx.fillRect(360, 430, 85, 210);
    ctx.fillStyle = "#166534";
    ctx.fillRect(380, 400, 45, 30);
    ctx.fillStyle = "#bbf7d0";
    ctx.fillRect(360, 500, 85, 55);
    ctx.fillStyle = "#14532d";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("GREEN TEA", 365, 532);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64Data = dataUrl.split(",")[1];

    resolve({
      base64Data,
      mimeType: "image/jpeg",
      dataUrl,
      width: 1000,
      height: 700,
    });
  });
}
