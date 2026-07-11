// Compact task-count summary: total / active / completed.
export default function TaskSummary({ counts }) {
  const items = [
    { label: 'Total', value: counts.all },
    { label: 'Active', value: counts.active },
    { label: 'Completed', value: counts.completed },
  ];

  return (
    <dl
      aria-label="Task summary"
      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm"
    >
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <dt className="text-slate-500">{label}</dt>
          <dd className="font-semibold text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
