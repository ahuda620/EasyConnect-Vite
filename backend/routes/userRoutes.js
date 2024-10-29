import express from "express";
import { getUserSkills } from "../controllers/userController.js";

export const router = express.Router();

router.get(`/:userId/skills`, getUserSkills);
