import db from "../config/db.js";

// Helper function to promisify db.query
const queryDb = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Upload Document
export const uploadDocument = async (req, res) => {
  const { file } = req;
  const {
    fileNo,
    fileVersion,
    status = "Pending",
    category,
    filename,
    department,
  } = req.body;

  if (!file) {
    return res.status(422).json({ error: "No file uploaded" }); //Unprocessable Entity
  }

  try {
    // Ensure Admin gets the department from the 'users' table
    if (req.user.designation === "Admin") {
      if (!department) {
        return res
          .status(400)
          .json({ error: "Admin must specify a department" }); // Bad Request
      }

      // Query to check if the department exists in the 'users' table
      const checkDepartmentQuery =
        "SELECT department FROM users WHERE department = ?";
      const result = await queryDb(checkDepartmentQuery, [department]);

      if (result.length === 0) {
        return res.status(404).json({ error: "Invalid department selected" }); //Not Found
      }

      // If department exists, proceed with uploading the document
      await insertDocument(
        req,
        res,
        fileNo,
        fileVersion,
        status,
        category,
        filename,
        department,
        file
      );
    } else {
      // For Supervisors and Workers, use their department from login
      const uploadDepartment = req.user.department;

      // Proceed with the document upload
      await insertDocument(
        req,
        res,
        fileNo,
        fileVersion,
        status,
        category,
        filename,
        uploadDepartment,
        file
      );
    }
  } catch (err) {
    return res.status(500).json({ error: err.message }); //Internal Server Error
  }
};

// Separate function to handle document insertion
const insertDocument = async (
  req,
  res,
  fileNo,
  fileVersion,
  status,
  category,
  filename,
  department,
  file
) => {
  const fileUrl = `/uploads/${encodeURIComponent(file.originalname)}`;
  const queryDoc = `
    INSERT INTO documents (fileNo, filename, fileVersion, category, status, fileUrl, department, designation, shift) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await queryDb(queryDoc, [
      fileNo,
      filename,
      fileVersion,
      category,
      status,
      fileUrl,
      department,
      req.user.designation,
      req.user.shift,
    ]);
    res.status(201).json({ message: "File uploaded successfully", fileUrl }); //Created
  } catch (err) {
    res.status(500).json({ error: err.message }); //Internal Server Error
  }
};

// Get All Documents (Admin)
export const getAllDocuments = async (req, res) => {
  const query = "SELECT * FROM documents";

  try {
    const result = await queryDb(query);
    res.status(200).json(result); // OK
  } catch (err) {
    res.status(500).json({ error: err.message }); // Internal Server Error
  }
};

// Get Documents by Department (Supervisor, Worker)
export const getDocumentsByDepartment = async (req, res) => {
  const query = "SELECT * FROM documents WHERE department = ?";

  try {
    const result = await queryDb(query, [req.user.department]);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found for this department" }); //Not Found
    }
    res.status(200).json(result); // OK
  } catch (err) {
    res.status(500).json({ error: err.message }); //Internal Server Error
  }
};

// Delete Documents By ID (Admin, Supervisor)
export const deleteDocument = async (req, res) => {
  const query = "DELETE FROM documents WHERE id = ?";

  try {
    const result = await queryDb(query, [req.params.id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Document deleted successfully" }); //OK
    } else {
      res.status(404).json({ message: "Document not found" }); //Not Found
    }
  } catch (err) {
    res.status(500).json({ error: err.message }); //Internal Server Error
  }
};

// Update Document by ID (Admin, Supervisor)
export const updateDocumentStatus = async (req, res) => {
  const { status } = req.body;
  const query = "UPDATE documents SET status = ? WHERE id = ?";

  try {
    const result = await queryDb(query, [status, req.params.id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Document status updated successfully" }); //OK
    } else {
      res.status(404).json({ message: "Document not found" }); //Not Found
    }
  } catch (err) {
    res.status(500).json({ error: err.message }); //Internal Server Error
  }
};
