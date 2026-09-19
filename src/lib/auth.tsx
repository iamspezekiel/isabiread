
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, sendPasswordResetEmail, updatePassword, signInWithPopup } from "firebase/auth";
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { Preloader } from '@/components/Preloader';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string, redirectTo?: string) => Promise<void>;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, redirectTo?: string) => {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured.");
    await signInWithEmailAndPassword(auth, email, password);
    router.push(redirectTo || '/dashboard');
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string, redirectTo?: string) => {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`
    });
    // Force a reload of the user to get the new displayName
    await userCredential.user.reload();
    const updatedUser = auth.currentUser;
    setUser(updatedUser); // Manually update state to reflect displayName immediately
    router.push(redirectTo || '/dashboard');
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured.");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push(redirectTo || '/dashboard');
  };
  
  const sendPasswordReset = async (email: string) => {
    if (!isFirebaseConfigured || !auth) throw new Error("Firebase not configured.");
    await sendPasswordResetEmail(auth, email);
  };
  
  const updateUserProfile = async (displayName: string) => {
    if (!auth?.currentUser) throw new Error("User not authenticated.");
    await updateProfile(auth.currentUser, { displayName });
    // Force a reload of the user to get the new displayName
    await auth.currentUser.reload();
    setUser(auth.currentUser); // Manually update state
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!auth?.currentUser) throw new Error("User not authenticated.");
    await updatePassword(auth.currentUser, newPassword);
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) return;
    await firebaseSignOut(auth);
    router.push('/login');
  };

  const value = { user, loading, login, signup, signInWithGoogle, logout, sendPasswordReset, isFirebaseConfigured, updateUserProfile, updateUserPassword };
  
  if (loading) {
    return <Preloader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
