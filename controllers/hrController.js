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

// // Create Question Paper
// export const createQuestionPaper = async (req, res) => {
//   const {
//     paperId,
//     questionNo,
//     question,
//     option1,
//     option2,
//     option3,
//     option4,
//     correctOption,
//     department, // Expect department to be sent in request body
//   } = req.body;

//   // Check if all required fields are provided
//   if (
//     !paperId ||
//     !questionNo ||
//     !question ||
//     !option1 ||
//     !option2 ||
//     !option3 ||
//     !option4 ||
//     !correctOption ||
//     !department
//   ) {
//     return res.status(422).json({ error: "All fields are required" }); // Unprocessable Entity
//   }

//   try {
//     // Ensure the specified department exists by checking the 'users' table
//     const [departmentCheck] = await pool.query(
//       "SELECT department FROM users WHERE department = ?",
//       [department]
//     );

//     if (departmentCheck.length === 0) {
//       return res.status(404).json({ error: "Invalid department specified" }); // Not Found
//     }

//     // Insert question paper details into the 'question_papers' table
//     await pool.query(
//       `
//       INSERT INTO question_papers (paperId, questionNo, question, option1, option2, option3, option4, correctOption, department)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         paperId,
//         questionNo,
//         question,
//         option1,
//         option2,
//         option3,
//         option4,
//         correctOption,
//         department,
//       ]
//     );

//     res.status(201).json({ message: "Question paper created successfully" }); // Created
//   } catch (err) {
//     return res.status(500).json({ error: err.message }); // Internal Server Error
//   }
// };

// // Get All Question Papers
// export const getAllQuestionPapers = async (req, res) => {
//   try {
//     const [papers] = await pool.query("SELECT * FROM question_papers"); // Fetch all question papers

//     if (papers.length === 0) {
//       return res.status(404).json({ error: "No question papers found" }); // Not Found
//     }

//     res.status(200).json(papers); // OK
//   } catch (err) {
//     return res.status(500).json({ error: err.message }); // Internal Server Error
//   }
// };

// // Delete Question Paper
// export const deleteQuestionPaper = async (req, res) => {
//   const { id } = req.params; // Get the paper ID from the URL parameters

//   try {
//     // Check if the question paper exists before trying to delete it
//     const [paperCheck] = await pool.query(
//       "SELECT * FROM question_papers WHERE id = ?",
//       [id]
//     );

//     if (paperCheck.length === 0) {
//       return res.status(404).json({ error: "Question paper not found" }); // Not Found
//     }

//     // Proceed to delete the question paper
//     await pool.query("DELETE FROM question_papers WHERE id = ?", [id]);

//     res.status(200).json({ message: "Question paper deleted successfully" }); // OK
//   } catch (err) {
//     return res.status(500).json({ error: err.message }); // Internal Server Error
//   }
// };
// Create Question Paper
export const createQuestionPaper = async (req, res) => {
  const {
    paperId,
    questionNo,
    department, // Expect department to be sent in request body
  } = req.body;

  // Check if all required fields are provided
  if (!paperId || !questionNo || !department) {
    return res
      .status(422)
      .json({ error: "Paper ID, Question No, and Department are required" }); // Unprocessable Entity
  }

  try {
    // Ensure the specified department exists by checking the 'users' table
    const [departmentCheck] = await pool.query(
      "SELECT department FROM users WHERE department = ?",
      [department]
    );

    if (departmentCheck.length === 0) {
      return res.status(404).json({ error: "Invalid department specified" }); // Not Found
    }

    // Process files if uploaded
    const questionFile = req.files["question"]
      ? req.files["question"][0]
      : null;
    const option1File = req.files["option1"] ? req.files["option1"][0] : null;
    const option2File = req.files["option2"] ? req.files["option2"][0] : null;
    const option3File = req.files["option3"] ? req.files["option3"][0] : null;
    const option4File = req.files["option4"] ? req.files["option4"][0] : null;

    // Encode file names to handle spaces and special characters
    const questionText = questionFile
      ? `/uploads/${encodeURIComponent(questionFile.filename)}`
      : req.body.question;
    const option1Text = option1File
      ? `/uploads/${encodeURIComponent(option1File.filename)}`
      : req.body.option1;
    const option2Text = option2File
      ? `/uploads/${encodeURIComponent(option2File.filename)}`
      : req.body.option2;
    const option3Text = option3File
      ? `/uploads/${encodeURIComponent(option3File.filename)}`
      : req.body.option3;
    const option4Text = option4File
      ? `/uploads/${encodeURIComponent(option4File.filename)}`
      : req.body.option4;
    const correctOption = req.body.correctOption;

    // Check if correctOption is provided
    if (!correctOption) {
      return res.status(422).json({ error: "Correct option is required" }); // Unprocessable Entity
    }

    // Insert question paper details into the 'question_papers' table
    await pool.query(
      `
      INSERT INTO question_papers (paperId, questionNo, question, option1, option2, option3, option4, correctOption, department)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        paperId,
        questionNo,
        questionText,
        option1Text,
        option2Text,
        option3Text,
        option4Text,
        correctOption,
        department,
      ]
    );

    // Prepare the response
    const response = {
      message: "Question paper created successfully",
      data: {
        paperId,
        questionNo,
        questionUrl: questionText,
        option1Url: option1Text,
        option2Url: option2Text,
        option3Url: option3Text,
        option4Url: option4Text,
        correctOption,
        department,
      },
    };

    res.status(201).json(response); // Created
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};
