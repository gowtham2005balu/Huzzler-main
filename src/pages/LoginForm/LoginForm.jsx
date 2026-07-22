import { useState } from "react";
import API from "../../api/client";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const submit = async () => {
    if (!email || !password) return alert("Please enter email and password!");

    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      if (!res.data || !res.data.user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userEmail", res.data.user.email);
     

  
      if (res.data.user.role === "client") {
        navigate("/client-dashbroad2");
      } else {
        navigate("/freelance-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h3 className="text-lg mb-4">{role ? `${role} Login` : "Login"}</h3>

      <input
        className="p-2 border mb-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        className="p-2 border mb-4 w-full"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button
        className={`p-2 w-full rounded-md text-white ${
          loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
        onClick={submit}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="mt-4 text-center">
        <a href="http://localhost:5000/api/auth/google">
          <button className="flex gap-2 border p-2 rounded mx-auto bg-white">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </a>
      </div>
    </div>
  );
}
