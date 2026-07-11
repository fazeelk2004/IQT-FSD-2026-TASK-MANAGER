const PRIORITY_STYLES = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// A single task card. Presentational — all actions bubble to the parent.
export default function TaskItem({ task, onToggle, onEdit, onDelete, onPriorityChange }) {
  const priorityClass = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
  const checkboxId = `task-${task._id}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task._id)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />

        <div className="min-w-0 flex-1">
          {/* Title on its own line so long titles wrap instead of overflowing.
              slate-500 (not slate-400) keeps completed titles readable. */}
          <label
            htmlFor={checkboxId}
            className={`block cursor-pointer break-words font-semibold ${
              task.completed ? 'text-slate-500 line-through' : 'text-slate-900'
            }`}
          >
            {task.title}
          </label>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {/* Priority as a discrete quick-change control */}
            <select
              value={task.priority}
              onChange={(e) => onPriorityChange(task._id, e.target.value)}
              aria-label={`Change priority for ${task.title}`}
              className={`cursor-pointer rounded-full border px-2 py-0.5 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-blue-500 ${priorityClass}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                task.completed
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              {task.completed ? 'Completed' : 'Active'}
            </span>
          </div>

          {task.description && (
            <p className="mt-2 break-words text-sm text-slate-600">
              {task.description}
            </p>
          )}

          <p className="mt-2 text-xs text-slate-500">
            Created {formatDate(task.createdAt)}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit task: ${task.title}`}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            aria-label={`Delete task: ${task.title}`}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
