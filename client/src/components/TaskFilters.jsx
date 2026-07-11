const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

// Presentational filter bar. Counts live in TaskSummary to avoid duplication.
export default function TaskFilters({ filter, onFilterChange }) {
  return (
    <div role="group" aria-label="Filter tasks" className="flex flex-wrap gap-2">
      {FILTERS.map(({ key, label }) => {
        const isActive = filter === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'border border-slate-200 bg-white/70 text-slate-600 backdrop-blur hover:bg-white hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
