import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createEvent, updateEvent, getEventById, getClubs, errMsg } from '../../services/api';
import { CATEGORIES, toInputDate } from '../../utils/format';
import { Skeleton } from '../../components/ui';
const empty = { club: '', title: '', category: 'Technical', description: '', date: '', time: '', venue: '', organizer: '', registrationDeadline: '', maxParticipants: 100, featured: false, image: '' };
export default function EventForm() {
  const { id } = useParams(); const nav = useNavigate();
  const [f, setF] = useState(empty), [errs, setErrs] = useState({}), [busy, setBusy] = useState(false), [loading, setLoading] = useState(!!id);
  useEffect(() => { if (id) getEventById(id).then(e => setF({ ...e, club: e.club?._id || e.club, date: toInputDate(e.date), registrationDeadline: toInputDate(e.registrationDeadline) })).catch(e => toast.error(errMsg(e))).finally(() => setLoading(false)); }, [id]);
  const [clubs, setClubs] = useState([]);
  useEffect(() => { getClubs().then(c => { setClubs(c); if (!id) setF(p => ({ ...p, club: p.club || c[0]?._id || '' })); }); }, [id]);
  const set = k => e => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const validate = () => {
    const x = {};
    ['club', 'title', 'description', 'date', 'time', 'venue', 'organizer', 'registrationDeadline'].forEach(k => { if (!String(f[k]).trim()) x[k] = 'Required'; });
    if (!(+f.maxParticipants >= 1)) x.maxParticipants = 'Must be at least 1';
    if (f.date && f.registrationDeadline && f.registrationDeadline > f.date) x.registrationDeadline = 'Deadline must be on/before event date';
    setErrs(x); return !Object.keys(x).length;
  };
  const submit = async e => {
    e.preventDefault(); if (!validate()) return; setBusy(true);
    try {
      const body = { ...f, maxParticipants: +f.maxParticipants };
      if (id) { await updateEvent(id, body); toast.success('Event updated'); } else { await createEvent(body); toast.success('Event created'); }
      nav('/admin/events');
    } catch (er) { toast.error(errMsg(er)); } finally { setBusy(false); }
  };
  const F = ({ k, label, type = 'text', wide }) => (<div className={wide ? 'md:col-span-2' : ''}><label className="label">{label}</label>{type === 'textarea' ? <textarea rows={4} className="input" value={f[k]} onChange={set(k)} /> : <input type={type} className="input" value={f[k]} onChange={set(k)} />}{errs[k] && <p className="mt-1 text-xs text-red-600">{errs[k]}</p>}</div>);
  if (loading) return <Skeleton className="h-96" />;
  return (
    <form onSubmit={submit} className="card mx-auto max-w-3xl p-6" noValidate>
      <h1 className="mb-5 text-2xl font-bold">{id ? 'Edit Event' : 'Add Event'}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label">Club</label><select className="input" value={f.club} onChange={set('club')}>{clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>{errs.club && <p className="mt-1 text-xs text-red-600">{errs.club}</p>}</div>
        <F k="title" label="Event Name" />
        <div><label className="label">Category</label><select className="input" value={f.category} onChange={set('category')}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
        <F k="organizer" label="Organizer" />
        <F k="description" label="Description" type="textarea" wide />
        <F k="date" label="Date" type="date" /><F k="time" label="Time (e.g. 10:00 AM)" />
        <F k="venue" label="Venue" /><F k="registrationDeadline" label="Registration Deadline" type="date" />
        <F k="maxParticipants" label="Maximum Participants" type="number" />
        <F k="image" label="Event Image URL" />
        {f.image && <img src={f.image} alt="preview" className="h-32 rounded-xl object-cover md:col-span-2" onError={e => (e.target.style.display = 'none')} />}
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Featured Event</label>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" className="btn-outline" onClick={() => nav('/admin/events')}>Cancel</button><button className="btn-primary" disabled={busy}>{busy ? 'Saving...' : id ? 'Update Event' : 'Create Event'}</button></div>
    </form>
  );
}
