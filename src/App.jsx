import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/subscriber/Dashboard";
import BrowseProjects from "./pages/subscriber/BrowseProjects";
import PaymentSuccess from "./pages/PaymentSuccess";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function Protected({ role, children }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/" />;
  if (auth.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<Navigate to="/app/browse" />} />

          <Route path="/app" element={<Protected role="subscriber"><Layout /></Protected>}>
            <Route index element={<Dashboard />} />
            <Route path="browse" element={<BrowseProjects />} />
          </Route>

          <Route path="/farmer" element={<Protected role="farmer"><Layout /></Protected>}>
            <Route index element={<FarmerDashboard />} />
          </Route>

          <Route path="/admin" element={<Protected role="admin"><Layout /></Protected>}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}