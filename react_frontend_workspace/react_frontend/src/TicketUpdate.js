import React, { useState } from "react";
import { updateTicket } from "./api";

/**
 * TicketUpdate - Update an existing ticket by ID. Allows title, description and status update.
 */
const TicketUpdate = ({ onUpdateSuccess, onUpdateError, loading, setLoading }) => {
  const [ticketId, setTicketId] = useState("");
  const [fields, setFields] = useState({
    title: "",
    description: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const ticketStatusOptions = [
    "",
    "open",
    "in_progress",
    "resolved",
    "closed",
  ];

  const handleChange = (field) => (e) => {
    setFields((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!ticketId.trim()) {
      setErrors({ ticketId: "Ticket ID required" });
      return;
    }
    setLoading(true);
    try {
      const update = {};
      if (fields.title) update.title = fields.title;
      if (fields.description) update.description = fields.description;
      if (fields.status) update.status = fields.status;

      if (!Object.keys(update).length) {
        setErrors({ generic: "At least one field required to update." });
        setLoading(false);
        return;
      }
      const resp = await updateTicket(ticketId.trim(), update);
      setFields({ title: "", description: "", status: "" });
      if (onUpdateSuccess) onUpdateSuccess(resp);
    } catch (e) {
      if (onUpdateError)
        onUpdateError(
          e?.detail?.[0]?.msg ||
            e?.detail ||
            e?.message ||
            e?.error ||
            "Error updating ticket"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ticket-update-form" onSubmit={handleSubmit} autoComplete="off">
      <h2 className="section-title">Update Ticket</h2>
      <label>
        Ticket ID
        <input
          className="input"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="abc-123..."
          type="text"
          required
          disabled={loading}
        />
      </label>
      {errors.ticketId && (
        <div className="field-error" style={{ color: "var(--accent)", fontSize: 13 }}>
          {errors.ticketId}
        </div>
      )}
      <label>
        New Title
        <input
          className="input"
          value={fields.title}
          onChange={handleChange("title")}
          placeholder="Update title (optional)"
          type="text"
          disabled={loading}
          maxLength={100}
        />
      </label>
      <label>
        New Description
        <textarea
          className="input"
          value={fields.description}
          onChange={handleChange("description")}
          rows={3}
          placeholder="Update details (optional)"
          disabled={loading}
          maxLength={600}
        />
      </label>
      <label>
        Status
        <select
          className="input"
          value={fields.status}
          onChange={handleChange("status")}
          disabled={loading}
          style={{width:"100%"}}
        >
          {ticketStatusOptions.map((st) => (
            <option key={st} value={st}>
              {st ? st.replace("_", " ") : "Choose status (optional)"}
            </option>
          ))}
        </select>
      </label>
      {errors.generic && (
        <div className="field-error" style={{ color: "var(--accent)", fontSize: 13 }}>
          {errors.generic}
        </div>
      )}
      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default TicketUpdate;
