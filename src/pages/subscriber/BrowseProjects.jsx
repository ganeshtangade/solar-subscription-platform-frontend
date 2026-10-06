import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function BrowseProjects() {
  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data));
    api.get("/plans").then((r) => setPlans(r.data));
  }, []);

  const subscribeAndPay = async (plan) => {
    try {
      setLoading(true);
      const sub = await api.post("/subscriptions", {
        user_id: auth.user.id,
        project_id: selected.id,
        plan_id: plan.plan_id,
        status: "Active",
      });
      const pay = await api.post(`/payment/create-checkout-session/${sub.data.id}`);
      window.location.href = pay.data.checkout_url; // redirect to Stripe
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-semibold text-lg mb-3">Available Solar Projects</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id}
              className={`bg-white rounded-xl border shadow-sm p-5 ${selected?.id === p.id ? "ring-2 ring-green-500" : ""}`}>
              <div className="h-28 rounded-lg bg-gradient-to-br from-blue-900 to-blue-600 mb-3" />
              <p className="font-semibold">{p.project_name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={14} /> {p.location}</p>
              <div className="grid grid-cols-2 text-sm mt-3">
                <div><p className="text-slate-400">Capacity</p><p className="font-medium">{p.capacity_kw} kW</p></div>
                <div><p className="text-slate-400">Rate</p><p className="font-medium">₹{p.energy_rate}/kWh</p></div>
              </div>
              <button onClick={() => setSelected(p)}
                className="mt-4 w-full border border-green-600 text-green-700 rounded-lg py-2 text-sm hover:bg-green-50">
                View Plans & Subscribe
              </button>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <section>
          <h2 className="font-semibold text-lg mb-3">Plans for {selected.project_name}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.plan_id} className="bg-white rounded-xl border shadow-sm p-5">
                <p className="font-semibold">{plan.plan_name}</p>
                <p className="text-2xl font-bold mt-1">₹{plan.monthly_fee}<span className="text-sm font-normal text-slate-500"> / month</span></p>
                <p className="text-sm text-slate-500 mt-2">Energy share: {plan.energy_share} kWh</p>
                <p className="text-sm text-slate-400">{plan.description}</p>
                <button disabled={loading} onClick={() => subscribeAndPay(plan)}
                  className="mt-4 w-full bg-green-600 text-white rounded-lg py-2 text-sm hover:bg-green-700 disabled:opacity-50">
                  {loading ? "Please wait..." : "Choose Plan & Pay"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}