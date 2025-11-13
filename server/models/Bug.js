import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reporter: {
    type: String,
    required: true,
    trim: true
  },
  assignee: {
    type: String,
    trim: true,
    default: ''
  },
  stepsToReproduce: [String],
  environment: {
    os: String,
    browser: String,
    version: String
  }
}, {
  timestamps: true
});

// Custom validation example
bugSchema.path('description').validate(function(desc) {
  return desc && desc.length >= 10;
}, 'Description must be at least 10 characters long');

export default mongoose.model('Bug', bugSchema);