// Este archivo configura y ejecuta el servidor Express, estableciendo los middlewares necesarios,
// cargando las rutas desde un archivo centralizado y escuchando en el puerto especificado.

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js'; // Cargar rutas desde el archivo centralizado

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Usar rutas
app.use('/api', routes);

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
