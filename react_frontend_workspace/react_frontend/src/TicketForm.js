import React, { useState } from "react";
import { createTicket } from "./api";

/**
 * TicketForm - Anonymous submission form for new tickets
 */
const TicketForm = ({ onSubmitSuccess, onSubmitError, loading, setLoading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!title || !description) {
      setErrors({
        title: !title ? "Title required" : null,
        description: !description ? "Description required" : null,
      });
      return;
    }
    setLoading(true);
    try {
      const result = await createTicket({ title, description });
      setTitle("");
      setDescription("");
      if (onSubmitSuccess) onSubmitSuccess(result);
    } catch (e) {
      if (onSubmitError)
        onSubmitError(
          e?.detail?.[0]?.msg ||
            e?.detail ||
            e?.message ||
            e?.error ||
            "Error submitting ticket"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit} autoComplete="off">
      <h2 className="section-title">Submit a Ticket</h2>
      <label>
        Title
        <input
          className="input"
          value={title}
          required
          disabled={loading}
          placeholder="Short summary"
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          maxLength={100}
        />
      </label>
      {errors.title && (
        <div className="field-error" style={{ color: "var(--accent)", fontSize: 13 }}>
          {errors.title}
        </div>
      )}
      <label>
        Description
        <textarea
          className="input"
          value={description}
          required
          disabled={loading}
          placeholder="Describe your issue"
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={600}
        />
      </label>
      {errors.description && (
        <div className="field-error" style={{ color: "var(--accent)", fontSize: 13 }}>
          {errors.description}
        </div>
      )}
      <button
        className="btn btn-accent"
        type="submit"
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default TicketForm;
