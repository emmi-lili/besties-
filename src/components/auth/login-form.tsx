"use client"

import { useAction } from "next-safe-action/hooks"
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { loginAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const { execute, result, isPending, hasErrored } = useAction(loginAction)

  const fieldErrors = result.validationErrors
  const emailError =
    fieldErrors &&
    "email" in fieldErrors &&
    fieldErrors.email &&
    "_errors" in fieldErrors.email
      ? fieldErrors.email._errors?.[0]
      : undefined

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        execute({
          email: String(fd.get("email") ?? ""),
          password: String(fd.get("password") ?? ""),
        })
      }}
    >
      <div className="animate-fade-in-up space-y-2">
        <Label htmlFor="email" className="flex items-center gap-1.5">
          <Mail className="size-3.5 text-muted-foreground" />
          Correo
        </Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@email.com"
            className={cn(
              "h-12 pl-4 pr-4 transition-all duration-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              emailError && "border-destructive ring-2 ring-destructive/20",
            )}
            aria-invalid={Boolean(emailError)}
          />
        </div>
        {emailError ? (
          <p className="flex items-center gap-1.5 text-label-sm text-destructive animate-fade-in" role="alert">
            <AlertCircle className="size-3.5" />
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="animate-fade-in-up stagger-1 space-y-2">
        <Label htmlFor="password" className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-muted-foreground" />
          Contraseña
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {hasErrored && result.serverError ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 animate-fade-in" role="alert">
          <AlertCircle className="size-4 shrink-0 text-destructive mt-0.5" />
          <p className="text-label-sm text-destructive">{result.serverError}</p>
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="animate-fade-in-up stagger-2 group h-12 w-full gap-2 shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Entrando…
          </>
        ) : (
          <>
            Entrar
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>
    </form>
  )
}
