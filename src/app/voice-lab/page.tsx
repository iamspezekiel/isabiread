
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, Square, Loader2, User, FlaskConical, Trash2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ICustomVoice, addCustomVoice, getCustomVoices, removeCustomVoice } from '@/lib/voices';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function VoiceCloningPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceName, setVoiceName] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [clonedVoices, setClonedVoices] = useState<ICustomVoice[]>([]);
  const [voiceToDelete, setVoiceToDelete] = useState<ICustomVoice | null>(null);

  const sampleText =
    'I am creating a voice clone with IsabiRead AI to personalize my audio experience.';
  
  useEffect(() => {
    // This effect runs only on the client
    setClonedVoices(getCustomVoices());
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/voice-lab');
    }
  }, [user, loading, router]);


  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        setAudioBlob(audioBlob);
      });

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description:
          'Please allow microphone access in your browser settings to record audio.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob || !voiceName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Information',
        description:
          'Please record a voice sample and provide a name for your voice clone.',
      });
      return;
    }
    setIsSubmitting(true);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async function () {
      const audioDataUri = reader.result as string;
      const newVoice = addCustomVoice(voiceName, audioDataUri);
      setClonedVoices(getCustomVoices());

      setIsSubmitting(false);
      setAudioBlob(null);
      setVoiceName('');
      toast({
        title: 'Voice Saved!',
        description: `Your new voice "${newVoice.name}" has been saved locally.`,
      });
    };
     reader.onerror = () => {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error Reading Audio",
        description: "Could not process the recorded audio. Please try again.",
      });
    };
  };
  
  const handleDeleteConfirm = () => {
    if (!voiceToDelete) return;
    removeCustomVoice(voiceToDelete.id);
    setClonedVoices(getCustomVoices());
    toast({
      title: "Voice Deleted",
      description: `The voice "${voiceToDelete.name}" has been removed.`,
    });
    setVoiceToDelete(null);
  };

  const playAudio = (audioDataUri: string) => {
    const audio = new Audio(audioDataUri);
    audio.play();
  };


  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
            IsabiRead Voice Lab
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create personalized AI voices. Record a sample to get started. These voices are saved in your browser.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Create Your Voice</CardTitle>
            <CardDescription>
              Record yourself reading the following sentence clearly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <FlaskConical className="h-4 w-4" />
              <AlertTitle>Local Voice Cloning</AlertTitle>
              <AlertDescription>
                This feature simulates voice cloning by saving your recording to your browser's local storage. Your custom voices will be available for use across the site.
              </AlertDescription>
            </Alert>

            <div className="p-6 bg-muted rounded-lg text-center font-medium text-lg">
              <p>"{sampleText}"</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                size="lg"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isRecording ? (
                  <>
                    <Square className="mr-2 h-5 w-5" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" /> Start Recording
                  </>
                )}
              </Button>
            </div>

            {audioBlob && (
              <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-medium">Your Recording</h3>
                <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                <div className="space-y-2">
                  <label htmlFor="voice-name" className="font-medium text-sm">
                    Name Your Voice
                  </label>
                  <Input
                    id="voice-name"
                    placeholder="e.g., 'My Morning Voice'"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !voiceName.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Voice'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>My Custom Voices</CardTitle>
            <CardDescription>
              Your locally saved voices will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clonedVoices.length > 0 ? (
              <div className="space-y-2">
                {clonedVoices.map((voice) => (
                  <div key={voice.id} className="flex items-center justify-between rounded-lg border p-3">
                    <p className="font-medium">{voice.name}</p>
                    <div className="flex items-center gap-2">
                       <Button variant="ghost" size="icon" onClick={() => playAudio(voice.audioDataUri)}>
                        <Play className="h-4 w-4" />
                        <span className="sr-only">Play Sample</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setVoiceToDelete(voice)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete Voice</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center bg-card">
                  <User className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No custom voices yet</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      Record your first voice sample to see it here.
                  </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={!!voiceToDelete} onOpenChange={(isOpen) => !isOpen && setVoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the custom voice
              <span className="font-bold"> {voiceToDelete?.name} </span> from your browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVoiceToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    