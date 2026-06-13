# 🗄️ Configuración de Supabase para ELO Cache

## 📋 Pasos para configurar Supabase

### 1. Crear cuenta en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

### 2. Crear la tabla de ELOs
1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Ejecuta este código SQL:

```sql
CREATE TABLE aoe_elos_1v1 (
  player_name TEXT PRIMARY KEY,
  elo_value TEXT,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

### 3. Obtener credenciales
1. Ve a **Settings** → **API**
2. Copia la **URL** (Project URL)
3. Copia la **anon key** (Project API keys → anon public)

### 4. Configurar el código
1. Abre el archivo `config.js`
2. Reemplaza los valores:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co', // Tu URL real
    key: 'tu-anon-key-aqui' // Tu anon key real
};
```

## 🚀 Funcionamiento

### ✅ Ventajas:
- **Base de datos real** compartida entre todos los usuarios
- **Actualización automática** cuando los ELOs expiran (24 horas)
- **Sin intervención manual** necesaria
- **Compatible con Netlify**

### 🔄 Flujo:
1. **Usuario abre la página** → Lee ELOs de Supabase
2. **Si ELO es reciente** (< 24h) → Usa el valor de la base de datos
3. **Si ELO está expirado** → Hace scraping y actualiza la base de datos
4. **Todos los usuarios** → Ven los mismos datos actualizados

### 📊 Estructura de datos:
```json
{
  "player_name": "SoLid",
  "elo_value": "1741",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

## 🔧 Troubleshooting

### Error de CORS:
- Verifica que las credenciales sean correctas
- Asegúrate de que la tabla `elos` exista

### Error de permisos:
- En Supabase, ve a **Authentication** → **Policies**
- Asegúrate de que la tabla `aoe_elos_1v1` tenga permisos de lectura/escritura

### Error de conexión:
- Verifica que la URL y key sean correctas
- Revisa la consola del navegador para errores específicos

## 📅 Tablas para el Matchmaking de torneos

El matchmaking (disponibilidad de equipos y partidos confirmados) usa dos tablas.
Ejecutá este SQL en el **SQL Editor** de Supabase una sola vez:

```sql
-- Disponibilidad por equipo: una fila por (torneo, equipo, fecha, franja)
create table if not exists tournament_availability (
  id bigint generated always as identity primary key,
  tournament_id text not null,
  team_id int not null,
  date date not null,
  slot text not null,
  created_at timestamptz default now(),
  unique (tournament_id, team_id, date, slot)
);

alter table tournament_availability enable row level security;

create policy "acceso publico tournament_availability"
on tournament_availability for all to anon
using (true) with check (true);

-- Partidos confirmados
create table if not exists tournament_matches (
  id bigint generated always as identity primary key,
  tournament_id text not null,
  team_a_id int not null,
  team_b_id int not null,
  date date not null,
  slot text not null,
  status text default 'confirmed',
  created_at timestamptz default now()
);

alter table tournament_matches enable row level security;

create policy "acceso publico tournament_matches"
on tournament_matches for all to anon
using (true) with check (true);
```

Franjas horarias (`slot`): `tarde` (15–19), `noche_temprano` (19–22), `noche_tarde` (22–01). 