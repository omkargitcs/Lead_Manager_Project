const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    let message = 'Request failed';
    try { message = (await response.json()).detail || message; } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const getLeads = (params) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'All') query.set('status', params.status);
  if (params.event && params.event !== 'All') query.set('event', params.event);
  return request(`/api/leads?${query.toString()}`);
};
export const createLead = (lead) => request('/api/leads', { method: 'POST', body: JSON.stringify(lead) });
export const updateLead = (id, lead) => request(`/api/leads/${id}`, { method: 'PUT', body: JSON.stringify(lead) });
export const deleteLead = (id) => request(`/api/leads/${id}`, { method: 'DELETE' });
export const aiSummary = (data) => request('/api/ai/summary', { method: 'POST', body: JSON.stringify(data) });
export const aiFollowUp = (data) => request('/api/ai/follow-up', { method: 'POST', body: JSON.stringify(data) });
