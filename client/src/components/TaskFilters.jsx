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
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
