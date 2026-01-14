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

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

console.log("DB CONFIG:", {
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  port: process.env.DB_PORT || process.env.MYSQLPORT,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
});

export default pool;
