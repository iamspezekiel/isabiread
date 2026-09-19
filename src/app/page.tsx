import Link from "next/link";
import { PdfUploader } from "@/components/PdfUploader";
import { Button } from "@/components/ui/button";
import { CassetteTape, ArrowRight } from "lucide-react";

const sampleTracks = [
  "Introduction",
  "The Argument",
  "Evidence",
  "The Turning Point",
  "Conclusion",
];

const features = [
  {
    title: "PDF to audiobook",
    detail: "Drop in any PDF and get back a full-length audio you can play anywhere — commute, gym, or eyes closed.",
    tag: "PDF",
  },
  {
    title: "Natural AI voices",
    detail: "Eight studio voices across calm, warm, professional, deep, and sweet registers.",
    tag: "VOICE",
  },
  {
    title: "Multi-speaker dialogue",
    detail: "Turn a script into a conversation. Each speaker gets their own voice, automatically.",
    tag: "DUO",
  },
  {
    title: "Voice Lab",
    detail: "Record a short sample and save your own voice to every future conversion.",
    tag: "REC",
  },
  {
    title: "Text to speech everywhere",
    detail: "Paste any text on any page and it is read aloud instantly — no PDF required.",
    tag: "TTS",
  },
  {
    title: "Your history, synced",
    detail: "Sign in and every conversion is recorded to your dashboard, ready to replay.",
    tag: "SYNC",
  },
];

const voices = [
  { name: "Algenib", detail: "Female · Calm" },
  { name: "Achernar", detail: "Male · Calm" },
  { name: "Gacrux", detail: "Male · Warm" },
  { name: "Vindemiatrix", detail: "Female · Warm" },
  { name: "Sadachbia", detail: "Male · Professional" },
  { name: "Schedar", detail: "Female · Professional" },
  { name: "Charon", detail: "Male · Deep" },
  { name: "Autonoe", detail: "Female · Sweet" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    detail: "2MB files · 10 conversions a month",
  },
  {
    name: "Pro",
    price: "$10",
    alt: "₦15,000",
    detail: "10MB files · unlimited conversions · high quality",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    detail: "Volume, custom limits, dedicated support",
  },
];

