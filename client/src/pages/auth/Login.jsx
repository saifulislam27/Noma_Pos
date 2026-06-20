import { useState } from "react";
import { login as loginService, register as registerService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);

  // LOGIN FORM
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // REGISTER FORM
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "cashier",
  });

  // LOGIN SUBMIT
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert("Username dan password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const data = await loginService(form);

      setAuth(data);

      if (data.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/cashier");
      }
    } catch (err) {
      console.error(err);
      alert("Login gagal, periksa username/password");
    } finally {
      setLoading(false);
    }
  };

  // REGISTER SUBMIT
  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !registerForm.name ||
      !registerForm.username ||
      !registerForm.password
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    try {
      await registerService(registerForm);

      alert("Register berhasil, silakan login");

      setTab("login");

      setRegisterForm({
        name: "",
        username: "",
        password: "",
        role: "cashier",
      });
    } catch (err) {
      console.error(err);
      alert("Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-2">
          NOMA
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Sistem Kasir UMKM
        </p>

        {/* TAB */}
        <div className="flex mb-6 bg-slate-100 p-1 rounded-xl">

          <button
            type="button"
            onClick={() => setTab("login")}
            className={`w-1/2 py-2 rounded-lg transition ${
              tab === "login"
                ? "bg-white shadow"
                : ""
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setTab("register")}
            className={`w-1/2 py-2 rounded-lg transition ${
              tab === "register"
                ? "bg-white shadow"
                : ""
            }`}
          >
            Register
          </button>

        </div>

        {/* LOGIN FORM */}
        {tab === "login" && (
          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Username"
              value={form.username}
              className="w-full border rounded-lg p-3 mb-4"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              className="w-full border rounded-lg p-3 mb-6"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Loading..." : "Login"}
            </button>

          </form>
        )}

        {/* REGISTER FORM */}
        {tab === "register" && (
          <form onSubmit={handleRegister}>

            <input
              type="text"
              placeholder="Nama"
              value={registerForm.name}
              className="w-full border rounded-lg p-3 mb-3"
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <input
              type="text"
              placeholder="Username"
              value={registerForm.username}
              className="w-full border rounded-lg p-3 mb-3"
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              className="w-full border rounded-lg p-3 mb-3"
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />

            <select
              value={registerForm.role}
              className="w-full border rounded-lg p-3 mb-6"
              onChange={(e) =>
                setRegisterForm((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
            >
              <option value="cashier">Cashier</option>
              <option value="owner">Owner</option>
            </select>

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Loading..." : "Register"}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}