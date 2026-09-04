"use client"

import { useAction } from "next-safe-action/hooks"
import { loginAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11"
        />
      </div>

      {hasErrored && result.serverError ? (
        <p className="text-caption text-destructive" role="alert">
          {result.serverError}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending}>
        {isPending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  )
}
