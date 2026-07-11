import { useEffect, useState } from 'react';

const EMPTY = { title: '', description: '', priority: 'medium' };

export default function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState('');

  const isEditing = Boolean(editingTask);

  useEffect(() => {
    if (editingTask) {
      setValues({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
      });
      setError('');
    } else {
      setValues(EMPTY);
    }
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = values.title.trim();

    if (title.length < 2) {
      setError('Title must be at least 2 characters.');
      return;
    }

    onSubmit({
      title,
      description: values.description.trim(),
      priority: values.priority,
    });

    setValues(EMPTY);
    setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      aria-label={isEditing ? 'Edit task' : 'Create a new task'}
    >
      <h2 className="text-lg font-semibold text-slate-900">
        {isEditing ? 'Edit task' : 'Add a task'}
      </h2>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="e.g. Prepare sprint demo"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-required="true"
            aria-invalid={Boolean(error)}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional details…"
            className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditing ? 'Update task' : 'Add task'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
