import express from "express";
import { getUserSkills } from "../controllers/userController.js";
import { updateUserSkills } from "../controllers/userController.js";
import { saveJobListing } from "../controllers/userController.js";
import { getSavedJobIds } from "../controllers/userController.js";
import { deleteSavedJobId } from "../controllers/userController.js";

export const router = express.Router();

router.get("/:userId/getSkills", getUserSkills);
router.patch("/:userId/updateSkills", updateUserSkills);
router.post("/:userId/saveJobListing", saveJobListing);
router.get("/:userId/getSavedJobIds", getSavedJobIds);
router.patch("/:userId/deleteSavedJobId", deleteSavedJobId);
