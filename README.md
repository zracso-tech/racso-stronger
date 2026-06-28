# RACSO Stronger

App personal de seguimiento de entrenamiento: rutina de hipertrofia de 5 días
(frecuencia 2) + registro diario de cardio y CrossFit + página de progreso.

## Stack
- [Astro](https://astro.build/) + React 19 + Tailwind 4
- [Supabase](https://supabase.com/) (Auth + Postgres con RLS)
- Despliegue en Vercel

## Estructura
```
app/
├── db/schema.sql         # Schema de Supabase (3 tablas + RLS)
├── src/
│   ├── data/routine.ts   # Rutina de 5 días tipada
│   ├── lib/supabase.ts   # Cliente Supabase
│   ├── layouts/          # Layout base
│   ├── components/       # React islands (auth, tracker, cardio, crossfit, progreso)
│   └── pages/            # Astro pages
└── legacy/               # HTML originales (referencia, no se sirve)
```

## Desarrollo local
```sh
npm install
cp .env.example .env   # rellenar con las claves de Supabase
npm run dev
```
Se levanta en `http://localhost:4321` (o `4322` si usas la config de Claude).

## Variables de entorno
- `PUBLIC_SUPABASE_URL` — URL del proyecto Supabase
- `PUBLIC_SUPABASE_ANON_KEY` — clave anon (pública por diseño; lo que protege los datos es el RLS de cada tabla)

## Despliegue (Vercel)
1. Importar el repo en https://vercel.com/new
2. Vercel detecta Astro automáticamente
3. Añadir las dos variables de entorno
4. Deploy

## Esquema de datos
Tres tablas con RLS por `user_id = auth.uid()`:
- `entrenos` — peso registrado por (día, ejercicio, fecha)
- `cardio` — sesiones de bici/cinta con minutos, km, kcal
- `crossfit` — 1 marca por día (sí/no) + nota
