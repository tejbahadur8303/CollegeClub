import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Trash2 } from 'lucide-react';
import { getMemberships, getClubs, deleteMembership, errMsg } from '../../services/api';
import usePolling from '../../hooks/usePolling';
import useFetch from '../../hooks/useFetch';
import LiveBadge from '../../components/LiveBadge';
import { Skeleton, Empty, ErrorBox, Modal } from '../../components/ui';
import { fmtDate } from '../../utils/format';
export default function Memberships() {
  const [search, setSearch] = useState(''), [q, setQ] = useState(''), [club, setClub] = useState(''), [page, setPage] = useState(1), [del, setDel] = useState(null);
  useEffect(() => { const t = setTimeout(() => { setQ(search); setPage(1); }, 300); return () => clearTimeout(t); }, [search]);
  const clubs = useFetch(getClubs);
  const { data, loading, error, reload, updatedAt } = usePolling(() => getMemberships({ search: q, club, page, limit: 15 }), [q, club, page]);
  const exportCsv = async () => {
    try {
      const all = await getMemberships({ search: q, club, limit: 2000 });
      const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const rows = [['Membership ID', 'Name', 'Email', 'College', 'Year', 'Phone', 'Club', 'Joined At'], ...all.memberships.map(m => [m.membershipId, m.name, m.email, m.college, m.year, m.phone, m.club?.name, new Date(m.joinedAt).toISOString()])];
      const url = URL.createObjectURL(new Blob([rows.map(r => r.map(esc).join(',')).join('\n')], { type: 'text/csv' }));
      Object.assign(document.createElement('a'), { href: url, download: 'memberships.csv' }).click(); URL.revokeObjectURL(url); toast.success('CSV exported');
    } catch (e) { toast.error(errMsg(e)); }
  };
  const remove = async () => { try { await deleteMembership(del._id); toast.success('Membership deleted'); setDel(null); reload(); } catch (e) { toast.error(errMsg(e)); } };
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">Club Members</h1><div className="flex items-center gap-3"><LiveBadge at={updatedAt} /><button className="btn-primary" onClick={exportCsv}><Download size={16} />Export CSV</button></div></div>
      <div className="card mb-4 grid gap-3 p-4 md:grid-cols-2">
        <input className="input" placeholder="Search name, email or ID" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input" value={club} onChange={e => { setClub(e.target.value); setPage(1); }}><option value="">All clubs</option>{clubs.data?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      </div>
      {loading ? <div><p className="mb-2 text-sm text-slate-500">Loading members...</p><Skeleton className="h-64" /></div> : error ? <ErrorBox message={error} onRetry={reload} /> : !data.memberships.length ? <Empty title="No members found." sub="" /> : (
        <>
          <div className="card overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>{['Membership ID', 'Name', 'Email', 'College', 'Year', 'Phone', 'Club', 'Joined', 'Actions'].map(h => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}</tr></thead>
            <tbody>{data.memberships.map(m => <tr key={m._id} className="border-t"><td className="px-3 py-3 font-mono text-xs">{m.membershipId}</td><td className="px-3 py-3 font-medium">{m.name}</td><td className="px-3 py-3">{m.email}</td><td className="px-3 py-3">{m.college}</td><td className="px-3 py-3">{m.year}</td><td className="px-3 py-3">{m.phone}</td><td className="px-3 py-3 font-medium text-indigo-700">{m.club?.name || '—'}</td><td className="px-3 py-3">{fmtDate(m.joinedAt)}</td>
              <td className="px-3 py-3"><button className="text-red-600" onClick={() => setDel(m)}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>
          <div className="mt-4 flex items-center justify-between text-sm"><span>{data.total} total</span><div className="flex items-center gap-2"><button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button><span>Page {data.page} / {data.pages || 1}</span><button className="btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div></div>
        </>
      )}
      {del && <Modal title="Delete Membership" onClose={() => setDel(null)}><p>Remove <b>{del.name}</b> from {del.club?.name}?</p><div className="mt-5 flex justify-end gap-2"><button className="btn-outline" onClick={() => setDel(null)}>Cancel</button><button className="btn-danger" onClick={remove}>Delete</button></div></Modal>}
    </div>
  );
}
