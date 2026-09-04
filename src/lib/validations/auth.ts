import { z } from "zod"

export const emailSchema = z
  .string()
  .trim()
  .email("Usá un correo válido")
  .transform((v) => v.toLowerCase())

export const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/\d/, "Incluí al menos un número")

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Ingresá tu contraseña"),
})
