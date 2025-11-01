// app/members/[id]/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

type Member = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  department: string | null;
  semester: string | null;
  createdAt: string;
};

export default function EditMember() {
  const params = useParams() as Record<string, string | string[] | undefined>;
  const rawId = useMemo(() => {
    const v = params?.id;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const id = useMemo(() => {
    if (!rawId) return NaN;
    const n = Number.parseInt(rawId, 10);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }, [rawId]);

  const [m, setM] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);
    setM(null);

    if (!rawId) {
      setError('Missing route parameter: id');
      setLoading(false);
      return;
    }
    if (!Number.isFinite(id)) {
      setError(`Invalid member id: "${rawId}"`);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const res = await fetch(`/api/members/${id}`, { cache: 'no-store', signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Member = await res.json();
        setM(data);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message ?? 'Failed to load member');
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [id, rawId]);

  if (loading) return <p className="text-gray-600">Loading member…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!m) return <p className="text-gray-600">Member not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Member — #{m.id}</h1>
      <div className="rounded-lg border p-4 space-y-2">
        <div><b>Name:</b> {m.fullName}</div>
        <div><b>Email:</b> {m.email}</div>
        <div><b>Phone:</b> {m.phone ?? '—'}</div>
        <div><b>Address:</b> {m.address ?? '—'}</div>
        <div><b>Department:</b> {m.department ?? '—'}</div>
        <div><b>Semester:</b> {m.semester ?? '—'}</div>
        <div><b>Created:</b> {new Date(m.createdAt).toLocaleString()}</div>
      </div>
      {/* ... your form fields bound to `m` ... */}
    </div>
  );
}
