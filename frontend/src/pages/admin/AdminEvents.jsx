import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { getEvents, deleteEvent, errMsg } from '../../services/api';
import useFetch from '../../hooks/useFetch';
import { Skeleton, Empty, ErrorBox, Modal, Badge, statusColor } from '../../components/ui';
import { fmtDate, eventStatus } from '../../utils/format';
export default function AdminEvents() {
  const [del, setDel] = useState(null);
  const { data, loading, error, reload } = useFetch(() => getEvents({ limit: 100 }));
  const confirm = async () => {
    try { await deleteEvent(del._id); toast.success('Event deleted'); setDel(null); reload(); } catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <div>
      <div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-bold">Events</h1><Link to="/admin/events/new" className="btn-primary"><Plus size={16} />Add Event</Link></div>
      {loading ? <Skeleton className="h-64" /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data.events.length ? <Empty /> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr>{['Event', 'Category', 'Date', 'Venue', 'Registrations', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{data.events.map(e => { const st = eventStatus(e); return (
            <tr key={e._id} className="border-t"><td className="px-4 py-3 font-medium">{e.title}</td><td className="px-4 py-3">{e.category}</td><td className="px-4 py-3">{fmtDate(e.date)}</td><td className="px-4 py-3">{e.venue}</td>
              <td className="px-4 py-3">{e.registrationCount}/{e.maxParticipants}</td><td className="px-4 py-3"><Badge color={statusColor(st)}>{st}</Badge></td>
              <td className="px-4 py-3"><div className="flex gap-3"><Link to={`/events/${e._id}`} title="View"><Eye size={16} /></Link><Link to={`/admin/events/${e._id}/edit`} title="Edit" className="text-indigo-600"><Pencil size={16} /></Link><button title="Delete" className="text-red-600" onClick={() => setDel(e)}><Trash2 size={16} /></button></div></td></tr>); })}</tbody></table></div>
      )}
      {del && <Modal title="Delete Event" onClose={() => setDel(null)}><p className="text-slate-600">Are you sure you want to delete this event?</p><p className="mt-1 text-sm font-semibold">{del.title}</p><div className="mt-5 flex justify-end gap-2"><button className="btn-outline" onClick={() => setDel(null)}>Cancel</button><button className="btn-danger" onClick={confirm}>Delete</button></div></Modal>}
    </div>
  );
}
