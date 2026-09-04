import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_DAYS,
} from "@/lib/constants"

export type Session = {
  userId: string
}

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET debe estar definido en .env.local (mínimo 16 caracteres).",
    )
  }
  return new TextEncoder().encode(secret)
}

function maxAgeSeconds() {
  return SESSION_MAX_AGE_DAYS * 24 * 60 * 60
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    })
    const userId = payload.sub
    if (!userId || typeof userId !== "string") return null
    return { userId }
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_DAYS}d`)
    .sign(getSecretKey())

  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds(),
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
