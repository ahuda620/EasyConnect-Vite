import express from "express";
import { body } from "express-validator";
import verifyUserId from "../middleware/verifyUserId.js";
import { getUserSkills } from "../controllers/userController.js";
import { updateUserSkills } from "../controllers/userController.js";
import { saveJobListing } from "../controllers/userController.js";
import { getSavedJobIds } from "../controllers/userController.js";
import { deleteSavedJobId } from "../controllers/userController.js";

export const router = express.Router();

router.use("/:userId", verifyUserId);

router.get("/:userId/getSkills", getUserSkills);
router.patch(
  "/:userId/updateSkills",
  [
    body("skills")
      .exists({ values: "null" })
      .withMessage("Skills field is required")
      .isArray()
      .withMessage("Skills must be an array"),
    body("skills.*")
      .optional()
      .isString()
      .withMessage("Each skill must be a string")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Each skill must only contain letters")
      .escape(),
  ],
  updateUserSkills
);
router.post("/:userId/saveJobListing", saveJobListing);
router.get("/:userId/getSavedJobIds", getSavedJobIds);
router.patch("/:userId/deleteSavedJobId", deleteSavedJobId);
