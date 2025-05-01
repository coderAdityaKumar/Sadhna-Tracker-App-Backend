import express from "express";
const router = express.Router();

import { createSadhna, getSadhna,checkIfDailyGoalsFilled ,setDailyGoals} from "../controllers/sadhna.controllers.js";
import { validateCreateSadhna } from "../validators/create-sadhna.validator.js";
import authenticateUser from "../middlewares/auth.middleware.js";

router.post("/create-sadhna", authenticateUser, validateCreateSadhna,createSadhna);
router.get("/get-sadhna", authenticateUser, getSadhna);
router.get("/check-daily-goals",authenticateUser,checkIfDailyGoalsFilled)
router.put("/set-daily-goals", authenticateUser, setDailyGoals);


export default router;