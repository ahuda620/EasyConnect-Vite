import mysql from "mysql2/promise";

const NODE_ENV = process.env.NODE_ENV || "development";

console.log(`Running in ${NODE_ENV} mode`);

let db;

try {
  db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
} catch (error) {
  console.log(error);
}

export default db;
