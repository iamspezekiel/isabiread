
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accessibility, BookAudio, Bot, BrainCircuit, Building, Bug, Lightbulb, Sparkles, Users, Wand2, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          About IsabiRead AI
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Unlocking knowledge, one audiobook at a time. We're on a mission to make information more accessible and learning more flexible for everyone, everywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-headline">Our Heritage</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground text-center">
            <p>
              IsabiRead AI is a proud product of <strong className="font-semibold text-foreground">SPE TECHNOLOGIES LTD</strong>, an innovation hub dedicated to creating solutions that matter. Our roots are in building robust, scalable, and user-centric applications that simplify complex problems.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex flex-col items-center text-center gap-2">
               <div className="bg-primary/10 p-3 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-headline">Powered by IsabiAI Technology</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground text-center">
            <p>
              At the heart of IsabiRead is our powerful <strong className="font-semibold text-foreground">IsabiAI Technology</strong>. This proprietary engine leverages cutting-edge AI models for intelligent document parsing, natural-sounding text-to-speech conversion, and insightful content summarization, ensuring a premium experience.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookAudio className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-headline">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              In a fast-paced world, finding time to read is a luxury. IsabiRead was born from a simple idea: what if you could listen to any document, just like an audiobook? We aim to transform your reading material—from academic papers and business reports to your favorite e-books—into clear, high-quality audio.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
               <div className="bg-primary/10 p-3 rounded-full">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-headline">The Technology</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              We leverage state-of-the-art Artificial Intelligence to power our platform. Our system first intelligently parses your PDF documents, then uses advanced Text-to-Speech (TTS) models to generate natural-sounding audio. We also employ AI to provide concise summaries, giving you the key points of a document at a glance.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="max-w-5xl mx-auto text-center">
        <div className="mb-10">
          <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">Why Choose IsabiRead AI?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm hover:scale-105 transition-transform">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Accessibility className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-headline text-xl font-semibold mb-2">Unmatched Accessibility</h3>
            <p className="text-muted-foreground">
              Listen to your documents anywhere, on any device. Perfect for commutes, workouts, or simply resting your eyes.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm hover:scale-105 transition-transform">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-headline text-xl font-semibold mb-2">Peak Efficiency</h3>
            <p className="text-muted-foreground">
              Absorb information faster through listening. Our AI summaries provide key insights instantly, saving you valuable time.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm hover:scale-105 transition-transform">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Wand2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-headline text-xl font-semibold mb-2">Elegant Simplicity</h3>
            <p className="text-muted-foreground">
              Our clean, intuitive interface makes converting documents a breeze. No complicated steps, just upload and listen.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl font-bold tracking-tight">Connect With Us</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are building IsabiRead with our community. Your feedback makes us better.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col hover:bg-muted/50 transition-colors text-left">
                <CardHeader className="flex-grow">
                    <div className="flex items-center gap-4">
                        <Bug className="h-6 w-6 text-destructive" />
                        <CardTitle className="font-medium text-base">Report a Bug</CardTitle>
                    </div>
                    <CardDescription className="text-sm pt-2">Encountered an issue? Your feedback is crucial for improving IsabiRead. We're here to help.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline" className="w-full">
                        <a href="mailto:read@isabi.cloud?subject=Bug Report">Contact Support</a>
                    </Button>
                </CardContent>
            </Card>

            <Card className="flex flex-col hover:bg-muted/50 transition-colors text-left">
                <CardHeader className="flex-grow">
                    <div className="flex items-center gap-4">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        <CardTitle className="font-medium text-base">Share a Suggestion</CardTitle>
                    </div>
                    <CardDescription className="text-sm pt-2">Have a great idea for a new feature? We would love to hear your thoughts and suggestions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline" className="w-full">
                        <a href="mailto:read@isabi.cloud?subject=Feature Suggestion">Share Feedback</a>
                    </Button>
                </CardContent>
            </Card>
            
            <Card className="flex flex-col hover:bg-muted/50 transition-colors text-left">
                <CardHeader className="flex-grow">
                    <div className="flex items-center gap-4">
                        <Users className="h-6 w-6 text-chart-2" />
                        <CardTitle className="font-medium text-base">Join Our Community</CardTitle>
                    </div>
                    <CardDescription className="text-sm pt-2">Connect with other users, share tips, and be the first to know about new updates.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline" className="w-full">
                        <a href="mailto:read@isabi.cloud?subject=Community Inquiry">Join Now</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </section>

    </div>
  );
}
