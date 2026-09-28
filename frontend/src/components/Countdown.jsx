import { useEffect, useState } from 'react';
export default function Countdown({ to }) {
  const calc = () => Math.max(0, new Date(to) - new Date());
  const [ms, setMs] = useState(calc);
  useEffect(() => { const t = setInterval(() => setMs(calc()), 1000); return () => clearInterval(t); }, [to]); // eslint-disable-line
  const s = Math.floor(ms / 1000);
  const parts = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor(s / 3600) % 24], ['Min', Math.floor(s / 60) % 60], ['Sec', s % 60]];
  return <div className="flex gap-3">{parts.map(([l, v]) => <div key={l} className="w-16 rounded-xl bg-white/15 py-2 text-center"><p className="text-2xl font-bold">{String(v).padStart(2, '0')}</p><p className="text-xs opacity-80">{l}</p></div>)}</div>;
}
