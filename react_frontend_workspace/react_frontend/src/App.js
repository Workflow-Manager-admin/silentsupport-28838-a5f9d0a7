import React, { useState } from "react";
import "./App.css";
import TicketForm from "./TicketForm";
import TicketStatus from "./TicketStatus";
import TicketUpdate from "./TicketUpdate";
import Notification from "./Notification";

function App() {
  // Notification state (message and type: "success" | "error")
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Helper to trigger notifications
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    // Auto-hide after 3.5s for most notifications
    if (message && type !== "error") {
      setTimeout(() => setNotification({ message: "", type: "" }), 3500);
    }
  };

  return (
    <div className="app light-theme">
      <nav className="navbar">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="logo">
            <span className="logo-symbol" style={{ color: "var(--accent)" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#2563eb" />
                <text x="50%" y="57%" fill="#fff" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">?</text>
              </svg>
            </span>
            SilentSupport
          </div>
          <div style={{ fontSize: 14, color: "var(--secondary)" }}>
            Anonymous Ticket System
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, marginTop: 80 }}>
        <div className="container">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: "", type: "" })}
          />
          <div className="ticket-grid">
            <div className="ticket-section ticket-form-section">
              <TicketForm
                loading={formLoading}
                setLoading={setFormLoading}
                onSubmitSuccess={(data) =>
                  showNotification(
                    `Ticket submitted! Your ID: ${data.id}`,
                    "success"
                  )
                }
                onSubmitError={(msg) => showNotification(msg, "error")}
              />
            </div>
            <div className="ticket-section">
              <TicketStatus
                onFetchError={(msg) => showNotification(msg, "error")}
              />
            </div>
            <div className="ticket-section">
              <TicketUpdate
                loading={updateLoading}
                setLoading={setUpdateLoading}
                onUpdateSuccess={() =>
                  showNotification(`Ticket updated.`, "success")
                }
                onUpdateError={(msg) => showNotification(msg, "error")}
              />
            </div>
          </div>
        </div>
        <footer style={{ padding: "24px 0 0", textAlign: "center", color: "var(--secondary, #64748b)", fontSize: 13 }}>
          SilentSupport &copy; {new Date().getFullYear()} &mdash; Powered by Kavia AI
        </footer>
      </main>
    </div>
  );
}

export default App;