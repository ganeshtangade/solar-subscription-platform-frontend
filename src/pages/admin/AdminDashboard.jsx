import { useEffect, useState } from "react";
import { Users, Sun, Zap, FileText } from "lucide-react";
import api from "../../api";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [subs, setSubs] = useState([]);
  const [generation, setGeneration] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [alloc, setAlloc] = useState({ generation_id: "", subscription_id: "" });
  const [busy, setBusy] = useState(false);

  const load = () => {
    api.get("/users").then((r) => setUsers(r.data));
    api.get("/projects").then((r) => setProjects(r.data));
    api.get("/subscriptions").then((r) => setSubs(r.data));
    api.get("/energy-generation").then((r) => setGeneration(r.data));
    api.get("/energy-allocation").then((r) => setAllocations(r.data));
  };
  useEffect(load, []);

  const allocate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/energy-allocation", {
        generation_id: Number(alloc.generation_id),
        subscription_id: Number(alloc.subscription_id),
      });
      setAlloc({ generation_id: "", subscription_id: "" });
    } catch (err) {
      alert(err.response?.data?.detail || "Failed");
    }
    setBusy(false);
    load();
  };

  const deleteFailed = async (id) => {
    await api.delete(`/energy-allocation/${id}`);
    load();
  };

  const totalCapacity = projects.reduce((s, p) => s + p.capacity_kw, 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={users.length} icon={Users} color="blue" />
        <StatCard label="Solar Projects" value={projects.length} icon={Sun} color="purple" />
        <StatCard label="Total Capacity" value={`${totalCapacity} kW`} icon={Zap} color="orange" />
        <StatCard label="Subscriptions" value={subs.length} icon={FileText} color="green" />
      </div>

      <form onSubmit={allocate} className="bg-white rounded-xl border p-5 shadow-sm flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-slate-500">Generation record</label>
          <select required className="block border rounded-lg p-2" value={alloc.generation_id}
            onChange={(e) => setAlloc({ ...alloc, generation_id: e.target.value })}>
            <option value="">Select</option>
            {generation.map((g) => <option key={g.id} value={g.id}>#{g.id} – {g.energy_kwh} kWh (project {g.project_id})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Subscription</label>
          <select required className="block border rounded-lg p-2" value={alloc.subscription_id}
            onChange={(e) => setAlloc({ ...alloc, subscription_id: e.target.value })}>
            <option value="">Select</option>
            {subs.map((s) => <option key={s.id} value={s.id}>#{s.id} – user {s.user_id} (project {s.project_id})</option>)}
          </select>
        </div>
        <button disabled={busy} className="bg-green-600 text-white rounded-lg px-5 py-2 disabled:opacity-50">
          {busy ? "Writing to blockchain..." : "Allocate Energy"}
        </button>
      </form>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-semibold mb-3">Blockchain Transactions</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr><th>ID</th><th>Subscription</th><th>kWh</th><th>Hash</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {allocations.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-2">#{a.id}</td>
                <td>#{a.subscription_id}</td>
                <td>{a.allocated_kwh}</td>
                <td className="font-mono text-xs">{a.blockchain_hash ? a.blockchain_hash.slice(0, 12) + "..." : "-"}</td>
                <td>{a.verification_status}</td>
                <td>
                  {a.verification_status === "Failed" && (
                    <button onClick={() => deleteFailed(a.id)} className="text-red-500 text-xs">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}