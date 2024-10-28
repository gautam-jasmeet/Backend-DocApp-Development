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

// Create Question Paper
export const createQuestionPaper = async (req, res) => {
  const {
    paperId,
    questionNo,
    question,
    option1,
    option2,
    option3,
    option4,
    correctOption,
    department,
  } = req.body;

  // Validate required fields
  if (!paperId || !questionNo || !department || !correctOption) {
    return res.status(422).json({
      error:
        "Paper ID, Question No, Department, and Correct Option are required",
    }); // Unprocessable Entity
  }

  try {
    // Verify that the department exists in the 'users' table
    const [departmentCheck] = await pool.query(
      "SELECT department FROM users WHERE department = ?",
      [department]
    );
    if (departmentCheck.length === 0) {
      return res.status(404).json({ error: "Invalid department specified" });
    }

    // Process files if uploaded
    const questionImg = req.files["questionImg"]
      ? `/uploads/${encodeURIComponent(req.files["questionImg"][0].filename)}`
      : null;
    const option1Img = req.files["option1Img"]
      ? `/uploads/${encodeURIComponent(req.files["option1Img"][0].filename)}`
      : null;
    const option2Img = req.files["option2Img"]
      ? `/uploads/${encodeURIComponent(req.files["option2Img"][0].filename)}`
      : null;
    const option3Img = req.files["option3Img"]
      ? `/uploads/${encodeURIComponent(req.files["option3Img"][0].filename)}`
      : null;
    const option4Img = req.files["option4Img"]
      ? `/uploads/${encodeURIComponent(req.files["option4Img"][0].filename)}`
      : null;

    // Set text fields to null if they are not provided
    const questionText = question || null;
    const option1Text = option1 || null;
    const option2Text = option2 || null;
    const option3Text = option3 || null;
    const option4Text = option4 || null;

    // Insert question paper details into the database
    await pool.query(
      `
      INSERT INTO question_papers (
        paperId, questionNo, question, questionImg, option1, option1Img, option2, option2Img, 
        option3, option3Img, option4, option4Img, correctOption, department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        paperId,
        questionNo,
        questionText,
        questionImg,
        option1Text,
        option1Img,
        option2Text,
        option2Img,
        option3Text,
        option3Img,
        option4Text,
        option4Img,
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
        questionText,
        questionImg,
        option1Text,
        option1Img,
        option2Text,
        option2Img,
        option3Text,
        option3Img,
        option4Text,
        option4Img,
        correctOption,
        department,
      },
    };

    res.status(201).json(response); // Created
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};

// Get All Question Papers
export const getAllQuestionPapers = async (req, res) => {
  try {
    // Query to select all question papers
    const [result] = await pool.query("SELECT * FROM question_papers");

    // Check if there are any question papers
    if (result.length === 0) {
      return res.status(404).json({ error: "No question papers found" });
    }

    // Group questions by paperId
    const groupedQuestions = result.reduce((acc, question) => {
      const { paperId, ...questionData } = question;

      // Create a new entry if it doesn't exist
      if (!acc[paperId]) {
        acc[paperId] = {
          PaperId: paperId,
          Questions: [],
        };
      }

      // Push the question data into the Questions array
      acc[paperId].Questions.push(questionData);
      return acc;
    }, {});

    // Convert the object to an array
    const response = Object.values(groupedQuestions);

    // Respond with the grouped question papers
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Question Paper by paperId
export const getQuestionPaper = async (req, res) => {
  const { paperId } = req.params;

  try {
    // Query the database for the specified paperId
    const [result] = await pool.query(
      `
      SELECT * FROM question_papers WHERE paperId = ?
      `,
      [paperId]
    );

    // Check if the question paper exists
    if (result.length === 0) {
      return res.status(404).json({ error: "Question paper not found" });
    }

    // Respond with the question paper data
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Question Paper by paperId
export const deleteQuestionPaper = async (req, res) => {
  const { paperId } = req.params;

  try {
    // Check if the question paper exists
    const [result] = await pool.query(
      "SELECT * FROM question_papers WHERE paperId = ?",
      [paperId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Question paper not found" });
    }

    // Delete the question paper
    await pool.query("DELETE FROM question_papers WHERE paperId = ?", [
      paperId,
    ]);

    res.status(200).json({ message: "Question paper deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign Paper to Employee
export const assignPaperToEmployee = async (req, res) => {
  const { employeeId, paperId, taskStatus = "inactive" } = req.body; // Default taskStatus is 'inactive'

  // Validate required fields
  if (!employeeId || !paperId) {
    return res.status(422).json({
      error: "Employee ID and Paper ID are required",
    }); // Unprocessable Entity
  }

  try {
    // Check if the employee exists
    const [employeeCheck] = await pool.query(
      "SELECT * FROM users WHERE employeeId = ?",
      [employeeId]
    );

    if (employeeCheck.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if the paper exists
    const [paperCheck] = await pool.query(
      "SELECT * FROM question_papers WHERE paperId = ?",
      [paperId]
    );

    if (paperCheck.length === 0) {
      return res.status(404).json({ error: "Question paper not found" });
    }

    // Insert the assignment into the 'assigned_papers' table
    await pool.query(
      `
      INSERT INTO assigned_papers (employeeId, paperId, taskStatus)
      VALUES (?, ?, ?)
      `,
      [employeeId, paperId, taskStatus]
    );

    res.status(201).json({
      message: "Paper assigned to employee successfully",
      data: {
        employeeId,
        paperId,
        taskStatus,
      },
    }); // Created
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};

// Get all assigned papers
export const getAllAssignedPapers = async (req, res) => {
  try {
    const [assignedPapers] = await pool.query(`
     SELECT * FROM assigned_papers
    `);

    res.status(200).json({
      message: "Assigned papers retrieved successfully",
      data: assignedPapers,
    }); // OK
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal Server Error
  }
};

// Get Assigned Papers for Employee using punchId
export const getAssignedPapersByPunchId = async (req, res) => {
  const { punchId } = req.params; // Get punchId from request parameters

  // Validate required fields
  if (!punchId) {
    return res.status(422).json({
      error: "Punch ID is required",
    });
  }

  try {
    // Retrieve employeeId using punchId
    const [employeeCheck] = await pool.query(
      "SELECT employeeId FROM users WHERE punchId = ?",
      [punchId]
    );

    if (employeeCheck.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeId = employeeCheck[0].employeeId; // Get employeeId from the response

    // Get assigned papers for the employee
    const [assignedPapers] = await pool.query(
      `
      SELECT ap.*, qp.paperTitle 
      FROM assigned_papers ap 
      JOIN question_papers qp ON ap.paperId = qp.paperId 
      WHERE ap.employeeId = ?
      `,
      [employeeId]
    );

    if (assignedPapers.length === 0) {
      return res
        .status(404)
        .json({ message: "No papers assigned to this employee" });
    }

    res.status(200).json({
      message: "Assigned papers retrieved successfully",
      data: assignedPapers,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update Task Status for Assigned Paper
export const updateTaskStatus = async (req, res) => {
  const { id } = req.params; // Assume you pass the assignment ID as a URL parameter
  const { taskStatus } = req.body;

  try {
    // Check if the assignment exists
    const [assignmentCheck] = await pool.query(
      "SELECT * FROM assigned_papers WHERE id = ?",
      [id]
    );

    if (assignmentCheck.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Update the task status
    await pool.query("UPDATE assigned_papers SET taskStatus = ? WHERE id = ?", [
      taskStatus,
      id,
    ]);

    res.status(200).json({ message: "Task status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
