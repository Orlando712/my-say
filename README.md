# MySay — Photo-Grounded Speech Board for Counter Interactions

> An accessible communication board for shop counters that turns real photos of store shelves into selectable vocabulary, natural phrases, and clear spoken speech.

---

## 1. Problem Statement

People who find speaking difficult (including non-speaking individuals, people with aphasia, speech apraxia, dysarthria, or traumatic brain injury) face acute communication barriers during everyday neighborhood transactions:
- **Pre-configured AAC (Augmentative and Alternative Communication) boards** rarely have the exact brand, package variation, or local item found on a specific neighborhood corner store counter.
- **Typing out descriptions** on a phone keyboard is slow, tiring, and frequently causes tension or rushed misunderstandings at a busy checkout counter.
- **Gesturing and pointing** across a counter or glass display often leads to incorrect items being grabbed by the shopkeeper.

**MySay** addresses this dynamic, scene-specific communication problem by grounding communication directly in the visual scene right in front of the customer.

---

## 2. Working Workflow & Features

MySay implements a complete, five-step interaction designed for rapid, error-tolerant shop-counter communication:

1. **Scene Capture**: The user takes a live camera photo or uploads a photo of items on the store shelf/counter (or loads an instant sample shelf for testing).
2. **Visual Vocabulary Extraction**: The app sends the photo to the server, where Gemma Vision extracts up to four clearly visible products with coordinates, returning normalized bounding boxes and bilingual labels (English and Telugu). The browser crops the products client-side using the native HTML5 Canvas API.
3. **Intent & Quantity Selection**: The user taps a visible product card, chooses an intention (*"Ask the price"* or *"I want this"*), and picks a quantity (1, 2, or 3). The active choice is immediately summarized with high-contrast visual cues.
4. **Message Review & Deliberate Speech**:
   - The user reviews the composed natural sentence in large, editable high-contrast text.
   - A visual pointing card highlights the selected item crop so the user can physically point to it.
   - **Nothing speaks automatically**: Speech is triggered strictly when the user explicitly presses **Speak Message**.
   - **Stop** and **Repeat** buttons are always accessible.
5. **Misunderstanding Correction & Quick Replies**:
   - If the clerk misunderstands or grabs the wrong item, the user taps **"No, a different item"** (entering correction mode and referencing the replacement item) or **"Only one"**.
   - Instant quick replies (**"Yes"**, **"No"**, **"Thank you"**) are always available and safely cancel in-flight model requests without overwriting user intent.

---

## 3. Why Gemma is Useful

Open-vocabulary shop encounters cannot be solved by static communication pictograms because store inventories change constantly. Gemma (`gemma-4-26b-a4b-it`) serves two critical roles:
1. **Unfamiliar Scene to Selectable Vocabulary**: Gemma's multimodal vision identifies items directly from cluttered shop counter photos and outputs localized bounding boxes, turning an unfamiliar visual environment into a custom, tactile communication board in seconds.
2. **Intent Grounding & Sentence Composition**: Rather than forcing the user to assemble words manually, Gemma converts structured, explicit choices (Item + Intention + Quantity + Correction context) into polite, natural spoken phrases in the selected language (English or Telugu).

*Note on Configuration:* Gemma is configured with `thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }` via the `@google/genai` SDK, which reduces inference latency significantly compared to unconstrained chain-of-thought generation while preserving robust item detection and bounding box coordinates.

---

## 4. Technology Stack & Configuration

