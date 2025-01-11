// Este archivo configura la conexión a la base de datos MySQL utilizando mysql2 con promesas.
// Carga las variables de entorno desde un archivo .env para gestionar de manera segura las credenciales
// de la base de datos y crea un pool de conexiones con las configuraciones necesarias.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
});

export default db;
