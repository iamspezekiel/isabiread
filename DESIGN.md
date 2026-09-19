---
name: IsabiRead AI
description: Every PDF, on tape — a cassette-deck world for turning documents into audio you press play on.
colors:
  paper: "hsl(40 30% 96%)"
  ink: "hsl(22 14% 11%)"
  card-warm: "hsl(42 35% 99%)"
  record: "hsl(5 78% 46%)"
  record-bright: "hsl(5 80% 56%)"
  record-deep: "#dc2626"
  tape-red: "#f87171"
  paper-muted: "hsl(28 8% 40%)"
  paper-border: "hsl(34 16% 82%)"
  deck: "#171717"
  deck-panel: "#262626"
  deck-edge: "#404040"
  deck-card: "hsl(24 10% 11%)"
  deck-text: "hsl(40 25% 92%)"
  deck-muted: "#a3a3a3"
  deck-border: "hsl(24 10% 19%)"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "3rem–6rem (text-5xl / md:text-8xl)"
    fontWeight: 700
    lineHeight: 1.02
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.875rem–2.25rem (text-3xl / md:text-4xl)"
    fontWeight: 700
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem–1.125rem (text-sm / md:text-lg)"
    fontWeight: 400
  label:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    letterSpacing: "0.22em"
    textTransform: "uppercase"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.625rem–0.75rem (text-[10px] / text-xs)"
    textTransform: "uppercase"
rounded:
  lg: "0.625rem"
  md: "calc(0.625rem - 2px)"
  sm: "calc(0.625rem - 4px)"
  deck-shell: "1rem"
  deck-window: "0.75rem"
  j-card: "0.375rem"
  rec-button: "9999px"
spacing:
  section-y: "3.5rem / 5rem (py-14 / md:py-20)"
  block-gap: "1rem–1.5rem (gap-4 / gap-6)"
  deck-pad: "1.25rem / 1.75rem (px-5 sm:px-7)"
  under-heading: "0.75rem+ (mt-3+ below a heading, never less)"
components:
  button-primary:
    backgroundColor: "{colors.record}"
    textColor: "#fafafa"
    rounded: "{rounded.lg}"
    height: "2.5rem"
    padding: "0.75rem 1rem"
  button-rec:
    backgroundColor: "{colors.record-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.rec-button}"
    size: "3.5rem"
  deck-shell:
    backgroundColor: "{colors.deck}"
    textColor: "{colors.deck-text}"
    rounded: "{rounded.deck-shell}"
  deck-window:
    backgroundColor: "{colors.deck-panel}"
    textColor: "{colors.deck-text}"
    rounded: "{rounded.deck-window}"
  tracklist-card:
    backgroundColor: "{colors.card-warm}"
    textColor: "{colors.ink}"
    rounded: "{rounded.j-card}"
  tape-label-chip:
    backgroundColor: "transparent"
    textColor: "{colors.record}"
    rounded: "{rounded.rec-button}"
---

# Design System: IsabiRead AI

## Overview

**Creative North Star: "The Mixtape Deck"**

Every document IsabiRead owns is a tape. The product's signature is a working cassette deck — not a marketing illustration, but the actual uploader: drop in a PDF, pick a voice, hit the round red REC button, and watch the counter climb while the reels spin. The world refuses the generic AI-voice hero: no soft-purple gradients, no robot mascot, no "cutting-edge speech synthesis" claims. Instead, a warm paper ground and ink type stand for the reading side of the product, and deck-chrome charcoal stands for anything that plays audio. Red is reserved for the record action and for live REC state, so it stays rare enough to read as the button everywhere it appears.

The page is a two-sided tape. Side A carries the offer: hero deck, how a tape gets made, the feature tracklist. Side B carries the voices and the close. Dark deck bands break the paper rhythm the way flipping a tape does — the alternation is the scroll rhythm, not an accent. Density is editorial: numbered tracklist rows, J-card cards, small tracked tape labels, and generous section breathing room (py-14 / md:py-20).

**Key Characteristics:**
- A functional cassette deck as the hero and primary conversion surface
- Two surfaces: warm paper (reading) and deck charcoal (playback) — never mixed
- One saturated accent: record red, reserved for actions and live state
- Tape-label micro-labels (0.7rem, +0.22em tracking, uppercase) as the section voice
- Mono labels only for machine data: counters, deck badges, ISO codes, timestamps

## Colors

The palette is a two-surface system: warm paper + ink for reading and content, deck-chrome charcoal for the player and playback. One saturated accent — record red — carries every action and every live state.

