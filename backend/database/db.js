import mysql from "mysql2/promise";

const NODE_ENV = process.env.NODE_ENV || "development";

console.log(`Running in ${NODE_ENV} mode`);

let db;

try {
  db = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} catch (error) {
  console.log(error);
}

export default db;
