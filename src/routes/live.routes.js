import express from "express";
const router = express.Router();
import  {ekadashiRoundsFetch,addEkadashiRounds, deleteAllRounds}  from "../controllers/ekadashi.data.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

//routes
router.get("/live-ekadashi-rounds", ekadashiRoundsFetch);
router.post("/add-rounds", authenticateUser, addEkadashiRounds);
router.delete("/delete-all-rounds",authenticateUser,deleteAllRounds)
export default router;