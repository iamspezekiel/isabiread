
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { convertPdfToAudio } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AudioPlayer, Reel } from "@/components/AudioPlayer";
import { CassetteTape, RefreshCw, XCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableVoices, getVoiceDetails, AnyVoice } from "@/lib/voices";

export function PdfUploader() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [availableVoices, setAvailableVoices] = useState<AnyVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");


  useEffect(() => {
    const voices = getAvailableVoices();
    setAvailableVoices(voices);
    if (voices.length > 0) {
        setSelectedVoice(voices[0].id);
    }
  }, []);

  const MAX_SIZE_GUEST = 2 * 1024 * 1024; // 2MB
  const MAX_SIZE_USER = 10 * 1024 * 1024; // 10MB
  const MAX_SIZE = user ? MAX_SIZE_USER : MAX_SIZE_GUEST;

  const counter = isLoading
    ? `REC ${progress}%`
    : audioUrl
      ? "PLAY"
      : file
        ? "READY"
        : "STBY";

  const handleFile = (selectedFile: File) => {
    if (isLoading) return;
    resetState(false); // Don't reset voice selection

    if (selectedFile.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF.");
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      const limitType = user ? "Pro" : "Free";
      setError(`File size exceeds the ${limitType} limit of ${MAX_SIZE / 1024 / 1024}MB.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const simulateProcessingProgress = () => {
    let internalProgress = 10;
    const interval = setInterval(() => {
      internalProgress += 1;
      setProgress(internalProgress);

      if (internalProgress >= 30 && internalProgress < 60) {
        setStatusText("Generating summary...");
      } else if (internalProgress >= 60 && internalProgress < 90) {
        setStatusText("Synthesizing audio...");
      } else if (internalProgress >= 90 && internalProgress < 99) {
        setStatusText("Finalizing...");
      }

      if (internalProgress >= 99) {
        clearInterval(interval);
      }
    }, 1000); // Slower interval for a smoother feel
    return interval;
  };

  const handleConvert = async () => {
    if (!file) return;

    // Handle custom voice simulation
    const voiceInfo = getVoiceDetails(selectedVoice);
    if (voiceInfo && 'isCustom' in voiceInfo && voiceInfo.isCustom) {
        setAudioUrl(voiceInfo.audioDataUri);
        setSummary("This is a preview using your saved custom voice. Full PDF conversion is not performed for local voice samples.");
        setProgress(100);
        setIsLoading(false);
        setStatusText("Previewing with custom voice.");
         toast({
          title: "Using Custom Voice",
          description: "Playing back your recorded voice sample.",
        });
        return;
    }


    setIsLoading(true);
    setProgress(0);
    setError(null);
    setStatusText("Preparing file...");

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 10);
        setProgress(percentLoaded);
        setStatusText("Reading file...");
      }
    };

    reader.onload = async () => {
      setProgress(10);
      setStatusText("Sending to AI...");

      const processingInterval = simulateProcessingProgress();

      const base64 = reader.result as string;
      const result = await convertPdfToAudio(base64, selectedVoice);

      clearInterval(processingInterval);

      if (result.error) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Conversion Failed",
          description: result.error,
        });
        setIsLoading(false);
        setProgress(0);
      } else if (result.audioDataUri) {
        setAudioUrl(result.audioDataUri); // Always set the ephemeral audio URL first

        if (user && db) {
          // Logged-in user flow: record conversion, but don't save the audio file
          setStatusText("Recording conversion...");
          try {
            await addDoc(collection(db, "files"), {
              userId: user.uid,
              name: file.name,
              summary: result.summary || "",
              createdAt: serverTimestamp(),
            });
             toast({
              title: "Conversion Recorded",
              description: "This conversion has been added to your dashboard history.",
            });
          } catch (dbError) {
             console.error("Firebase DB error:", dbError);
             setError("Failed to record your conversion, but you can listen to it now.");
          }
        } else {
          // Guest user flow
          toast({
              title: "Want to save your conversion history?",
              description: "Sign up for an account to track your conversions in your dashboard.",
          });
        }

        setSummary(result.summary || null);
        setProgress(100);
        setStatusText("Your audio is ready!");
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setIsLoading(false);
      setProgress(0);
    };

    reader.readAsDataURL(file);
  };

  const resetState = (resetVoice = true) => {
    setFile(null);
    setError(null);
    setAudioUrl(null);
    setSummary(null);
    setIsLoading(false);
    setProgress(0);
    setStatusText("");
    if(resetVoice && availableVoices.length > 0) setSelectedVoice(availableVoices[0].id);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 text-neutral-200 shadow-xl shadow-black/20">
        {/* Deck header */}
        <div className="flex items-center justify-between border-b border-neutral-700/70 bg-neutral-950/50 px-5 py-3">
          <div className="flex items-center gap-2">
            {isLoading && (
              <span className="rec-blink h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden />
            )}
            <span className="tape-label text-neutral-400">
              {isLoading ? "Recording" : "IsabiRead · Deck"}
            </span>
          </div>
          <span className="font-mono text-xs text-neutral-400 tabular-nums">{counter}</span>
        </div>

        {/* Tape window */}
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-xl border border-neutral-700/80 bg-neutral-800/70 p-4 sm:p-6">
            {audioUrl ? (
              <div className="space-y-4">
                <AudioPlayer src={audioUrl} title={file?.name} />
                {summary && (
                  <Accordion type="single" collapsible className="w-full text-neutral-200">
                    <AccordionItem value="item-1" className="border-neutral-700">
                      <AccordionTrigger className="text-neutral-200 hover:text-white">
                        View AI Summary
                      </AccordionTrigger>
                      <AccordionContent className="text-neutral-400">
                        <p className="whitespace-pre-wrap">{summary}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                <Button onClick={() => resetState()} variant="secondary" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Eject &amp; New Tape
                </Button>
              </div>
            ) : !file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging
                    ? "border-red-400 bg-red-500/10"
                    : "border-neutral-600 bg-neutral-800/60"
                }`}
              >
                <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                <div className="flex items-center gap-4 text-neutral-500">
                  <Reel spinning={false} />
                  <CassetteTape className="h-10 w-10 text-neutral-400" />
                  <Reel spinning={false} />
                </div>
                <p className="mt-5 font-headline text-lg font-bold text-neutral-100">Insert your PDF</p>
                <p className="mt-1 text-sm text-neutral-400">
                  Drag &amp; drop it in here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-semibold text-red-400 underline underline-offset-2 hover:text-red-300"
                  >
                    browse files
                  </button>
                </p>
                <p className="mt-5 text-[11px] text-neutral-500">
                  Max size {MAX_SIZE / 1024 / 1024}MB.{" "}
                  {user ? (
                    "You are on the Pro plan."
                  ) : (
                    <span>
                      Want more?{" "}
                      <Link href="/pricing" className="text-red-400 hover:text-red-300">
                        Upgrade now
                      </Link>
                      .
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Tracklist */}
                <div>
                  <p className="tape-label text-red-400">Side A · Tracklist</p>
                  <div className="mt-2 rounded-lg border border-neutral-700 bg-neutral-900/60 px-4 py-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-mono text-neutral-500">01</span>
                      <span className="truncate font-medium text-neutral-100">{file.name}</span>
                      <span className="ml-auto shrink-0 rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-neutral-400">
                        PDF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Voice select */}
                <div>
                  <label className="tape-label text-neutral-400" htmlFor="deck-voice">
                    Select voice
                  </label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isLoading}>
                    <SelectTrigger id="deck-voice" className="mt-2 w-full border-neutral-700 bg-neutral-800 text-neutral-100">
                      <SelectValue placeholder="Choose a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transport */}
                <div className="flex items-center gap-4 pt-1">
                  {isLoading ? (
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="flex items-center gap-2 text-red-400">
                          <span className="rec-blink h-2 w-2 rounded-full bg-red-500" aria-hidden />
                          REC
                        </span>
                        <span className="text-neutral-400">{statusText}</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-neutral-700 [&>div]:bg-red-500" />
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleConvert}
                        aria-label="Record and convert to audio"
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-red-400/70 bg-red-600 shadow-lg shadow-red-950/50 transition hover:bg-red-500"
                      >
                        <span className="h-4 w-4 rounded-full bg-white" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="font-headline text-sm font-bold text-neutral-100">Record audio</p>
                        <p className="truncate text-xs text-neutral-500">
                          Converts {file.name}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => resetState(false)}
                        aria-label="Eject file"
                        className="text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
                <XCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Deck footer */}
        <div className="flex items-center justify-between border-t border-neutral-700/70 bg-neutral-950/50 px-5 py-2.5 font-mono text-[11px] text-neutral-500">
          <span>ISABIREAD AI · DECK 01</span>
          <span>{user ? "PRO · 10MB MAX" : "FREE · 2MB MAX"}</span>
        </div>
      </div>
    </div>
  );
}