export default function Home() {
  return (
    <div className="pb-16">
      {/* ===== SIDE A · Hero ===== */}
      <section className="pt-12 pb-14 text-center md:pt-20">
        <p className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
          <span className="rec-blink h-2 w-2 rounded-full bg-primary" aria-hidden />
          <span className="tape-label text-foreground">IsabiRead · Side A</span>
        </p>

        <h1 className="mx-auto mt-8 max-w-4xl font-headline text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl leading-[1.02]">
          Your PDF, <span className="text-primary">on tape.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
          Drop in any document, hit record, and IsabiRead reads it back in a natural
          voice — one of eight studio voices, or your own, saved in the Voice Lab.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <PdfUploader />
          <div className="hidden w-full max-w-sm lg:block lg:max-w-[15rem] lg:shrink-0">
            <div className="rounded-md border border-neutral-600 bg-card p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <span className="tape-label text-primary">Side A</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  ISABIREAD · 64K
                </span>
              </div>
              <div className="tracklines mt-3 rounded-md border border-border bg-background p-4">
                <ol className="space-y-2.5 text-sm">
                  {sampleTracks.map((track, i) => (
                    <li key={track} className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium text-foreground">{track}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 font-mono text-xs text-muted-foreground">
          FREE TO START · NO CARD NEEDED · 10 CONVERSIONS A MONTH
        </p>
      </section>

      {/* ===== Sample tape ===== */}
      <section className="border-y border-neutral-700 bg-neutral-900 text-neutral-200">
        <div className="container grid items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="tape-label text-red-400">Sample tape</p>
            <h2 className="mt-3 font-headline text-3xl font-bold text-neutral-50 md:text-4xl">
              How a tape gets made
            </h2>
            <ol className="mt-8 space-y-6">
              {[
                ["01", "INSERT", "Drop in your PDF — chapters are read straight off the file."],
                ["02", "RECORD", "Pick a voice and hit record. IsabiRead extracts, summarizes, and synthesizes."],
                ["03", "PLAY", "Listen anywhere. The whole document, one continuous take."],
              ].map(([num, label, text]) => (
                <li key={num} className="flex gap-4">
                  <span className="font-mono text-sm font-bold text-red-400">{num}</span>
                  <div>
                    <p className="font-headline text-sm font-bold uppercase tracking-widest text-neutral-100">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* J-card tracklist */}
          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-md border border-neutral-600 bg-card p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <span className="tape-label text-primary">Side A</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  ISABIREAD · 64K · SAMPLE
                </span>
              </div>
              <div className="tracklines mt-3 rounded-md border border-border bg-background p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  Chapter_02_Final.pdf
                </p>
                <ol className="mt-3 space-y-2.5 text-sm">
                  {sampleTracks.map((track, i) => (
                    <li key={track} className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium text-foreground">{track}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIDE A · Features tracklist ===== */}
      <section className="container px-4 py-14 md:py-20">
        <p className="tape-label text-primary">Side A · The tape</p>
        <h2 className="mt-3 max-w-2xl font-headline text-3xl font-bold text-foreground md:text-4xl">
          Everything on the record
        </h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group grid gap-2 py-6 md:grid-cols-[64px_1fr_auto] md:items-baseline md:gap-8"
            >
              <span className="font-mono text-sm text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-headline text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  {feature.detail}
                </p>
              </div>
              <span className="hidden w-24 rounded border border-border px-2 py-1 text-center font-mono text-[10px] tracking-wider text-muted-foreground md:block">
                {feature.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SIDE B · Voices ===== */}
      <section className="border-y border-neutral-700 bg-neutral-900 text-neutral-200">
        <div className="container px-4 py-14 md:py-20">
          <p className="tape-label text-red-400">Side B · The voices</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-headline text-3xl font-bold text-neutral-50 md:text-4xl">
              Pick who reads to you
            </h2>
            <Link
              href="/voice-lab"
              className="font-mono text-xs text-neutral-400 underline underline-offset-4 hover:text-neutral-100"
            >
              OR CLONE YOUR OWN →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {voices.map((voice) => (
              <div
                key={voice.name}
                className="rounded-lg border border-neutral-700 bg-neutral-800/60 p-4 transition-colors hover:border-neutral-500"
              >
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden />
                <p className="mt-3 font-headline text-base font-bold text-neutral-100">
                  {voice.name}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-neutral-500">{voice.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border-2 border-red-500/60 bg-red-500/10 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="flex items-center gap-2 font-headline text-base font-bold text-neutral-100">
                <CassetteTape className="h-5 w-5 text-red-400" />
                Your voice
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Record a short sample in the Voice Lab and it joins the roster on every future tape.
              </p>
            </div>
            <Button asChild className="mt-4 shrink-0 sm:mt-0">
              <Link href="/voice-lab">
                Open the Voice Lab <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Pick your copy ===== */}
      <section className="container px-4 py-14 md:py-20">
        <p className="tape-label text-primary">Pick your copy</p>
        <h2 className="mt-3 max-w-2xl font-headline text-3xl font-bold text-foreground md:text-4xl">
          Free to start. Pro when you&apos;re all in.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-xl border bg-card p-6 ${
                plan.popular ? "border-primary shadow-lg ring-2 ring-primary" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="tape-label text-muted-foreground">{plan.name}</span>
                {plan.popular && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-4 font-headline text-3xl font-bold text-foreground">
                {plan.price}
                {plan.alt && (
                  <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
                    / {plan.alt}
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.detail}</p>
              <div className="mt-6 pt-2">
                <Button asChild variant={plan.popular ? "default" : "outline"} className="w-full">
                  <Link href="/pricing">See full plans</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Close ===== */}
      <section className="container px-4 pb-8 text-center">
        <p className="tape-label text-primary">Side B · End</p>
        <h2 className="mt-3 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Press play.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Your library, on tape — anywhere, any voice, anytime.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Start making tapes</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/text-to-speech">Or paste some text</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
