import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getEvents, getClubs } from '../services/api';
import useFetch from '../hooks/useFetch';
import EventCard from '../components/EventCard';
import RegisterModal from '../components/RegisterModal';
import { Skeleton, Empty, ErrorBox } from '../components/ui';
import { CATEGORIES } from '../utils/format';
export default function Events() {
  const [search, setSearch] = useState(''), [q, setQ] = useState(''), [category, setCategory] = useState('All'), [status, setStatus] = useState(''), [page, setPage] = useState(1), [sel, setSel] = useState(null), [club, setClub] = useState('');
  const clubs = useFetch(getClubs);
  useEffect(() => { const t = setTimeout(() => { setQ(search); setPage(1); }, 300); return () => clearTimeout(t); }, [search]);
  const { data, loading, error, reload } = useFetch(() => getEvents({ search: q, club, category, status, page, limit: 9 }), [q, club, category, status, page]);
  const pill = (active) => `rounded-full px-4 py-1.5 text-sm font-medium border ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-100'}`;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">All Events</h1>
      <div className="relative mt-5"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input className="input pl-10" placeholder="Search events by name..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      <select className="input mt-4 sm:w-64" value={club} onChange={e => { setClub(e.target.value); setPage(1); }}><option value="">All clubs</option>{clubs.data?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      <div className="mt-4 flex flex-wrap gap-2">{['All', ...CATEGORIES].map(c => <button key={c} className={pill(category === c)} onClick={() => { setCategory(c); setPage(1); }}>{c}</button>)}</div>
      <div className="mt-2 flex flex-wrap gap-2">{[['', 'Any time'], ['upcoming', 'Upcoming'], ['past', 'Past']].map(([v, l]) => <button key={l} className={pill(status === v)} onClick={() => { setStatus(v); setPage(1); }}>{l}</button>)}</div>
      <div className="mt-6">
        {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} />)}</div>
          : error ? <ErrorBox message={error} onRetry={reload} />
          : !data.events.length ? <Empty /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.events.map(e => <EventCard key={e._id} event={e} onRegister={setSel} />)}</div>}
      </div>
      {data && data.pages > 1 && <div className="mt-8 flex items-center justify-center gap-3"><button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button><span className="text-sm">Page {data.page} of {data.pages}</span><button className="btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div>}
      {sel && <RegisterModal event={sel} onClose={() => setSel(null)} onDone={reload} />}
    </div>
  );
}
