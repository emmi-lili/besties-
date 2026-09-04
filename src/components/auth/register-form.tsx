"use client"

import Link from "next/link"
import { useAction } from "next-safe-action/hooks"
import { useMemo, useState } from "react"
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
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11"
          aria-invalid={Boolean(emailError)}
        />
        {emailError ? (
          <p className="text-caption text-destructive" role="alert">
            {emailError}
            {emailTaken ? (
              <>
                {" "}
                <Link href="/login" className="underline underline-offset-2">
                  Iniciá sesión
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="h-11"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(passwordError)}
        />
        {password ? (
          <div className="space-y-1.5" aria-live="polite">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    strength.score >= step
                      ? strength.score <= 1
                        ? "bg-destructive"
                        : strength.score === 2
                          ? "bg-mustard"
                          : "bg-forest"
                      : "bg-border",
                  )}
                />
              ))}
            </div>
            {strength.label ? (
              <p className="text-micro text-muted-foreground">
                Fuerza: {strength.label}
              </p>
            ) : null}
          </div>
        ) : null}
        {passwordError ? (
          <p className="text-caption text-destructive" role="alert">
            {passwordError}
          </p>
        ) : (
          <p className="text-micro text-muted-foreground">
            Mínimo 8 caracteres y un número.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmá la contraseña</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="h-11"
          aria-invalid={Boolean(confirmError)}
        />
        {confirmError ? (
          <p className="text-caption text-destructive" role="alert">
            {confirmError}
          </p>
        ) : null}
      </div>

      {hasErrored && result.serverError ? (
        <p className="text-caption text-destructive" role="alert">
          {result.serverError}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending}>
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  )
}
