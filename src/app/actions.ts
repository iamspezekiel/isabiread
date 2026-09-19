
"use server";

import { pdfToAudio } from "@/ai/flows/pdf-to-audio-flow";
import { textToAudio } from "@/ai/flows/text-to-audio-flow";
import { multiSpeakerTextToAudio } from "@/ai/flows/multi-speaker-flow";
import { processVoiceSample } from "@/ai/flows/voice-lab-flow";

export async function convertPdfToAudio(pdfDataUri: string, voice: string): Promise<{ audioDataUri?: string; summary?: string; error?: string }> {
  try {
    if (!pdfDataUri.startsWith("data:application/pdf;base64,")) {
        return { error: "Invalid PDF data URI format." };
    }
    
    const result = await pdfToAudio({ pdfDataUri, voice });
    
    if (result.audioDataUri) {
      return { audioDataUri: result.audioDataUri, summary: result.summary };
    } else {
      return { error: "Conversion failed to produce audio." };
    }
  } catch (error: any) {
    console.error("Error in convertPdfToAudio:", error);
    const errorMessage = error.message || "An unexpected error occurred during conversion.";
    return { error: errorMessage };
  }
}


export async function convertTextToAudio(text: string, voice: string): Promise<{ audioDataUri?: string; error?: string }> {
  try {
    if (!text || !text.trim()) {
        return { error: "Input text cannot be empty." };
    }
    
    const result = await textToAudio({ text, voice });
    
    if (result.audioDataUri) {
      return { audioDataUri: result.audioDataUri };
    } else {
      return { error: "Conversion failed to produce audio." };
    }
  } catch (error: any) {
    console.error("Error in convertTextToAudio:", error);
    const errorMessage = error.message || "An unexpected error occurred during text-to-speech conversion.";
    return { error: errorMessage };
  }
}

export async function convertMultiSpeakerTextToAudio(text: string, voices: string[]): Promise<{ audioDataUri?: string, formattedText?: string, error?: string }> {
  try {
    if (!text || !text.trim()) {
      return { error: "Input text cannot be empty." };
    }
     if (!voices || voices.length === 0) {
      return { error: "At least one voice must be selected." };
    }
    
    const result = await multiSpeakerTextToAudio({ text, voices });
    
    if (result.audioDataUri) {
      return { audioDataUri: result.audioDataUri, formattedText: result.formattedText };
    } else {
      return { error: "Conversion failed to produce audio." };
    }
  } catch (error: any)
 {
    console.error("Error in convertMultiSpeakerTextToAudio:", error);
    const errorMessage = error.message || "An unexpected error occurred during conversion.";
    return { error: errorMessage };
  }
}

export async function submitVoiceSample(audioDataUri: string, voiceName: string): Promise<{ status?: string, message?: string, error?: string }> {
    try {
        if (!audioDataUri) {
            return { error: "Audio data is missing." };
        }
        if (!voiceName.trim()) {
            return { error: "Voice name cannot be empty." };
        }

        const result = await processVoiceSample({ audioDataUri, voiceName });
        
        return { status: result.status, message: result.message };

    } catch (error: any) {
        console.error("Error in submitVoiceSample:", error);
        const errorMessage = error.message || "An unexpected error occurred.";
        return { error: errorMessage };
    }
}
