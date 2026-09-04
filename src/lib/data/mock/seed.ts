import { nanoid } from "nanoid"
import type {
  DosVerdades,
  MockDatabase,
  Profile,
  RespuestaJuego,
  User,
} from "../types"
import {
  SEED_INSIGNIAS,
  SEED_INTERESES,
  SEED_PREGUNTAS_ESTO,
  SEED_PROMPTS,
  buildCurrentReto,
} from "./catalog"

type SeedProfileSpec = {
  email: string
  nombre: string
  edad: number
  ciudad: string
  barrio: string
  bio: string
  energiaSocial: number
  disponibilidad: Profile["disponibilidad"]
  interesIds: string[]
  dosVerdades: DosVerdades
  /** Índices 0-14 → "a" | "b" para las 15 preguntas Esto o Esto */
  respuestasEsto: Array<"a" | "b">
  fotoHue: number
}

const SPECS: SeedProfileSpec[] = [
  {
    email: "cami@seed.amiguis",
    nombre: "Cami",
    edad: 28,
    ciudad: "La Paz",
    barrio: "Sopocachi",
    bio: "Recién mudada, busco gente para café sin agenda.",
    energiaSocial: 55,
    disponibilidad: ["tardes_semana", "findes"],
    interesIds: ["i-cafe", "i-leer", "i-caminar", "i-podcasts", "i-vino"],
    dosVerdades: {
      frase1: "Viví un año en Buenos Aires sin volver a Bolivia",
      frase2: "Sé hacer pan de masa madre",
      frase3: "Una vez canté en un karaoke de karaoke japonés",
      mentiraIndex: 2,
    },
    respuestasEsto: ["a", "a", "a", "b", "b", "a", "a", "a", "b", "b", "a", "a", "a", "a", "a"],
    fotoHue: 12,
  },
  {
    email: "vale@seed.amiguis",
    nombre: "Vale",
    edad: 32,
    ciudad: "La Paz",
    barrio: "Miraflores",
    bio: "Mamá de una toddler. Necesito adultas que no hablen solo de pijamas.",
    energiaSocial: 35,
    disponibilidad: ["mananas", "findes"],
    interesIds: ["i-brunch", "i-series", "i-yoga", "i-plantas", "i-foto"],
    dosVerdades: {
      frase1: "Corrí una media maratón embarazada de 4 meses",
      frase2: "Colecciono tazas feas de viaje",
      frase3: "Fui DJ en la facultad",
      mentiraIndex: 1,
    },
    respuestasEsto: ["b", "a", "a", "a", "b", "a", "b", "b", "b", "a", "b", "a", "b", "a", "b"],
    fotoHue: 40,
  },
  {
    email: "sof@seed.amiguis",
    nombre: "Sofía",
    edad: 24,
    ciudad: "Santa Cruz",
    barrio: "Equipetrol",
    bio: "Nueva en la ciudad por laburo. Quiero planes espontáneos.",
    energiaSocial: 78,
    disponibilidad: ["noches", "findes"],
    interesIds: ["i-bares", "i-bailar", "i-conciertos", "i-cine", "i-tech"],
    dosVerdades: {
      frase1: "Me mudé con dos valijas y un cactus",
      frase2: "Hablo cuatro idiomas fluído",
      frase3: "Odio el ceviche (perdón)",
      mentiraIndex: 2,
    },
    respuestasEsto: ["b", "b", "b", "a", "a", "b", "b", "a", "a", "b", "a", "b", "a", "b", "a"],
    fotoHue: 200,
  },
  {
    email: "mari@seed.amiguis",
    nombre: "Mari",
    edad: 36,
    ciudad: "Santa Cruz",
    barrio: "Las Palmas",
    bio: "Salí de una relación de 9 años. Reaprendiendo a hacer planes.",
    energiaSocial: 42,
    disponibilidad: ["tardes_semana", "noches"],
    interesIds: ["i-cocina", "i-mercado", "i-leer", "i-boardgames", "i-escribir"],
    dosVerdades: {
      frase1: "Aprendí a nadar a los 30",
      frase2: "Tengo un podcast que nadie escucha",
      frase3: "Nunca vi Titanic",
      mentiraIndex: 3,
    },
    respuestasEsto: ["a", "a", "a", "b", "b", "a", "a", "b", "b", "a", "b", "a", "b", "a", "a"],
    fotoHue: 280,
  },
  {
    email: "lau@seed.amiguis",
    nombre: "Lau",
    edad: 27,
    ciudad: "La Paz",
    barrio: "San Miguel",
    bio: "Diseñadora. Busco gente para trekking y quejas productivas.",
    energiaSocial: 62,
    disponibilidad: ["findes", "mananas"],
    interesIds: ["i-trekking", "i-foto", "i-pintar", "i-cafe", "i-idiomas"],
    dosVerdades: {
      frase1: "Subí el Illimani",
      frase2: "Tatuaje de un mapache en el tobillo",
      frase3: "Gané un concurso de memes en el laburo",
      mentiraIndex: 1,
    },
    respuestasEsto: ["a", "a", "a", "a", "b", "b", "b", "a", "b", "b", "a", "a", "a", "a", "a"],
    fotoHue: 160,
  },
  {
    email: "nati@seed.amiguis",
    nombre: "Nati",
    edad: 30,
    ciudad: "La Paz",
    barrio: "Obrajes",
    bio: "Dev y lectora compulsiva. Mejor de a dos cafés que de a diez personas.",
    energiaSocial: 28,
    disponibilidad: ["tardes_semana", "noches"],
    interesIds: ["i-tech", "i-leer", "i-cafe", "i-podcasts", "i-astro"],
    dosVerdades: {
      frase1: "Programo desde los 14",
      frase2: "Tengo miedo a los perros chicos",
      frase3: "Fui scout hasta los 18",
      mentiraIndex: 2,
    },
    respuestasEsto: ["a", "a", "b", "b", "b", "a", "a", "b", "b", "a", "b", "a", "a", "a", "a"],
    fotoHue: 220,
  },
  {
    email: "andrea@seed.amiguis",
    nombre: "Andrea",
    edad: 34,
    ciudad: "Santa Cruz",
    barrio: "Urubó",
    bio: "Profesora. Quiero amigas para yoga y vino, no necesariamente juntos.",
    energiaSocial: 48,
    disponibilidad: ["mananas", "findes"],
    interesIds: ["i-yoga", "i-vino", "i-series", "i-plantas", "i-musica"],
    dosVerdades: {
      frase1: "Di clases en tres países",
      frase2: "No sé andar en bici",
      frase3: "Cocino mejor que mi mamá (y ella lo admite)",
      mentiraIndex: 3,
    },
    respuestasEsto: ["b", "a", "a", "a", "b", "a", "a", "a", "b", "b", "a", "a", "b", "a", "b"],
    fotoHue: 320,
  },
  {
    email: "pao@seed.amiguis",
    nombre: "Pao",
    edad: 22,
    ciudad: "Santa Cruz",
    barrio: "Centro",
    bio: "Estudiante. Extraño mi círculo de Cochabamba.",
    energiaSocial: 70,
    disponibilidad: ["noches", "findes", "tardes_semana"],
    interesIds: ["i-bailar", "i-cine", "i-brunch", "i-correr", "i-conciertos"],
    dosVerdades: {
      frase1: "Me mudé sola a los 19",
      frase2: "Nunca me corté el pelo yo misma",
      frase3: "Sé el himno de tres clubes de fútbol",
      mentiraIndex: 2,
    },
    respuestasEsto: ["b", "b", "a", "a", "a", "b", "b", "a", "a", "b", "a", "b", "a", "b", "a"],
    fotoHue: 350,
  },
  {
    email: "gaby@seed.amiguis",
    nombre: "Gaby",
    edad: 29,
    ciudad: "La Paz",
    barrio: "Calacoto",
    bio: "Marketing. Quiero menos networking y más risas.",
    energiaSocial: 58,
    disponibilidad: ["noches", "findes"],
    interesIds: ["i-vino", "i-bares", "i-foto", "i-caminar", "i-boardgames"],
    dosVerdades: {
      frase1: "Trabajé en un circo un verano",
      frase2: "Tengo alergia al cilantro",
      frase3: "Sé hacer malabares con pelotas",
      mentiraIndex: 1,
    },
    respuestasEsto: ["b", "b", "a", "b", "a", "b", "a", "a", "a", "b", "b", "b", "a", "a", "a"],
    fotoHue: 25,
  },
  {
    email: "fer@seed.amiguis",
    nombre: "Fer",
    edad: 38,
    ciudad: "La Paz",
    barrio: "Achumani",
    bio: "Dos hijas, un perro, cero paciencia para planes que se cancelan.",
    energiaSocial: 40,
    disponibilidad: ["mananas", "findes"],
    interesIds: ["i-caminar", "i-mercado", "i-leer", "i-yoga", "i-cocina"],
    dosVerdades: {
      frase1: "Empecé a estudiar derecho a los 35",
      frase2: "Nunca usé Instagram",
      frase3: "Mi perro se llama Excel",
      mentiraIndex: 2,
    },
    respuestasEsto: ["a", "a", "a", "b", "b", "a", "a", "a", "b", "a", "a", "a", "b", "a", "a"],
    fotoHue: 90,
  },
  {
    email: "dani@seed.amiguis",
    nombre: "Dani",
    edad: 26,
    ciudad: "Santa Cruz",
    barrio: "Los Pozos",
    bio: "Ilustradora freelance. Ideal: café + dibujar en silencio juntas.",
    energiaSocial: 32,
    disponibilidad: ["tardes_semana", "mananas"],
    interesIds: ["i-pintar", "i-cafe", "i-musica", "i-plantas", "i-escribir"],
    dosVerdades: {
      frase1: "Vendí un dibujo a una marca grande",
      frase2: "No me gusta el chocolate",
      frase3: "Tengo un gato que solo come atún",
      mentiraIndex: 2,
    },
    respuestasEsto: ["a", "a", "a", "b", "b", "a", "b", "b", "b", "a", "b", "a", "a", "a", "b"],
    fotoHue: 140,
  },
  {
    email: "caro@seed.amiguis",
    nombre: "Caro",
    edad: 31,
    ciudad: "Santa Cruz",
    barrio: "Equipetrol",
    bio: "Después del divorce-not-divorce. Quiero amigas, no consejos no pedidos.",
    energiaSocial: 52,
    disponibilidad: ["noches", "findes", "tardes_semana"],
    interesIds: ["i-bailar", "i-vino", "i-trekking", "i-cine", "i-idiomas"],
    dosVerdades: {
      frase1: "Me fui de viaje sola un mes",
      frase2: "Sé tocar el ukelele",
      frase3: "Odio los domingos",
      mentiraIndex: 3,
    },
    respuestasEsto: ["b", "b", "a", "a", "a", "b", "b", "a", "a", "b", "a", "b", "a", "b", "a"],
    fotoHue: 300,
  },
]

