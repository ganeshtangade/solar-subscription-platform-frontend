import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [result, setResult] = useState(null);
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      api.post(`/payment/verify/${sessionId}`)
        .then((r) => setResult(r.data))
        .catch(() => setResult({ message: "Verification failed" }));
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow text-center space-y-3">
        <h1 className="text-2xl font-bold text-green-600">Payment</h1>
        <p>{result ? result.message : "Verifying payment..."}</p>
        <Link to="/app" className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}