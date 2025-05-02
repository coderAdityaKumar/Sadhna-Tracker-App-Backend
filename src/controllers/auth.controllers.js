import User from "../models/users.models.js";
import dotenv from "dotenv"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {emailTransporter} from "../utils/email.js";
import { validationResult } from "express-validator";
import crypto from "crypto";

//     registerUser,
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // throw new ApiError(400, errors.array()[0].msg);
        return res.json(new ApiResponse(400, {}, errors.array()[0].msg));
    }

    const { username, firstName, lastName, email, password, hostel } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        // console.log(new ApiError(409, "Username or Email already exists"))
        return res.json(new ApiResponse(409, {message: "User already exists"},"Username or Email already exists"));
    }

    // Generate verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create the user
    const user = await User.create({
        username,
        firstName,
        lastName,
        email,
        hostel,
        password,
        verificationToken
    });

    if (!user) {
        throw new ApiError(500, "Unable to create user");
    }

    // Generate JWT token for frontend
    const token = await user.genereateToken();

    // Exclude sensitive fields
    const createdUser = await User.findById(user._id).select("-password -verificationToken -__v");

    // Optional: Send verification email
    const verificationLink = `https://sadhna-tracker-app-frontend.vercel.app/verify-user?token=${verificationToken}`;
    try {
        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Account",
            html: `<h3>Click <a href="${verificationLink}">here</a> to verify your account</h3>`
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }

    // Send response
    res.status(201).json(new ApiResponse(201, { user: createdUser, token }, "User created successfully"));
});



    //loginUser,

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.findOne({
        $or: [{username}, {email}]
    }).select("-createdAt -updatedAt -__v")

    if(!user) {
        return res.json(new ApiResponse(400, {},"invalid credentials"));
    }

    if(!(user.isVerified)){
        return res.json(new ApiResponse(400, {}, "user is not verified first verify the user"));
    }
    
    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        return res.json(new ApiResponse(400, {}, "invalid credentials"));
    }

    const token = await user.genereateToken();
    
    // console.log(new ApiResponse(200, {token}, "user login successfully"))
    res
    .status(200)
    .json(new ApiResponse(200, {token}, "user login successfully"))
})

//verifyUser,
const verifyUser = asyncHandler(async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    const {token} = req.query;
    if(!token){
        throw new ApiError(400, "cannot verify user")
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if(!decode){
        throw new ApiError(401, "invalid token");
    }

    const user = await User.findOne({email: decode.email}).select("-password -createdAt -updatedAt -__v");
    if(!user) {
        throw new ApiError(401, "invalid token");
    }

    if(user.isVerified){
        throw new ApiError(400, "user already verified");
    }

    if(user.verificationToken !== token) {
        throw new ApiError(401, "invalid token");
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            {_id: user._id},
            { 
                $unset: { 
                verificationToken: 1 
                },
                isVerified: true
            }, // Use $unset to remove the field
            { new: true } // Return the modified document
        ).select("-password -createdAt -updatedAt -__v")

        res.status(200).json(new ApiResponse(200, updatedUser, "user verified"))
    } catch(err) {
        console.log(err);
    }

})

const sendVerificationCode = asyncHandler(async(req, res) => {
    const {username, email} = req.body;

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    
    if(!user){
        throw new ApiError(409, "unable to find user")
    }
    
    
    try{
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.verificationToken = verificationToken;
        await user.save();
        const verificationLink = `http://localhost:3000/auth/verify-user?token=${user.verificationToken}`;
        const verificationEmail = await emailTransporter.sendMail({
            from: `Folk < ${process.env.EMAIL_USER} >`, // sender address
            to: user.email, // list of receivers
            subject: "Verifcation link RDUA ✔", // Subject line
            html: `<h3>Click <a href="${verificationLink}">here</a></h3>`, // html body
          });
    } catch(error) {
        // throw new ApiError(500, "error sending verification email");
        console.log(error);
    }

})

// Forgot Password Controller
const forgetPassword = asyncHandler(async (req, res) => {
    const { username, email } = req.body;
  
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
  
    if (!user) {
      res.status(404);
      throw new ApiError('User not found with the provided username or email');
    }
  
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set token and expiry on user document
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();
  
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  

    // Email content
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) requested a password reset.\n\n
             Please click the following link to reset your password:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email.\n
             This link will expire in 10 minutes.`,
    };
  
    // Send email
    try {
      await emailTransporter.sendMail(mailOptions);
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (error) {
      // Clear token and expiry if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(500);
      throw new Error('Failed to send reset email. Please try again later.');
    }
  });

  const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
  
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
  
    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired token');
    }
  
    // Update password (assuming you hash passwords with bcrypt)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  });

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("authToken").status(200).json(new ApiResponse(200, {}, "user logged out successfully"))
})

export {
    registerUser,
    verifyUser,
    loginUser,
    sendVerificationCode,
    forgetPassword,
    logoutUser
}