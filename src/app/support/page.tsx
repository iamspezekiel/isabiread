
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BookText, Mail, MessageSquare, BookOpen, Upload, Headphones, FileText } from "lucide-react";
import Link from "next/link";

// Add Tawk_API to the window interface to avoid TypeScript errors
declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
    };
  }
}

export default function SupportPage() {
  const { toast } = useToast();

  const openChatWidget = () => {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      window.Tawk_API.maximize();
    } else {
      toast({
        variant: "default",
        title: "Live Chat Unavailable",
        description: "The chat widget is still loading or is currently unavailable. Please try again in a moment.",
      });
    }
  };

  return (
    <div className="space-y-16 py-8">
      <section>
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Support Center
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We're here to help. Choose an option below to find answers to your questions or get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch mt-12">
          <Card className="flex flex-col hover:shadow-xl transition-shadow text-center">
            <CardHeader className="flex-grow">
              <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                  <BookText className="h-8 w-8 text-primary" />
                  </div>
              </div>
              <CardTitle className="font-headline">Knowledgebase</CardTitle>
              <CardDescription className="pt-2">
                Browse our comprehensive library of articles and tutorials to find answers to common questions.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/knowledgebase">
                  Browse Articles
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col hover:shadow-xl transition-shadow text-center">
            <CardHeader className="flex-grow">
               <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
              </div>
              <CardTitle className="font-headline">Live Chat</CardTitle>
              <CardDescription className="pt-2">
                Chat directly with a member of our support team for immediate assistance during business hours.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={openChatWidget} className="w-full">
                Start a Chat
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col hover:shadow-xl transition-shadow text-center">
            <CardHeader className="flex-grow">
               <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                  <Mail className="h-8 w-8 text-primary" />
                  </div>
              </div>
              <CardTitle className="font-headline">Email Support</CardTitle>
              <CardDescription className="pt-2">
                Send us an email with your questions or feedback, and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <a href="mailto:read@isabi.cloud?subject=Support%20Request">
                  Send an Email
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Getting Started Guide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to IsabiRead! Here's how to convert your PDFs to audiobooks in a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Step 1: Upload Your PDF</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                Start by visiting the homepage. You can either drag and drop your PDF file directly onto the upload area or click the "Browse Files" button to select a file from your device.
              </p>
              <p>
                Please note the file size limits: Free users can upload files up to 2MB, while Pro users enjoy a 10MB limit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Step 2: Convert to Audio</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                Once you've selected a valid PDF file, its name will appear in the uploader. Simply click the "Convert to Audio" button to begin the process.
              </p>
              <p>
                Our AI will process your document, extract the text, and convert it into a high-quality audio file. You'll see a progress bar indicating the status of the conversion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <div className="flex items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Step 3: Listen & Review</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                When the conversion is complete, an audio player will appear. You can play, pause, and listen to your new audiobook directly on the page.
              </p>
               <p>
                Below the player, you'll find an "AI Summary" section. Click it to expand and read a concise summary of your document's content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <div className="flex items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Step 4: Manage Files</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                If you have an account, you can access your dashboard to view and manage all your previously converted files.
              </p>
              <p>
                The dashboard provides a convenient way to replay or download your audiobooks anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
