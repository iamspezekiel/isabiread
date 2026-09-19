"use client";

import { useRef, useState } from "react";

export function Reel({ spinning }: { spinning: boolean }) {
  return (
    <div
      className={`relative h-11 w-11 shrink-0 rounded-full border-[3px] border-neutral-600 bg-neutral-800 ${
        spinning ? "reel-spin" : ""
      }`}
      aria-hidden
    >
      {[0, 45, 90, 135].map((deg) => (
        <span
          key={deg}
          className="absolute left-1/2 top-1/2 h-[3px] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-600"
          style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-500" />
    </div>
  );
}

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Reel spinning={playing} />
          <Reel spinning={playing} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="tape-label text-red-400">Now playing</p>
          <p className="truncate text-sm font-medium text-neutral-100">
            {title ?? "Your audio"}
          </p>
        </div>
        <span className="hidden font-mono text-xs text-neutral-500 sm:block">SIDE A</span>
      </div>
      <audio
        controls
        src={src}
        className="mt-4 w-full"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
