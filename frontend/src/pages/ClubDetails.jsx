import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { getClub, getEvents } from '../services/api';
import useFetch from '../hooks/useFetch';
import EventCard from '../components/EventCard';
import RegisterModal from '../components/RegisterModal';
import { Skeleton, Empty, ErrorBox, Badge } from '../components/ui';
export default function ClubDetails() {
  const { slug } = useParams(); const [joining, setJoining] = useState(false), [sel, setSel] = useState(null);
  const club = useFetch(() => getClub(slug), [slug]);
  const events = useFetch(() => club.data ? getEvents({ club: club.data._id, limit: 50 }).then(d => d.events) : Promise.resolve([]), [club.data?._id]);
  if (club.loading) return <div className="mx-auto max-w-5xl px-4 py-10"><Skeleton className="h-48" /></div>;
  if (club.error) return <div className="mx-auto max-w-5xl px-4 py-10"><ErrorBox message={club.error} onRetry={club.reload} /><Link to="/clubs" className="btn-outline mt-4">Back to clubs</Link></div>;
  const c = club.data;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div><Badge>{c.category}</Badge><h1 className="mt-2 text-3xl font-extrabold">{c.name}</h1><p className="mt-2 max-w-2xl text-slate-600">{c.description}</p><p className="mt-3 flex items-center gap-2 text-sm"><Users size={16} />{c.memberCount} members</p></div>
        <button className="btn-primary" onClick={() => setJoining(true)}>Join Club</button>
      </div>
      <h2 className="mb-4 mt-10 text-2xl font-bold">Events by {c.name}</h2>
      {events.loading ? <Skeleton /> : !events.data?.length ? <Empty sub="This club has no events yet." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{events.data.map(e => <EventCard key={e._id} event={e} onRegister={setSel} />)}</div>}
      {joining && <RegisterModal club={c} onClose={() => setJoining(false)} onDone={club.reload} />}
      {sel && <RegisterModal event={sel} onClose={() => setSel(null)} onDone={events.reload} />}
    </div>
  );
}
