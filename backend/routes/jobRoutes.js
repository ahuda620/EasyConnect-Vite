import express from "express";
import { getJobListings } from "../controllers/jobController.js";

export const router = express.Router();

router.get("/", getJobListings);
