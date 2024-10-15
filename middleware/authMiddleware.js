import jwt from "jsonwebtoken";
import db from "../config/db.js";

// Middleware to authenticate token using async/await
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401); // Unauthorized: No token provided

    const user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Set user in the request object
    next();
  } catch (err) {
    return res.status(403).json({ error: err.message }); // Forbidden: Invalid token
  }
};

// Middleware to check user role with async/await
export const checkRole = (roles) => async (req, res, next) => {
  try {
    const query = "SELECT * FROM users WHERE employeeID = ?";
    const [result] = await db.promise().query(query, [req.user.employeeID]);

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" }); //Not Found: User does not exist
    }

    const user = result[0];
    if (roles.includes(user.designation)) {
      req.user = user; // Set updated user in request object
      next();
    } else {
      return res.status(403).json({ message: "Access denied" }); //Forbidden: User does not have required role
    }
  } catch (err) {
    return res.status(500).json({ error: err.message }); //Internal Server Error: Database or other issues
  }
};

// // Middleware to check if the user is in the HR department using async/await
export const checkHRDepartment = async (req, res, next) => {
  try {
    if (req.user.department === "HR") {
      // Additional HR-specific logic can be added here
      next();
    } else {
      return res.status(403).json({
        message: "Access restricted to HR department only", // Forbidden: User does not belong to HR
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message }); //Internal Server Error: Processing issues
  }
};
