import Task from '../models/Task.js';

// Wrap Async Route Handlers So Rejected Promises Flow To The Error Middleware.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/tasks - Get All Tasks, Newest First.
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: tasks });
});

// GET /api/tasks/:id - Get Single Task, 404 If Absent.
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task Not Found' });
  }
  res.status(200).json({ success: true, data: task });
});

// POST /api/tasks - Create Task.
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.validatedBody);
  res.status(201).json({ success: true, data: task });
});

// PATCH /api/tasks/:id - Update Task.
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.validatedBody, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task Not Found' });
  }
  res.status(200).json({ success: true, data: task });
});

// DELETE /api/tasks/:id - Delete Task.
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task Not Found' });
  }
  res.status(200).json({ success: true, data: task });
});
