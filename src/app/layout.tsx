
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import NextTopLoader from 'nextjs-toploader';
import TawkToWidget from '@/components/TawkToWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://read.isabi.cloud'),
  title: {
    default: 'IsabiRead AI - Convert PDF to Audiobook Instantly',
    template: '%s | IsabiRead AI',
  },
  description: 'Effortlessly convert PDF documents, articles, and e-books into high-quality, natural-sounding audiobooks with AI. Listen on the go and learn faster with IsabiRead.',
  keywords: ['pdf to audiobook', 'text to speech', 'ai audio converter', 'pdf reader', 'document to audio', 'tts', 'listen to pdf', 'isabiread'],
  manifest: '/manifest.json',
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: 'IsabiRead AI - Convert PDF to Audiobook Instantly',
    description: 'Effortlessly convert PDF documents, articles, and e-books into high-quality, natural-sounding audiobooks with AI.',
    url: 'https://read.isabi.cloud',
    siteName: 'IsabiRead AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'IsabiRead AI - Convert PDF to Audiobook Instantly',
    description: 'Effortlessly convert PDF documents, articles, and e-books into high-quality, natural-sounding audiobooks with AI.',
  },
};

export const viewport: Viewport = {
  themeColor: '#f4efe4',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background" suppressHydrationWarning>
        <div
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html:
              "\n<!-- IsabiRead direction contract. Seed key: 06012d58.\nTHESIS: IsabiRead turns a PDF into a mixtape you press play on, refusing the generic AI-voice hero.\nOWN-WORLD: warm paper ground, ink type, record-red for every action, deck-chrome charcoal for the player; tracklists and SIDE A/B as structure, tape counter and REC states.\nSTORY: a visitor drops in a PDF, hits REC, and hears it read back in a natural voice; listening to documents feels real, personal, and local.\nFIRST VIEWPORT: a headline over a working cassette deck - drop zone, voice select, red REC, live counter - beside a sample J-card tracklist.\nFORM: mixtape/cassette direction, grounded position 4, seed key 06012d58.\nFINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->\n",
          }}
        />
        <NextTopLoader
          color="hsl(var(--primary))"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
        />
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
          <TawkToWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
