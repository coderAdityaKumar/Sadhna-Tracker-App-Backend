import express from 'express';
const router = express.Router();

import {getAllUsers, getUserById, getUser, updateUser, deleteUser} from "../controllers/user.controllers.js";
import authenticateUser from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/auth.roles.js';

router.get("/getAllUsers", authenticateUser,authorizeRoles("admin"), getAllUsers);
// router.get("/:userId", authenticateUser, getUserById);
router.get("/get-user", authenticateUser, getUser);
router.put("/update-user", authenticateUser, updateUser);
router.delete("/delete-user", authenticateUser, deleteUser);

export default router;