'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

type Row = {
  id: number; // this is the ISSUE id
  issuedAt: string;
  dueAt: string;
  returnedAt: string | null;
  book: { id: number; title: string; author: string };
};

export default function History() {
  const params = useParams() as Record<string, string | string[] | undefined>;
  const rawId = useMemo(() => {
    const v = params?.id;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const memberId = useMemo(() => {
    if (!rawId) return NaN;
    const n = Number.parseInt(rawId, 10);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }, [rawId]);

  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setError(null);
    setRows([]);
    setLoading(true);

    if (!rawId) {
      setError('Missing route parameter: id');
      setLoading(false);
      return;
    }
    if (!Number.isFinite(memberId)) {
      setError(`Invalid member id: "${rawId}"`);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const res = await fetch(`/api/members/${memberId}/history`, {
          cache: 'no-store',
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setRows(await res.json());
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message ?? 'Failed to load history');
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [memberId, rawId]);

  async function handleReturn(issueId: number) {
    setSubmittingId(issueId);
    try {
      const res = await fetch(`/api/issues/${issueId}/return`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Return failed (HTTP ${res.status})`);
      }
      const { returnedAt } = await res.json();

      // optimistic update: mark this issue as returned in the list
      setRows((prev) =>
        prev.map((r) =>
          r.id === issueId ? { ...r, returnedAt } : r
        )
      );
    } catch (e: any) {
      alert(e.message ?? 'Could not return this book.');
    } finally {
      setSubmittingId(null);
    }
  }

  if (loading) return <p className="text-gray-600">Loading history…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!rows.length) return <p className="text-gray-600">No history found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Borrowing History — Member #{memberId}</h1>
      <ul className="space-y-3">
        {rows.map((r) => {
          const alreadyReturned = !!r.returnedAt;
          return (
            <li key={r.id} className="rounded-lg border p-3">
              <div><b>Book:</b> {r.book.title} — {r.book.author}</div>
              <div><b>Issued:</b> {new Date(r.issuedAt).toLocaleString()}</div>
              <div><b>Due:</b> {new Date(r.dueAt).toLocaleString()}</div>
              <div><b>Returned:</b> {alreadyReturned ? new Date(r.returnedAt!).toLocaleString() : '—'}</div>

              <button
                className={`px-4 py-2 rounded-2xl ${alreadyReturned ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-black text-white hover:opacity-90'}`}
                disabled={alreadyReturned || submittingId === r.id}
                onClick={() => handleReturn(r.id)}
              >
                {submittingId === r.id ? 'Returning…' : (alreadyReturned ? 'Already Returned' : 'Return Book')}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
