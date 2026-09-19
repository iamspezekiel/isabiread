# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone with documents they would rather listen to than read:

- Students and professionals who must absorb lots of reading material and want to listen while commuting, working out, or resting their eyes.
- People with dyslexia, vision fatigue, or reading difficulty who need documents read aloud.
- General audiences with PDFs (ebooks, reports, articles) who prefer listening.

## Product Purpose

Turn PDFs and written text into high-quality, natural-sounding audio so people can absorb documents hands-free. Success means a user uploads (or pastes) content, gets clean natural audio quickly, and returns because the listening experience is pleasant.

## Positioning

A PDF-to-audio tool that stands apart on three fronts competitors lack: local voices (including Nigerian voices), multi-speaker dialogue detection, and a Voice Lab for custom voices — while staying free to start with no account required to convert.

## Operating Context

- Browser-first (PWA-capable). Users upload a PDF or paste text, pick a voice, and preview audio inline.
- Guest users can convert up to 2MB files without an account; logged-in users get 10MB files and a dashboard history.
- Accounts are email/password or Google via Firebase. Payments are PayPal (USD) and Paystack (NGN).
- Voice Lab records a sample with the microphone; custom voices are stored in the browser's localStorage (simulated cloning — no true model training).

## Capabilities and Constraints

- PDF → audio with an AI-generated summary (server-side text extraction via pdf-parse).
- Text → speech and multi-speaker TTS (auto-detects speakers and assigns chosen voices).
- Voice Lab (local voice samples), selectable across all converters.
- Free plan: 10 conversions/month, 2MB uploads. Pro: unlimited, 10MB.
- TTS uses Google Gemini TTS; audio is returned as raw PCM and converted to WAV (~5000-char limit per chunk, chunked for longer documents).
- Custom voices are simulated client-side; there is no real voice-clone backend.
- Server actions accept up to 25MB bodies.

## Brand Commitments

- Name: IsabiRead AI. Domain: isabiread.icu.
- Visual identity: indigo primary (`#454e91`), light off-white background, Inter (body) + Space Grotesk (headline) fonts, lucide iconography. (Confirmed incumbent identity; not a binding design directive.)
- Friendly, encouraging voice in UI copy.

## Evidence on Hand

- docs/blueprint.md — original feature brief (upload flow, file-size validation, TTS conversion, audio player, auth, dashboard, dynamic pauses).
- Working implementation in src/ (pages, Genkit flows, components) is the incumbent visual system.
- No real testimonials, case studies, press, or customer proof exist. Future work must not fabricate them.

## Product Principles

- Speed and natural listening experience matter equally; neither is sacrificed for the other.
- Free and frictionless to start: guests can convert without an account.
- Preserve reading content faithfully — summaries and audio should reflect the actual document.
- Local relevance (Nigerian voices) is a genuine differentiator, not a gimmick.
- Transparency about capability limits (file size, character caps, simulated voice cloning).

## Accessibility & Inclusion

- Audio output inherently supports low-vision and reading-difficulty users.
- No product-specific accessibility standard is confirmed yet; treat keyboard operability, contrast, and semantic markup as baseline expectations.
