import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    answerText: {
      type: String,
      required: [true, 'Answer text is required'],
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate answers for same question by same user
answerSchema.index({ userId: 1, questionId: 1 }, { unique: true });

// Index for faster queries
answerSchema.index({ userId: 1 });
answerSchema.index({ sectionId: 1 });
answerSchema.index({ questionId: 1 });

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
