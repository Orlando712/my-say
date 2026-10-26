import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeProductAnalysisPayload,
  PRODUCT_ANALYSIS_SCHEMA,
} from "../src/lib/server/gemini";

test("1. Valid root array is normalized and accepted", () => {
  const rootArray = [
    {
      id: "item_1",
      labelEn: "Tomato",
      labelTe: "టమాట",
      box: { x: 0.1, y: 0.2, width: 0.3, height: 0.4 },
    },
    {
      id: "item_2",
      labelEn: "Green Bell Pepper",
      labelTe: "పచ్చి బెంగళూరు మిరప",
      box: { x: 0.5, y: 0.2, width: 0.35, height: 0.35 },
    },
  ];

  // 1a: Normalization wraps root array into { items: [...] }
  const normalized = normalizeProductAnalysisPayload(rootArray);
  assert.deepStrictEqual(normalized, { items: rootArray });

  // 1b: Schema validates and accepts normalized payload
  const result = PRODUCT_ANALYSIS_SCHEMA.safeParse(normalized);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.items.length, 2);
    assert.strictEqual(result.data.items[0].labelEn, "Tomato");
    assert.strictEqual(result.data.items[1].labelTe, "పచ్చి బెంగళూరు మిరప");
  }

  // 1c: Root array with up to 4 items is accepted
  const fourItemsArray = Array.from({ length: 4 }, (_, i) => ({
    id: `item_${i + 1}`,
    labelEn: `Product ${i + 1}`,
    labelTe: `వస్తువు ${i + 1}`,
    box: { x: 0.1 * i, y: 0.1, width: 0.2, height: 0.2 },
  }));
  const normalizedFour = normalizeProductAnalysisPayload(fourItemsArray);
  const resultFour = PRODUCT_ANALYSIS_SCHEMA.safeParse(normalizedFour);
  assert.strictEqual(resultFour.success, true);
});

test("2. Valid { items: [...] } response is preserved and accepted", () => {
  const rootObject = {
    items: [
      {
        id: "item_1",
        labelEn: "Cucumber",
        labelTe: "దోసకాయ",
        box: { x: 0.15, y: 0.25, width: 0.3, height: 0.2 },
      },
    ],
    explanation: "Clear retail vegetable display with labeled produce.",
  };

  // 2a: Normalization preserves root object as-is
  const normalized = normalizeProductAnalysisPayload(rootObject);
  assert.deepStrictEqual(normalized, rootObject);

  // 2b: Schema validates and accepts
  const result = PRODUCT_ANALYSIS_SCHEMA.safeParse(normalized);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.items.length, 1);
    assert.strictEqual(result.data.items[0].labelEn, "Cucumber");
    assert.strictEqual(result.data.explanation, "Clear retail vegetable display with labeled produce.");
  }
});

test("3. Invalid item data is still rejected", () => {
  // 3a: Missing labelEn
  const missingLabelEn = normalizeProductAnalysisPayload([
    {
      id: "item_1",
      labelTe: "టమాట",
      box: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 },
    },
  ]);
  assert.strictEqual(PRODUCT_ANALYSIS_SCHEMA.safeParse(missingLabelEn).success, false);

  // 3b: Missing labelTe
  const missingLabelTe = normalizeProductAnalysisPayload([
    {
      id: "item_1",
      labelEn: "Tomato",
      box: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 },
    },
  ]);
  assert.strictEqual(PRODUCT_ANALYSIS_SCHEMA.safeParse(missingLabelTe).success, false);

  // 3c: Missing box
  const missingBox = normalizeProductAnalysisPayload([
    {
      id: "item_1",
      labelEn: "Tomato",
      labelTe: "టమాట",
    },
  ]);
  assert.strictEqual(PRODUCT_ANALYSIS_SCHEMA.safeParse(missingBox).success, false);

  // 3d: Malformed box coordinates (non-number or missing dimension)
  const malformedBox = normalizeProductAnalysisPayload([
    {
      id: "item_1",
      labelEn: "Tomato",
      labelTe: "టమాట",
      box: { x: "not-a-number", y: 0.1, width: 0.2, height: 0.2 },
    },
  ]);
  assert.strictEqual(PRODUCT_ANALYSIS_SCHEMA.safeParse(malformedBox).success, false);

  // 3e: Empty label string
  const emptyLabel = normalizeProductAnalysisPayload([
    {
      id: "item_1",
      labelEn: "",
      labelTe: "టమాట",
      box: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 },
    },
  ]);
  assert.strictEqual(PRODUCT_ANALYSIS_SCHEMA.safeParse(emptyLabel).success, false);

  // 3f: More than 4 items must be rejected per max(4) guard
  const fiveItemsArray = Array.from({ length: 5 }, (_, i) => ({
    id: `item_${i + 1}`,
    labelEn: `Product ${i + 1}`,
    labelTe: `వస్తువు ${i + 1}`,
    box: { x: 0.1 * i, y: 0.1, width: 0.15, height: 0.15 },
  }));
  const normalizedFive = normalizeProductAnalysisPayload(fiveItemsArray);
  assert.strictEqual(PRODUCT_ANALYSIS_SCHEMA.safeParse(normalizedFive).success, false);

  // 3g: Invalid item mixed with valid item must NOT be silently accepted or discarded
  const mixedArray = [
    {
      id: "item_1",
      labelEn: "Good Tomato",
      labelTe: "టమాట",
      box: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 },
    },
    {
      id: "item_2",
      labelEn: "", // Invalid empty label
      labelTe: "దోసకాయ",
      box: { x: 0.3, y: 0.1, width: 0.2, height: 0.2 },
    },
  ];
  const normalizedMixed = normalizeProductAnalysisPayload(mixedArray);
  assert.strictEqual(PRODUCT_ANALYSIS_SCHEMA.safeParse(normalizedMixed).success, false);

  // 3h: Non-object / non-array primitives
  assert.strictEqual(
    PRODUCT_ANALYSIS_SCHEMA.safeParse(normalizeProductAnalysisPayload("not an object")).success,
    false
  );
  assert.strictEqual(
    PRODUCT_ANALYSIS_SCHEMA.safeParse(normalizeProductAnalysisPayload(null)).success,
    false
  );
});
