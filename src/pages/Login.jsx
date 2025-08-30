import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Demo credentials
    if (email === "admin@gmail.com" && password === "1234") {
      const base64UrlEncode = (obj) => {
        const json = JSON.stringify(obj);
        const b64 = btoa(json);
        return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      };
      const header = { alg: "none", typ: "JWT" };
      const payload = {
        sub: "admin-user-id",
        email: "admin@gmail.com",
        is_admin: true,
        roles: ["admin"],
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24h expiry
      };
      const fakeToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`;

      localStorage.setItem("token", fakeToken);
      navigate(from, { replace: true });
    } else {
      setError("Invalid credentials. Use admin@gmail.com / 1234");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6 shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">Admin Login</h1>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-3 py-2 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
