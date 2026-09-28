export default function LiveBadge({ at }) {
  return <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />Live{at && ` · updated ${at.toLocaleTimeString()}`}</span>;
}
