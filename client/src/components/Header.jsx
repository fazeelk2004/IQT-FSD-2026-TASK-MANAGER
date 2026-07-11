// Application header: product name and a short subtitle.
export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          IQT Smart Task Manager
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Organise Your Work, Set Priorities, And Track Progress.
        </p>
      </div>
    </header>
  );
}
