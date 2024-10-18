import pool from "../config/db.js"; // Import the MySQL pool

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
    // Ensure HR Supervisor specifies a valid department by checking the 'users' table
    const [departmentCheck] = await pool.query(
      "SELECT department FROM users WHERE department = ?",
      [departmentName]
    );

    if (departmentCheck.length === 0) {
      return res.status(404).json({ error: "Invalid department specified" }); // Not Found
    }

    // Create video URL
    const videoUrl = `/uploads/${encodeURIComponent(file.originalname)}`;

    // Insert video details into the 'training_videos' table
    await pool.query(
      `
      INSERT INTO training_videos (videoName, videoVersion, videoDescription, videoUrl, departmentName)
      VALUES (?, ?, ?, ?, ?)
      `,
      [videoName, videoVersion, videoDescription, videoUrl, departmentName]
    );

    res.status(201).json({
      message: "Training video uploaded successfully",
      videoUrl,
    }); // Created
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};

// Get All Training Videos (Accessible by Admin, Supervisor, Worker)
export const getTrainingVideos = async (req, res) => {
  try {
    const [videos] = await pool.query("SELECT * FROM training_videos"); // Fetch all training videos

    if (videos.length === 0) {
      return res.status(404).json({ error: "No training videos found" }); // Not Found
    }

    res.status(200).json(videos); // OK
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};

// Delete Training Video (Accessible by Admin & Supervisor only)
export const deleteTrainingVideo = async (req, res) => {
  const { id } = req.params; // Get the video ID from the URL parameters

  try {
    // Check if the video exists before trying to delete it
    const [videoCheck] = await pool.query(
      "SELECT * FROM training_videos WHERE id = ?",
      [id]
    );

    if (videoCheck.length === 0) {
      return res.status(404).json({ error: "Training video not found" }); // Not Found
    }

    // Proceed to delete the video
    await pool.query("DELETE FROM training_videos WHERE id = ?", [id]);

    res.status(200).json({ message: "Training video deleted successfully" }); // OK
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};
