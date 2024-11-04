import mysql from "mysql2/promise";

let db;

try {
  db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "job_board_db",
  });
} catch (error) {
  console.log(error);
}

export default db;
