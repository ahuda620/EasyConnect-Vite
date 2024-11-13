import express from "express";
import { getJobListings } from "../controllers/jobController.js";
import { getJobDetails } from "../controllers/jobController.js";

export const router = express.Router();

//These are routes for MOCK DATA
router.get("/", getJobListings);
router.get("/fetchJobDetails", getJobDetails);
