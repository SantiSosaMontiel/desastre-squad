# Desastre Squad - Estadísticas del Equipo

Una aplicación web simple para gestionar las estadísticas de tu equipo de Age of Empires 2 "Desastre Squad".

## 🚀 Cómo usar

### Opción 1: Servidor Local (Recomendado)
1. **Ejecutar el servidor**: `python server.py`
2. **Se abrirá automáticamente** en tu navegador
3. **Funciona completamente** con carga automática de datos

### Opción 2: Archivo Directo
1. **Abrir la aplicación**: Simplemente abre el archivo `index.html` en tu navegador web
2. **Limitaciones**: No carga automáticamente el JSON (restricciones del navegador)
3. **Usar "Cargar Datos"** para cargar manualmente el archivo JSON

## 📊 Características

### Estadísticas incluidas (escala 1-10):
- **Micro**: Control de unidades y batallas
- **Balance Económico**: Gestión de recursos y economía
- **Agresividad**: Estilo de juego ofensivo
- **Adaptabilidad**: Flexibilidad en diferentes situaciones
- **Estrategia**: Planificación y táctica
- **Juego en Equipo**: Coordinación con el equipo
- **Mentalidad**: Estado mental y enfoque
- **Conocimiento de Mapas**: Familiaridad con diferentes mapas

### Información adicional:
- **Nombre del jugador**
- **Posición en el equipo**
- **Civilización preferida**
- **Notas adicionales**
- **Foto del jugador** (archivo con nombre del jugador)

## 🎯 Funcionalidades

### Gráfico de Radar
- Visualización interactiva de las 8 estadísticas
- Se actualiza en tiempo real al mover los sliders
- Área sombreada que muestra el perfil completo del jugador

### Gestión de Jugadores
- **Agregar jugador**: Crea nuevas tarjetas de jugador
- **Eliminar jugador**: Borra jugadores (mínimo 1 jugador)
- **Editar datos**: Todos los campos son editables

### Guardado y Carga
- **Guardar datos**: Descarga un archivo JSON con toda la información
- **Cargar datos**: Importa datos guardados previamente
- **Fotos**: Usa archivos de imagen con el nombre del jugador

## 🎮 Personalización

### Cambiar estadísticas
Si quieres modificar las estadísticas, edita el archivo `index.html`:
1. Busca la sección `stats-inputs`
2. Cambia las etiquetas y los `data-stat` de los sliders
3. Actualiza el archivo `script.js` en la función `getDisplayName()`

### Cambiar colores
Edita el archivo `styles.css` para personalizar los colores del tema.

## 📱 Responsive
La aplicación funciona perfectamente en:
- Computadoras de escritorio
- Tablets
- Teléfonos móviles

## 🔧 Estructura de archivos

```
age/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad JavaScript
├── README.md           # Este archivo
├── placeholder-avatar.svg  # Imagen por defecto
└── photos/             # Carpeta para fotos de jugadores
    ├── Herno.jpg       # Foto de Herno
    ├── TheRazor.jpg    # Foto de TheRazor
    └── ...             # Más fotos
```

## 💾 Formato de datos

Los datos se guardan en formato JSON con esta estructura:

```json
{
  "players": [
    {
      "name": "TheRazor",
      "position": "Polifuncional",
      "civilization": "Francos",
      "notes": "Jugador versátil con buen macro y micro",
      "stats": {
        "micro": 7,
        "balance": 8,
        "agresividad": 6,
        "adaptabilidad": 8,
        "estrategia": 7,
        "equipo": 9,
        "mentalidad": 8,
        "mapas": 9
      }
    }
  ]
}
```

## 🎯 Consejos de uso

1. **Evaluación honesta**: Usa la escala 1-10 de manera realista
2. **Comparación**: Usa los gráficos para comparar fortalezas entre jugadores
3. **Actualización**: Revisa y actualiza las estadísticas regularmente
4. **Backup**: Guarda tus datos frecuentemente

## 🚀 ¡Listo para usar!

1. **Abre `index.html`** en tu navegador
2. **¡Listo!** La aplicación cargará automáticamente todos los jugadores del equipo
3. **Personaliza las estadísticas**: Ajusta las estadísticas de cada jugador según sus fortalezas
4. **Agrega fotos**: Coloca archivos de imagen en la carpeta `photos/` con el nombre del jugador
5. **Guarda tus cambios**: Usa "Guardar Datos" para mantener tu progreso

**Nota**: Si quieres cargar datos personalizados, usa el botón "Cargar Datos"

## 📸 **Fotos de Jugadores**

Para agregar fotos a los jugadores:
1. **Crea archivos de imagen** con el nombre exacto del jugador
2. **Guarda las imágenes** en la carpeta `photos/`
3. **Formato**: `photos/NombreDelJugador.jpg`
4. **Ejemplo**: `photos/Herno.jpg`, `photos/TheRazor.jpg`

**Formatos soportados**: JPG, PNG, GIF, WebP

**Nota**: Si no existe la foto del jugador, se mostrará el placeholder por defecto.

### Jugadores del equipo Desastre Squad:
- sszafranko (Nomad Player)
- Lugut
- SoLid
- Jonny
- RELP
- Reymon
- Danny
- Ze Pequeño
- Lauri
- Herno
- Eze
- Anakin
- Chetti
- TheRazor
- Pepe
- Fran Camet
- Nachorga
- Marco Van Basten
- Nasper
- Alejo Camet
- War Machine
- Dylan
- Patocuesta
- ThePipi

---

**¡Que ganes muchos torneos con tu equipo! 🏆** 