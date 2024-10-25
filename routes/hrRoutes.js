import express from "express";
import {
  authenticateToken,
  checkHRDepartment,
  checkRole,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createQuestionPaper,
  deleteTrainingVideo,
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
router.post(
  "/create-question-paper",
  upload.fields([
    { name: "question", maxCount: 1 },
    { name: "option1", maxCount: 1 },
    { name: "option2", maxCount: 1 },
    { name: "option3", maxCount: 1 },
    { name: "option4", maxCount: 1 },
  ]),
  createQuestionPaper,
  authenticateToken,
  checkRole(["Supervisor"]),
  checkHRDepartment
);

// // Route to create a question paper(HR Supervisor only)
// router.post(
//   "/question-paper",
//   authenticateToken,
//   checkRole(["Supervisor"]),
//   checkHRDepartment,
//   createQuestionPaper
// );

// // Route to get all question papers(Admin, Supervisor, Worker)
// router.get(
//   "/question-papers",
//   authenticateToken,
//   checkRole(["Admin", "Supervisor", "Worker"]),
//   getAllQuestionPapers
// );

// // Route to delete a question paper by ID(HR Supervisor)
// router.delete(
//   "/question-paper/:id",
//   authenticateToken,
//   checkRole(["Supervisor"]),
//   checkHRDepartment,
//   deleteQuestionPaper
// );

export default router;
