import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sun } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("subscriber");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: users } = await api.get("/users");
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return setError("No user found with this email");
      login(user, role);
      navigate(role === "subscriber" ? "/app" : `/${role}`);
    } catch {
      setError("Cannot reach the server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow w-96 space-y-4">
        <div className="flex items-center gap-2 justify-center">
          <Sun className="text-yellow-500" size={32} />
          <h1 className="text-2xl font-bold">SolarShare</h1>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input className="w-full border rounded-lg p-2" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="w-full border rounded-lg p-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="subscriber">Subscriber</option>
          <option value="farmer">Solar Farmer</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-green-600 text-white rounded-lg py-2 font-medium hover:bg-green-700">
          Login
        </button>
        <p className="text-sm text-center text-slate-500">
          New here? <Link to="/register" className="text-green-600">Create account</Link>
        </p>
      </form>
    </div>
  );
}