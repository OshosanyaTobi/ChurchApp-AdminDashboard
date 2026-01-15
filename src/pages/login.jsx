import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/StateContext";

const Login = () => {
  const { login, token } = useStateContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect ONLY when token changes
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Admin Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "320px",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    marginBottom: "15px",
    padding: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default Login;
