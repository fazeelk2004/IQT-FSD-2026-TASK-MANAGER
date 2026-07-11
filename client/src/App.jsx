import { useEffect, useMemo, useState } from 'react';

import Header from './components/Header.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskFilters from './components/TaskFilters.jsx';
import TaskList from './components/TaskList.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import { mockTasks } from './data/mockTasks.js';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = () => {
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  };

  useEffect(loadTasks, []);

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

  const handleCreateOrUpdate = (payload) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === editingTask._id ? { ...t, ...payload } : t
        )
      );
      setEditingTask(null);
      return;
    }

    const newTask = {
      _id: crypto.randomUUID(),
      ...payload,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    if (editingTask && editingTask._id === id) setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <section className="lg:sticky lg:top-6 lg:self-start">
            <TaskForm
              onSubmit={handleCreateOrUpdate}
              editingTask={editingTask}
              onCancelEdit={() => setEditingTask(null)}
            />
          </section>

          <section className="space-y-4">
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />

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
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
