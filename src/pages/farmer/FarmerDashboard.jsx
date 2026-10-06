import { useEffect, useState } from "react";
import { Sun, Zap, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";
import StatCard from "../../components/StatCard";

export default function FarmerDashboard() {
  const [projects, setProjects] = useState([]);
  const [generation, setGeneration] = useState([]);
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState({ project_id: "", power_kw: "", energy_kwh: "" });

  const load = () => {
    api.get("/projects").then((r) => setProjects(r.data));
    api.get("/energy-generation").then((r) => setGeneration(r.data));
    api.get("/subscriptions").then((r) => setSubs(r.data));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/energy-generation", {
        project_id: Number(form.project_id),
        power_kw: Number(form.power_kw),
        energy_kwh: Number(form.energy_kwh),
      });
      setForm({ project_id: "", power_kw: "", energy_kwh: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed");
    }
  };

  const totalCapacity = projects.reduce((s, p) => s + p.capacity_kw, 0);
  const totalGen = generation.reduce((s, g) => s + g.energy_kwh, 0);
  const chartData = generation.map((g) => ({
    date: new Date(g.recorded_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    kwh: g.energy_kwh,
  }));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={projects.length} icon={Sun} color="blue" />
        <StatCard label="Total Capacity" value={`${totalCapacity} kW`} icon={Zap} color="purple" />
        <StatCard label="Total Generation" value={`${totalGen.toFixed(1)} kWh`} icon={Zap} color="orange" />
        <StatCard label="Subscribers" value={subs.length} icon={Users} color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Energy Production Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" /><YAxis /><Tooltip />
              <Bar dataKey="kwh" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
          <h2 className="font-semibold">Record Generation</h2>
          <select required className="w-full border rounded-lg p-2" value={form.project_id}
            onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
            <option value="">Select project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.project_name}</option>)}
          </select>
          <input required type="number" step="any" placeholder="Power (kW)" className="w-full border rounded-lg p-2"
            value={form.power_kw} onChange={(e) => setForm({ ...form, power_kw: e.target.value })} />
          <input required type="number" step="any" placeholder="Energy (kWh)" className="w-full border rounded-lg p-2"
            value={form.energy_kwh} onChange={(e) => setForm({ ...form, energy_kwh: e.target.value })} />
          <button className="w-full bg-green-600 text-white rounded-lg py-2">Save</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-semibold mb-3">My Solar Projects</h2>
        {projects.map((p) => (
          <div key={p.id} className="flex justify-between py-2 border-b text-sm">
            <span>{p.project_name}</span>
            <span>{p.capacity_kw} kW</span>
            <span className="text-green-700">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}