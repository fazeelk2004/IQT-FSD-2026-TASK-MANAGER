// Application header: branded logo mark, product name, and a short subtitle.
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/30">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
            IQT Smart Task Manager
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Organise your work, set priorities, and track progress.
          </p>
        </div>
      </div>
    </header>
  );
}
