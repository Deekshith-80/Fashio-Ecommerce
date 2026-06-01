import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../store/authSlice";
import api from "../api/axiosConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white text-black">
      <section className="w-full md:w-1/2 h-full flex items-center justify-center px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <p className="text-[11px] uppercase tracking-[0.5em] text-gray-500">Fashio</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
            SIGN IN TO FASHIO
          </h1>
          <p className="mt-4 text-sm leading-6 text-gray-500">
            Access your account, track your orders, and continue shopping with a minimal,
            premium experience.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full border border-gray-300 focus:border-black outline-none px-4 py-3 transition-colors bg-white"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2.5 bg-white px-1 text-[10px] uppercase tracking-[0.3em] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:tracking-[0.35em] peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:tracking-[0.3em] peer-focus:text-black"
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full border border-gray-300 focus:border-black outline-none px-4 py-3 transition-colors bg-white"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 bg-white px-1 text-[10px] uppercase tracking-[0.3em] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:tracking-[0.35em] peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:tracking-[0.3em] peer-focus:text-black"
              >
                Password
              </label>
            </div>

            {error ? (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-black bg-black px-4 py-3 text-xs font-medium uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8">
            <Link
              to="/register"
              className="text-sm text-black underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Join Us. Create an Account
            </Link>
          </div>
        </div>
      </section>

      <aside className="hidden md:block w-1/2 h-full">
        <img
          src="https://images.pexels.com/photos/10147904/pexels-photo-10147904.jpeg"
          alt="Editorial fashion"
          className="object-cover w-full h-full"
        />
      </aside>
    </div>
  );
}
