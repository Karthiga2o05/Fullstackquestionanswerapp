import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Section ID is required'],
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ['MCQ', 'FILL_IN_BLANK'],
      required: [true, 'Question type is required'],
    },
    options: {
      type: {
        A: String,
        B: String,
        C: String,
        D: String,
      },
      required: function () {
        return this.questionType === 'MCQ';
      },
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
questionSchema.index({ sectionId: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ questionType: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
