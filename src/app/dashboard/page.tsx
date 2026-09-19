
"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, Plus, FileText, Trash2, Repeat, Gem, Settings, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp, doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { formatDistanceToNow, differenceInDays, startOfMonth } from "date-fns";

interface AudioFile {
  id: string;
  name: string;
  audioUrl?: string;
  summary: string;
  createdAt: Timestamp;
}

interface Subscription {
  plan: 'Free' | 'Pro';
  renewalDate: Date | null;
}

const FileCardSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-md flex-shrink-0 mt-1" />
                <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [files, setFiles] = useState<AudioFile[]>([]);
  const [fileToDelete, setFileToDelete] = useState<AudioFile | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [subscription, setSubscription] = useState<Subscription>({
    plan: 'Free',
    renewalDate: null,
  });

  useEffect(() => {
    setIsMounted(true);
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user && db) {
      const firestore = db;
      const fetchFiles = async () => {
        setIsFetching(true);
        try {
          const filesRef = collection(firestore, 'files');
          const q = query(filesRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const userFiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AudioFile));
          setFiles(userFiles);

          // Load the user's subscription plan (defaults to Free if not present)
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const plan = data.plan === 'Pro' ? 'Pro' : 'Free';
            const renewal = data.renewalDate?.toDate?.() || null;
            setSubscription({ plan, renewalDate: renewal });
          }
        } catch (error) {
          console.error("Error fetching files:", error);
          toast({
            variant: "destructive",
            title: "Failed to load files",
            description: "Could not retrieve your files. Please try again later.",
          });
        } finally {
          setIsFetching(false);
        }
      };
      fetchFiles();
    }
  }, [user, loading, router, toast]);

  const handleDeleteConfirm = async () => {
    if (!fileToDelete || !user || !db || !storage) return;

    try {
      // Conditionally delete from storage
      if (fileToDelete.audioUrl) {
          try {
              const fileRef = ref(storage, fileToDelete.audioUrl);
              await deleteObject(fileRef);
          } catch (storageError: any) {
              // Ignore 'object-not-found' errors if the file was already deleted
              // or if it was a data URI from a fallback scenario.
              if (storageError.code !== 'storage/object-not-found') {
                  // Re-throw other storage errors
                  throw storageError;
              }
              console.warn("Storage object not found for deletion, proceeding to delete Firestore record.");
          }
      }

      // Delete from firestore
      await deleteDoc(doc(db, "files", fileToDelete.id));

      setFiles(currentFiles => currentFiles.filter(file => file.id !== fileToDelete.id));
      
      toast({
          title: "Record Deleted",
          description: `The record for "${fileToDelete.name}" has been successfully deleted.`,
      });
    } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: "Could not delete the record. Please try again.",
        });
        console.error("Delete error:", error);
    } finally {
        setFileToDelete(null); // Close the dialog
    }
  };

  const openDeleteDialog = (file: AudioFile) => {
    setFileToDelete(file);
  };

  const conversionsThisMonth = files.filter(f => f.createdAt.toDate() >= startOfMonth(new Date())).length;
  const monthlyLimit = subscription.plan === 'Pro' ? Infinity : 10;

  const renderSubscriptionCard = () => {
    if (subscription.plan === 'Pro' && subscription.renewalDate) {
      const daysRemaining = differenceInDays(subscription.renewalDate, new Date());
      return (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro Plan</div>
            <p className="text-xs text-muted-foreground">
              Renews in {daysRemaining > 0 ? `${daysRemaining} days` : 'today'}
            </p>
          </CardContent>
        </Card>
      );
    }

    // Default to Free plan
    return (
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-lg font-bold">Free Plan</div>
            <Button size="sm" className="mt-2 w-full" asChild>
                <Link href="/pricing">Upgrade to Pro</Link>
            </Button>
        </CardContent>
      </Card>
    );
  };

  if (isFetching) {
    return (
      <div className="space-y-8">
        <Card className="mb-8">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
            <div className="flex-grow space-y-2 text-center sm:text-left w-full">
              <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
              <Skeleton className="h-5 w-64 mx-auto sm:mx-0" />
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 mt-4 sm:mt-0">
              <Skeleton className="h-10 w-28" />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">My Audio Files</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FileCardSkeleton />
                <FileCardSkeleton />
                <FileCardSkeleton />
            </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <Card className="mb-8">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 text-3xl flex-shrink-0">
              <AvatarFallback>{(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-3xl font-bold font-headline">{user?.displayName || 'Your Library'}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 mt-4 sm:mt-0">
              <Button asChild variant="outline">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversions
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files.length}</div>
              <p className="text-xs text-muted-foreground">
                All your conversion records.
              </p>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions This Month</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyLimit === Infinity
                  ? conversionsThisMonth
                  : `${conversionsThisMonth} / ${monthlyLimit}`}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on your {subscription.plan} plan.
              </p>
            </CardContent>
          </Card>
          
          {renderSubscriptionCard()}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline">My Conversion History</h2>
          {files.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {files.map((file) => (
                <Card key={file.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                        <FileText className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <CardTitle className="text-lg font-semibold leading-tight">{file.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                              {isMounted ? `Converted ${formatDistanceToNow(file.createdAt.toDate(), { addSuffix: true })}` : 'Loading date...'}
                            </CardDescription>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    {file.audioUrl ? (
                      <audio controls src={file.audioUrl} className="w-full rounded-md">
                          Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="flex items-center justify-center p-3 rounded-md bg-muted text-muted-foreground text-sm text-center">
                          <Info className="mr-2 h-4 w-4 flex-shrink-0" />
                          Audio for this conversion was not saved.
                      </div>
                    )}
                    {file.summary && (
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-sm">View AI Summary</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap text-sm">{file.summary}</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                     <Button variant="outline" asChild disabled={!file.audioUrl}>
                       <a href={file.audioUrl} download={`IsabiRead_${file.name}.wav`}>
                         <Download className="mr-2 h-4 w-4" />
                         Download
                       </a>
                    </Button>
                    <Button variant="destructive" onClick={() => openDeleteDialog(file)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center bg-card">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No conversions yet</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      Convert your first PDF to see its record here.
                  </p>
                  <Button asChild>
                      <Link href="/">
                          <Plus className="mr-2 h-4 w-4" />
                          Convert a PDF
                      </Link>
                  </Button>
              </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!fileToDelete} onOpenChange={(isOpen) => !isOpen && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the record for
              <span className="font-bold"> {fileToDelete?.name} </span>.
               If an audio file was saved for this record, it will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFileToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
