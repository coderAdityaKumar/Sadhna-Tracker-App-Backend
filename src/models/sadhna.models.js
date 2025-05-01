  import mongoose from "mongoose";

  const sadhnaSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now, // Defaults to current date
    },
    manglaArti: {
      didAttend: {
          type: Boolean,
          required: [true, 'Mangla Arti status is required'],
          default: false,
      },
      minsLate: {
          type: Number,
          min: [0, 'Minutes late cannot be negative'],
          default: 0,
          required: [
              function () {
                  return this.manglaArti.didAttend;
              },
              'Minutes late is required if Mangla Arti is attended',
          ],
      }
    },studyHours: {
      type: Number,
      required: true,
    },
    chantingRounds: {
      type: Number,
      required: [true, 'Chanting rounds are required'],
      min: [0, 'Chanting rounds cannot be negative'],
      default: 0,
    },
    bookReading: {
      didRead: {
        type: Boolean,
        required: [true, 'Book reading status is required'],
        default: false,
      },
      bookName: {
        type: String,
        trim: true,
        required: [
          function () {
            return this.bookReading.didRead;
          },
          'Book name is required if reading is done',
        ],
      },
      duration: {
        type: Number, // Duration in minutes
        min: [0, 'Duration cannot be negative'],
        required: [
          function () {
            return this.bookReading.didRead;
          },
          'Duration is required if reading is done',
        ],
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: [true, 'User is required'], // Assuming each sadhna is tied to a user
    },
  }, {
    timestamps: true, // Adds createdAt and updatedAt fields
  });


  const Sadhna = mongoose.model('Sadhna', sadhnaSchema);

  export default Sadhna