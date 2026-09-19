
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Upload, Headphones, FileText } from "lucide-react";

export default function UserGuidePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          User Guide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome to IsabiRead! Here's a simple guide to get you started on converting your PDFs to audiobooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
    </div>
  );
}
