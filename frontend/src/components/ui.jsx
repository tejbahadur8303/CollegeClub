import { X } from 'lucide-react';
export const Skeleton = ({ className = 'h-64' }) => <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />;
export const Empty = ({ title = 'No events found.', sub = 'Try changing your search or filters.' }) => (
  <div className="card p-10 text-center"><p className="text-lg font-semibold">{title}</p><p className="text-sm text-slate-500">{sub}</p></div>
);
export const ErrorBox = ({ message, onRetry }) => (
  <div className="card border-red-200 bg-red-50 p-6 text-center text-red-700"><p>{message}</p>{onRetry && <button onClick={onRetry} className="btn-outline mt-3">Retry</button>}</div>
);
export const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={onClose}>
    <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold">{title}</h3><button onClick={onClose}><X size={20} /></button></div>
      {children}
    </div>
  </div>
);
export const Badge = ({ children, color = 'indigo' }) => {
  const c = { indigo: 'bg-indigo-100 text-indigo-700', green: 'bg-emerald-100 text-emerald-700', red: 'bg-red-100 text-red-700', slate: 'bg-slate-100 text-slate-600' }[color];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{children}</span>;
};
export const statusColor = s => ({ Open: 'green', Closed: 'red', Completed: 'slate' }[s]);
