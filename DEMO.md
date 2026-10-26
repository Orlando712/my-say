# MySay — 90-Second Demonstration Script & Walkthrough

This document outlines a concise, realistic 90-second demonstration walk-through for hackathon evaluators and video presentation.

---

## Timeline & Narration Script

### [00:00 – 00:15] Problem Introduction
- **Visual**: Show the MySay app open on mobile or desktop at `http://localhost:3001`.
- **Narration**:
  > *"For people who find speaking difficult—due to aphasia, speech apraxia, or disability—a simple trip to the local store can be stressful. Standard AAC boards don't have the specific items on a neighborhood counter, typing on a phone is slow, and pointing across glass displays often leads to mix-ups. MySay turns a real photo of the store counter into an instant, tactile speech board."*

### [00:15 – 00:30] Scene Capture & Grounding
- **Visual**: Click "Upload Photo" (or "Take a Photo" / "Load Sample Shop Shelf"). Select a real counter display photograph containing distinct packaged goods (e.g. snack boxes, drink cans, or grocery packages). Press "Find items".
- **Narration**:
  > *"The shopper photographs the counter. In seconds, Gemma Vision analyzes the visual scene, locates the prominent items, and extracts normalized bounding boxes. The browser automatically crops each product using the HTML5 Canvas API, generating touchable product cards with bilingual English and Telugu labels."*

### [00:30 – 00:45] Intent Selection & Composing
- **Visual**:
  1. Tap the second product card (e.g. "Digestive Biscuits").
  2. Notice the "Active selection" banner immediately confirms: `Active selection: Digestive Biscuits • Ask price • Qty: 1`.
  3. Change quantity to `2`.
  4. Keep intention as "Ask the price".
  5. Tap "Build message".
- **Narration**:
  > *"The customer taps the item they want, chooses 'Ask the price', and selects quantity 2. Gemma composes a polite, natural sentence: 'Excuse me, could you please tell me how much two packs of Digestive Biscuits cost?'"*

### [00:45 – 01:05] Deliberate Speech & Review
- **Visual**:
  1. Highlight the large, high-contrast editable text box and the Pointing Card showing the cropped photo of the biscuits.
  2. Explain that nothing speaks automatically.
  3. Press the prominent **Speak Message** button.
  4. The browser synthesizes the sentence cleanly. Demonstrate the accessible **Stop** and **Repeat** buttons.
- **Narration**:
  > *"Crucially, nothing speaks until the user is ready. The shopper reviews the message, shows the screen if needed, and presses Speak Message. The voice speaks clearly, and Repeat or Stop are one tap away."*

### [01:05 – 01:20] Misunderstanding Correction & Quick Replies
- **Visual**:
  1. Simulate the shopkeeper reaching for the wrong item (e.g., reaching for crackers instead).
  2. Tap **"No, a different item"** in Section 5. The app enters correction mode.
  3. Tap the third product card (e.g. "Chocolate Cookies").
  4. Tap "Build message". The generated message now states: *"Actually, not the Digestive Biscuits, I would like the Chocolate Cookies instead, please."*
  5. Show an instant quick reply: tap **"Thank you"**—it immediately enters the message box without auto-speaking.
- **Narration**:
  > *"If the shopkeeper reaches for the wrong box, the customer taps 'No, a different item' and selects the right one. MySay explicitly structures the correction sentence: 'Actually, not the biscuits, I would like the cookies instead, please.' Quick answers like 'Yes', 'No', and 'Thank you' are always available."*

### [01:20 – 01:30] Gemma's Role & Realistic Prototype Limitations
- **Visual**: Pan down to the footer showing `gemma-4-26b-a4b-it` (ThinkingLevel.MINIMAL).
- **Narration**:
  > *"Gemma turns unpredictable physical surroundings into a concrete vocabulary. As an early prototype, lighting or package reflections can cause detection errors, browser voices can sound mechanical, and latency varies over cellular networks. But grounding AAC in real photos brings neighborhood counters within reach for everyone."*

---

## Demo Checklist for Presenters

1. **Environment Setup**: Verify `GEMINI_API_KEY` is loaded in `.env.local` and `npm run dev` is running on `http://localhost:3001`.
2. **Audio Check**: Ensure computer audio output is unmuted and browser speech synthesis permissions are active.
3. **Photo Asset Ready**: Have a clear photograph of 3–4 grocery or counter items ready, or use the built-in "Load Sample Shop Shelf" shortcut for immediate evaluation.
4. **Deliberate Actions**: Highlight that speech requires an explicit user click, demonstrating user agency and control.
