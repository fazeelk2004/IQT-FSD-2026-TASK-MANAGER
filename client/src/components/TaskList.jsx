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
        className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mx-auto h-10 w-10 text-slate-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <p className="mt-3 text-sm font-medium text-slate-700">{message}</p>
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
