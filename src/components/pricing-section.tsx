"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Lock } from "lucide-react";
import { createCheckoutSession } from "@/app/actions";

const FREE_FEATURES = [
  "Up to 10 conversions per day",
  "Convert files up to 25MB each",
  "Merge, split, and compress PDFs",
  "Upload up to 10 files at once",
];

const PRO_FEATURES = [
  "Unlimited conversions",
  "Larger file size limits",
  "Priority processing",
  "Advanced compression",
  "OCR text extraction",
  "All PDF tools included",
];

export function PricingSection() {
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setBusy(true);
    try {
      const result = await createCheckoutSession();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast({
          variant: "destructive",
          title: "Checkout unavailable",
          description: result.error || "Stripe is not configured on this deployment.",
        });
      }
    } catch {
      toast({ variant: "destructive", title: "Checkout unavailable", description: "Please try again later." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">Simple, Fair Pricing</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Start free — no credit card required. Upgrade for unlimited conversions and every PDF tool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-headline">Free</CardTitle>
              <Badge variant="secondary">Current plan</Badge>
            </div>
            <CardDescription>For occasional quick conversions.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-4xl font-bold mb-4">
              $0<span className="text-base font-normal text-muted-foreground"> / forever</span>
            </p>
            <ul className="space-y-2 text-sm">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/#tools">Start Converting</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-headline">Pro</CardTitle>
              <Badge className="bg-accent text-accent-foreground">Best value</Badge>
            </div>
            <CardDescription>For professionals and power users.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-4xl font-bold mb-4">
              $4.99<span className="text-base font-normal text-muted-foreground"> / month</span>
            </p>
            <ul className="space-y-2 text-sm">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={busy}
              onClick={() => void handleUpgrade()}
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
              {busy ? "Starting checkout..." : "Upgrade to Pro"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}