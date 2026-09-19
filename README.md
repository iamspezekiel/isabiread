# IsabiRead AI 🎧

**Turn PDFs and written text into high-quality, natural-sounding audio.**

IsabiRead AI is a browser-first web app that converts documents and text into speech you can listen to anywhere — while commuting, working out, or resting your eyes. It stands apart with local voices (including Nigerian voices), multi-speaker dialogue detection, and a Voice Lab for creating custom voices — and it's free to start, with no account required to convert.

**Live site:** [isabiread.icu](https://isabiread.icu)

---

## ✨ Features

- **PDF → Audio** — Upload a PDF, get it read aloud with an AI-generated summary of the content. Text extraction happens server-side with `pdf-parse`.
- **Text → Speech** — Paste any text and convert it to natural speech instantly.
- **Multi-Speaker Mode** — Auto-detects speakers in a dialogue and assigns a different voice to each one, great for scripts, interviews, and conversations.
- **Voice Lab** — Record a sample with your microphone and save custom voices, selectable across all converters. Custom voices are stored locally in your browser.
- **Local Voices** — A voice lineup that includes Nigerian voices, not just the usual generic accents.
- **Dynamic Pauses** — Intelligently inserts natural pauses so the audio doesn't sound robotic.
- **AI Summaries** — Every conversion comes with a concise AI-generated summary of the source material.
- **No Account Needed** — Guest users can convert files up to 2 MB without signing up.
- **Dashboard & History** — Signed-in users get a dashboard with their conversion history and up to 10 MB uploads.
- **Flexible Payments** — PayPal (USD) and Paystack (NGN) for upgrading to Pro.

## 🆓 Plans & Limits

| | Free | Pro |
|---|---|---|
| Conversions | 10 / month | Unlimited |
| Max upload size | 2 MB | 10 MB |
| Account required | No (guest mode available) | Yes |
| Dashboard history | — | ✅ |

## 🧠 How It Works

1. The user uploads a PDF or pastes text in the browser.
2. Server actions extract and validate the content (PDFs are parsed server-side; bodies up to 25 MB are accepted).
3. [Genkit](https://genkit.dev) AI flows call **Google Gemini TTS**, chunking long documents (~5,000 characters per chunk).
4. Raw PCM audio is converted to WAV client-side and played back in the inline audio player, alongside an AI-generated summary.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, Turbopack) + React 18 + TypeScript
- **AI:** [Genkit](https://genkit.dev) with Google AI (Gemini TTS + summarization)
- **Auth & Hosting:** Firebase (email/password + Google sign-in, App Hosting)
- **UI:** Tailwind CSS, shadcn/ui (Radix UI), lucide-react icons, Inter + Space Grotesk fonts
- **PDF parsing:** `pdf-parse` (server-side)
- **Audio:** Google Gemini TTS → raw PCM → WAV (`wav` encoder)
- **Payments:** PayPal (`@paypal/react-paypal-js`) and Paystack (`react-paystack`)
- **Support:** Tawk.to live chat widget

## 📁 Project Structure

```
src/
├── ai/
│   ├── flows/                  # Genkit AI flows
│   │   ├── pdf-to-audio-flow.ts        # PDF upload → extracted text + audio
│   │   ├── text-to-audio-flow.ts       # Plain text → speech
│   │   ├── multi-speaker-flow.ts       # Dialogue detection + multi-voice TTS
│   │   ├── summarize-text-flow.ts      # AI summaries
│   │   ├── voice-lab-flow.ts           # Voice Lab sample handling
│   │   └── dynamic-pause-insertion.ts  # Natural pause insertion
│   ├── genkit.ts               # Genkit client configuration
│   └── dev.ts                  # Genkit dev entrypoint
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── text-to-speech/         # Text → speech converter
│   ├── multi-speaker/          # Multi-speaker converter
│   ├── voice-lab/              # Voice Lab (custom voices)
│   ├── dashboard/              # Conversion history (signed-in)
│   ├── pricing/                # Plans & checkout
│   ├── login/ / signup/ / forgot-password/
│   ├── settings/ / about/ / support/ / knowledgebase/ / user-guide/
│   └── actions.ts              # Next.js server actions
├── components/                 # App components (Header, Footer, AudioPlayer,
│                               # PdfUploader, Preloader, TawkToWidget) + shadcn/ui
├── hooks/                      # use-toast, use-mobile
├── lib/                        # auth context, firebase init, voices, utils
└── services/pdf-service.ts     # Server-side PDF text extraction
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Gemini API key ([Google AI Studio](https://aistudio.google.com/))
- A Firebase project (for auth)

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
cp .env .env.local   # or edit .env directly

# 3. Start the dev server (runs on http://localhost:9002)
npm run dev
```

Optionally, run the Genkit developer UI to inspect and test AI flows:

```bash
npm run genkit:dev     # or: npm run genkit:watch
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (AI flows) |
| `GOOGLE_API_KEY` | Google API key |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID (Pro checkout) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key (NGN checkout) |
| `NEXT_PUBLIC_TAWKTO_PROPERTY_ID` | Tawk.to property ID (support widget) |
| `NEXT_PUBLIC_TAWKTO_WIDGET_ID` | Tawk.to widget ID (support widget) |

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server with Turbopack on port **9002** |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `npm run genkit:dev` | Start Genkit dev server for AI flows |
| `npm run genkit:watch` | Genkit dev server with auto-reload |

## ☁️ Deployment

The app is configured for **Firebase App Hosting** via `apphosting.yaml` (single instance). To deploy:

```bash
firebase experiments enable webframeworks   # if not already enabled
firebase init apphosting
firebase deploy
```

Set production secrets (e.g. `GEMINI_API_KEY`) with `firebase apphosting:secrets:set`.

## ⚠️ Notes & Limitations

- TTS is chunked at roughly **5,000 characters per request**; longer documents are split automatically.
- Voice Lab voice cloning is **simulated client-side** — custom voices live in the browser's localStorage, and no real model training happens.
- Server actions accept bodies up to **25 MB**; converter limits are 2 MB (guest/free) and 10 MB (Pro).
- This project intentionally does not fabricate testimonials or customer proof.

## 📄 License

All rights reserved © IsabiRead AI.
