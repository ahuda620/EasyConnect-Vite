import express from "express";
import bodyParser from "body-parser";
import { handleClerkWebHook } from "../controllers/clerkController.js";

export const router = express.Router();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  handleClerkWebHook
);
