import mongoose from "mongoose";
const ekadashiSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rounds: {
      type: Number,
      required: true,
      min: 1
    },
  }, { timestamps: true });
  
  const Ekadashi = mongoose.model('Ekadshi', ekadashiSchema);
  export default Ekadashi