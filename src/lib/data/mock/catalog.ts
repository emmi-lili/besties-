import type {
  Insignia,
  Interes,
  PreguntaJuego,
  Prompt,
  Reto,
} from "../types"

export const SEED_INTERESES: Interes[] = [
  { id: "i-cafe", nombre: "Café de especialidad", categoria: "comer", emoji: "☕" },
  { id: "i-brunch", nombre: "Brunch", categoria: "comer", emoji: "🥑" },
  { id: "i-cocina", nombre: "Cocinar juntas", categoria: "comer", emoji: "🍲" },
  { id: "i-mercado", nombre: "Mercados", categoria: "comer", emoji: "🛒" },
  { id: "i-vino", nombre: "Vino y charla", categoria: "salir", emoji: "🍷" },
  { id: "i-bares", nombre: "Bares tranqui", categoria: "salir", emoji: "🍸" },
  { id: "i-conciertos", nombre: "Conciertos", categoria: "salir", emoji: "🎵" },
  { id: "i-bailar", nombre: "Bailar", categoria: "salir", emoji: "💃" },
  { id: "i-cine", nombre: "Cine", categoria: "salir", emoji: "🎬" },
  { id: "i-series", nombre: "Series en casa", categoria: "casa", emoji: "📺" },
  { id: "i-leer", nombre: "Leer", categoria: "casa", emoji: "📚" },
  { id: "i-plantas", nombre: "Plantas", categoria: "casa", emoji: "🪴" },
  { id: "i-boardgames", nombre: "Juegos de mesa", categoria: "casa", emoji: "🎲" },
  { id: "i-caminar", nombre: "Caminar", categoria: "movimiento", emoji: "🚶" },
  { id: "i-yoga", nombre: "Yoga", categoria: "movimiento", emoji: "🧘" },
  { id: "i-correr", nombre: "Correr", categoria: "movimiento", emoji: "🏃" },
  { id: "i-trekking", nombre: "Trekking", categoria: "movimiento", emoji: "🥾" },
  { id: "i-bici", nombre: "Bici", categoria: "movimiento", emoji: "🚲" },
  { id: "i-foto", nombre: "Fotografía", categoria: "creativo", emoji: "📷" },
  { id: "i-pintar", nombre: "Pintar", categoria: "creativo", emoji: "🎨" },
  { id: "i-escribir", nombre: "Escribir", categoria: "creativo", emoji: "✍️" },
  { id: "i-musica", nombre: "Hacer música", categoria: "creativo", emoji: "🎸" },
  { id: "i-podcasts", nombre: "Podcasts", categoria: "nerd", emoji: "🎧" },
  { id: "i-tech", nombre: "Tech", categoria: "nerd", emoji: "💻" },
  { id: "i-astro", nombre: "Astronomía", categoria: "nerd", emoji: "✨" },
  { id: "i-idiomas", nombre: "Idiomas", categoria: "nerd", emoji: "🗣️" },
]

export const SEED_PROMPTS: Prompt[] = [
  { id: "p1", texto: "Mi plan perfecto un domingo es..." },
  { id: "p2", texto: "La última vez que me reí hasta llorar fue porque..." },
  { id: "p3", texto: "Si pudiera mudarme a otro barrio, elegiría..." },
]

