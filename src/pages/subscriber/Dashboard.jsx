import { useEffect, useState } from "react";
import { Zap, Wallet, Leaf, ShieldCheck } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  const { auth } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/dashboard/${auth.user.id}`).then((r) => setData(r.data));
  }, [auth.user.id]);

  if (!data) return <p>Loading...</p>;

  const subs = data.subscriptions;
  const allocations = subs.flatMap((s) => s.energy_allocations);
  const payments = subs.flatMap((s) => s.payments);

  const totalEnergy = allocations.reduce((sum, a) => sum + a.allocated_kwh, 0);
  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const co2 = (totalEnergy * 0.82).toFixed(1); // approx. India grid factor, kg CO2/kWh

  const chartData = allocations.map((a) => ({
    date: new Date(a.allocated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    kwh: a.allocated_kwh,
  }));

  const verified = allocations.filter((a) => a.blockchain_hash);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Energy Received" value={`${totalEnergy.toFixed(1)} kWh`} icon={Zap} color="green" />
        <StatCard label="Total Paid" value={`₹${totalPaid}`} icon={Wallet} color="blue" />
        <StatCard label="CO₂ Avoided" value={`${co2} kg`} icon={Leaf} color="orange" />
        <StatCard label="Subscriptions" value={subs.length} icon={ShieldCheck} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold mb-4">My Energy Allocation</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="kwh" stroke="#16a34a" fill="#bbf7d0" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subscriptions */}
        <div className="space-y-4">
          {subs.map((s) => (
            <div key={s.subscription_id} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400">My Subscription</p>
                  <p className="font-semibold">{s.solar_project.project_name}</p>
                  <p className="text-sm text-slate-500">{s.solar_project.location}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {s.subscription_status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div><p className="text-slate-400">Plan</p><p className="font-medium">{s.plan.plan_name}</p></div>
                <div><p className="text-slate-400">Monthly</p><p className="font-medium">₹{s.plan.monthly_fee}</p></div>
                <div><p className="text-slate-400">Energy Share</p><p className="font-medium">{s.plan.energy_share} kWh</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain transactions */}
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-semibold mb-4">Blockchain Verification</h2>
        {verified.length === 0 && <p className="text-slate-400 text-sm">No verified allocations yet.</p>}
        <div className="divide-y">
          {allocations.map((a) => (
            <div key={a.allocation_id} className="py-3 flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">Energy Allocated: {a.allocated_kwh} kWh</p>
                <p className="text-slate-400 font-mono text-xs">
                  {a.blockchain_hash ? `${a.blockchain_hash.slice(0, 10)}...${a.blockchain_hash.slice(-6)}` : "No hash"}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                a.verification_status === "Verified" ? "bg-green-100 text-green-700"
                : a.verification_status === "Failed" ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"}`}>
                {a.verification_status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-semibold mb-4">Recent Transactions</h2>
        <div className="divide-y">
          {payments.map((p) => (
            <div key={p.payment_id} className="py-3 flex justify-between text-sm">
              <span>Subscription Payment #{p.payment_id}</span>
              <span className="font-medium">- ₹{p.amount} ({p.status})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}