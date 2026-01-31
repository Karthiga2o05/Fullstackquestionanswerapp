import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: [true, 'Section name is required'],
      trim: true,
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
sectionSchema.index({ createdBy: 1 });
sectionSchema.index({ sectionName: 1 });

const Section = mongoose.model('Section', sectionSchema);

export default Section;
