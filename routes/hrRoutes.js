import express from "express";
import {
  authenticateToken,
  checkHRDepartment,
  checkRole,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createQuestionPaper,
  deleteQuestionPaper,
  deleteTrainingVideo,
  getAllQuestionPapers,
  getQuestionPaper,
  getTrainingVideos,
  uploadTrainingVideo,
} from "../controllers/hrController.js";

const router = express.Router();

//Route for HR Supervisor to upload training video(HR Supervisor only)
router.post(
  "/training-video",
  authenticateToken,
  checkRole(["Supervisor"]),
  checkHRDepartment,
  upload.single("video"),
  uploadTrainingVideo
);

//Route to get training video("Admin","Supervisor","Worker")
router.get(
  "/",
  authenticateToken,
  checkRole(["Admin", "Supervisor", "Worker"]),
  getTrainingVideos
);

//Delete route to a remove a training video(Supervisor,Admin)
router.delete(
  "/training-video/:id",
  authenticateToken,
  checkRole(["Supervisor", "Admin"]),
  deleteTrainingVideo
);

// Route to create a question paper with file uploads
// Define the route for creating a question paper
router.post(
  "/create-question-paper",
  upload.fields([
    { name: "questionImg", maxCount: 1 },
    { name: "option1Img", maxCount: 1 },
    { name: "option2Img", maxCount: 1 },
    { name: "option3Img", maxCount: 1 },
    { name: "option4Img", maxCount: 1 },
  ]),
  createQuestionPaper,
  authenticateToken,
  checkRole(["Supervisor"]),
  checkHRDepartment
);

// Get all question papers
router.get(
  "/get-question-paper",
  getAllQuestionPapers,
  authenticateToken,
  checkRole(["Supervisor", "Admin", "Worker"])
);

// Get question paper by paperId
router.get(
  "/get-question-paper/:paperId",
  getQuestionPaper,
  authenticateToken,
  checkRole(["Supervisor", "Admin", "Worker"])
);

// Delete question paper by paperId
router.delete(
  "/delete-question-paper/:paperId",
  deleteQuestionPaper,
  authenticateToken,
  checkRole(["Supervisor"]),
  checkHRDepartment
);

export default router;
