import TaskItem from './TaskItem.jsx';

// Empty-state copy tailored to the active filter.
function emptyStateText(filter) {
  if (filter === 'active') {
    return { message: 'No active tasks', hint: 'Everything is done — nice work!' };
  }
  if (filter === 'completed') {
    return { message: 'No completed tasks yet', hint: 'Finished tasks will appear here.' };
  }
  return { message: 'No tasks yet', hint: 'Create your first task using the form.' };
}

// Renders the list of tasks, or a professional empty state when there are none.
export default function TaskList({ tasks, filter, onToggle, onEdit, onDelete, onPriorityChange }) {
  if (tasks.length === 0) {
    const { message, hint } = emptyStateText(filter);
    return (
      <div
        role="status"
        className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center backdrop-blur"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-7 w-7 text-indigo-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <p className="mt-4 text-base font-semibold text-slate-800">{message}</p>
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task._id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onPriorityChange={onPriorityChange}
          />
        </li>
      ))}
    </ul>
  );
}
