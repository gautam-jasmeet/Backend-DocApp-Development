// controllers/hrVideoController.js

import db from "../config/db.js";

//Helper function to promisify db.query
const queryDb = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Upload Training Video (HR Supervisor)
export const uploadTrainingVideo = async (req, res) => {
  const { file } = req;
  const { videoName, videoVersion, videoDescription, departmentName } =
    req.body;

  // Check if the video is uploaded
  if (!file) {
    return res.status(422).json({ error: "No video uploaded" }); // Unprocessable Entity
  }

  try {
    // Ensure HR Supervisor specifies a valid department
    const checkDepartmentQuery =
      "SELECT department FROM users WHERE department = ?";
    const departmentCheck = await queryDb(checkDepartmentQuery, [
      departmentName,
    ]);

    if (departmentCheck.length === 0) {
      return res.status(404).json({ error: "Invalid department specified" }); // Not Found
    }

    // Create video URL
    const videoUrl = `/uploads/${encodeURIComponent(file.originalname)}`;

    // Insert video details into the database
    const queryDoc = `
      INSERT INTO training_videos (videoName, videoVersion, videoDescription, videoUrl, departmentName) 
      VALUES (?, ?, ?, ?, ?)`;

    await queryDb(queryDoc, [
      videoName,
      videoVersion,
      videoDescription,
      videoUrl,
      departmentName,
    ]);

    res
      .status(201)
      .json({ message: "Training video uploaded successfully", videoUrl }); // Created
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};

//Get All Training Videos(Accessible by Admin, Supervisor, Worker)

export const getTrainingVideos = async (req, res) => {
  try {
    const query = "SELECT * FROM training_videos"; // Fetch all  training videos

    const videos = await queryDb(query);

    if (videos.length === 0) {
      return res.status(404).json({ error: "No training videos found" }); //Not Found
    }

    res.status(200).json(videos); //OK
  } catch (err) {
    return res.status(500).json({ error: err.message }); //Internal Server Error
  }
};

//Delete Training Video(Accessible by Admin & Supervisor only)

export const deleteTrainingVideo = async (req, res) => {
  const { id } = req.params; //Get the video ID from hte URL parameters

  try {
    // check if the video exists before trying to delete
    const checkVideoQuery = "SELECT * FROM training_videos WHERE id = ?";
    const videoCheck = await queryDb(checkVideoQuery, [id]);

    if (videoCheck.length === 0) {
      return res.status(404).json({ error: "Training video not found" }); //Not Found
    }

    //Proceed to delete the video
    const deleteVideoQuery = "DELETE FROM training_videos WHERE id = ?";
    await queryDb(deleteVideoQuery, [id]);

    res.status(200).json({ message: "Training video deleted successfully" }); //OK
  } catch (err) {
    return res.status(500).json({ error: err.message }); //Internal Server Error
  }
};
