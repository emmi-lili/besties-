"use server"

import { redirect } from "next/navigation"
import {
  returnServerError,
  returnValidationErrors,
} from "next-safe-action"
import { actionClient } from "@/lib/safe-action"
import { loginSchema, registerSchema } from "@/lib/validations/auth"
import { getDataLayer } from "@/lib/data"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import {
  createSession,
  destroySession,
  getSession,
} from "@/lib/auth/session"

export const registerAction = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput }) => {
    const data = getDataLayer()
    const existing = await data.users.findByEmail(parsedInput.email)
    if (existing) {
      returnValidationErrors(registerSchema, {
        email: {
          _errors: ["Ese correo ya tiene cuenta. Iniciá sesión"],
        },
      })
    }

    const passwordHash = await hashPassword(parsedInput.password)
    const user = await data.users.create({
      email: parsedInput.email,
      passwordHash,
    })

    await createSession(user.id)
    redirect("/crear-perfil")
  })

export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput }) => {
    const data = getDataLayer()
    const user = await data.users.findByEmail(parsedInput.email)
    const ok =
      user !== null &&
      (await verifyPassword(parsedInput.password, user.passwordHash))

    if (!ok) {
      returnServerError("Correo o contraseña incorrectos")
    }

    await data.users.touchLastLogin(user.id)
    await createSession(user.id)

    const profile = await data.profiles.getByUserId(user.id)
    if (!profile || !profile.onboardingCompleto) {
      redirect("/crear-perfil")
    }
    redirect("/descubrir")
  })

export const logoutAction = actionClient.action(async () => {
  const session = await getSession()
  if (session) {
    await destroySession()
  }
  redirect("/login")
})
