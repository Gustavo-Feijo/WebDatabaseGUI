import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: './database/credentials.env' });

let connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Listen for the 'error' event
connection.on('error', (err) => {
    console.error('MySQL connection error:', err.message);
});

export default connection;