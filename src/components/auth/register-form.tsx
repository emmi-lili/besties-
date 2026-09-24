"use client"

import Link from "next/link"
import { useAction } from "next-safe-action/hooks"
import { useMemo, useState } from "react"
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
  Shield,
} from "lucide-react"
import { registerAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPasswordStrength } from "@/lib/auth/password-strength"
import { cn } from "@/lib/utils"

export function RegisterForm() {
  const [password, setPassword] = useState("")
  const strength = useMemo(() => getPasswordStrength(password), [password])

  const { execute, result, isPending, hasErrored } = useAction(registerAction)

  const fieldErrors = result.validationErrors
  const emailError =
    fieldErrors &&
    "email" in fieldErrors &&
    fieldErrors.email &&
    "_errors" in fieldErrors.email
      ? fieldErrors.email._errors?.[0]
      : undefined
  const passwordError =
    fieldErrors &&
    "password" in fieldErrors &&
    fieldErrors.password &&
    "_errors" in fieldErrors.password
      ? fieldErrors.password._errors?.[0]
      : undefined
  const confirmError =
    fieldErrors &&
    "confirmPassword" in fieldErrors &&
    fieldErrors.confirmPassword &&
    "_errors" in fieldErrors.confirmPassword
      ? fieldErrors.confirmPassword._errors?.[0]
      : undefined

  const emailTaken = emailError?.includes("ya tiene cuenta")

  const strengthColors = {
    1: "bg-destructive",
    2: "bg-accent-gold",
    3: "bg-secondary",
    4: "bg-secondary",
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        execute({
          email: String(fd.get("email") ?? ""),
          password: String(fd.get("password") ?? ""),
          confirmPassword: String(fd.get("confirmPassword") ?? ""),
        })
      }}
    >
      <div className="animate-fade-in-up space-y-2">
        <Label htmlFor="email" className="flex items-center gap-1.5">
          <Mail className="size-3.5 text-muted-foreground" />
          Correo
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          className={cn(
            "h-12 transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            emailError && "border-destructive ring-2 ring-destructive/20",
          )}
          aria-invalid={Boolean(emailError)}
        />
        {emailError ? (
          <p className="flex items-center gap-1.5 text-label-sm text-destructive animate-fade-in" role="alert">
            <AlertCircle className="size-3.5 shrink-0" />
            {emailError}
            {emailTaken ? (
              <>
                {" "}
                <Link
                  href="/login"
                  className="underline underline-offset-2 hover:text-destructive/80"
                >
                  Iniciá sesión
                </Link>
              </>
            ) : null}
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
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className={cn(
            "h-12 transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            passwordError && "border-destructive ring-2 ring-destructive/20",
          )}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(passwordError)}
        />
        {password ? (
          <div className="space-y-2 animate-fade-in" aria-live="polite">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    strength.score >= step
                      ? strengthColors[step as keyof typeof strengthColors]
                      : "bg-surface-container-high",
                  )}
                />
              ))}
            </div>
            {strength.label ? (
              <div className="flex items-center gap-1.5">
                <Shield
                  className={cn(
                    "size-3.5 transition-colors",
                    strength.score <= 1
                      ? "text-destructive"
                      : strength.score === 2
                        ? "text-accent-gold"
                        : "text-secondary",
                  )}
                />
                <p className="text-label-sm text-muted-foreground">
                  Fuerza:{" "}
                  <span
                    className={cn(
                      "font-medium",
                      strength.score <= 1
                        ? "text-destructive"
                        : strength.score === 2
                          ? "text-accent-gold"
                          : "text-secondary",
                    )}
                  >
                    {strength.label}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
        {passwordError ? (
          <p className="flex items-center gap-1.5 text-label-sm text-destructive animate-fade-in" role="alert">
            <AlertCircle className="size-3.5" />
            {passwordError}
          </p>
        ) : (
          <p className="flex items-center gap-1 text-label-sm text-muted-foreground">
            <KeyRound className="size-3" />
            Mínimo 8 caracteres y un número.
          </p>
        )}
      </div>

      <div className="animate-fade-in-up stagger-2 space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-1.5">
          <Check className="size-3.5 text-muted-foreground" />
          Confirmá la contraseña
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className={cn(
            "h-12 transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            confirmError && "border-destructive ring-2 ring-destructive/20",
          )}
          aria-invalid={Boolean(confirmError)}
        />
        {confirmError ? (
          <p className="flex items-center gap-1.5 text-label-sm text-destructive animate-fade-in" role="alert">
            <AlertCircle className="size-3.5" />
            {confirmError}
          </p>
        ) : null}
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
        className="animate-fade-in-up stagger-3 group h-12 w-full gap-2 shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creando cuenta…
          </>
        ) : (
          <>
            Crear cuenta
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>
    </form>
  )
}
