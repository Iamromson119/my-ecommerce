import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      const redirect = location.state?.from || "/";
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-sand rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-sand rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
        />
        {error && <p className="text-clay text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-moss text-paper px-6 py-3 rounded-md font-medium hover:bg-moss/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        No account?{" "}
        <Link to="/register" className="text-moss underline">
          Register
        </Link>
      </p>
      <p className="mt-4 text-xs text-ink/40">
        Demo admin: admin@example.com / admin123 &middot; Demo customer: customer@example.com / customer123
      </p>
    </div>
  );
};

export default Login;
