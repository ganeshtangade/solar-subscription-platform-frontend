export default function StatCard({ label, value, sub, icon: Icon, color = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${colors[color]}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}