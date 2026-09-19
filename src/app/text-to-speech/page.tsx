
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { convertTextToAudio } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Textarea } from "@/components/ui/textarea";
import { Volume2, RefreshCw, XCircle, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableVoices, getVoiceDetails, AnyVoice } from "@/lib/voices";

const MAX_CHARS = 5000;

export default function TextToSpeechPage() {
  const { toast } = useToast();

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const simulateProcessingProgress = () => {
    let internalProgress = 10;
    const interval = setInterval(() => {
      internalProgress += 1;
      setProgress(internalProgress);
      
      if (internalProgress >= 60 && internalProgress < 99) {
        setStatusText("Finalizing audio...");
      }
      
      if (internalProgress >= 99) {
        clearInterval(interval);
      }
    }, 800); // Slower interval for a smoother feel
    return interval;
  };

  const handleConvert = async () => {
    if (!text.trim()) {
        setError("Please enter some text to convert.");
        return;
    }

    if (text.length > MAX_CHARS) {
        setError(`Text exceeds the ${MAX_CHARS.toLocaleString()}-character limit. Please shorten your text.`);
        return;
    }

    // Handle custom voice simulation
    const voiceInfo = getVoiceDetails(selectedVoice);
    if (voiceInfo && 'isCustom' in voiceInfo && voiceInfo.isCustom) {
        setAudioUrl(voiceInfo.audioDataUri);
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
    setProgress(10);
    setError(null);
    setAudioUrl(null);
    setStatusText("Synthesizing audio...");

    const processingInterval = simulateProcessingProgress();
    
    const result = await convertTextToAudio(text, selectedVoice);

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
      setAudioUrl(result.audioDataUri);
      setProgress(100);
      setStatusText("Your audio is ready!");
      toast({
          title: "Conversion Successful",
          description: "Your text has been converted to audio.",
      });
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setText("");
    setError(null);
    setAudioUrl(null);
    setIsLoading(false);
    setProgress(0);
    setStatusText("");
    if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].id);
    }
  };

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
                Text-to-Speech Converter
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Bring your text to life. Paste your content below and listen to it as natural-sounding audio.
            </p>
        </div>
    
        {audioUrl ? (
             <Card className="max-w-2xl mx-auto p-6 shadow-lg">
                <CardContent className="p-0">
                    <h3 className="text-xl font-semibold font-headline mb-2">Your audio is ready!</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Voice: {getVoiceDetails(selectedVoice)?.name}</p>
                    <AudioPlayer src={audioUrl} />
                    <Button onClick={resetState} className="w-full mt-6">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Convert More Text
                    </Button>
                </CardContent>
            </Card>
        ) : (
             <Card className="max-w-2xl mx-auto shadow-lg">
                <CardContent className="p-6 space-y-4">
                    <Textarea
                        placeholder="Enter your text here..."
                        value={text}
                        onChange={handleTextChange}
                        className="min-h-[200px] text-base"
                        disabled={isLoading}
                        maxLength={MAX_CHARS}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                    </p>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Select a Voice</label>
                        <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isLoading}>
                            <SelectTrigger className="w-full">
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

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                            <XCircle className="h-4 w-4 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {isLoading ? (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">{statusText}</p>
                                <p className="text-sm font-semibold text-primary">{progress}%</p>
                            </div>
                            <Progress value={progress} className="w-full" />
                        </div>
                    ) : (
                        <Button onClick={handleConvert} className="w-full" disabled={!text.trim()}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Convert to Audio
                        </Button>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}

    