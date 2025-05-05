import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Ekadashi from "../models/ekadashi.model.js";
import User from "../models/users.models.js";

const ekadashiRoundsFetch = asyncHandler(async (req, res) => {
  try {
    // 1. Find all Ekadashi records with at least 1 round
    const records = await Ekadashi.find({ rounds: { $gte: 1 } });

    // 2. Calculate total rounds per user
    const userRounds = {};
    records.forEach((record) => {
      const userId = record.user.toString();
      userRounds[userId] = (userRounds[userId] || 0) + record.rounds;
    });

    // 3. Get user details and create scoreboard
    const scoreboard = [];
    const userIds = Object.keys(userRounds);

    for (const userId of userIds) {
      const user = await User.findById(userId).select("firstName lastName");
      if (user) {
        scoreboard.push({
          firstName: user.firstName,
          lastName: user.lastName,
          rounds: userRounds[userId],
        });
      }
    }

    // 4. Sort by highest rounds first
    scoreboard.sort((a, b) => b.rounds - a.rounds);

    // 5. Send response
    res
      .status(200)
      .json(new ApiResponse(200, scoreboard, "Scorecard fetched successfully"));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json(new ApiResponse(500, {}, "Error fetching scorecard"));
  }
});

const addEkadashiRounds = asyncHandler(async (req, res) => {
  try {
    // 1. Get data from request
    const { rounds } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    // 2. Basic validation
    if (!rounds || rounds < 1) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Please enter a valid number of rounds (minimum 1)"
          )
        );
    }

    // 3. Create new record
    const newRecord = await Ekadashi.create({
      user: userId,
      rounds: rounds,
    });

    // 4. Return success response
    return res
      .status(201)
      .json(new ApiResponse(201, newRecord, "Rounds added successfully"));
  } catch (error) {
    console.error("Error adding rounds:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Failed to add rounds"));
  }
});

const deleteAllRounds = asyncHandler(async (req, res) => {
  try {
    // Verify the requesting user is an admin
    const requestingUser = await User.findById(req.user.id);
    
    if (!requestingUser) {
      return res.status(401).json(new ApiResponse(401, {}, "User not found"));
    }

    if (requestingUser.role !== "admin") {
      
      return res.status(403).json(new ApiResponse(403, {}, "Not authorized. Admin access required"));
    }

    // Delete all rounds
    const result = await Ekadashi.deleteMany({});
    
    if (result.deletedCount === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "No rounds found to delete"));
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} rounds`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error("Error deleting rounds:", error);
    res.status(500).json(new ApiResponse(500, {}, "Failed to delete rounds"));
  }
});

export { ekadashiRoundsFetch, addEkadashiRounds , deleteAllRounds };
