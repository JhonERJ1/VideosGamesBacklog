# 🎮 Backlog de Videojuegos

Aplicación web full-stack para gestionar tu lista de videojuegos: pendientes, en progreso, terminados y abandonados. Con calificación, género, plataforma, horas jugadas y comentarios.

## 🛠️ Stack tecnológico

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Backend:** Node.js + Express.js
- **Base de datos:** MongoDB + Mongoose
- **Otros:** dotenv, cors

## 📋 Funcionalidades

### CRUD completo
- ✅ **Crear** juego con formulario validado
- ✅ **Leer** todos los juegos (vista en tarjetas) y ver detalle
- ✅ **Actualizar** juegos con formulario prellenado
- ✅ **Eliminar** con modal de confirmación

### Funcionalidades adicionales
- 🔍 **Búsqueda en tiempo real** por título
- 🎯 **Filtros** por estado, género y plataforma
- 📊 **Indicadores visuales:** total, pendientes, jugando, terminados, calificación promedio y horas totales
- 🔔 Notificaciones tipo toast
- 📱 Diseño responsive

## 📂 Estructura del proyecto

```
backlog-videojuegos/
├── backend/
│   ├── config/
│   │   └── db.js               # Conexión a MongoDB
│   ├── models/
│   │   └── Juego.js            # Schema de Mongoose
│   ├── routes/
│   │   └── juegos.js           # Rutas del CRUD
│   ├── .env                    # Variables de entorno
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Servidor Express
└── frontend/
    ├── css/
    │   └── styles.css          # Estilos
    ├── js/
    │   └── app.js              # Lógica del cliente
    └── index.html              # Página principal
```

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js (v16 o superior)
- MongoDB instalado y corriendo localmente, **o** una cuenta de MongoDB Atlas

### Pasos

1. **Clona o descarga el proyecto:**

```bash
cd backlog-videojuegos
```

2. **Instala las dependencias del backend:**

```bash
cd backend
npm install
```

3. **Configura las variables de entorno:**

Crea un archivo `.env` en la carpeta `backend/` (o copia el `.env.example`):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/backlog_videojuegos
```

> Si usas **MongoDB Atlas**, reemplaza `MONGODB_URI` con tu cadena de conexión:
> `mongodb+srv://usuario:contraseña@cluster.mongodb.net/backlog_videojuegos`

4. **Inicia MongoDB localmente** (si lo usas en local):

```bash
# Linux/Mac
sudo systemctl start mongod
# Windows: inicia el servicio de MongoDB
```

5. **Ejecuta el servidor:**

```bash
npm start
```

O en modo desarrollo (con recarga automática):

```bash
npm run dev
```

6. **Abre la aplicación:**

Visita `http://localhost:3000` en tu navegador.

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/juegos` | Listar todos los juegos (con filtros opcionales) |
| GET | `/api/juegos/estadisticas` | Obtener estadísticas |
| GET | `/api/juegos/:id` | Obtener un juego por ID |
| POST | `/api/juegos` | Crear un nuevo juego |
| PUT | `/api/juegos/:id` | Actualizar un juego |
| DELETE | `/api/juegos/:id` | Eliminar un juego |

### Filtros del GET /api/juegos
- `?busqueda=zelda` — Busca por título
- `?estado=Jugando` — Filtra por estado
- `?genero=RPG` — Filtra por género
- `?plataforma=PC` — Filtra por plataforma

## 🧩 Modelo de datos (Juego)

```js
{
  titulo: String,           // requerido, 2-100 caracteres
  genero: String,           // requerido, valores predefinidos
  plataforma: String,       // requerido, valores predefinidos
  estado: String,           // Pendiente | Jugando | Terminado | Abandonado
  calificacion: Number,     // 0-10
  horasJugadas: Number,     // >= 0
  comentarios: String,      // máx 500 caracteres
  createdAt: Date,
  updatedAt: Date
}
```

## 📝 Notas

- Todas las validaciones se hacen tanto en el cliente como en el servidor.
- La aplicación usa `fetch` para comunicarse con la API (no se requiere recargar la página).
- Los datos se obtienen siempre desde MongoDB en cada operación.
