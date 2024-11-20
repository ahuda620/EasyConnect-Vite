import { Webhook } from "svix";
import { clerkClient } from "@clerk/express";
import db from "../database/db.js";

export const handleClerkWebHook = async (req, res) => {
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
  let msg;
  try {
    //Verify webhook using Svix
    //Webhook is triggered by Clerk user.created, session.created, user.deleted events
    msg = wh.verify(payload, headers); //var that stores verified request body message

    //Extract eventType from webhook
    const eventType = msg.type;
    const userId = msg.data.id;

    if (eventType === "user.created") {
      //Check if user is in database
      try {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
          userId,
        ]);
        if (rows.length !== 0) {
          console.log(`User ${userId} is already in database.`);
          return res.sendStatus(200); // User already exists
        }
        //Insert user into database
        const firstName = msg.data.first_name || msg.data.username || "Unknown";

        await db.query("INSERT INTO users (id, first_name) VALUES (?, ?)", [
          userId,
          firstName,
        ]);
        console.log(`Inserted ${userId} into database.`);
        return res.sendStatus(201);
      } catch (error) {
        console.error(
          `Error inserting user with ID ${userId} into database: ${error}`
        );
        return res.status(500).send({ error: error.message });
      }
    } else if (eventType === "user.deleted") {
      try {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [
          userId,
        ]);

        if (result.affectedRows > 0) {
          console.log(`User with ID ${userId} deleted from database`);
          return res.sendStatus(200);
        } else {
          console.error(`User with ID ${userId} not found in database`);
          return res.status(404).send("User not found in database");
        }
      } catch (error) {
        console.error("Error deleting user from database:", error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      console.log(`Unhandled event type: ${eventType}`);
      return res.sendStatus(204);
    }
  } catch (error) {
    console.error(`Webhook verification failed: ${error}`);
    return res
      .status(400)
      .json({ message: `Webhook verfication failed: ${error.message}` });
  }
};
