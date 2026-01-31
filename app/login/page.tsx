"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/portal");
    } catch (err: any) {
      console.error("Login error:", err);
      // For demo purposes, if user not found, try to register them automatically
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push("/portal");
        } catch (regErr: any) {
          console.error("Registration error:", regErr);
          setError("Authentication failed. Please check your credentials.");
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191919] text-[#F4EDE4] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2e]/30 via-[#191919] to-[#2d5945]/20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
            BonusThoughts
          </h1>
          <p className="text-sm text-[#D4C4B0]">Client Access Portal</p>
        </div>

        <Card className="border-[#F4EDE4]/10 bg-[#F4EDE4]/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[#F4EDE4] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4a7c59]" />
              Secure Login
            </CardTitle>
            <CardDescription className="text-[#D4C4B0]">
              Access your active products and support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-red-400 text-xs p-2 bg-red-900/20 rounded border border-red-900/50">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] text-[#191919] hover:opacity-90"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-xs text-[#D4C4B0]/60">
              Restricted access system. Authorized personnel only.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}