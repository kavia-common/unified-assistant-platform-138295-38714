import React from "react";

// PUBLIC_INTERFACE
function Header({ user, onLoginClick, onLogoutClick }) {
  /**
   * Dashboard header displaying brand, user account, and login/logout.
   * @param {object|null} user - User info or null if not logged in
   * @param {function} onLoginClick - Function to trigger login modal
   * @param {function} onLogoutClick - Function to log the user out
   */
  return (
    <header className="dashboard-header">
      <div className="brand">
        <span className="brand-logo">🤖</span>
        <span className="brand-text">Kavia Assistant</span>
      </div>
      <div className="user-section">
        {user ? (
          <>
            <span className="user-name">👤 {user.username}</span>
            <button className="btn accent" onClick={onLogoutClick}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn accent" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
export default Header;
