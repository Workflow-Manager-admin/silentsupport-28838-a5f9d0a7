//
// api.js - API helper functions for SilentSupport frontend
//

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://vscode-internal-8853-qa.qa01.cloud.kavia.ai:3001";

// PUBLIC_INTERFACE
export async function createTicket({ title, description }) {
  /** Creates new anonymous ticket. Returns response {id, title, description, ...} or throws error */
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) {
    throw await res.json();
  }
  return await res.json();
}

// PUBLIC_INTERFACE
export async function getTicket(ticketId) {
  /** Retrieves ticket info by ID */
  const res = await fetch(`${BASE_URL}/tickets/${encodeURIComponent(ticketId)}`);
  if (!res.ok) throw await res.json();
  return await res.json();
}

// PUBLIC_INTERFACE
export async function updateTicket(ticketId, { title, description, status }) {
  /** Updates ticket by ID. Pass partial {title?, description?, status?} as allowed by backend */
  const res = await fetch(`${BASE_URL}/tickets/${encodeURIComponent(ticketId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, status }),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// PUBLIC_INTERFACE
export async function getTicketNotifications(ticketId) {
  /** Gets notifications for a ticket */
  const res = await fetch(
    `${BASE_URL}/tickets/${encodeURIComponent(ticketId)}/notifications`
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}
