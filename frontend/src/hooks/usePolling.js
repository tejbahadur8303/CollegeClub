import { useEffect, useState, useCallback, useRef } from 'react';
import { errMsg } from '../services/api';
// Fetches immediately, then silently refreshes every `ms` (paused while the tab is hidden).
export default function usePolling(fn, deps = [], ms = 10000) {
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(''), [updatedAt, setUpdatedAt] = useState(null);
  const ref = useRef(fn); ref.current = fn;
  const load = useCallback(() => ref.current().then(d => { setData(d); setError(''); setUpdatedAt(new Date()); }).catch(e => setError(errMsg(e))).finally(() => setLoading(false)), []);
  useEffect(() => { load(); const t = setInterval(() => { if (!document.hidden) load(); }, ms); return () => clearInterval(t); }, deps); // eslint-disable-line
  return { data, loading, error, reload: load, updatedAt };
}
