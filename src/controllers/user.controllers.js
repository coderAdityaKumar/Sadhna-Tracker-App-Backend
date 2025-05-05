import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password -verificationToken -__v").populate("sadhna", "-user -__v");
    if (!users) {
        return res.json(new ApiResponse(404,{}, "No users found")) ;
    }
    res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});

const getUser = asyncHandler(async (req, res) => {
    // console.log(req.user);
    const user = await User.findById(req.user?.id).select("-password -verificationToken -__v ").populate("sadhna", "-user -__v");

    if(!user) {
        res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    res.json(new ApiResponse(200, user, "user sent successfully"))
})

const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -verificationToken -__v").populate("sadhnas", "-user -__v");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const {firstname, lastname, email, hostel} = req.body;
    console.table({firstname, lastname, email, hostel});
    
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            firstName: firstname,
            lastName: lastname,
            email: email,
            hostel: hostel
        },
        {
            new: true
        }
    ).select("-password -createdAt -__v");

    if(!user){
        return res.json(new ApiResponse(500, {}, "internal server error: updating user"))
    }

    res.json(new ApiResponse(200, user, "user updated success fully"));
});

// Update user role
const updateUserRole = asyncHandler(async (req, res) => {
    const { userId, role } = req.body;
  
    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return res.json(new ApiResponse(400, {}, "Invalid role specified"));
    }
  
    const user = await User.findById(userId);
    if (!user) {
      return res.json(new ApiResponse(404, {}, "user not found"));
    }
  
    user.role = role;
    await user.save();
  
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user
    });
  });

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id, {new:true});
    res.json(new ApiResponse(200, user, "user deleted success fully"));
});

export {
    getAllUsers,
    getUserById,
    getUser,
    updateUser,
    deleteUser,
    updateUserRole
}