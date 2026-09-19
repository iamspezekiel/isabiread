
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/button";
import { CassetteTape, ChevronDown, Menu, Users, Volume2, FlaskConical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useRef, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

// Define the BeforeInstallPromptEvent interface as it's not in standard TS lib yet
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}


export function Header() {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  const handleInstallClick = useCallback(async () => {
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) {
      return;
    }
    promptEvent.prompt();
    await promptEvent.userChoice;
    deferredPromptRef.current = null;
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      deferredPromptRef.current = promptEvent;
      
      toast({
        title: "Install IsabiRead AI",
        description: "For the best experience, add our app to your home screen.",
        action: (
          <ToastAction altText="Install App" onClick={handleInstallClick}>
            Install
          </ToastAction>
        ),
        duration: 30000,
      });
    };

    const handleAppInstalled = () => {
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast, handleInstallClick]);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <CassetteTape className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">
            IsabiRead AI
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <DropdownMenu open={isProductsMenuOpen} onOpenChange={setIsProductsMenuOpen}>
            <DropdownMenuTrigger
              onMouseEnter={() => setIsProductsMenuOpen(true)}
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
            >
              Products <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64"
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
                <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-start gap-3">
                        <CassetteTape className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold">PDF to Audio</p>
                            <p className="text-xs text-muted-foreground">Convert documents into audiobooks.</p>
                        </div>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/text-to-speech" className="flex items-start gap-3">
                        <Volume2 className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold">Text to Speech</p>
                            <p className="text-xs text-muted-foreground">Turn any written text into audio.</p>
                        </div>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/multi-speaker" className="flex items-start gap-3">
                         <Users className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold">Multi-Speaker TTS</p>
                            <p className="text-xs text-muted-foreground">Create dialogue with multiple voices.</p>
                        </div>
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/voice-lab" className="flex items-start gap-3">
                         <FlaskConical className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold">Voice Lab</p>
                            <p className="text-xs text-muted-foreground">Clone your voice with AI.</p>
                        </div>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">About</Link>
          <Link href="/pricing" className="text-muted-foreground transition-colors hover:text-primary">Pricing</Link>
          <Link href="/support" className="text-muted-foreground transition-colors hover:text-primary">Support</Link>
          
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium mt-6">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <CassetteTape className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold text-foreground">
                      IsabiRead AI
                    </span>
                  </Link>
                </SheetClose>
                 <SheetClose asChild>
                  <Link href="/" className="text-muted-foreground hover:text-foreground">PDF to Audio</Link>
                </SheetClose>
                 <SheetClose asChild>
                  <Link href="/text-to-speech" className="text-muted-foreground hover:text-foreground">Text to Speech</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/multi-speaker" className="text-muted-foreground hover:text-foreground">Multi-Speaker</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/voice-lab" className="text-muted-foreground hover:text-foreground">Voice Lab</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/support" className="text-muted-foreground hover:text-foreground">Support</Link>
                </SheetClose>
                
                <div className="border-t pt-6 mt-4 space-y-4">
                  {loading ? (
                      <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
                  ) : user ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">Dashboard</Link>
                      </SheetClose>
                      <Button onClick={() => { logout(); }} className="w-full">Logout</Button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/login" className="block text-muted-foreground hover:text-foreground">Login</Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="w-full"><Link href="/signup">Sign Up</Link></Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
