// Compact task-count summary: total / active / completed, shown as stat chips.
export default function TaskSummary({ counts }) {
  const items = [
    { label: 'Total', value: counts.all, dot: 'bg-slate-400' },
    { label: 'Active', value: counts.active, dot: 'bg-blue-500' },
    { label: 'Completed', value: counts.completed, dot: 'bg-emerald-500' },
  ];

  return (
    <dl aria-label="Task summary" className="flex flex-wrap gap-2">
      {items.map(({ label, value, dot }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur"
        >
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
          <dt className="text-xs font-medium text-slate-500">{label}</dt>
          <dd className="text-sm font-bold text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
