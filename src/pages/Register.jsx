import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow w-96 space-y-3">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {["name", "email", "phone", "address", "password"].map((f) => (
          <input key={f} required type={f === "password" ? "password" : "text"}
            className="w-full border rounded-lg p-2" placeholder={f[0].toUpperCase() + f.slice(1)}
            value={form[f]} onChange={set(f)} />
        ))}
        <button className="w-full bg-green-600 text-white rounded-lg py-2 font-medium">Register</button>
        <p className="text-sm text-center"><Link to="/" className="text-green-600">Back to login</Link></p>
      </form>
    </div>
  );
}