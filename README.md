# Torneos Malvagol

App web para administrar torneos de fútbol 7: equipos, jugadores, partidos, resultados, tabla general y goleadores.

## Requisitos

- Node.js instalado
- Cuenta en Supabase
- Cuenta en Vercel si quieres publicarla

## Instalación local

```bash
npm install
npm run dev
```

Abre: http://localhost:3000

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. Ve a SQL Editor.
3. Copia y ejecuta el contenido de `supabase/schema.sql`.
4. Crea un archivo `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Publicar en Vercel

1. Sube este proyecto a GitHub.
2. Conecta el repositorio en Vercel.
3. Agrega las variables de entorno.
4. Deploy.

## Módulos incluidos

- Vista pública
- Panel administrador inicial
- Registro de torneos
- Registro de equipos
- Registro de jugadores
- Registro de partidos
- Captura de marcadores
- Tabla general automática
- Tabla de goleadores
