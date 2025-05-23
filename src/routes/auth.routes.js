import express from "express";
const router = express.Router();

// middleware imports
import { validateRegisterUser } from "../validators/register-user.validator.js";
import { validateVerifyUserToken } from "../validators/query-token.validator.js";
import authenticateUser from "../middlewares/auth.middleware.js";

// controller imports

import {
    registerUser,
    loginUser,
    verifyUser,
    forgotPassword,
    logoutUser,
    resetPassword
} from "../controllers/auth.controllers.js"

// routes
router.post("/register-user", validateRegisterUser, registerUser);
router.get("/verify-user", validateVerifyUserToken, verifyUser);
router.post("/login-user", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout-user", authenticateUser,logoutUser);


export default router;