import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Users, Hourglass } from 'lucide-react';
import { getEventById } from '../services/api';
import useFetch from '../hooks/useFetch';
import RegisterModal from '../components/RegisterModal';
import { Skeleton, ErrorBox, Badge, statusColor } from '../components/ui';
import { fmtDate, eventStatus } from '../utils/format';
export default function EventDetails() {
  const { id } = useParams(); const [open, setOpen] = useState(false);
  const { data: e, loading, error, reload } = useFetch(() => getEventById(id), [id]);
  if (loading) return <div className="mx-auto max-w-4xl px-4 py-10"><Skeleton className="h-80" /></div>;
  if (error) return <div className="mx-auto max-w-4xl px-4 py-10"><ErrorBox message={error} onRetry={reload} /><Link to="/events" className="btn-outline mt-4">Back to events</Link></div>;
  const st = eventStatus(e);
  const info = [[Calendar, 'Date', fmtDate(e.date)], [Clock, 'Time', e.time], [MapPin, 'Venue', e.venue], [Users, 'Club', e.club?.name || '—'], [User, 'Organizer', e.organizer], [Hourglass, 'Registration Deadline', fmtDate(e.registrationDeadline)], [Users, 'Max Participants', e.maxParticipants], [Users, 'Available Seats', e.availableSeats]];
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="h-64 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 md:h-80">{e.image && <img src={e.image} alt={e.title} className="h-full w-full object-cover" />}</div>
      <div className="mt-6 flex flex-wrap items-center gap-2"><Badge>{e.category}</Badge><Badge color={statusColor(st)}>{st}</Badge></div>
      <h1 className="mt-2 text-3xl font-extrabold">{e.title}</h1>
      <p className="mt-4 whitespace-pre-line text-slate-600">{e.description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">{info.map(([I, l, v]) => <div key={l} className="card flex items-center gap-3 p-4"><I className="text-indigo-600" size={18} /><div><p className="text-xs text-slate-500">{l}</p><p className="font-semibold">{v}</p></div></div>)}</div>
      <button className="btn-primary mt-6 w-full sm:w-auto" disabled={st !== 'Open'} onClick={() => setOpen(true)}>{st === 'Open' ? 'Register Now' : `Registration ${st}`}</button>
      {open && <RegisterModal event={e} onClose={() => setOpen(false)} onDone={reload} />}
    </div>
  );
}
