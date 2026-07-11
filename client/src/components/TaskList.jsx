import TaskItem from './TaskItem.jsx';

// Renders the list of tasks, or an empty state when there are none.
export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
        <p className="text-sm font-medium text-slate-700">No tasks to show</p>
        <p className="mt-1 text-sm text-slate-500">
          Add a task above or switch filters to see more.
        </p>
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
          />
        </li>
      ))}
    </ul>
  );
}
