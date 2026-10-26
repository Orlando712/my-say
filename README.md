# MySay

> **Your surroundings. Your words.**

[![Watch Demo](https://img.shields.io/badge/Demo-Watch%20Video-red?style=for-the-badge&logo=youtube)](https://youtu.be/2diSeK497kA)

**Video Demonstration:** [https://youtu.be/2diSeK497kA](https://youtu.be/2diSeK497kA)

---

## Problem & Solution

### The Problem
People who find speaking difficult—including non-speaking individuals, people with aphasia, speech apraxia, or dysarthria—often encounter communication barriers at neighborhood store counters:
- **Static AAC boards** cannot anticipate the specific brands, packaging variations, or local items present in every neighborhood shop.
- **Typing descriptions** on a phone keyboard during a fast-moving checkout interaction is slow and tiring.
- **Pointing across a counter** or through glass displays is frequently ambiguous.

### The Solution
**MySay** grounds communication directly in the user's immediate physical surroundings:
1. The user photographs the shop shelf or counter display.
2. Gemma Vision detects visible items and generates an interactive, tactile communication board.
3. The user selects a product, intention ("Ask the price" or "I want this"), and quantity.
4. The user reviews an editable sentence and explicitly taps **Speak Message** to speak aloud in English or Telugu.
5. If the shopkeeper misunderstands, dedicated correction controls ("Different item", "Only one") and instant replies ("Yes", "No", "Thank you") resolve the interaction quickly.

---

## Main Features

| Feature | Description | Accessibility & Safeguard |
| :--- | :--- | :--- |
| **Scene-Grounded Vocabulary** | Detects up to 4 clearly visible products from a shelf photo with localized bounding boxes. | Turns an unfamiliar store display into an interactive touch board in seconds. |
| **Client-Side Canvas Cropping** | Crops product photos directly in the browser via HTML5 Canvas using normalized coordinates. | Zero image storage on disk; keeps API keys and raw storage strictly server-side. |
| **Intent & Quantity Selection** | Structured controls to ask prices or state purchase intent for 1, 2, or 3 items. | High-contrast visual cards make current selections obvious before speaking. |
| **Zero Autonomous Speech** | Generates editable natural text but never speaks automatically. | Speech triggers exclusively on deliberate user tap of **Speak Message**. |
| **Composition Template Fallback** | Deterministic local templates compose phrases if the model API is unreachable. | Speech generation never halts if the network drops (vision recognition still requires hosted API). |
| **Rapid Misunderstanding Corrections** | Dedicated "Different item" and "Only one" buttons update the phrase in context. | Quickly resolves counter misunderstandings without restarting the workflow. |
| **Instant Quick Replies** | One-tap "Yes", "No", and "Thank you" responses. | Immediately aborts in-flight API requests to prevent late responses from overwriting user intent. |
| **Bilingual Interface (EN / TE)** | Full support for English and Telugu labels and speech. | Native Telugu script rendering; browser voice availability checks prevent garbled accents. |

---

## How Gemma Powers MySay

MySay uses Google's **Gemma 4** (`gemma-4-26b-a4b-it`) via the server-side `@google/genai` SDK:

1. **Multimodal Visual Recognition (`/api/analyze`)**:
   - Analyzes cluttered retail scenes and detects up to 4 prominent items.
   - Returns normalized bounding boxes (`{ x, y, width, height }` from `0` to `1`) and bilingual labels (English and Telugu).
   - Validated against a strict Zod schema with automatic array-root normalization to ensure reliable downstream client cropping.
   - Built-in server retry loop with backoff handles transient API overload spikes seamlessly.

2. **Contextual Phrase Composition (`/api/compose`)**:
   - Converts structured selections (product label, intention, quantity, language, and prior correction context) into natural, polite conversational sentences.
   - If the composition API is unavailable, the server automatically falls back to deterministic local phrase templates.

3. **Performance Optimization (`ThinkingLevel.MINIMAL`)**:
   - Configured with `thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }` to reduce inference latency, delivering predictable response times suitable for counter checkout interactions.

> **Architecture Note**: Message composition includes deterministic local template fallback if the model API is unreachable. Visual product recognition from photos requires the hosted Gemma Vision API.

---

## Project Directory Structure

```
mysay/
├── .env.example              # Template environment variables for Gemini API & Gemma model
├── LICENSE                   # MIT license terms and third-party attribution notices
├── SKILL.md                  # Agent workflow specification for scene-to-communication boards
├── package.json              # Project dependencies, scripts, and test runner configuration
├── public/                   # Static icons and presentation assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/      # POST /api/analyze: Gemma vision recognition & bounding boxes
│   │   │   └── compose/      # POST /api/compose: Gemma phrase composition with local fallback
│   │   ├── globals.css       # Tailwind CSS theme setup and global typography styles
│   │   ├── layout.tsx        # Root HTML layout and viewport metadata
│   │   └── page.tsx          # Main application page orchestrating surroundings and words panels
│   ├── components/
│   │   ├── Header.tsx        # Top navigation header with language switcher (English / Telugu)
│   │   ├── ImageCapture.tsx  # Camera capture, file upload, synthetic test shelf, and retry alert
│   │   ├── ProductCard.tsx   # Product card displaying client-cropped image and bilingual labels
│   │   ├── ProductGrid.tsx   # 2x2 grid displaying detected product cards
│   │   └── WordsPanel.tsx    # Communication panel: intention, quantity, speech, and corrections
│   └── lib/
│       ├── imageUtils.ts     # Client canvas resizing (1280px max) and bounding-box cropping
│       ├── sampleImage.ts    # Synthetic shop shelf generator for unit and pipeline testing
│       ├── speech.ts         # Web Speech API wrapper with voice detection & Telugu checks
│       ├── templates.ts      # Deterministic local phrase templates and quick reply phrases
│       ├── types.ts          # TypeScript interfaces for products, boxes, intentions, and APIs
│       └── server/
│           └── gemini.ts     # Server-side @google/genai client, schemas, retries, and normalization
└── tests/
    └── normalization.test.ts # Unit tests for response normalization and schema validation
```

---

## Local Setup & Environment Variables

### Prerequisites
- Node.js 20+ (tested on Node.js v24)
- npm

### 1. Environment Configuration

If `.env.local` does not already exist, copy `.env.example`:

```bash
if [ ! -f .env.local ]; then cp .env.example .env.local; fi
```

Configure your server-side variables in `.env.local`:

```env
# Google Gemini / Gemma API Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key_here

# Model identifier for Gemma on Gemini API
GEMMA_MODEL=gemma-4-26b-a4b-it
```

> **Important**: Never commit `.env.local`. It is excluded by `.gitignore`.

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port reported in your terminal) to use the app.

---

## Verification Commands

Run the test suite, linting, type-checking, and production build with the following commands:

```bash
# Run unit tests (response normalization & schema validation)
npm test

# Run code style & lint checks
npm run lint

# Run strict TypeScript compiler verification
npx tsc --noEmit

# Run production build (webpack target)
npm run build

# Start production server
npm run start
```

---

## Limitations

- **Visual Recognition Conditions**: Recognition accuracy depends on ambient lighting, angle, and packaging clarity. Reflective surfaces or heavy clutter can produce approximate bounding boxes.
- **Hosted API Dependency for Recognition**: While sentence composition includes an offline template fallback, visual item detection from photos requires an active network connection to the hosted Gemma Vision API.
- **Telugu Speech Engine Dependency**: Spoken audio relies on the browser's native `window.speechSynthesis`. Voice quality varies by operating system. If the host platform lacks an installed Telugu voice, the app suppresses foreign-accented speech and alerts the user to show the high-contrast on-screen text to the shopkeeper instead.
- **Not Tested with Intended Users**: MySay is an early functional prototype developed for hackathon demonstration; it has not yet been tested with intended users or undergone formal clinical usability trials.

---

## License & Credits

- **Application Code**: Licensed under the [MIT License](./LICENSE).
- **Concept Credit**: Inspired by the [3VA](https://github.com/libreearth/eva_voice_release) augmentative communication project concept.
- **Third-Party Notices**:
  - [Next.js](https://nextjs.org/) & [React](https://react.dev/): MIT License &copy; Vercel, Inc. and Meta Platforms, Inc.
  - [Tailwind CSS](https://tailwindcss.com/): MIT License &copy; Tailwind Labs, Inc.
  - [Lucide Icons](https://lucide.dev/): ISC License &copy; Lucide Contributors.
  - [Google Gen AI SDK](https://github.com/google-gemini/deprecations): Apache-2.0 License &copy; Google LLC.
