require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); 
const fs = require('fs/promises'); 
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');
const routes = require('./routes');
const { initRedis } = require('./utils/cache');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.send({ backend: "ok", db: "connected", rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "1234";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'skill_portal';
// const DB_INIT_SCRIPT = './db/init.sql'; // Path to SQL initialization script

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      multipleStatements: true 
    });
    console.log('MySQL connected');

    // Here Read and execute the database initialization script
    const initSql = await fs.readFile(DB_INIT_SCRIPT, 'utf8');
    await connection.query(initSql);
    console.log('Database schema initialized or updated.');

    return connection;
  } catch (err) {
    console.error('MySQL connection failed or schema initialization failed', err);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await connectToDatabase();
    await initRedis();
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

startServer();
