import { useEffect, useMemo, useState } from 'react';
import { Bot, Building2, CheckCircle2, ChevronDown, Edit3, Mail, MessageSquareText, Plus, Search, Sparkles, Trash2, Users, X } from 'lucide-react';
import { aiFollowUp, aiSummary, createLead, deleteLead, getLeads, updateLead } from './api';

const emptyForm = { name: '', company: '', email: '', event: '', notes: '', follow_up_status: 'Not Contacted' };
const statuses = ['Not Contacted', 'Contacted', 'Follow-up Sent', 'Converted'];

function App() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [event, setEvent] = useState('All');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [aiResult, setAiResult] = useState('');
  const [aiMode, setAiMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const events = useMemo(() => ['All', ...new Set(leads.map((lead) => lead.event).filter(Boolean))], [leads]);

  async function loadLeads() {
    try { setError(''); setLeads(await getLeads({ search, status, event })); }
    catch (err) { setError(err.message); }
  }

  useEffect(() => { const timer = setTimeout(loadLeads, 250); return () => clearTimeout(timer); }, [search, status, event]);

  const stats = {
    total: leads.length,
    contacted: leads.filter((x) => x.follow_up_status === 'Contacted' || x.follow_up_status === 'Follow-up Sent').length,
    converted: leads.filter((x) => x.follow_up_status === 'Converted').length,
  };

  function openCreate() { setForm(emptyForm); setEditingId(null); setModalOpen(true); setError(''); }
  function openEdit(lead) { setForm({ ...lead }); setEditingId(lead.id); setModalOpen(true); setError(''); }

  async function saveLead(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (editingId) await updateLead(editingId, form); else await createLead(form);
      setModalOpen(false); setForm(emptyForm); setEditingId(null); await loadLeads();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  async function removeLead(id) {
    if (!window.confirm('Delete this lead?')) return;
    try { await deleteLead(id); if (selected?.id === id) setSelected(null); await loadLeads(); }
    catch (err) { setError(err.message); }
  }

  async function runAI(mode) {
    if (!selected?.notes?.trim()) { setError('Add interaction notes before using AI.'); return; }
    setAiMode(mode); setAiResult(''); setLoading(true); setError('');
    try {
      const payload = { notes: selected.notes, name: selected.name, company: selected.company, event: selected.event };
      const data = mode === 'summary' ? await aiSummary(payload) : await aiFollowUp(payload);
      setAiResult(data.result);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><div><strong>LeadFlow</strong><span>AI Event Lead Manager</span></div></div>
      <button className="primary" onClick={openCreate}><Plus size={18} /> Add Lead</button>
    </header>

    <main className="content">
      <section className="hero">
        <div><p className="eyebrow">EVENT RELATIONSHIP HUB</p><h1>Turn conversations into follow-ups.</h1><p className="hero-copy">Capture event leads, keep every interaction organized, and use AI to turn notes into your next action.</p></div>
        <div className="hero-ai"><Bot size={22}/><span>AI-assisted follow-up</span></div>
      </section>

      <section className="stats-grid">
        <Stat icon={<Users />} label="Total leads" value={stats.total} />
        <Stat icon={<MessageSquareText />} label="In follow-up" value={stats.contacted} />
        <Stat icon={<CheckCircle2 />} label="Converted" value={stats.converted} />
      </section>

      <section className="toolbar card">
        <div className="searchbox"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, company, email, event..." /></div>
        <Select value={status} onChange={setStatus} options={['All', ...statuses]} />
        <Select value={event} onChange={setEvent} options={events} />
      </section>

      {error && <div className="error-banner">{error}<button onClick={() => setError('')}><X size={16}/></button></div>}

      <section className="leads-layout">
        <div className="card table-card">
          <div className="card-head"><div><h2>Event leads</h2><p>{leads.length} result{leads.length === 1 ? '' : 's'}</p></div></div>
          {leads.length === 0 ? <div className="empty"><Users size={32}/><h3>No leads found</h3><p>Try changing the filters or add your first event lead.</p><button className="primary" onClick={openCreate}><Plus size={17}/> Add Lead</button></div> : <div className="table-wrap"><table><thead><tr><th>Lead</th><th>Company</th><th>Event</th><th>Status</th><th>Action</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className={selected?.id === lead.id ? 'active-row' : ''} onClick={() => { setSelected(lead); setAiResult(''); }}><td><div className="lead-cell"><div className="avatar">{lead.name.charAt(0).toUpperCase()}</div><div><strong>{lead.name}</strong><small>{lead.email}</small></div></div></td><td>{lead.company}</td><td>{lead.event}</td><td><StatusPill status={lead.follow_up_status}/></td><td><div className="row-actions"><button title="Edit" onClick={(e) => { e.stopPropagation(); openEdit(lead); }}><Edit3 size={16}/></button><button title="Delete" onClick={(e) => { e.stopPropagation(); removeLead(lead.id); }}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>}
        </div>

        {selected && <aside className="card detail-card">
          <div className="detail-top"><div><p className="eyebrow">LEAD DETAILS</p><h2>{selected.name}</h2></div><button className="icon-btn" onClick={() => setSelected(null)}><X size={18}/></button></div>
          <div className="detail-meta"><span><Building2 size={15}/>{selected.company}</span><span><Mail size={15}/>{selected.email}</span></div>
          <div className="detail-section"><label>Event</label><p>{selected.event}</p></div>
          <div className="detail-section"><label>Interaction notes</label><p className="notes">{selected.notes || 'No notes added.'}</p></div>
          <div className="detail-section"><label>Follow-up status</label><StatusPill status={selected.follow_up_status}/></div>
          <div className="ai-panel"><div className="ai-title"><Sparkles size={17}/><strong>AI assistant</strong></div><p>Generate a concise summary or a ready-to-edit follow-up from these notes.</p><div className="ai-buttons"><button onClick={() => runAI('summary')} disabled={loading}><Bot size={16}/> Summarize</button><button onClick={() => runAI('follow-up')} disabled={loading}><Mail size={16}/> Draft follow-up</button></div>{aiMode && <div className="ai-result"><div className="result-label">{aiMode === 'summary' ? 'AI SUMMARY' : 'FOLLOW-UP DRAFT'}</div><pre>{loading ? 'Generating...' : aiResult}</pre></div>}</div>
          <div className="detail-footer"><button className="secondary" onClick={() => openEdit(selected)}><Edit3 size={16}/> Edit lead</button><button className="danger" onClick={() => removeLead(selected.id)}><Trash2 size={16}/> Delete</button></div>
        </aside>}
      </section>
    </main>

    {modalOpen && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}><form className="modal card" onSubmit={saveLead}><div className="modal-head"><div><p className="eyebrow">{editingId ? 'UPDATE LEAD' : 'NEW LEAD'}</p><h2>{editingId ? 'Edit event lead' : 'Add event lead'}</h2></div><button type="button" className="icon-btn" onClick={() => setModalOpen(false)}><X/></button></div><div className="form-grid"><Field label="Name" required value={form.name} onChange={(v) => setForm({...form,name:v})}/><Field label="Company" required value={form.company} onChange={(v) => setForm({...form,company:v})}/><Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({...form,email:v})}/><Field label="Event" required value={form.event} onChange={(v) => setForm({...form,event:v})}/><div className="field"><label>Follow-up status</label><Select value={form.follow_up_status} onChange={(v) => setForm({...form,follow_up_status:v})} options={statuses}/></div><div className="field full"><label>Interaction notes</label><textarea rows="6" maxLength="5000" value={form.notes} onChange={(e) => setForm({...form,notes:e.target.value})} placeholder="What did you discuss? What does this lead need?" /></div></div><div className="modal-actions"><button type="button" className="secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary" disabled={loading}>{loading ? 'Saving...' : editingId ? 'Save changes' : 'Create lead'}</button></div></form></div>}
  </div>
}

function Stat({ icon, label, value }) { return <div className="card stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div> }
function StatusPill({ status }) { return <span className={`pill ${status.toLowerCase().replaceAll(' ','-')}`}>{status}</span> }
function Select({ value, onChange, options }) { return <div className="select-wrap"><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((x) => <option key={x}>{x}</option>)}</select><ChevronDown size={16}/></div> }
function Field({ label, value, onChange, type='text', required=false }) { return <div className="field"><label>{label}{required && ' *'}</label><input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} /></div> }

export default App;
