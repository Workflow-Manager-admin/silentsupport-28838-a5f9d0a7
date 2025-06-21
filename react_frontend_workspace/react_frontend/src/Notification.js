import React from "react";

/**
 * Notification component to display success or error messages.
 */
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  // type: "success" | "error"
  return (
    <div
      className={`notification notification-${type}`}
      role="alert"
      style={{
        background:
          type === "success"
            ? "var(--primary)"
            : type === "error"
            ? "#fee2e2"
            : "#f3f3f3",
        color: type === "success" ? "#fff" : "#b91c1c",
        border:
          type === "success"
            ? "1px solid var(--primary)"
            : "1px solid #fca5a5",
        minHeight: "44px",
        padding: "10px 20px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        fontWeight: 500,
        margin: "12px 0 0",
        boxShadow: "0 2px 8px rgba(80,80,160,0.08)",
        zIndex: 1000,
        maxWidth: 420,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <span style={{ flexGrow: 1 }}>{message}</span>
      <button
        aria-label="Close Notification"
        style={{
          background: "none",
          border: "none",
          color: type === "success" ? "#fff" : "#b91c1c",
          fontWeight: "bold",
          fontSize: "1.1rem",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default Notification;
