-- Amiguis — schema objetivo (contrato para el mock).
-- No se ejecuta en fase 1. Fase 2: aplicar en Supabase.

create extension if not exists citext;
create extension if not exists pgcrypto;

create table users (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  nombre text not null,
  edad int not null check (edad between 18 and 99),
  ciudad text not null,
  barrio text not null,
  bio text not null default '',
  fotos text[] not null default '{}',
  energia_social int not null default 50 check (energia_social between 0 and 100),
  disponibilidad text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table intereses (
  id text primary key,
  nombre text not null,
  categoria text not null,
  emoji text not null
);

create table perfil_intereses (
  profile_id uuid not null references profiles (id) on delete cascade,
  interes_id text not null references intereses (id) on delete cascade,
  primary key (profile_id, interes_id)
);

create table prompts (
  id text primary key,
  texto text not null
);

create table respuestas_prompt (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  prompt_id text not null references prompts (id),
  respuesta text not null
);

create table preguntas_juego (
  id text primary key,
  juego text not null,
  texto text not null,
  opcion_a text not null,
  opcion_b text not null,
  peso int not null default 1
);

create table respuestas_juego (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  pregunta_id text not null references preguntas_juego (id),
  opcion char(1) not null check (opcion in ('a', 'b')),
  created_at timestamptz not null default now(),
  unique (profile_id, pregunta_id)
);

create table swipes (
  id uuid primary key default gen_random_uuid(),
  from_profile uuid not null references profiles (id) on delete cascade,
  to_profile uuid not null references profiles (id) on delete cascade,
  direccion text not null check (direccion in ('pasar', 'quizas', 'jugar')),
  created_at timestamptz not null default now(),
  unique (from_profile, to_profile)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  profile_a uuid not null references profiles (id) on delete cascade,
  profile_b uuid not null references profiles (id) on delete cascade,
  score int not null default 0,
  created_at timestamptz not null default now(),
  estado text not null default 'pendiente_juego',
  check (profile_a < profile_b)
);

create table sesiones_juego (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  juego text not null,
  estado text not null default 'esperando',
  created_at timestamptz not null default now()
);

create table rondas_juego (
  id uuid primary key default gen_random_uuid(),
  sesion_id uuid not null references sesiones_juego (id) on delete cascade,
  orden int not null,
  payload jsonb not null default '{}',
  resultado jsonb
);

create table mensajes (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  sender_profile uuid references profiles (id) on delete set null,
  contenido text not null,
  tipo text not null default 'texto',
  created_at timestamptz not null default now(),
  leido_at timestamptz
);

create table retos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null,
  semana date not null,
  tipo text not null
);

create table retos_usuario (
  id uuid primary key default gen_random_uuid(),
  reto_id uuid not null references retos (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  prueba_url text,
  completado_at timestamptz,
  unique (reto_id, profile_id)
);

create table insignias (
  id text primary key,
  slug text unique not null,
  nombre text not null,
  descripcion text not null,
  emoji text not null,
  condicion jsonb not null default '{}'
);

create table insignias_usuario (
  profile_id uuid not null references profiles (id) on delete cascade,
  insignia_id text not null references insignias (id) on delete cascade,
  ganada_at timestamptz not null default now(),
  primary key (profile_id, insignia_id)
);

create table reportes (
  id uuid primary key default gen_random_uuid(),
  reporter uuid not null references profiles (id) on delete cascade,
  reportado uuid not null references profiles (id) on delete cascade,
  motivo text not null,
  detalle text not null default '',
  created_at timestamptz not null default now()
);

create table bloqueos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  bloqueado_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_id, bloqueado_id)
);

-- RLS policies (fase 2)
-- users: cada usuaria solo SELECT/UPDATE su propio row (auth.uid() = id).
-- profiles: SELECT de perfiles no bloqueados mutuamente; INSERT/UPDATE solo propio.
-- mensajes: SELECT/INSERT solo si el match involucra al profile de auth.uid().
-- matches / sesiones_juego / rondas_juego: solo participantes del match.
-- swipes: INSERT propio; SELECT propio.
-- bloqueos / reportes: INSERT propio; bloqueos SELECT propio.
-- retos: lectura pública autenticada; retos_usuario solo propio en escritura.
-- respuestas_juego / respuestas_prompt: escritura propia; lectura en contexto de match.
