"use client"

import { GalleryVerticalEnd, ShieldAlert } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { OWNER_EMAIL } from "@/lib/briefing/types"
import { ThemeToggle } from "./theme-toggle"

// Page frame from shadcn login-03.
function GateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/briefing/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          BonusThoughts
        </a>
        {children}
      </div>
    </div>
  )
}

export function LoadingGate() {
  return (
    <GateFrame>
      <Card aria-busy="true">
        <CardHeader className="items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    </GateFrame>
  )
}

export function SignInGate({ onSignIn, error }: { onSignIn: () => void; error?: string }) {
  return (
    <GateFrame>
      <LoginForm onGoogle={onSignIn} error={error} />
    </GateFrame>
  )
}

export function DeniedGate({ email, onRetry }: { email: string; onRetry: () => void }) {
  return (
    <GateFrame>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="bg-destructive/10 text-destructive mb-1 flex size-10 items-center justify-center rounded-full">
              <ShieldAlert className="size-5" />
            </div>
            <CardTitle className="text-xl">Access denied</CardTitle>
            <CardDescription>
              <span className="text-foreground font-medium">{email}</span> isn&apos;t allowed to read this briefing.
              You&apos;ve been signed out.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert>
              <AlertTitle>Owner only</AlertTitle>
              <AlertDescription>
                Sign in with {OWNER_EMAIL}. No briefing data was loaded for this account.
              </AlertDescription>
            </Alert>
            <Button onClick={onRetry}>Try a different account</Button>
          </CardContent>
        </Card>
      </div>
    </GateFrame>
  )
}