- **Frontend & App Framework**: [Next.js](https://nextjs.org/) 16 (App Router), React 19, TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with accessible high-contrast colors and large touch targets ($\ge 48\text{px}$ to $60\text{px}$)
- **AI Vision & Composition**: `@google/genai` SDK running exclusively on the Node.js server runtime
- **Model Identifier**: `gemma-4-26b-a4b-it`
- **Speech Engine**: Native Browser `window.speechSynthesis` (Web Speech API)
- **Image Processing**: Client-side canvas resizing and bounding box cropping (zero client API key exposure)
- **Icons**: [Lucide React](https://lucide.dev/)

### Environment Variables

If `.env.local` does not already exist, copy `.env.example`:

```bash
# Only copy if .env.local does not already exist (do not overwrite existing configuration):
if [ ! -f .env.local ]; then cp .env.example .env.local; fi
```

Then edit `.env.local` to configure your server-side variables:

```env
# Google Gemini / Gemma API Key (Server-side only)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Model identifier
GEMMA_MODEL=gemma-4-26b-a4b-it
```

> **Warning**: Do not overwrite or delete an existing `.env.local` that already contains your configured key.

### Local Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm run start
```

### Image Testing & Verification Provenance

- **Synthetic Test Benchmarks**: The in-app "Load Sample Shop Shelf" feature and synthetic test images were created during development for predictable unit latency benchmarking and pipeline verification without requiring physical camera access.
- **Real-Photo Manual Verification**: The user manually tested and confirmed that the real-photo flow and speech worked end-to-end (confirming product recognition, client-side Canvas cropping, and voice synthesis). Note: Camera capture and file upload were not independently verified as separate paths. Recognition accuracy depends on lighting, packaging, and clarity; it is not claimed to be guaranteed for arbitrary scenes.

### Deployment & Hosting Configuration (Vercel Fluid Compute)

- **Serverless Timeout Accommodation**: Route handlers (`/api/analyze` and `/api/compose`) export `maxDuration = 120`.
- **Vercel Fluid Compute Required**: Deploying to Vercel requires enabling **Fluid Compute** (in Project Settings &rarr; Functions) to allow execution durations up to 120 seconds. This ensures serverless functions accommodate the application's bounded 90-second timeout ceiling for Gemma vision inference without encountering platform 504 Gateway Timeout errors.
- **Required Server-Side Environment Variables**:
  - `GEMINI_API_KEY`: Server-side API key for `@google/genai`.
  - `GEMMA_MODEL`: `gemma-4-26b-a4b-it`.

---

## 5. Hosted API Processing & Data Handling

- **Application-Level Privacy**: MySay does not maintain any persistent database, user accounts, cookies, session trackers, or server-side disk storage. Uploaded photos and audio transcripts are processed in-memory during the active HTTP request and discarded immediately after response generation.
- **Provider-Level Transmission**: Image data and prompt strings are transmitted over HTTPS to Google's hosted Gemini API endpoints using the official `@google/genai` SDK. Processing adheres to standard Google Gemini API terms and operational lifecycles; MySay makes no independent claims regarding upstream model provider log retention.

---

## 6. Known Limitations

This project is an early hackathon functional prototype. Transparent limitations include:
- **Recognition & Crop Accuracy**: Cluttered backgrounds, reflective packaging, extreme angles, or poor lighting can cause Gemma to mislabel items or produce approximate bounding boxes that clip parts of a product.
- **Device-Dependent Speech Synthesis**: Speech synthesis relies on the local browser's Web Speech API. Voices can sound robotic or mechanical depending on the OS. On platforms lacking a native Telugu voice, the app displays a clear warning banner and relies on high-contrast screen text rather than falling back to an unintelligible English accent.
- **Latency**: Vision processing over cellular connections may take 5–15 seconds depending on network conditions. A visible elapsed-time indicator and Cancel button keep the user informed.
- **No Direct User Testing Yet**: While grounded in established AAC design principles (large touch targets, confirmation before speech, high contrast), this prototype has not yet undergone formal usability studies with individuals who have speech disabilities.

---

## 7. Inspiration & Origin

MySay was inspired by the **3VA** (Visual Voice Vocabulary Architecture) project's pictogram communication approach for augmentative communication. 

While 3VA uses pre-authored pictogram symbol grids, MySay develops an original, photo-grounded paradigm: dynamically generating a temporary, custom communication board directly from a live photograph of the user's immediate physical environment, combined with explicit confirmation and counter-specific misunderstanding correction flows.

---

## 8. Reused Assets & Attribution

- **Next.js & React**: Licensed under the MIT License &copy; Vercel, Inc. and Meta Platforms, Inc.
- **Tailwind CSS**: Licensed under the MIT License &copy; Tailwind Labs, Inc.
- **Lucide Icons**: Licensed under the ISC License &copy; Lucide Contributors.
- **Google Gen AI SDK (`@google/genai`)**: Licensed under the Apache-2.0 License &copy; Google LLC.
- **Original MySay Application Code**: Licensed under the MIT License (see [LICENSE](file:///Users/chaitra/My%20say/LICENSE)).
