import express from "express";
import { getUserSkills } from "../controllers/userController.js";
import { updateUserSkills } from "../controllers/userController.js";

export const router = express.Router();

router.get("/:userId/getSkills", getUserSkills);
router.patch("/:userId/updateSkills", updateUserSkills);
