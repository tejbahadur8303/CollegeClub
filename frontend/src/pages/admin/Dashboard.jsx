import { Building2, CalendarDays, CalendarClock, UserPlus, Users, Ticket } from 'lucide-react';
import { getDashboardStats, getRecentEvents, getRecentRegistrations, getRecentMembers, getClubBreakdown } from '../../services/api';
import usePolling from '../../hooks/usePolling';
import LiveBadge from '../../components/LiveBadge';
import { Skeleton, ErrorBox } from '../../components/ui';
import { fmtDate } from '../../utils/format';
export default function Dashboard() {
  const { data, loading, error, reload, updatedAt } = usePolling(() => Promise.all([getDashboardStats(), getRecentEvents(), getRecentRegistrations(), getRecentMembers(), getClubBreakdown()]));
  if (loading) return <div><p className="mb-4 text-slate-500">Loading dashboard...</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-28" />)}</div></div>;
  if (error && !data) return <ErrorBox message={error} onRetry={reload} />;
  const [s, events, regs, members, clubs] = data; const max = Math.max(1, ...s.trends.map(t => t.count)); const cmax = Math.max(1, ...clubs.map(c => Math.max(c.members, c.registrations)));
  const cards = [['Total Clubs', s.totalClubs, Building2], ['Total Events', s.totalEvents, CalendarDays], ['Upcoming Events', s.upcomingEvents, CalendarClock], ['Total Members', s.totalMembers, Users], ['Total Registrations', s.totalRegistrations, Ticket], ["Today's Registrations", s.todayRegistrations, UserPlus]];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">Dashboard</h1><LiveBadge at={updatedAt} /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([l, v, I]) => <div key={l} className="card flex items-center justify-between p-5"><div><p className="text-sm text-slate-500">{l}</p><p className="text-3xl font-extrabold">{v}</p></div><I className="text-indigo-500" /></div>)}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5"><h2 className="mb-4 font-bold">Registration Trends (last 7 days)</h2>
          <div className="flex h-44 items-end gap-2 sm:gap-3">{s.trends.map(t => <div key={t.date} className="flex flex-1 flex-col items-center justify-end gap-1"><span className="text-xs font-semibold">{t.count}</span><div className="w-full rounded-t-lg bg-indigo-500" style={{ height: `${(t.count / max) * 100}%`, minHeight: 4 }} /><span className="text-[10px] text-slate-500">{t.date.slice(5)}</span></div>)}</div></div>
        <div className="card p-5"><h2 className="mb-1 font-bold">Club-wise Members & Registrations</h2><p className="mb-3 flex gap-3 text-xs text-slate-500"><span><b className="text-indigo-600">■</b> Members</span><span><b className="text-emerald-500">■</b> Registrations</span></p>
          <div className="space-y-3">{clubs.map(c => <div key={c._id}><p className="mb-1 text-sm font-medium">{c.name}</p>
            <div className="flex items-center gap-2"><div className="h-2 rounded bg-indigo-500" style={{ width: `${(c.members / cmax) * 100}%`, minWidth: 4 }} /><span className="text-xs">{c.members}</span></div>
            <div className="mt-1 flex items-center gap-2"><div className="h-2 rounded bg-emerald-500" style={{ width: `${(c.registrations / cmax) * 100}%`, minWidth: 4 }} /><span className="text-xs">{c.registrations}</span></div></div>)}</div></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5"><h2 className="mb-3 font-bold">Recent Registrations</h2>{regs.length ? regs.map(r => <div key={r._id} className="border-b py-2 text-sm last:border-0"><p><b>{r.name}</b> → {r.event?.title}</p><p className="text-xs text-slate-500">{r.club?.name} · {fmtDate(r.registeredAt)}</p></div>) : <p className="text-sm text-slate-500">No registrations found.</p>}</div>
        <div className="card p-5"><h2 className="mb-3 font-bold">Recent Members</h2>{members.length ? members.map(m => <div key={m._id} className="border-b py-2 text-sm last:border-0"><p><b>{m.name}</b> joined {m.club?.name}</p><p className="text-xs text-slate-500">{fmtDate(m.joinedAt)}</p></div>) : <p className="text-sm text-slate-500">No members yet.</p>}</div>
        <div className="card p-5"><h2 className="mb-3 font-bold">Recent Events</h2>{events.length ? events.map(e => <div key={e._id} className="border-b py-2 text-sm last:border-0"><p className="font-medium">{e.title}</p><p className="text-xs text-slate-500">{e.club?.name} · {fmtDate(e.date)}</p></div>) : <p className="text-sm text-slate-500">No events yet.</p>}</div>
      </div>
    </div>
  );
}
