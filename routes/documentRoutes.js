import express from "express";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentsByDepartment,
  deleteDocument,
  updateDocumentStatus,
} from "../controllers/documentController.js";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload Document (Admin, Supervisor only)
router.post(
  "/upload",
  authenticateToken,
  checkRole(["Admin", "Supervisor"]),
  upload.single("file"),
  uploadDocument
);

// Get All Documents (Admin)
router.get("/", authenticateToken, checkRole(["Admin"]), getAllDocuments);

// Get Documents by Department (Supervisor, Worker)
router.get(
  "/:department",
  authenticateToken,
  checkRole(["Supervisor", "Worker"]),
  getDocumentsByDepartment
);

// Delete Document by ID (Admin, Supervisor)
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["Admin", "Supervisor"]),
  deleteDocument
);

// Update Document by ID (Admin, Supervisor)
router.put(
  "/:id",
  authenticateToken,
  checkRole(["Admin"]),
  updateDocumentStatus
);

export default router;
