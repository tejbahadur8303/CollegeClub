import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Trash2 } from 'lucide-react';
import { getRegistrations, getEvents, getClubs, deleteRegistration, errMsg } from '../../services/api';
import useFetch from '../../hooks/useFetch';
import usePolling from '../../hooks/usePolling';
import LiveBadge from '../../components/LiveBadge';
import { Skeleton, Empty, ErrorBox, Modal } from '../../components/ui';
import { fmtDate, YEARS } from '../../utils/format';
export default function Registrations() {
  const [search, setSearch] = useState(''), [q, setQ] = useState(''), [event, setEvent] = useState(''), [club, setClub] = useState(''), [year, setYear] = useState(''), [date, setDate] = useState(''), [page, setPage] = useState(1), [del, setDel] = useState(null);
  useEffect(() => { const t = setTimeout(() => { setQ(search); setPage(1); }, 300); return () => clearTimeout(t); }, [search]);
  const evs = useFetch(() => getEvents({ limit: 100 }).then(d => d.events));
  const clubs = useFetch(getClubs);
  const { data, loading, error, reload, updatedAt } = usePolling(() => getRegistrations({ search: q, club, event, year, date, page, limit: 15 }), [q, club, event, year, date, page]);
  const exportCsv = async () => {
    try {
      const all = await getRegistrations({ search: q, club, event, year, date, limit: 2000 });
      const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const rows = [['Registration ID', 'Name', 'Email', 'College', 'Year', 'Phone', 'Event', 'Club', 'Registered At', 'Status'], ...all.registrations.map(r => [r.registrationId, r.name, r.email, r.college, r.year, r.phone, r.event?.title, r.club?.name, new Date(r.registeredAt).toISOString(), r.status])];
      const url = URL.createObjectURL(new Blob([rows.map(r => r.map(esc).join(',')).join('\n')], { type: 'text/csv' }));
      Object.assign(document.createElement('a'), { href: url, download: 'registrations.csv' }).click(); URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch (e) { toast.error(errMsg(e)); }
  };
  const remove = async () => { try { await deleteRegistration(del._id); toast.success('Registration deleted'); setDel(null); reload(); } catch (e) { toast.error(errMsg(e)); } };
  const reset = fn => e => { fn(e.target.value); setPage(1); };
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">Registrations</h1><div className="flex items-center gap-3"><LiveBadge at={updatedAt} /><button className="btn-primary" onClick={exportCsv}><Download size={16} />Export CSV</button></div></div>
      <div className="card mb-4 grid gap-3 p-4 md:grid-cols-5">
        <input className="input" placeholder="Search name, email or ID" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input" value={club} onChange={reset(setClub)}><option value="">All clubs</option>{clubs.data?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
        <select className="input" value={event} onChange={reset(setEvent)}><option value="">All events</option>{evs.data?.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}</select>
        <select className="input" value={year} onChange={reset(setYear)}><option value="">All years</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select>
        <input className="input" type="date" value={date} onChange={reset(setDate)} />
      </div>
      {loading ? <div><p className="mb-2 text-sm text-slate-500">Loading registrations...</p><Skeleton className="h-64" /></div> : error ? <ErrorBox message={error} onRetry={reload} /> : !data.registrations.length ? <Empty title="No registrations found." sub="" /> : (
        <>
          <div className="card overflow-x-auto"><table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>{['Registration ID', 'Student Name', 'Email', 'College', 'Year', 'Phone', 'Event', 'Club', 'Registration Date', 'Status', 'Actions'].map(h => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}</tr></thead>
            <tbody>{data.registrations.map(r => <tr key={r._id} className="border-t"><td className="px-3 py-3 font-mono text-xs">{r.registrationId}</td><td className="px-3 py-3 font-medium">{r.name}</td><td className="px-3 py-3">{r.email}</td><td className="px-3 py-3">{r.college}</td><td className="px-3 py-3">{r.year}</td><td className="px-3 py-3">{r.phone}</td><td className="px-3 py-3">{r.event?.title || '—'}</td><td className="px-3 py-3 font-medium text-indigo-700">{r.club?.name || '—'}</td><td className="px-3 py-3">{fmtDate(r.registeredAt)}</td><td className="px-3 py-3">{r.status}</td>
              <td className="px-3 py-3"><button className="text-red-600" onClick={() => setDel(r)}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>
          <div className="mt-4 flex items-center justify-between text-sm"><span>{data.total} total</span><div className="flex items-center gap-2"><button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button><span>Page {data.page} / {data.pages || 1}</span><button className="btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div></div>
        </>
      )}
      {del && <Modal title="Delete Registration" onClose={() => setDel(null)}><p>Delete registration <b>{del.registrationId}</b> for {del.name}?</p><div className="mt-5 flex justify-end gap-2"><button className="btn-outline" onClick={() => setDel(null)}>Cancel</button><button className="btn-danger" onClick={remove}>Delete</button></div></Modal>}
    </div>
  );
}
