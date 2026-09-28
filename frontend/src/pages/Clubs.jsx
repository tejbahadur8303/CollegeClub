import { useState } from 'react';
import { getClubs } from '../services/api';
import useFetch from '../hooks/useFetch';
import ClubCard from '../components/ClubCard';
import RegisterModal from '../components/RegisterModal';
import { Skeleton, Empty, ErrorBox } from '../components/ui';
export default function Clubs() {
  const [sel, setSel] = useState(null);
  const { data, loading, error, reload } = useFetch(getClubs);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Our Clubs</h1><p className="mt-1 text-slate-500">Find your community and join a club today.</p>
      <div className="mt-6">
        {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-52" />)}</div>
          : error ? <ErrorBox message={error} onRetry={reload} />
          : !data.length ? <Empty title="No clubs found." sub="" /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.map(c => <ClubCard key={c._id} club={c} onJoin={setSel} />)}</div>}
      </div>
      {sel && <RegisterModal club={sel} onClose={() => setSel(null)} onDone={reload} />}
    </div>
  );
}
