import { useState, useEffect, useRef, useCallback } from 'react';
import { laporanAPI } from '../services/api';
import { getErrorMessage } from '../utils/error';
import { useAuthStore } from '../stores/useAuthStore';

const normalizeList = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export function useLaporanList(filters = {}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

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
      // Admin kecamatan: filter by kecamatan
      const queryParams = user?.id_role === 2 
        ? { ...JSON.parse(filtersKey), id_kecamatan: user.id_kecamatan || user.id_kecamatan }
        : JSON.parse(filtersKey);
      
      const res = await laporanAPI.list(queryParams, { signal: controller.signal });
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
  }, [filtersKey, user?.id_role, user?.id_kecamatan]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { reports, setReports, loading, error, reload: load };
}

export default useLaporanList;