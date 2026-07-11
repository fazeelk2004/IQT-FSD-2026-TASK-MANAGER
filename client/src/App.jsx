import { useEffect, useMemo, useState } from 'react';

import Header from './components/Header.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskFilters from './components/TaskFilters.jsx';
import TaskList from './components/TaskList.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import * as taskApi from './services/taskApi.js';

// App owns all shared state and talks to the API through taskApi.
// Children stay presentational and bubble actions up via callbacks.
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true); // initial fetch
  const [error, setError] = useState(''); // fetch error
  const [submitting, setSubmitting] = useState(false); // create/update in flight
  const [actionError, setActionError] = useState(''); // toggle/priority/delete error

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

  // Create (prepend) or update (replace) — guarded against duplicate submits.
  const handleCreateOrUpdate = async (payload) => {
    if (submitting) return;
    setSubmitting(true);
    setActionError('');
    try {
      if (editingTask) {
        const updated = await taskApi.updateTask(editingTask._id, payload);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await taskApi.createTask(payload);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
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
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
          {/* Left column: form */}
          <section className="lg:sticky lg:top-6 lg:self-start">
            <TaskForm
              onSubmit={handleCreateOrUpdate}
              editingTask={editingTask}
              onCancelEdit={() => setEditingTask(null)}
              submitting={submitting}
            />
          </section>

          {/* Right column: filters + list */}
          <section className="space-y-4">
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />

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
                onToggle={handleToggle}
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onPriorityChange={handlePriorityChange}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
