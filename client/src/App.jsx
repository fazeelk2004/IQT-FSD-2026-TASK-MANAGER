import { useEffect, useMemo, useState } from 'react';

import Header from './components/Header.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskFilters from './components/TaskFilters.jsx';
import TaskSummary from './components/TaskSummary.jsx';
import TaskList from './components/TaskList.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import EditTaskModal from './components/EditTaskModal.jsx';
import * as taskApi from './services/taskApi.js';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true); // initial fetch
  const [error, setError] = useState(''); // fetch error
  const [creating, setCreating] = useState(false); // create request in flight
  const [actionError, setActionError] = useState(''); // create/toggle/priority/delete error

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleCreate = async (payload) => {
    if (creating) return;
    setCreating(true);
    setActionError('');
    try {
      const created = await taskApi.createTask(payload);
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSaveEdit = async (updates) => {
    const updated = await taskApi.updateTask(editingTask._id, updates);
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    setActionError('');
    try {
      const updated = await taskApi.setTaskCompleted(id, !task.completed);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handlePriorityChange = async (id, priority) => {
    setActionError('');
    try {
      const updated = await taskApi.setTaskPriority(id, priority);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    const label = task ? `"${task.title}"` : 'this task';
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    setActionError('');
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (editingTask && editingTask._id === id) setEditingTask(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-slate-50 via-white to-indigo-50/40">
      {/* Decorative background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl"
      />

      <Header />

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <section className="lg:sticky lg:top-6 lg:self-start">
            <TaskForm onSubmit={handleCreate} submitting={creating} />
          </section>
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TaskSummary counts={counts} />
              <TaskFilters filter={filter} onFilterChange={setFilter} />
            </div>

            {actionError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              >
                {actionError}
              </p>
            )}

            {loading && <LoadingSpinner />}

            {!loading && error && (
              <ErrorMessage message={error} onRetry={loadTasks} />
            )}

            {!loading && !error && (
              <TaskList
                tasks={visibleTasks}
                filter={filter}
                onToggle={handleToggle}
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onPriorityChange={handlePriorityChange}
              />
            )}
          </section>
        </div>
      </main>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
