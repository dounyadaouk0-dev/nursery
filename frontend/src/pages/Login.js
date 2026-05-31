import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const backgroundUrl = process.env.PUBLIC_URL + "/background.jpeg";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(identifier, password);
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${backgroundUrl})`,
        backgroundSize: "cover",

        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <div className="login-card">
        <h1>Welcome to Berries Nursery</h1>
        <p>Sign in to continue to the child care center dashboard.</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p style={{ color: "#d32f2f", marginBottom: "20px" }}>{error}</p>}

          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Email or username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
