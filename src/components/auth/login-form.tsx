"use client"

import { useAction } from "next-safe-action/hooks"
import { enterWithCodeAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const { execute, result, isPending, hasErrored } = useAction(enterWithCodeAction)

  const fieldErrors = result.validationErrors
  const codeError =
    fieldErrors &&
    "code" in fieldErrors &&
    fieldErrors.code &&
    "_errors" in fieldErrors.code
      ? fieldErrors.code._errors?.[0]
      : undefined

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        execute({
          code: String(fd.get("code") ?? ""),
        })
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="code">Código</Label>
        <Input
          id="code"
          name="code"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          required
          maxLength={8}
          className="h-11 tracking-[0.4em]"
          aria-invalid={Boolean(codeError)}
        />
        {codeError ? (
          <p className="text-label-md text-destructive" role="alert">
            {codeError}
          </p>
        ) : null}
      </div>

      {hasErrored && result.serverError ? (
        <p className="text-label-md text-destructive" role="alert">
          {result.serverError}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending}>
        {isPending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  )
}
