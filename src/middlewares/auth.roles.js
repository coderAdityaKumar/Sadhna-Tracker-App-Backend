import User from "../models/users.models.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Fetch the user from the DB using the user ID from the token
      const user = await User.findById(req.user.id).select("role"); // Ensure you're querying for the role

      if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
      }
      console.log(user)

      // Check if the role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json(new ApiResponse(403, {}, "Access denied: Admins only"));
      }

      next(); // Proceed to the next middleware
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, {}, "Server error"));
    }
  };
};