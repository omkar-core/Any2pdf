"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Chrome, Mail, AlertCircle } from "lucide-react";
import { isFirebaseConfigured, getFirebaseApp } from "@/lib/firebase";

export default function SignInPage() {
  const router = useRouter();
  const configured = isFirebaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finish = (message: string | null) => {
    setBusy(null);
    setError(message);
  };

  const handleGoogle = async () => {
    const app = getFirebaseApp();
    if (!app) {
      finish("Firebase authentication is not configured on this deployment.");
      return;
    }
    setBusy("google");
    setError(null);
    try {
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const auth = getAuth(app);
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
      router.refresh();
    } catch (err) {
      finish(normalizeError(err));
    }
  };

  const handleEmailAuth = async (createIfMissing: boolean) => {
    const app = getFirebaseApp();
    if (!app) {
      finish("Firebase authentication is not configured on this deployment.");
      return;
    }
    if (!email || !password) {
      finish(`Please enter both an email and a password${createIfMissing ? "." : "."}`);
      return;
    }
    setBusy("email");
    setError(null);
    try {
      const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import(
        "firebase/auth"
      );
      const auth = getAuth(app);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        const code = (err as Error & { code?: string }).code;
        if (createIfMissing && (code === "auth/user-not-found" || code === "auth/invalid-credential")) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      finish(normalizeError(err));
    }
  };

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    void handleEmailAuth(false);
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    void handleEmailAuth(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account to access premium features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!configured && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication not configured</AlertTitle>
                <AlertDescription>
                  Add your NEXT_PUBLIC_FIREBASE_* environment variables to enable Google and email sign-in.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!configured || busy !== null}
              onClick={() => void handleGoogle()}
            >
              {busy === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={!configured || busy !== null}>
                    {busy === "email" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={!configured || busy !== null}>
                    {busy === "email" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-center text-muted-foreground">
              By continuing you agree to our{" "}
              <Link href="/terms" className="text-primary underline underline-offset-4">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function normalizeError(err: unknown): string {
  const message = err instanceof Error ? err.message : "Sign-in failed. Please try again.";
  return message.replace(/^Firebase: /, "").replace(/ \(auth\/[a-z-]+\)\.?$/, "");
}