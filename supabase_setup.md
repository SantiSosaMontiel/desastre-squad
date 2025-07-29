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