/** Placeholder SVG data-URL con iniciales — sin fotos reales en el seed. */
export function placeholderFoto(nombre: string, hue: number): string {
  const initial = encodeURIComponent(nombre.slice(0, 1).toUpperCase())
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
    <rect fill="hsl(${hue} 45% 72%)" width="600" height="750"/>
    <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
      font-family="system-ui,sans-serif" font-size="220" font-weight="700"
      fill="hsl(${hue} 40% 28%)">${initial}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const SEED_PASSWORD_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.qKqJ5Y5Y5Y5Y5Y5Y5Yu" // placeholder; replaced at runtime if needed

export function createEmptyDatabase(): MockDatabase {
  return {
    users: [],
    profiles: [],
    intereses: [...SEED_INTERESES],
    prompts: [...SEED_PROMPTS],
    respuestasPrompt: [],
    preguntasJuego: [...SEED_PREGUNTAS_ESTO],
    respuestasJuego: [],
    swipes: [],
    matches: [],
    sesionesJuego: [],
    rondasJuego: [],
    mensajes: [],
    retos: [buildCurrentReto()],
    retosUsuario: [],
    insignias: [...SEED_INSIGNIAS],
    insigniasUsuario: [],
    reportes: [],
    bloqueos: [],
    amistades: [],
    capsulas: [],
    capsulaAdjuntos: [],
    entradasDiario: [],
    estampillas: [],
    lugares: [],
    hitos: [],
  }
}

export function seed(): MockDatabase {
  const db = createEmptyDatabase()
  const now = new Date().toISOString()

  for (const spec of SPECS) {
    const userId = nanoid()
    const profileId = nanoid()

    const user: User = {
      id: userId,
      email: spec.email,
      passwordHash: SEED_PASSWORD_HASH,
      createdAt: now,
      lastLoginAt: null,
    }

    const profile: Profile = {
      id: profileId,
      userId,
      nombre: spec.nombre,
      edad: spec.edad,
      ciudad: spec.ciudad,
      barrio: spec.barrio,
      bio: spec.bio,
      fotos: [placeholderFoto(spec.nombre, spec.fotoHue)],
      energiaSocial: spec.energiaSocial,
      disponibilidad: spec.disponibilidad,
      interesIds: spec.interesIds,
      dosVerdades: spec.dosVerdades,
      onboardingCompleto: true,
      rachaDias: Math.floor(Math.random() * 5) + 1,
      ultimaActividadAt: now,
      createdAt: now,
    }

    db.users.push(user)
    db.profiles.push(profile)

    const respuestas: RespuestaJuego[] = SEED_PREGUNTAS_ESTO.map((q, idx) => ({
      id: nanoid(),
      profileId,
      preguntaId: q.id,
      opcion: spec.respuestasEsto[idx] ?? "a",
      createdAt: now,
    }))
    db.respuestasJuego.push(...respuestas)
  }

  return db
}
