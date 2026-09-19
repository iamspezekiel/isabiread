
"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const TawkToWidget = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;
  const isLoaded = useRef(false);

  // Hide chat on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (isLoaded.current || !propertyId || !widgetId || isAuthPage) {
      return;
    }

    // Set user data before script loads
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    if (user) {
        (window as any).Tawk_API.visitor = {
            name: user.displayName || 'User',
            email: user.email,
        };
    }
    
    (window as any).Tawk_LoadStart = new Date();

    // Inject the Tawk.to script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
    
    isLoaded.current = true;

    return () => {
      // Basic cleanup, though Tawk.to doesn't provide a clean removal method
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete (window as any).Tawk_API;
      isLoaded.current = false;
    };
  }, [propertyId, widgetId, user, isAuthPage]);


  useEffect(() => {
    // Tawk.to API might not be available immediately
    const tawkAPI = (window as any).Tawk_API;
    if (!tawkAPI || typeof tawkAPI.hideWidget !== 'function') {
      return;
    }
    
    if (isAuthPage) {
        tawkAPI.hideWidget();
    } else {
        tawkAPI.showWidget();
    }
  }, [isAuthPage, pathname]); // Re-run when path changes

  return null;
};

export default TawkToWidget;