### Primary
- **Record Red** (hsl(5 78% 46%), dark mode hsl(5 80% 56%)): the only saturated accent. Owns the primary button, the round REC button, the REC blink dot, hover links, and the text emphasis in headlines ("on tape."). Darkens to **record-deep** (#dc2626) on the deck's REC circle.
- **Tape Red** (#f87171): the deck-world text red — "Side A · Tracklist", "Record audio" labels, dropzone browse links, the blinking REC dot against dark surfaces. It is record red's brighter voice on dark chrome, not a second accent.

### Neutral
- **Paper** (hsl(40 30% 96%)): page background in light mode. Warm cream, never white.
- **Ink** (hsl(22 14% 11%)): primary text and dark-mode card surface; the reading foreground.
- **Card Warm** (hsl(42 35% 99%)): cards, J-cards, popovers on paper.
- **Paper Border** (hsl(34 16% 82%)) and **Paper Muted** (hsl(28 8% 40%)): 1px hairlines and secondary text on the paper side.
- **Deck** (#171717), **Deck Panel** (#262626), **Deck Edge** (#404040): the deck shell, its inner window, and its hairline borders. Warm-charcoal neutrals from Tailwind's neutral scale (700/800/900/950).
- **Deck Card** (hsl(24 10% 11%)), **Deck Text** (hsl(40 25% 92%)), **Deck Muted** (#a3a3a3): dark-mode surfaces, text, and secondary text.
- **Deck Border** (hsl(24 10% 19%)): dark-mode hairlines.

### Named Rules

**The Record Red Rule.** Record red never decorates. It appears only where the user can act or where recording is live: buttons, the REC dot, links, and emphasis on a single headline word. If red appears, something is actionable or in a REC state.

**The Two-Surface Rule.** Reading lives on paper, playback lives on deck charcoal. A player, voice roster, or audio control never sits on a paper surface, and an uploader never sits on a dark band. The dark deck band is the product's one repeated dark moment, and it is always playback or voices.

## Typography

**Display Font:** Space Grotesk (fallback: sans-serif)
**Body Font:** Inter (fallback: sans-serif)
**Label/Mono Font:** Space Grotesk for tape labels; system monospace for machine data

**Character:** Space Grotesk is a geometric grotesk with the squared, techy character of printed cassette J-card typography — it reads as designed hardware, not a default sans. Inter carries the dense reading copy in quiet contrast. Tape labels are Space Grotesk 700 at 0.7rem with +0.22em tracking, uppercased, the deck's label language; mono (uppercased, 10–12px) is reserved for counters, deck badges, and file/ISO codes.

### Hierarchy
- **Display** (Space Grotesk 700, 3rem–6rem, leading 1.02, tracking -0.02em): the landing headline only ("Your PDF, on tape."), breaking to an accent on one word.
- **Headline** (Space Grotesk 700, 1.875rem–2.25rem, leading 1.1): section titles ("How a tape gets made", "Pick who reads to you").
- **Body** (Inter 400, 0.875rem–1.125rem, leading 1.6, max ~65ch): reading copy and feature descriptions.
- **Label** (Space Grotesk 700, 0.7rem, +0.22em tracking, uppercase): the `tape-label` class — section markers, deck titles, card eyebrows.
- **Mono** (monospace, 0.625rem–0.75rem, uppercase): the tape counter, "ISABIREAD AI · DECK 01", "FREE · 2MB MAX", track numbers, timestamps.

### Named Rules

**The Tape-Label Rule.** Section markers are tape labels — tiny, uppercase, widely tracked Space Grotesk — never generic eyebrows, and never repeated more than once per surface. They are the J-card's printed labels, so they may sit above headings; that is the world's native labeling, not decoration.

**The Mono-Data Rule.** Monospace is for machine data only: counters, badges, track numbers, codes. If the text is human language, it is Space Grotesk or Inter, never mono.

## Layout

Centered container (max-w 1400px, px-4) with a single vertical rhythm: sections pad py-14 on mobile and md:py-20 on desktop; more space above a heading than below (mt-3+ above, mt-1–2 below). The page alternates paper sections with full-width deck bands (`border-y border-neutral-700 bg-neutral-900`) — the tape flip is the page rhythm.

- **Landing structure:** Side A hero (centered deck over a headline), "How a tape gets made" band with the J-card tracklist beside the steps, a feature tracklist as divided rows (01–06), Side B voices band (roster grid + Voice Lab callout), pricing, and a centered close.
- **The deck** is centered under the hero on a paper background and is the tallest element on the first viewport; it is always a dark chrome block on paper, never on a dark band.
- **Grids:** voices roster 2 / 3 / 4 columns (sm / lg breakpoints); pricing 1 / 3 columns (md). Content gaps are gap-3 to gap-4; between sections, py-14 / md:py-20.
- **Responsive:** J-card sits beside the steps at md and below them on mobile; the deck's inner padding steps px-5 → sm:px-7, py-5 → sm:py-6; the display headline steps text-5xl → sm:text-7xl → md:text-8xl.

## Elevation & Depth

Flat-first. Paper surfaces are tonal, not lifted: cards are card-warm on paper with 1px hairlines and no shadows. The deck is the single elevated object on the landing page — `shadow-xl shadow-black/20`, a soft, blurred, offset drop under the dark shell that grounds it like a physical machine on a desk. Dark bands use border-y hairlines and inner tonal steps (neutral-900 band over neutral-800 panels over neutral-950 headers/footers), never shadows.

### Named Rules

**The Flat-By-Default Rule.** Paper surfaces are flat at rest; the deck is the only allowed drop shadow, and it stays soft. No hard offset shadows anywhere in the system.

## Shapes

Base radius is 0.625rem (10px) for buttons, inputs, and cards; inner steps 8px and 6px (calc). The deck stack layers its own radii: shell 16px, tape window 12px, inner panels 8px, and the dropzone 8px with a 2px dashed hairline. The REC button is a perfect circle (50%) — the one fully round control, so it reads as a button in any context. J-cards and voice-roster tiles are slightly harder (6px). Tape-label chips are pills (9999px). Hairlines are 1px (`border-border` on paper, `border-neutral-700` inside the deck).

## Components

### Buttons
- **Shape:** base radius 0.625rem; the REC button is a 3.5rem circle.
- **Primary:** record red background (hsl(5 78% 46%)), near-white text, py-3 px-4, font-body semibold. Hover: lightens (hover to record-bright behavior via opacity/shade); focus ring uses the ring token (record red).
- **The REC Button (signature):** 3.5rem circle, record-deep (#dc2626) fill, white center dot, 2px tape-red ring, soft shadow — the single primary action on the deck. While converting it is replaced by a live progress row (blinking red REC + counter + red progress bar).
- **Secondary / Ghost:** paper-side outline buttons (border-border, ink text); deck-side ghost buttons are neutral-400 text with neutral-800 hover.

### The Deck (signature component)
The deck is the uploader, hero, and state machine in one. Dark chrome shell (deck #171717, 16px radius, 1px deck-edge border, soft shadow). Header row: blinking red REC dot + tape-label title ("Recording" / "IsabiRead · Deck") on the left, mono counter ("STBY" / "READY" / "REC 42%" / "PLAY") on the right, on a neutral-950 strip. Tape window: two Reels flanking a CassetteTape icon over the dropzone ("Insert your PDF", drag-and-drop, browse link, size limit line). Loaded state becomes a tracklist ("Side A · Tracklist" with the file as track 01) plus the voice Select and the transport row. Deck footer: mono badges "ISABIREAD AI · DECK 01" and "FREE · 2MB MAX" / "PRO · 10MB MAX". Counter is tabular-nums so it never jitters.

### Audio Player
"Now playing" card on deck surfaces. Signature element: the **Reel** — two circular reels whose spokes rotate (reel-spin, 1.6s linear) while audio plays, rendered as a real spinning component, not a static icon. Track title, transport controls, and summary accordion on neutral panels.

### Navigation
**Header:** paper surface, CassetteTape logo mark + "IsabiRead" wordmark; links are Inter labels with hover:text-primary. **Footer:** dark deck strip (neutral-900) with Side A / Side B link columns, mono fine print and copyright on neutral-600. The footer is the closing dark band; no other surface follows it.

### Selects / Inputs
On the deck: dark selects (deck-panel background, deck-edge border, deck-text value, tape-label caption above). On paper: standard paper-surface fields with border-border hairlines and a record-red focus ring.

### Chips / Labels
- **Tape-label chip:** pill with a blinking REC dot (rec-blink, 1.1s) + tape-label text ("IsabiRead · Side A") — the hero's identity badge.
- **Tracklist card (J-card):** card-warm background, 6px radius, 1px border; header row of tape-label "Side A" + mono ISO line; body uses the `tracklines` repeating hairline pattern (11px pitch) as the ruled-paper ground for numbered tracks.

## Do's and Don'ts

### Do:
- **Do** keep every audio surface dark (deck charcoal) and every reading surface warm paper.
- **Do** reserve record red for actions, REC state, and one emphasized headline word per section.
- **Do** use tape-label micro-labels as the world's section voice — uppercase Space Grotesk, +0.22em tracking, 0.7rem.
- **Do** use mono only for machine data: counters, deck badges, track numbers, codes.
- **Do** alternate paper sections with full-width dark deck bands to build the scroll rhythm.
- **Do** give the deck the product's only drop shadow, soft (`shadow-xl shadow-black/20`).

### Don't:
- **Don't** put a player or uploader on a paper surface, or voices on a dark-free page.
- **Don't** introduce a second saturated accent; record red is the only one.
- **Don't** use hard offset shadows, gradient text, glass panels, or glow effects anywhere.
- **Don't** let mono typeset human-language copy, or Inter typeset counters.
- **Don't** stack card-in-card-in-card: the deck's three-layer chrome (shell → window → panel) is its own hierarchy and should not be multiplied.
- **Don't** ship a generic AI visual (gradients, orbs, robot ears) as a stand-in for the deck.
