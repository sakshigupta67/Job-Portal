import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    isVisible: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
