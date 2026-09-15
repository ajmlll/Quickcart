function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 font-bold text-xl">
          ⚡ QuickCart Client
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Client Skeleton Ready
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed">
          Configured with React, Vite, TypeScript, Tailwind CSS, React Router DOM, and Redux Toolkit.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-mono text-left pt-2">
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <span className="text-indigo-400 block font-semibold">Router:</span> Installed
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <span className="text-indigo-400 block font-semibold">Redux:</span> Configured
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <span className="text-indigo-400 block font-semibold">Tailwind:</span> v4 Active
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <span className="text-indigo-400 block font-semibold">TypeScript:</span> Strict
          </div>
        </div>

        <div className="pt-2">
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
            Ready for Route & Feature Implementation
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
