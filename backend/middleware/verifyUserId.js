import db from "../database/db.js";

export default async function verifyUserId(req, res, next) {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send("No user id supplied");
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).send("User id was not found");
    }

    next();
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).send("Internal database error");
  }
}
