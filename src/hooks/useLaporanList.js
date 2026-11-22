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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useAuthStore();

  const filtersKey = JSON.stringify(filters);
  const abortRef = useRef(null);
  const seqRef = useRef(0);

  const load = useCallback(async (pageNum = 1) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);

    try {
      // Admin kecamatan: filter by kecamatan
      const baseParams = user?.id_role === 2 
        ? { ...JSON.parse(filtersKey), id_kecamatan: user.id_kecamatan || user.id_kecamatan }
        : JSON.parse(filtersKey);
      
      const queryParams = { ...baseParams, page: pageNum, limit: 10 };
      
      const res = await laporanAPI.list(queryParams, { signal: controller.signal });
      if (seq !== seqRef.current) return;
      
      const normalized = normalizeList(res.data);
      setReports(normalized);
      
      // Handle pagination from response
      const pagination = res.data?.pagination || res.data?.meta || {};
      setTotalPages(pagination.total_pages || pagination.last_page || 1);
      setTotalItems(pagination.total_items || pagination.total || normalized.length);
      setPage(pageNum);
      
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
    load(1);
    return () => abortRef.current?.abort();
  }, [load]);

  return { 
    reports, 
    setReports, 
    loading, 
    error, 
    reload: () => load(page),
    page,
    totalPages,
    totalItems,
    setPage,
    hasMore: page < totalPages,
  };
}

export default useLaporanList;