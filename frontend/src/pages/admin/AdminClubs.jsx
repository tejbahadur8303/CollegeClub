import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getClubs, createClub, updateClub, deleteClub, errMsg } from '../../services/api';
import usePolling from '../../hooks/usePolling';
import LiveBadge from '../../components/LiveBadge';
import { Skeleton, Empty, ErrorBox, Modal } from '../../components/ui';
import { CATEGORIES } from '../../utils/format';
const blank = { name: '', category: 'Technical', description: '', logo: '' };
export default function AdminClubs() {
  const { data, loading, error, reload, updatedAt } = usePolling(getClubs);
  const [form, setForm] = useState(null), [del, setDel] = useState(null), [busy, setBusy] = useState(false);
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const save = async e => {
    e.preventDefault(); setBusy(true);
    try { form._id ? await updateClub(form._id, form) : await createClub(form); toast.success(form._id ? 'Club updated' : 'Club created'); setForm(null); reload(); }
    catch (er) { toast.error(errMsg(er)); } finally { setBusy(false); }
  };
  const remove = async () => { try { await deleteClub(del._id); toast.success('Club deleted'); setDel(null); reload(); } catch (er) { toast.error(errMsg(er)); } };
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">Clubs</h1><div className="flex items-center gap-3"><LiveBadge at={updatedAt} /><button className="btn-primary" onClick={() => setForm(blank)}><Plus size={16} />Add Club</button></div></div>
      {loading ? <Skeleton className="h-64" /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data.length ? <Empty title="No clubs found." sub="" /> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr>{['Club', 'Category', 'Members', 'Description', 'Actions'].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{data.map(c => <tr key={c._id} className="border-t"><td className="px-4 py-3 font-medium">{c.name}</td><td className="px-4 py-3">{c.category}</td><td className="px-4 py-3 font-semibold">{c.memberCount}</td><td className="max-w-xs truncate px-4 py-3 text-slate-500">{c.description}</td>
            <td className="px-4 py-3"><div className="flex gap-3"><button className="text-indigo-600" onClick={() => setForm(c)}><Pencil size={16} /></button><button className="text-red-600" onClick={() => setDel(c)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>
      )}
      {form && <Modal title={form._id ? 'Edit Club' : 'Add Club'} onClose={() => setForm(null)}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label">Club Name</label><input className="input" required value={form.name} onChange={set('name')} /></div>
          <div><label className="label">Category</label><select className="input" value={form.category} onChange={set('category')}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Description</label><textarea rows={3} className="input" required value={form.description} onChange={set('description')} /></div>
          <div><label className="label">Logo URL (optional)</label><input className="input" value={form.logo || ''} onChange={set('logo')} /></div>
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Saving...' : 'Save Club'}</button>
        </form></Modal>}
      {del && <Modal title="Delete Club" onClose={() => setDel(null)}><p>Delete <b>{del.name}</b>? Its events, members and registrations will also be deleted.</p><div className="mt-5 flex justify-end gap-2"><button className="btn-outline" onClick={() => setDel(null)}>Cancel</button><button className="btn-danger" onClick={remove}>Delete</button></div></Modal>}
    </div>
  );
}
