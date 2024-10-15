import express from "express";
import {
  fillJoiningForm,
  getJoiningForms,
  updateJoiningForm,
} from "../controllers/joiningController.js";
import {
  authenticateToken,
  checkRole,
  checkHRDepartment,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Fill Joining Form (HR Supervisor)
router.post(
  "/fill",
  authenticateToken,
  checkRole(["Supervisor"]),
  checkHRDepartment,
  upload.single("photo"),
  fillJoiningForm
);

// Get Joining Forms (HR Supervisor)
router.get(
  "/",
  authenticateToken,
  checkRole(["Supervisor", "Worker", "Admin"]),
  // checkHRDepartment,
  getJoiningForms
);

//Update joining form(HR Supervisor)
router.put(
  "/:id", // Assuming the record is Identified by and ID in the URL
  authenticateToken,
  checkRole(["Supervisor"]),
  checkHRDepartment,
  upload.single("photo"), // If a new photo is uploaded
  updateJoiningForm
);

export default router;
