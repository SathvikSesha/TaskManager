// import dotenv from "dotenv";
// import mysql from "mysql2/promise";

// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "127.0.0.1",
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// export default pool;

import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

/* DEBUG LOG – SAFE (no password) */
console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
});

/* OPTIONAL but VERY GOOD: test connection */
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

export default pool;
