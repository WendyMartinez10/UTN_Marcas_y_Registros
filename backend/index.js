import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import pool, { checkDbConnection } from './config/db.js';
import { crearSesion } from './config/session.js';
import { errorMiddleware } from './middleware/error.middleware.js';

import usuariosRoutes from './routes/usuarios.routes.js';
import departamentosRoutes from './routes/departamentos.routes.js';
import dispositivosRoutes from './routes/dispositivos.routes.js';
import marcasRoutes from './routes/marcas.routes.js';
import equiposRoutes from './routes/equipos.routes.js';
import prestamosRoutes from './routes/prestamos.routes.js';
import configuracionRoutes from './routes/configuracion.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Asegura que exista la carpeta de subida de imágenes de equipos.
const uploadsDir = process.env.UPLOADS_DIR || 'uploads/equipos';
fs.mkdirSync(uploadsDir, { recursive: true });

// Si el servidor corre detrás de un proxy (producción), confía en él para
// obtener correctamente la IP real del cliente (req.ip) y cookies "secure".
if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(crearSesion(pool));

// Archivos estáticos: imágenes de equipos subidas por el administrador.
app.use('/uploads/equipos', express.static(path.join(__dirname, uploadsDir)));

// Rutas de la API
app.use('/api/auth', usuariosRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/dispositivos', dispositivosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/configuracion', configuracionRoutes);

// Rutas de salud
app.get('/api/ping', (req, res) => {
    res.json({ success: true, data: { message: 'pong' } });
});

app.get('/api/health', async (req, res) => {
    const dbOk = await checkDbConnection();
    res.json({ success: true, data: { server: 'ok', database: dbOk ? 'ok' : 'error' } });
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

// Manejador de errores (siempre al final)
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    checkDbConnection();
});
