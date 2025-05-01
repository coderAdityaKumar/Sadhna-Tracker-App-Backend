import mongoose from "mongoose";
const dailyGoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roundsOfChanting: { type: Number, default: 16 },
    attendMangalaAarti: { type: Boolean, default: false },
    watchLectureMinutes: { type: Number, default: 30 },
    readBookMinutes: { type: Number, default: 45 },
    month: { type: Number, required: true }, // 1 = January, 2 = February, etc.
    year: { type: Number, required: true },  // Year of the goals
    filledAt: { type: Date, default: Date.now } // Timestamp when the form was filled
  });
  
  const DailyGoal = mongoose.model('DailyGoal', dailyGoalSchema);
  export default DailyGoal;
  