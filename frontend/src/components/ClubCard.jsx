import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Badge } from './ui';
export default function ClubCard({ club: c, onJoin }) {
  return (
    <div className="card flex flex-col gap-3 p-5 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-extrabold text-white">{c.logo ? <img src={c.logo} alt="" className="h-full w-full object-cover" /> : c.name[0]}</div>
        <div><Link to={`/clubs/${c.slug}`} className="font-bold hover:text-indigo-600">{c.name}</Link><div className="mt-0.5"><Badge>{c.category}</Badge></div></div>
      </div>
      <p className="line-clamp-2 text-sm text-slate-500">{c.description}</p>
      <p className="flex items-center gap-2 text-sm text-slate-600"><Users size={14} />{c.memberCount} members</p>
      <div className="mt-auto flex gap-2"><Link to={`/clubs/${c.slug}`} className="btn-outline flex-1">View</Link><button className="btn-primary flex-1" onClick={() => onJoin(c)}>Join Club</button></div>
    </div>
  );
}
