"use client";
import { useEffect, useState } from "react";

type Member = {
  id: number;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "" });

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  async function createMember(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ fullName: "", email: "", phone: "", address: "" });
    refresh();
  }

  async function remove(id: number) {
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Members</h1>

      <form onSubmit={createMember} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input className="border rounded p-2" placeholder="Full name" value={form.fullName} onChange={e=>setForm(s=>({ ...s, fullName: e.target.value }))} required />
        <input className="border rounded p-2" placeholder="Email" value={form.email} onChange={e=>setForm(s=>({ ...s, email: e.target.value }))} />
        <input className="border rounded p-2" placeholder="Phone" value={form.phone} onChange={e=>setForm(s=>({ ...s, phone: e.target.value }))} />
        <input className="border rounded p-2" placeholder="Address" value={form.address} onChange={e=>setForm(s=>({ ...s, address: e.target.value }))} />
        <button className="md:col-span-4 bg-black text-white rounded p-2">Add Member</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.sort((a, b) => a.id - b.id).map(m => (
              <tr key={m.id}>
                <td className="p-2 border">{m.id}</td>
                <td className="p-2 border">{m.fullName}</td>
                <td className="p-2 border">{m.email || "—"}</td>
                <td className="p-2 border">{m.phone || "—"}</td>
                <td className="p-2 border space-x-2">
                  <a className="underline" href={`/members/${m.id}`}>Details</a>
                  <a className="underline" href={`/members/${m.id}/history`}>History</a>
                  <button className="text-red-600" onClick={() => remove(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}