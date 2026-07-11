import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title Is Required'],
      trim: true,
      minlength: [2, 'Title Must Be At Least 2 Characters'],
      maxlength: [150, 'Title Must Be At Most 150 Characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description Must Be At Most 1000 Characters'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} Is Not A Valid Priority',
      },
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ completed: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
