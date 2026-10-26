# MySay — Hackathon Submission Details

## 1. One-Sentence Pitch
MySay is a photo-grounded communication board that transforms real photographs of store shelves into selectable vocabulary, natural phrases, and deliberate speech for people who find speaking difficult.

---

## 2. Short Problem & Solution Description

### The Problem
Everyday neighborhood counter transactions (corner stores, bakeries, pharmacies) can present communication challenges for people who find speaking difficult (such as individuals with aphasia, speech apraxia, or dysarthria). Pre-made AAC boards often do not include specific local brands or changing inventory, typing on a small keyboard during checkout can be slow and tiring, and pointing across counters can lead to misunderstandings.

### The Solution
MySay grounds communication directly in a photograph of the immediate scene. A shopper snaps a photo of the counter, and the app detects the visible items, generates touchable product cards with bilingual English and Telugu labels, and lets the shopper select their intent (*"Ask the price"* or *"I want this"*) and quantity. The app composes a natural, polite sentence that speaks only when the user explicitly presses **Speak Message**, with dedicated one-tap correction buttons if the shopkeeper misunderstands.

---

## 3. Implemented Features

- **Photo Capture & Client Pre-Processing**: Live camera capture and photo upload for real-world packaged items, plus an in-app synthetic shelf loader for instant testing without camera access; client-side image downscaling to prevent excessive upload overhead.
- **Verification Provenance**: Clearly distinguishes synthetic test images (used for latency benchmarking and layout checks) from manual testing where the user confirmed that the real-photo flow and speech worked end-to-end. (Camera capture and upload were not independently verified as separate paths; recognition accuracy depends on lighting and packaging, and is not claimed to be 100% guaranteed).
- **Server-Side Gemma Vision Grounding**: Identifies up to four prominent items from the photograph, returning bounding box coordinates ({x, y, width, height}, normalized 0–1) and bilingual names (English + Telugu).
- **Client-Side Canvas Cropping**: Crops individual products client-side using the HTML5 Canvas API without exposing server API credentials to the browser.
- **Dynamic Touch Board**: Accessible product cards with high-contrast active states, bilingual text labels, and touch targets exceeding $48\text{px}$.
- **Structured Intent & Quantity Selection**: Quick toggles between asking for pricing or stating purchase intent, plus quantities (1, 2, 3), with a high-visibility summary of the active selection.
- **Natural Phrase Composition with Fallback**: Gemma composes polite sentences in English or Telugu. If the composition API is unreachable, an offline deterministic template engine provides standard phrase templates. (Note: Offline fallback applies strictly to sentence composition; visual product recognition from photographs still requires the hosted Gemma API).
- **Confirmation-Guarded Speech**: Zero autonomous speech. Audio is generated exclusively upon an explicit user press of **Speak Message**, supported by accessible **Stop** and **Repeat** buttons.
- **Telugu Voice Fallback Handling**: Detects whether the user's browser has native Telugu speech synthesis installed; if missing, it cleanly suppresses garbled English speech and surfaces a high-contrast text banner for counter staff to read directly.
- **Misunderstanding Correction Flow**: First-class support for *"No, a different item"* (re-anchoring the spoken message to the replacement item) and *"Only one"*.
- **Immunity for Instant Quick Replies**: Instant replies (*"Yes"*, *"No"*, *"Thank you"*) cancel in-flight model requests to guarantee that pending responses never overwrite user intent.

---

## 4. Technology Used

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (accessible contrast, responsive layouts, large touch targets)
- **Model Provider & SDK**: Google Gemini API via official `@google/genai` SDK on the Node.js server runtime
- **Model Identifier**: `gemma-4-26b-a4b-it` configured with `thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }`
- **Speech Synthesis**: Native Web Speech API (`window.speechSynthesis`)
- **Icons**: Lucide React

---

## 5. What We Built Ourselves & The Inspiration

### What We Built Ourselves
- The end-to-end photo-grounded AAC architecture, including client-side Canvas cropping from normalized bounding boxes.
- Stale-message invalidation and request-race guards (`composeReqIdRef` and `AbortController`) that protect user input from out-of-order model overwrite.
- The contextual misunderstanding correction workflow that references both the rejected item and the newly chosen item.
- Bilingual English and Telugu prompt engineering and deterministic template fallbacks.
- Voice capability detection that prevents inappropriate foreign-accent voice synthesis on Indic text.

### Inspiration
MySay was inspired by the [3VA](https://github.com/libreearth/eva_voice_release) project's pictogram communication approach. Rather than relying on static symbol grids, MySay extends this concept to dynamic physical retail counters by generating instant communication boards from live photos of the immediate physical surroundings.

---

## 6. Known Limitations & Realistic Next Steps

### Known Limitations
- **Visual Recognition in Heavy Clutter**: While Gemma successfully isolates separated packaged items, heavily overlapped shelves, extreme glare, or unusual packaging can produce approximate bounding boxes or misidentifications.
- **Hosted API Dependency for Recognition**: While sentence composition includes an offline deterministic template fallback when the model API is unreachable, product recognition from photographs requires an active network connection to the hosted Gemma Vision API.
- **Browser-Dependent Voices**: Web Speech synthesis voices vary significantly across operating systems and browsers, and robotic inflections remain a reality for client-side TTS engines.
- **Network Latency**: Vision model inference requires network connectivity and takes approximately 5–15 seconds depending on connection speed.
- **Lack of Clinical User Testing**: The interface is designed around principles like large touch targets, high contrast, and confirmation before speech, but has not yet undergone formal clinical trials or user testing with individuals who have speech disabilities.

### Realistic Next Steps
1. **Offline/Local On-Device Models**: Porting the vision and phrasing pipeline to on-device models (e.g. MediaPipe / Gemma on-device) to eliminate network latency and ensure availability in basement or low-connectivity stores.
2. **Audio Output Customization**: Adding controls for speech rate, pitch, and voice preference to give users greater personal agency over their synthesized voice.
3. **Store-Specific Memory / Cache**: Allowing users to save frequently visited neighborhood stores locally so product recognition becomes instantaneous on repeat visits.
4. **Co-Design with AAC Users**: Partnering with speech-language pathologists and AAC community members to refine touch target ergonomics and correction button placement based on hands-on feedback.
