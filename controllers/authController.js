import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js"; // Import the pool

// Signup Function
export const signup = async (req, res) => {
  const { name, employeeID, department, designation, password, shift } =
    req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (name, employeeID, department, designation, password, shift) VALUES (?, ?, ?, ?, ?, ?)";

    // Execute the database query using pool.promise()
    await pool.query(query, [
      name,
      employeeID,
      department,
      designation,
      hashedPassword,
      shift,
    ]);

    return res.status(201).json({ message: "User created successfully" }); //201 for resource creation
  } catch (err) {
    return res.status(500).json({ error: err.message }); // Internal server error for database or other issues
  }
};

// Login Function
export const login = async (req, res) => {
  const { employeeID, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE employeeID = ?";

    // Execute the database query using pool.promise()
    const [result] = await pool.query(query, [employeeID]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" }); //404 for user not found
    }

    const user = result[0];

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" }); //401 for unauthorized access
    }

    // Generate JWT token
    const token = jwt.sign(
      { employeeID: user.employeeID },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with token and user details
    return res.status(200).json({
      token, // JWT token
      employeeID: user.employeeID, // User's employee ID
      name: user.name, // User's name
      department: user.department, // User's department
      designation: user.designation, // User's designation
      shift: user.shift, // User's shift
    });
  } catch (err) {
    return res.status(500).json({ error: err.message }); //Internal server Error for unexpected issues
  }
};
