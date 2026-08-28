import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-6">Create an account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-sand rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
        />
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-sand rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
        />
        {error && <p className="text-clay text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-moss text-paper px-6 py-3 rounded-md font-medium hover:bg-moss/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="text-moss underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
