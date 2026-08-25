import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    // El contenedor de MySQL (imagen oficial mysql:8.0) usa UTC como su
    // reloj interno, sin importar la zona horaria del sistema donde corre
    // Node. Sin esta opción, mysql2 asume que las fechas que llegan de la
    // base de datos ya están en la hora local del servidor Node y NO las
    // convierte, provocando un desfase (p. ej. mostrar "25/8" y una hora
    // adelantada cuando en realidad es "24/8"). 'Z' le indica a mysql2 que
    // interprete esos valores como UTC, para que se conviertan
    // correctamente a la hora local de quien los vea en el navegador.
    timezone: 'Z',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Verifica la conexión a la base de datos. Se utiliza al arrancar el
 * servidor para informar en consola si la conexión fue exitosa o no,
 * sin detener el proceso (el servidor sigue disponible para reintentar).
 */
export const checkDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        console.log(`Conexión a la base de datos exitosa`);
        return true;
    } catch (error) {
        console.error('No fue posible conectar a la base de datos.');
        console.error(`   Motivo: ${error.message}`);
    }
};

export default pool;