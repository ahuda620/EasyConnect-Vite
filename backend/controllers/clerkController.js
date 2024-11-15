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
    //Webhook is triggered by Clerk user.created and session.created events
    msg = wh.verify(payload, headers); //var that stores verified request body message

    //Extract user_id from webhook
    const userId = msg.data.user_id;

    let user; //var that stores fetched user data from Clerk API
    try {
      //Fetch user data from Clerk API
      user = await clerkClient.users.getUser(userId);
    } catch (error) {
      return res.status(400).send("Invalid webhook signature");
    }

    //Check if user is in database
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);

      if (rows.length === 0) {
        //If user is not in database, insert them in
        try {
          await db.query("INSERT INTO users (id, first_name) VALUES (?, ?)", [
            userId,
            user.firstName,
          ]);
          return res.sendStatus(201);
        } catch (error) {
          console.error("Error inserting new user into database");
          return res.status(500).json({ error: error.message });
        }
      } else {
        //User is already in database
        return res.sendStatus(200);
      }
    } catch (error) {
      console.error("Error checking database:", error);
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Webhook verfication failed: ${error}` });
  }
};
