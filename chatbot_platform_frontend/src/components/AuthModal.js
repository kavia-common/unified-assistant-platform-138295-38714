import React, { useState } from "react";

// PUBLIC_INTERFACE
function AuthModal({ onClose, onLogin, onRegister, visible }) {
  /**
   * Authentication modal dialog for user login/register.
   * @param {function} onClose - Callback to close modal
   * @param {function} onLogin - Callback for login({username, password})
   * @param {function} onRegister - Callback for register({username, password})
   * @param {boolean} visible - Modal visibility
   */
  const [tab, setTab] = useState("login");
  const [fields, setFields] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fields.username || !fields.password) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    if (tab === "login") onLogin(fields).catch(setError);
    else onRegister(fields).catch(setError);
  };

  if (!visible) return null;
  return (
    <div className="modal auth-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={fields.username}
            onChange={handleChange}
            autoFocus
            autoComplete="username"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={fields.password}
            onChange={handleChange}
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn accent" type="submit">
            {tab === "login" ? "Sign In" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
