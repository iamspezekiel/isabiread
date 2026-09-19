
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { convertMultiSpeakerTextToAudio } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, XCircle, Wand2, Users, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableVoices, AnyVoice } from "@/lib/voices";

const MAX_CHARS = 5000;

export default function MultiSpeakerPage() {
  const { toast } = useToast();

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [formattedText, setFormattedText] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [availableVoices, setAvailableVoices] = useState<AnyVoice[]>([]);
  const [selectedVoices, setSelectedVoices] = useState<string[]>([]);

  useEffect(() => {
    const voices = getAvailableVoices();
    setAvailableVoices(voices);
    if (voices.length > 0) {
      setSelectedVoices([voices[0].id]);
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const simulateProcessingProgress = () => {
    let internalProgress = progress;
    const interval = setInterval(() => {
      internalProgress += 1;
      setProgress(internalProgress);
      
      if (internalProgress >= 30 && internalProgress < 60) {
        setStatusText("Synthesizing audio for all speakers...");
      } else if (internalProgress >= 60 && internalProgress < 99) {
        setStatusText("Finalizing multi-speaker track...");
      }
      
      if (internalProgress >= 99) {
        clearInterval(interval);
      }
    }, 1000); // Slower interval for a smoother feel
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
    const realVoices = selectedVoices.filter(v => !v.startsWith('custom_'));

    if (realVoices.length === 0) {
      setError("Multi-speaker generation requires at least one prebuilt voice. Custom voices are for single-voice preview only.");
      return;
    }

    setIsLoading(true);
    setProgress(10);
    setError(null);
    setAudioUrl(null);
    setFormattedText(null);
    setStatusText("Analyzing text for speakers...");

    const processingInterval = simulateProcessingProgress();
    
    // We only send non-custom voices to the backend
    const result = await convertMultiSpeakerTextToAudio(text, realVoices);

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
      setFormattedText(result.formattedText || "Could not retrieve formatted text.");
      setProgress(100);
      setStatusText("Your multi-speaker audio is ready!");
      toast({
          title: "Conversion Successful",
          description: "Your text has been converted to multi-speaker audio.",
      });
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setText("");
    setError(null);
    setAudioUrl(null);
    setFormattedText(null);
    setIsLoading(false);
    setProgress(0);
    setStatusText("");
    if (availableVoices.length > 0) {
      setSelectedVoices([availableVoices[0].id]);
    }
  };
  
  const handleVoiceChange = (index: number, value: string) => {
    const newVoices = [...selectedVoices];
    newVoices[index] = value;
    setSelectedVoices(newVoices);
  };
  
  const addVoice = () => {
    if (selectedVoices.length < availableVoices.length) {
      const nextVoice = availableVoices.find(v => !selectedVoices.includes(v.id));
      if (nextVoice) {
          setSelectedVoices([...selectedVoices, nextVoice.id]);
      }
    }
  };
  
  const removeVoice = (index: number) => {
    if (selectedVoices.length > 1) {
      const newVoices = selectedVoices.filter((_, i) => i !== index);
      setSelectedVoices(newVoices);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Multi-Speaker TTS
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Create dynamic audio with multiple voices. The AI will automatically detect different speakers in your text.
        </p>
      </div>
    
      {audioUrl ? (
        <Card className="max-w-3xl mx-auto p-6 shadow-lg">
          <CardContent className="p-0">
            <h3 className="text-xl font-semibold font-headline mb-4">Your audio is ready!</h3>
            <AudioPlayer src={audioUrl} />
            
            {formattedText && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">AI Speaker Detection Result:</h4>
                <Textarea value={formattedText} readOnly className="min-h-[150px] bg-muted/50" />
              </div>
            )}
            
            <Button onClick={resetState} className="w-full mt-6">
              <RefreshCw className="mr-2 h-4 w-4" />
              Convert More Text
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardContent className="p-6 space-y-4">
            <Textarea
              placeholder="Enter text with multiple speakers here (e.g., a script or interview)..."
              value={text}
              onChange={handleTextChange}
              className="min-h-[250px] text-base"
              disabled={isLoading}
              maxLength={MAX_CHARS}
            />
            <p className="text-xs text-muted-foreground text-right">
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </p>

            <div className="space-y-4">
              <label className="text-sm font-medium block">Select Voices for Speakers</label>
              {selectedVoices.map((voiceId, index) => (
                <div key={index} className="flex items-center gap-2">
                  <p className="font-mono text-xs p-2 bg-muted rounded-md">Speaker{index + 1}</p>
                  <Select
                    value={voiceId}
                    onValueChange={(value) => handleVoiceChange(index, value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map(voice => (
                        <SelectItem key={voice.id} value={voice.id} disabled={selectedVoices.includes(voice.id) && voice.id !== voiceId}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   {selectedVoices.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeVoice(index)} disabled={isLoading}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addVoice}
                disabled={isLoading || selectedVoices.length >= availableVoices.length}
              >
                <Users className="mr-2 h-4 w-4" />
                Add Speaker Voice
              </Button>
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
              <Button onClick={handleConvert} className="w-full" disabled={!text.trim() || selectedVoices.length === 0}>
                <Wand2 className="mr-2 h-4 w-4" />
                Convert to Multi-Speaker Audio
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    