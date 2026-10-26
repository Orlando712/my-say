---
name: scene-to-communication-board
description: Reusable agent workflow pattern that transforms a real physical scene photo into a temporary, grounded augmentative communication board with explicit intent selection, confirmation-guarded speech synthesis, and rapid misunderstanding correction.
---

# Scene-to-Communication-Board Workflow

This document describes the architectural pattern for converting real-world environment photos into grounded, accessible communication boards for people with speech disabilities.

## 1. Overview & Core Philosophy

Pre-configured AAC symbol sets and text-entry boards can be challenging to use in open-ended retail settings where inventory changes. The **scene-to-communication-board** pattern dynamically turns a photo of the user's immediate visual environment into an interactive, tactile communication board.

Crucially, because automated visual recognition and speech synthesis can introduce errors or unwanted noise, this pattern enforces **explicit user confirmation before audio output** and provides **first-class misunderstanding correction controls**.

---

## 2. Workflow Pipeline

```
[Physical Scene Photo]
        │
        ▼ (Ephemeral In-Memory Transfer)
[Vision Grounding Model]
        │
        ├─► Detects up to 4 prominent items
        ├─► Extracts normalized bounding box coordinates {x, y, width, height} (0–1)
        └─► Generates bilingual labels (Local language + English)
        │
        ▼ (Client-Side Canvas Crop)
[Interactive Touch Board]
        │
        ├─► Display high-contrast image crops + bilingual labels
        ├─► Intent Selection: "Ask the price" vs "I want this"
        └─► Quantity Selection: 1, 2, or 3
        │
        ▼ (Explicit Action: "Build message")
[Contextual Sentence Composer]
        │
        ├─► Combines selected item, intention, quantity, and correction history
        ├─► Fallback: Deterministic local phrase template if composer unavailable
        │    (Note: Fallback applies to composition only; recognition requires hosted API)
        └─► Previews editable text in large viewport (Zero auto-speech)
        │
        ▼ (Explicit Action: "Speak Message")
[Browser Web Speech Synthesis]
        │
        ├─► Speaks in target language (suppresses misconfigured foreign voices)
        └─► Provides accessible Stop and Repeat controls
        │
        ▼ (Counter Encounter: Misunderstanding / Change)
[Correction & Quick Reply Layer]
        ├─► "No, a different item" (re-anchors to replacement product)
        ├─► "Only one" (adjusts quantity)
        └─► Quick replies ("Yes", "No", "Thank you") that cancel pending requests
```

---

## 3. Inputs & Outputs

### Inputs
1. **Scene Image**: Base64 or binary image buffer (JPEG/PNG/WebP, resized to $\le 1280\text{px}$ client-side to minimize transport latency).
2. **Target Language**: ISO language code (e.g., `en`, `te`).
3. **User Intent**: Structured choice (`ask_price` | `want_this`).
4. **Quantity**: Integer selection (`1` | `2` | `3`).
5. **Correction Context** (Optional): Previously selected item metadata when user corrects a shopkeeper misunderstanding.

### Outputs
1. **Detected Items**: Array of items with unique ID, normalized bounding boxes ({x, y, width, height}, normalized 0–1), primary label, and bilingual translation.
2. **Visual Crops**: Client-extracted image crops for tactile pointing.
3. **Spoken Phrase**: Natural, polite sentence or template phrase in the target language.
4. **Voice Audio**: Client-synthesized speech audio executed via local browser speech engines.

---

## 4. Explicit User Confirmation Guardrails

1. **Zero Autonomous Speech**: The system must never initiate speech audio automatically upon image analysis, item selection, or sentence generation. Audio output requires a deliberate user click or tap on the "Speak Message" control.
2. **Stale Message Invalidation**: Any modification to selected item, quantity, intention, or photo immediately marks the existing message as stale (`isStale: true`), visually alerting the user that the displayed text no longer matches their active selection.
3. **Overwrite Immunity for Quick Replies**: Tapping an instant reply ("Yes", "No", "Thank you") immediately increments a request counter and aborts any pending background model generation, preventing delayed network responses from overwriting the user's immediate answer.

---

## 5. Failure Handling & Resilience

| Failure Scenario | Mitigation Strategy |
| :--- | :--- |
| **Model Request Timeout** | Bounded timeouts (e.g., 90s server limit), real-time elapsed second indicator, and user-facing "Cancel scan" button. No automatic infinite retry loops. |
| **Model Service Failure / Missing Key** | Deterministic local template engine generates structured fallback phrases in English and Telugu for message composition without blocking the user. (Note: Fallback applies strictly to message composition; visual product recognition from photos still requires the hosted API.) |
| **Bounding Box Out of Bounds** | Client canvas crop verifies bounds; if crop fails, the UI gracefully falls back to the full scene image with an indicator tag. |
| **Missing Browser Voice (e.g. Telugu)** | Detects lack of local engine support and suppresses garbled foreign accents. Displays high-contrast text and notifies user that text is visible for counter staff to read. |
| **Cluttered or Ambiguous Scene** | Detection prompt strictly bounds output to up to 4 prominent items from the scene, avoiding unmanageable card flooding. |
