import { useState } from "react";
import axios from "axios";
import "./LoginPage.css";

const API_BASE_URL = "http://localhost:5000";

export default function LoginPage({ onAuthSuccess, onBackToLanding }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [helperMessage, setHelperMessage] = useState("");

  const isSignup = mode === "signup";

  const resetMessages = () => {
    setErrorMessage("");
    setHelperMessage("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    if (isSignup && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignup
        ? { name, email, password }
        : { email, password };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      onAuthSuccess({
        token: response.data.data.token,
        user: response.data.data.user,
        persist: rememberMe,
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>

      <div className="glass-login-card fade-in">
        <button
          type="button"
          className="back-link"
          onClick={onBackToLanding}
        >
          Back to home
        </button>

        <div className="auth-mode-switch">
          <button
            type="button"
            className={`auth-mode-btn ${!isSignup ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-mode-btn ${isSignup ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Create Account
          </button>
        </div>

        <div className="login-header">
          <h2>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>
          <p>
            {isSignup
              ? "Set up a real GesturAI account to save your session and unlock role-based access."
              : "Sign in with your real account to access the GesturAI workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          )}

          <div className="login-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>

            <button
              type="button"
              className="inline-link-btn"
              onClick={() =>
                setHelperMessage(
                  "Password reset is not built yet, but account creation and sign-in are now real.",
                )
              }
            >
              Forgot password?
            </button>
          </div>

          {errorMessage && <div className="auth-alert auth-alert-error">{errorMessage}</div>}
          {helperMessage && <div className="auth-alert auth-alert-info">{helperMessage}</div>}

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading
              ? isSignup
                ? "Creating account..."
                : "Authenticating..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          {isSignup ? (
            <p>
              Already have an account?
              <button
                type="button"
                className="footer-action"
                onClick={() => switchMode("login")}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?
              <button
                type="button"
                className="footer-action"
                onClick={() => switchMode("signup")}
              >
                Create one
              </button>
            </p>
          )}
        </div>

        <p className="helper-copy">
          Admin access is assigned automatically to the first registered account
          if no `ADMIN_EMAILS` are configured, or to any email listed in the
          server `ADMIN_EMAILS` environment variable.
        </p>
      </div>
    </div>
  );
}
