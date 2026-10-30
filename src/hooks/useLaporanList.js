import { useState, useEffect, useRef, useCallback } from 'react';
import { laporanAPI } from '../services/api';
import { getErrorMessage } from '../utils/error';

const normalizeList = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export function useLaporanList(filters = {}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);
  const abortRef = useRef(null);
  const seqRef = useRef(0);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await laporanAPI.list(JSON.parse(filtersKey), { signal: controller.signal });
      if (seq !== seqRef.current) return;
      setReports(normalizeList(res.data));
      setError(null);
    } catch (err) {
      if (controller.signal.aborted) return;
      if (seq !== seqRef.current) return;
      setError(getErrorMessage(err));
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { reports, setReports, loading, error, reload: load };
}

export default useLaporanList;