/** 15 dilemas base de Esto o Esto (más extras para variedad). */
export const SEED_PREGUNTAS_ESTO: PreguntaJuego[] = [
  {
    id: "ee-01",
    juego: "esto-o-esto",
    texto: "¿Qué te define más?",
    opcionA: "Café a las 7am",
    opcionB: "Vino a las 11pm",
    peso: 2,
  },
  {
    id: "ee-02",
    juego: "esto-o-esto",
    texto: "¿Cómo salís?",
    opcionA: "Plan armado con dos semanas",
    opcionB: "Me escribís y salgo en 20 minutos",
    peso: 3,
  },
  {
    id: "ee-03",
    juego: "esto-o-esto",
    texto: "Cuando una amiga tiene un drama...",
    opcionA: "Escucho toda tu historia",
    opcionB: "Te doy la solución en dos frases",
    peso: 3,
  },
  {
    id: "ee-04",
    juego: "esto-o-esto",
    texto: "¿Cómo preferís hablar?",
    opcionA: "Mensaje de voz de 4 minutos",
    opcionB: "Diez mensajes de texto seguidos",
    peso: 2,
  },
  {
    id: "ee-05",
    juego: "esto-o-esto",
    texto: "Cumpleaños ideal",
    opcionA: "Cumpleaños con 40 personas",
    opcionB: "Cumpleaños con 3",
    peso: 2,
  },
  {
    id: "ee-06",
    juego: "esto-o-esto",
    texto: "Fin de semana",
    opcionA: "Quedarme en pijama todo el sábado",
    opcionB: "Salir aunque esté cansada",
    peso: 2,
  },
  {
    id: "ee-07",
    juego: "esto-o-esto",
    texto: "Vacaciones",
    opcionA: "Playa y no hacer nada",
    opcionB: "Ciudad nueva cada día",
    peso: 1,
  },
  {
    id: "ee-08",
    juego: "esto-o-esto",
    texto: "Conflictos",
    opcionA: "Hablo al toque",
    opcionB: "Necesito un día para pensarlo",
    peso: 3,
  },
  {
    id: "ee-09",
    juego: "esto-o-esto",
    texto: "Redes",
    opcionA: "Stories de todo",
    opcionB: "Casi no publico",
    peso: 1,
  },
  {
    id: "ee-10",
    juego: "esto-o-esto",
    texto: "Dinero entre amigas",
    opcionA: "Dividimos al centavo",
    opcionB: "Esta va por mí, la próxima por vos",
    peso: 2,
  },
  {
    id: "ee-11",
    juego: "esto-o-esto",
    texto: "Mañana libre",
    opcionA: "Gym o caminata",
    opcionB: "Dormir hasta tarde",
    peso: 1,
  },
  {
    id: "ee-12",
    juego: "esto-o-esto",
    texto: "Primera salida juntas",
    opcionA: "Café de una hora",
    opcionB: "Plan largo y ver qué pasa",
    peso: 2,
  },
  {
    id: "ee-13",
    juego: "esto-o-esto",
    texto: "Humor",
    opcionA: "Humor negro siempre",
    opcionB: "Humor suave, sin cringe",
    peso: 2,
  },
  {
    id: "ee-14",
    juego: "esto-o-esto",
    texto: "Música en el auto",
    opcionA: "Playlist armada",
    opcionB: "Lo que salga en la radio",
    peso: 1,
  },
  {
    id: "ee-15",
    juego: "esto-o-esto",
    texto: "Cuando no contesto...",
    opcionA: "Estoy ocupada, no es personal",
    opcionB: "Avisame si te preocupa",
    peso: 2,
  },
]

export const SEED_INSIGNIAS: Insignia[] = [
  {
    id: "ins-primera",
    slug: "primera-partida",
    nombre: "Primera partida",
    descripcion: "Completaste tu primer juego con una match.",
    emoji: "🎲",
    condicion: { juegosCompletados: 1 },
  },
  {
    id: "ins-bingo",
    slug: "primer-bingo",
    nombre: "Bingo completo",
    descripcion: "Cerraste una línea del bingo de amistad.",
    emoji: "🎯",
    condicion: { bingoLineas: 1 },
  },
  {
    id: "ins-tres",
    slug: "tres-matches-jugando",
    nombre: "En racha social",
    descripcion: "Tres matches con partida abierta o jugada.",
    emoji: "🔥",
    condicion: { matchesJugando: 3 },
  },
  {
    id: "ins-detective",
    slug: "detective",
    nombre: "Detective",
    descripcion: "Acertaste la mentira en Dos verdades.",
    emoji: "🕵️",
    condicion: { verdadesAcertadas: 1 },
  },
  {
    id: "ins-retos",
    slug: "cinco-retos",
    nombre: "Cinco retos",
    descripcion: "Completaste cinco retos semanales.",
    emoji: "🏅",
    condicion: { retosCompletados: 5 },
  },
]

export function currentWeekMonday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

export function buildCurrentReto(): Reto {
  return {
    id: "reto-semana-actual",
    titulo: "Audio a una amiga lejana",
    descripcion:
      "Mandale un audio a una amiga que no ves hace meses. Contale algo bueno de tu semana.",
    semana: currentWeekMonday(),
    tipo: "conexion",
  }
}
