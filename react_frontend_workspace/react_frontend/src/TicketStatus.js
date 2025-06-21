import React, { useState } from "react";
import { getTicket, getTicketNotifications } from "./api";

/**
 * TicketStatus - Lookup by ticket ID. Shows details and live notifications.
 */
const TicketStatus = ({ onFetchError }) => {
  const [ticketId, setTicketId] = useState("");
  const [result, setResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setResult(null);
    setNotifications([]);
    if (!ticketId.trim()) return;
    setLoading(true);
    try {
      const data = await getTicket(ticketId.trim());
      setResult(data);
      // fetch notifications
      try {
        const notes = await getTicketNotifications(ticketId.trim());
        setNotifications(notes || []);
      } catch {
        setNotifications([]);
      }
    } catch (e) {
      setResult(null);
      if (onFetchError)
        onFetchError(
          e?.detail?.[0]?.msg ||
            e?.detail ||
            e?.message ||
            e?.error ||
            "Ticket not found"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-status-section">
      <h2 className="section-title">Check Status</h2>
      <form onSubmit={handleLookup} style={{ marginBottom: 12 }}>
        <label>
          Ticket ID
          <input
            className="input"
            value={ticketId}
            disabled={loading}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="abc-123..."
            type="text"
            autoComplete="off"
            required
          />
        </label>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
          style={{ marginLeft: 10 }}
        >
          {loading ? "Loading..." : "Check"}
        </button>
      </form>
      {result && (
        <div className="ticket-details">
          <div>
            <b>Status:</b>{" "}
            <span style={{ color: "var(--primary)", fontWeight: 500 }}>
              {result.status}
            </span>
          </div>
          <div>
            <b>Title:</b> {result.title}
          </div>
          <div>
            <b>Description:</b> {result.description}
          </div>
          <div>
            <b>Created At:</b> {new Date(result.created_at).toLocaleString()}
          </div>
          <div>
            <b>Last Update:</b> {new Date(result.updated_at).toLocaleString()}
          </div>
        </div>
      )}
      {notifications && notifications.length > 0 && (
        <div className="ticket-notifications">
          <h4>Notifications:</h4>
          <ul>
            {notifications.map((n) => (
              <li key={`${n.timestamp}-${n.message}`}>
                <span style={{ color: "var(--accent)" }}>
                  [{new Date(n.timestamp).toLocaleString()}]
                </span>{" "}
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TicketStatus;
