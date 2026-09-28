import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { fmtDate, eventStatus } from '../utils/format';
import { Badge, statusColor } from './ui';
export default function EventCard({ event: e, onRegister }) {
  const st = eventStatus(e);
  return (
    <div className="card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-44 bg-gradient-to-br from-indigo-500 to-purple-600">{e.image && <img src={e.image} alt={e.title} className="h-full w-full object-cover" loading="lazy" onError={ev => (ev.target.style.display = 'none')} />}</div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between"><Badge>{e.category}</Badge><Badge color={statusColor(st)}>{st}</Badge></div>
        {e.club?.name && <p className="text-xs font-semibold text-indigo-600">{e.club.name}</p>}
        <Link to={`/events/${e._id}`} className="text-lg font-bold hover:text-indigo-600">{e.title}</Link>
        <p className="line-clamp-2 text-sm text-slate-500">{e.description}</p>
        <div className="mt-1 space-y-1 text-sm text-slate-600">
          <p className="flex items-center gap-2"><Calendar size={14} /> {fmtDate(e.date)}</p>
          <p className="flex items-center gap-2"><Clock size={14} /> {e.time}</p>
          <p className="flex items-center gap-2"><MapPin size={14} /> {e.venue}</p>
          <p className="flex items-center gap-2"><Users size={14} /> {e.availableSeats} seats left</p>
        </div>
        <div className="mt-auto flex gap-2 pt-3">
          <Link to={`/events/${e._id}`} className="btn-outline flex-1">Details</Link>
          <button className="btn-primary flex-1" disabled={st !== 'Open'} onClick={() => onRegister(e)}>Register</button>
        </div>
      </div>
    </div>
  );
}
