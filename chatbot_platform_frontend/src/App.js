import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import AuthModal from "./components/AuthModal";

// Backend API root
const API_ROOT = "http://localhost:3001";

// Helper: Retrieve local token
function getStoredToken() {
  return localStorage.getItem("access_token");
}

// Helper: Save token
function storeToken(token) {
  localStorage.setItem("access_token", token);
}

// Helper: Remove token
function clearToken() {
  localStorage.removeItem("access_token");
}

// PUBLIC_INTERFACE
function App() {
  // Theme state
  const [theme, setTheme] = useState("dark");
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authModal, setAuthModal] = useState(false);
  // Data state
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // On mount: apply theme & check login
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Attempt auto-login if token is present
    const token = getStoredToken();
    if (token) {
      fetch(`${API_ROOT}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((info) => setUser(info))
        .catch(() => {
          clearToken();
          setUser(null);
        });
    }
    // Load available applications list
    fetch(`${API_ROOT}/apps`)
      .then((res) => res.json())
      .then(setApplications)
      .catch(() => setApplications([]));
  }, []);

  // When app changes, clear chat history
  useEffect(() => {
    setChatHistory([]);
  }, [selectedApp]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleLoginModal = () => setAuthModal((v) => !v);

  // PUBLIC_INTERFACE
  async function handleLogin({ username, password }) {
    const res = await fetch(`${API_ROOT}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      throw new Error("Invalid credentials.");
    }
    const data = await res.json();
    storeToken(data.access_token);
    setUser({ username: data.username });
    setAuthModal(false);
    // Optionally fetch extra user data here
  }

  // PUBLIC_INTERFACE
  async function handleRegister({ username, password }) {
    const res = await fetch(`${API_ROOT}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      throw new Error("Registration failed.");
    }
    await handleLogin({ username, password });
  }

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    clearToken();
    setUser(null);
    setChatHistory([]);
    setSelectedApp(null);
  };

  // PUBLIC_INTERFACE
  const handleAppLaunch = (app) => {
    setSelectedApp(app);
    setSidebarOpen(false);
  };

  // PUBLIC_INTERFACE
  async function handleSendMessage(message) {
    if (!user) {
      setAuthModal(true);
      return;
    }
    setIsSending(true);
    setChatInput("");
    // Push user message to chat history immediately
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message, timestamp: Date.now() },
    ]);
    const payload = {
      message,
      ...(selectedApp ? { app_id: selectedApp.id } : {}),
    };
    const token = getStoredToken();
    try {
      const res = await fetch(`${API_ROOT}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Assistant did not respond");
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "assistant",
          message: data.response,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "assistant",
          message: "There was an error communicating with the assistant.",
          timestamp: Date.now(),
        },
      ]);
    }
    setIsSending(false);
  }

  return (
    <div className={`App dashboard-layout${sidebarOpen ? " sidebar-open" : ""}`}>
      <Header
        user={user}
        onLoginClick={handleLoginModal}
        onLogoutClick={handleLogout}
      />
      <Sidebar
        applications={applications}
        onAppLaunch={handleAppLaunch}
        selectedApp={selectedApp && selectedApp.id}
      />
      <ChatInterface
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        input={chatInput}
        setInput={setChatInput}
        isSending={isSending}
        appSelected={selectedApp}
      />
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <AuthModal
        visible={authModal}
        onClose={handleLoginModal}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default App;
