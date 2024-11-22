import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLPASSWORD:", process.env.MYSQLPASSWORD);
console.log("MYSQL_DATABASE:", process.env.MYSQL_DATABASE);
console.log("MYSQLPORT:", process.env.MYSQLPORT);

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
