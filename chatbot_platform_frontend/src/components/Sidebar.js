import React from "react";

// PUBLIC_INTERFACE
function Sidebar({ applications, onAppLaunch, selectedApp }) {
  /**
   * Displays the sidebar navigation for applications.
   * @param {Array} applications - List of application objects {id, name, icon}.
   * @param {function} onAppLaunch - Callback for application click.
   * @param {string} selectedApp - ID of currently selected app
   */
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Applications</h2>
      <ul className="app-list">
        {applications.map((app) => (
          <li
            key={app.id}
            className={`app-item${selectedApp === app.id ? " selected" : ""}`}
            onClick={() => onAppLaunch(app)}
          >
            {app.icon && <span className="app-icon">{app.icon}</span>}
            {app.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
