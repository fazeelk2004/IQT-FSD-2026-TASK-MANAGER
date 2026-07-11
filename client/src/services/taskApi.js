import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

function toError(error) {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'Request Failed. Please Rry Again.';
  return new Error(message);
}

// 1. Get All Tasks
export async function getTasks() {
  try {
    const res = await api.get('/tasks');
    return res.data.data;
  } catch (error) {
    throw toError(error);
  }
}

// 2. Create A Task
export async function createTask(payload) {
  try {
    const res = await api.post('/tasks', payload);
    return res.data.data;
  } catch (error) {
    throw toError(error);
  }
}

// 3. Edit A Task
export async function updateTask(id, updates) {
  try {
    const res = await api.patch(`/tasks/${id}`, updates);
    return res.data.data;
  } catch (error) {
    throw toError(error);
  }
}

// 4. Delete A Task
export async function deleteTask(id) {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    throw toError(error);
  }
}

// 5. Mark A Task As Completed
export function setTaskCompleted(id, completed) {
  return updateTask(id, { completed });
}

// 6. Change Task Priority
export function setTaskPriority(id, priority) {
  return updateTask(id, { priority });
}

// 7. Improve A Task Description With AI
export async function improveTask({ title, description }) {
  try {
    const res = await api.post('/ai/improve-task', { title, description });
    return res.data.data.improvedDescription;
  } catch (error) {
    throw toError(error);
  }
}
