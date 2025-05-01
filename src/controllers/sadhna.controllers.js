import { asyncHandler } from "../utils/asyncHandler.js";
import Sadhna from "../models/sadhna.models.js";
import User from "../models/users.models.js";
import DailyGoal from "../models/dailyGoals.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { body, validationResult } from "express-validator";

//create sadhana
const createSadhna = asyncHandler(async (req, res) => {
  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(new ApiResponse(400, {}, errors.array()[0].msg));
  }

  const {
    date,
    userManglaArti,
    userChantingRounds,
    studyHours,
    userBookReading,
  } = req.body;

  //checking if user has already submitted the sadhana report
  
  const dayStart = new Date(date);
  const dayEnd = new Date(date);
  dayEnd.setDate(dayEnd.getDate() + 1); // next day start (exclusive range)

  const existing = await Sadhna.findOne({
    user: req.user.id,
    date: {
      $gte: dayStart,
      $lt: dayEnd,
    },
  });

  if (existing) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Sadhana already submitted for today"));
  }

  // If not exists, create new entry

  const newSadhna = await Sadhna.create({
    date,
    user: req.user.id,
    manglaArti: {
      didAttend: userManglaArti.didAttend,
      minsLate: userManglaArti.minsLate,
    },
    studyHours,
    chantingRounds: userChantingRounds,
    bookReading: {
      didRead: userBookReading.didRead,
      bookName: userBookReading.bookName,
      duration: userBookReading.duration,
    },
  });

  if (!newSadhna) {
    return res.json(new ApiResponse(500, {}, "Failed to create Sadhna record"));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { sadhna: newSadhna._id } },
    { new: true } // returns the updated user
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, newSadhna, "Sadhna record created successfully")
    );
});

//get sadhna

const getSadhna = asyncHandler(async (req, res) => {
  // const {sadhnaId} = req.body;
  const user = req.user.id;
  const sadhna = await Sadhna.find({ user: user }).populate(
    "user",
    "-password -verificationToken -__v"
  );
  if (!sadhna) {
    return res.json(new ApiResponse(404, {}, "Sadhna record not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, sadhna, "Sadhna record retrieved successfully"));
});



const checkIfDailyGoalsFilled = asyncHandler(async (req, res) => {
  const user = req.user.id;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const dailyGoal = await DailyGoal.findOne({
    userId: user,
    month: currentMonth,
    year: currentYear,
  });

  if (!dailyGoal) {
    return res.json(
      new ApiResponse(404, { filled: false }, "You have not filled your daily goals for this month")
    );
  }

  // Return the daily goal data as well
  res.status(200).json(
    new ApiResponse(200, { filled: true, goal: dailyGoal }, "Daily goals for this month are filled")
  );
});



// Set daily goals
const setDailyGoals = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    roundsOfChanting,
    attendMangalaAarti,
    watchLectureMinutes,
    readBookMinutes,
  } = req.body;

  // Validate required fields
  if (
    roundsOfChanting === undefined ||
    attendMangalaAarti === undefined ||
    watchLectureMinutes === undefined ||
    readBookMinutes === undefined
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All daily goal fields are required"));
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-based month (e.g., May = 5)

  // Check if a daily goal already exists for this user for the current month
  let existing = await DailyGoal.findOne({ userId, year, month });

  if (existing) {
    // Update existing goal
    existing.roundsOfChanting = roundsOfChanting;
    existing.attendMangalaAarti = attendMangalaAarti;
    existing.watchLectureMinutes = watchLectureMinutes;
    existing.readBookMinutes = readBookMinutes;
    await existing.save();

    return res
      .status(200)
      .json(new ApiResponse(200, existing, "Daily goals updated successfully"));
  } else {
    // Create new goal
    const newGoal = new DailyGoal({
      userId,
      year,
      month,
      roundsOfChanting,
      attendMangalaAarti,
      watchLectureMinutes,
      readBookMinutes,
    });

    await newGoal.save();
    return res
      .status(201)
      .json(new ApiResponse(201, newGoal, "Daily goals set successfully"));
  }
});




export { createSadhna, getSadhna,checkIfDailyGoalsFilled,setDailyGoals };
