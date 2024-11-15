import db from "../database/db.js";
import { validationResult } from "express-validator";

export const updateUserSkills = async (req, res) => {
  const { userId } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { skills } = req.body;

  //Validate skills array
  if (!Array.isArray(skills) || skills === undefined || !userId) {
    return res.status(400).send({ error: "Invalid skills format" });
  }

  //update user skills in database
  try {
    const [result] = await db.query(
      "UPDATE users SET skills = ? WHERE id = ?",
      [JSON.stringify(skills), userId]
    );

    return res.status(200).send("Skills updated in database successfully");
  } catch (error) {
    console.error("Error updating user skills in database");
    return res.status(500).send(error.message);
  }
};

export const getUserSkills = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query("SELECT skills FROM users WHERE id = ?", [
      userId,
    ]);

    const skills = JSON.parse(rows[0].skills);

    res.status(200).send(skills);
  } catch (error) {
    console.error("Error fetching user skills in database");
    return res.status(500).send(error.message);
  }
};

export const saveJobListing = async (req, res) => {
  const { userId } = req.params;
  const { jobId } = req.body;

  //validate job id
  if (typeof jobId !== "string") {
    return res.status(400).send({ error: "Invalid job_id format" });
  }

  try {
    // Check the number of saved jobs for the user
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM saved_jobs WHERE user_id = ?",
      [userId]
    );

    if (rows[0].count >= 5) {
      return res.status(400).send("You can only save up to 5 job listings");
    }

    const [result] = await db.query(
      `INSERT INTO saved_jobs (user_id, job_id) 
                                       VALUES (?, ?)
                                       ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP`,
      [userId, jobId]
    );

    if (result.affectedRows === 1) {
      // Affected rows is 1 when a new row is inserted
      return res.status(200).send("Job listing saved in database successfully");
    } else if (result.affectedRows === 2) {
      // Affected rows is 2 when an existing row is updated
      return res.status(200).send("Job listing is already saved");
    }
  } catch (error) {
    console.error("Error saving job listing in database");
    return res.status(500).send(error.message);
  }
};

export const getSavedJobIds = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM saved_jobs WHERE user_id = ?",
      [userId]
    );
    const jobIds = rows.map((row) => row.job_id);

    res.status(200).send(jobIds);
  } catch (error) {
    console.error("Error fetching saved jobs from database");
    return res.status(500).send(error.message);
  }
};

export const deleteSavedJobId = async (req, res) => {
  const { userId } = req.params;
  const { jobId } = req.body;

  try {
    const [result] = await db.query(
      "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?",
      [userId, jobId]
    );

    if (result.affectedRows > 0) {
      return res.status(200).send("Job id deleted from database successfully");
    } else {
      return res
        .status(404)
        .send("No job ID associated with the provided user ID was found");
    }
  } catch (error) {
    console.error("Error deleting job id from database");
    return res.status(500).send(error.message);
  }
};
