
"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const pricingTiers = [
  {
    name: "Free",
    prices: {
      USD: { display: "$0", amount: 0 },
      NGN: { display: "₦0", amount: 0 },
    },
    period: "/ month",
    description: "For individuals and small projects. Get started for free.",
    features: [
      "Up to 2MB file size",
      "10 conversions per month",
      "Standard audio quality",
      "Community support",
    ],
    cta: "Get Started",
    ctaLink: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    prices: {
      USD: { display: "$10", amount: 10 },
      NGN: { display: "₦15,000", amount: 15000 },
    },
    period: "/ month",
    description: "For professionals and teams who need more power.",
    features: [
      "Up to 10MB file size",
      "Unlimited conversions",
      "High-quality audio",
      "Email support",
      "Access to API",
    ],
    cta: "Upgrade to Pro",
    ctaLink: "/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    prices: {
      USD: { display: "Custom", amount: 0 },
      NGN: { display: "Custom", amount: 0 },
    },
    period: "",
    description: "For large organizations with custom needs.",
    features: [
      "Custom file size limits",
      "Volume conversions",
      "Premium audio quality & voices",
      "Dedicated support & SLA",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    ctaLink: "mailto:read@isabi.cloud?subject=Sales%20Inquiry",
    popular: false,
  },
];

const PricingPageContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  const proTier = pricingTiers.find(tier => tier.name === 'Pro')!;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  // --- Paystack (NGN) Configuration ---
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || "",
    amount: proTier.prices['NGN'].amount * 100, // Amount in kobo
    currency: 'NGN',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePaystackPayment = usePaystackPayment(paystackConfig);

  const onPaystackSuccess = (reference: any) => {
    toast({
      title: "Payment Successful!",
      description: `Your Pro plan is now active. Transaction reference: ${reference.reference}`,
    });
    // Here you would typically make a server call to update the user's subscription status.
  };

  const onPaystackClose = () => {
    toast({
      variant: "default",
      title: "Payment window closed.",
      description: "You can attempt to upgrade again anytime.",
    });
  };

  const handleNgnUpgrade = () => {
    if (!user) {
      router.push('/signup?redirect=/pricing');
      return;
    }
    if (!paystackConfig.publicKey) {
      console.error("Paystack public key is not set.");
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Payment gateway is not configured. Please contact support.",
      });
      return;
    }
    initializePaystackPayment({onSuccess: onPaystackSuccess, onClose: onPaystackClose});
  };

  return (
      <div className="space-y-8 py-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Pricing Plans
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. Convert your PDFs to audiobooks with ease.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Tabs defaultValue="USD" onValueChange={(value) => setCurrency(value as 'USD' | 'NGN')} className="w-full max-w-xs">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="USD">USD ($)</TabsTrigger>
              <TabsTrigger value="NGN">NGN (₦)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-bold rounded-t-lg -m-px mb-0">
                  Most Popular
                </div>
              )}
              <CardHeader className="flex-grow-0">
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.prices[currency].display}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-chart-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.name === "Pro" ? (
                    <div className="w-full">
                      {currency === 'NGN' && (
                          <Button onClick={handleNgnUpgrade} className="w-full">
                            {tier.cta}
                          </Button>
                      )}
                      {currency === 'USD' &&
                        (!user ? (
                          <Button onClick={() => router.push('/signup?redirect=/pricing')} className="w-full">
                            {tier.cta}
                          </Button>
                        ) : !paypalClientId ? (
                          <Button
                            onClick={() =>
                            toast({
                                variant: 'destructive',
                                title: 'Configuration Error',
                                description: 'PayPal is not configured. Please contact support.',
                            })
                            }
                            className="w-full"
                            disabled
                          >
                            PayPal Unavailable
                          </Button>
                        ) : (
                            <PayPalButtons
                                style={{ layout: 'vertical' }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        intent: "CAPTURE",
                                        purchase_units: [
                                            {
                                                description: "IsabiRead Pro Plan Subscription",
                                                amount: {
                                                    currency_code: "USD",
                                                    value: proTier.prices['USD'].amount.toString(),
                                                },
                                            },
                                        ],
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    const order = await actions.order!.capture();
                                    toast({
                                        title: "Payment Successful!",
                                        description: `Your Pro plan is now active. Transaction ID: ${order.id}`,
                                    });
                                    // Here you would typically make a server call to update the user's subscription status.
                                }}
                                onError={(err) => {
                                    toast({
                                        variant: "destructive",
                                        title: "PayPal Error",
                                        description: "An error occurred during payment. Please try again.",
                                    });
                                    console.error("PayPal Error:", err);
                                }}
                            />
                        )
                      )}
                    </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={tier.ctaLink}>{tier.cta}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
  )
}


export default function PricingPage() {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  
  if (!paypalClientId) {
    return <PricingPageContent />;
  }
  
  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD", "disable-funding": "credit,card" }}>
      <PricingPageContent />
    </PayPalScriptProvider>
  );
}
