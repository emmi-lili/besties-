"use server"

import { redirect } from "next/navigation"
import {
  returnServerError,
  returnValidationErrors,
} from "next-safe-action"
import { actionClient } from "@/lib/safe-action"
import {
  accessCodeSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth"
import { getDataLayer } from "@/lib/data"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import {
  createSession,
  destroySession,
  getSession,
} from "@/lib/auth/session"

const ACCESS_CODE = "1234"
const GATE_EMAIL = "emmi@local.amiguis"

async function ensureGateUser() {
  const data = getDataLayer()
  let user = await data.users.findByEmail(GATE_EMAIL)
  if (!user) {
    user = await data.users.create({
      email: GATE_EMAIL,
      passwordHash: "code-gate",
    })
  }

  const profile = await data.profiles.getByUserId(user.id)
  if (!profile?.onboardingCompleto) {
    await data.profiles.upsert(user.id, {
      nombre: "Emmi",
      edad: 28,
      ciudad: "La Paz",
      barrio: "Sopocachi",
      bio: "",
      fotos: [],
      energiaSocial: 50,
      disponibilidad: ["findes"],
      interesIds: ["i-cafe", "i-leer", "i-caminar"],
      onboardingCompleto: true,
    })
  }

  return user
}

export const enterWithCodeAction = actionClient
  .inputSchema(accessCodeSchema)
  .action(async ({ parsedInput }) => {
    if (parsedInput.code !== ACCESS_CODE) {
      returnServerError("Código incorrecto")
    }

    const data = getDataLayer()
    const user = await ensureGateUser()
    await data.users.touchLastLogin(user.id)
    await createSession(user.id)
    redirect("/descubrir")
  })

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
