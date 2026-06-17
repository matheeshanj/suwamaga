import { useState, useEffect } from "react";

// ─── Replace these with your Supabase credentials ────────────────────────────
const SUPABASE_URL = "https://ccuwjdxydneocrxomcej.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdXdqZHh5ZG5lb2NyeG9tY2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODU5MzEsImV4cCI6MjA5NzI2MTkzMX0.2UN2GhIie01vqZUFXCWnn8Pv83PpITernuPDYVkCha8";
const ADMIN_PASSWORD = "19065mnj"; // change this!

// ─── Supabase helpers ─────────────────────────────────────────────────────────
async function dbGet(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  return res.json();
}

async function dbInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  return res.json();
}

async function dbUpdate(table, id, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  return res.json();
}

async function dbDelete(table, id) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
}

// ─── colours ──────────────────────────────────────────────────────────────────
const T = {
  bg: "#F7FAFA", surface: "#FFFFFF", teal: "#00796B", tealLight: "#E0F2F1",
  tealDark: "#004D40", amber: "#F57F17", emergency: "#C62828",
  text: "#1A2E2E", muted: "#607D7B", border: "#E0EEEC", red: "#C62828",
};

const ARTICLE_CATEGORIES = [
  "diseases","symptoms","medicines","tests","pregnancy",
  "child","mental","firstaid","nutrition","prevention","sexual",
];

// ─── small reusables ──────────────────────────────────────────────────────────
function Label({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 4, letterSpacing: 0.5 }}>{children}</div>;
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <Label>{label}</Label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, outline: "none" }}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <Label>{label}</Label>}
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, resize: "vertical", outline: "none" }}
      />
      <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>Multiple items: one per line</div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <Label>{label}</Label>}
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, background: T.surface }}
      >
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

function SaveBtn({ onClick, saving }) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      background: T.teal, color: "#fff", border: "none", borderRadius: 10,
      padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
      opacity: saving ? 0.7 : 1, width: "100%",
    }}>
      {saving ? "Saving..." : "💾 Save"}
    </button>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: `1px solid ${T.red}`, color: T.red,
      borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer", marginTop: 6,
    }}>🗑 Delete</button>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? T.red : T.tealDark, color: "#fff",
      borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14,
      zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap",
    }}>{msg}</div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
      <div style={{ fontWeight: 800, fontSize: 16, color: T.tealDark, marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  function attempt() {
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setErr("Wrong password. Try again."); }
  }
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: T.surface, borderRadius: 16, padding: 32, width: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40 }}>🌿</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: T.tealDark, marginTop: 8 }}>සෞඛ්‍ය ශ්‍රී Admin</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Content Management</div>
        </div>
        <Input label="PASSWORD" value={pw} onChange={setPw} type="password" placeholder="Enter admin password" />
        {err && <div style={{ color: T.red, fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button onClick={attempt} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>
          Login →
        </button>
      </div>
    </div>
  );
}

// ─── ARTICLES TAB ─────────────────────────────────────────────────────────────
const BLANK_ARTICLE = {
  title_si: "", title_en: "", category: "diseases",
  overview: "", symptoms: "", causes: "", warning_signs: "",
  treatment: "", selfcare: "", prevention: "", see_doctor: "",
  reviewer: "", reviewed_date: new Date().toISOString().split("T")[0],
  featured: false,
};

function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, "new" = new form, id = edit form
  const [form, setForm] = useState(BLANK_ARTICLE);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  function load() {
    setLoading(true);
    dbGet("articles").then(data => {
      setArticles(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  function f(key) { return val => setForm(prev => ({ ...prev, [key]: val })); }

  function startNew() { setForm(BLANK_ARTICLE); setEditing("new"); }
  function startEdit(a) {
    setForm({
      ...BLANK_ARTICLE, ...a,
      symptoms: Array.isArray(a.symptoms) ? a.symptoms.join("\n") : a.symptoms || "",
      causes: Array.isArray(a.causes) ? a.causes.join("\n") : a.causes || "",
      warning_signs: Array.isArray(a.warning_signs) ? a.warning_signs.join("\n") : a.warning_signs || "",
      selfcare: Array.isArray(a.selfcare) ? a.selfcare.join("\n") : a.selfcare || "",
      prevention: Array.isArray(a.prevention) ? a.prevention.join("\n") : a.prevention || "",
    });
    setEditing(a.id);
  }

  function toArray(str) {
    return str.split("\n").map(s => s.trim()).filter(Boolean);
  }

  async function save() {
    if (!form.title_si.trim()) { showToast("Sinhala title is required", "error"); return; }
    setSaving(true);
    const row = {
      ...form,
      symptoms: toArray(form.symptoms),
      causes: toArray(form.causes),
      warning_signs: toArray(form.warning_signs),
      selfcare: toArray(form.selfcare),
      prevention: toArray(form.prevention),
    };
    try {
      if (editing === "new") {
        delete row.id;
        await dbInsert("articles", row);
        showToast("✅ Article saved!");
      } else {
        await dbUpdate("articles", editing, row);
        showToast("✅ Article updated!");
      }
      load();
      setEditing(null);
    } catch (e) {
      showToast("Error saving. Check Supabase.", "error");
    }
    setSaving(false);
  }

  async function del(id) {
    if (!window.confirm("Delete this article?")) return;
    await dbDelete("articles", id);
    showToast("Deleted.");
    load();
    setEditing(null);
  }

  if (editing !== null) return (
    <div>
      <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, fontSize: 15, padding: "4px 0 16px", cursor: "pointer" }}>← Back to list</button>
      <SectionCard title={editing === "new" ? "✏️ New Article" : "✏️ Edit Article"}>
        <Input label="TITLE (SINHALA) *" value={form.title_si} onChange={f("title_si")} placeholder="රෝගයේ නම" />
        <Input label="TITLE (ENGLISH)" value={form.title_en} onChange={f("title_en")} placeholder="Disease name in English" />
        <Select label="CATEGORY" value={form.category} onChange={f("category")} options={ARTICLE_CATEGORIES} />
        <div style={{ marginBottom: 12 }}>
          <Label>FEATURED ON HOME?</Label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
            <span style={{ fontSize: 14, color: T.text }}>Show on home screen</span>
          </label>
        </div>
        <Textarea label="OVERVIEW" value={form.overview} onChange={f("overview")} placeholder="Brief description..." rows={4} />
        <Textarea label="SYMPTOMS (one per line)" value={form.symptoms} onChange={f("symptoms")} placeholder={"උණ\nශීත\nරතු ලප"} />
        <Textarea label="CAUSES (one per line)" value={form.causes} onChange={f("causes")} placeholder={"Dengue mosquito\nVirus"} />
        <Textarea label="WARNING SIGNS (one per line)" value={form.warning_signs} onChange={f("warning_signs")} placeholder={"ලේ ගැලීම\nශ්වාස අපහසුව"} />
        <Textarea label="TREATMENT" value={form.treatment} onChange={f("treatment")} placeholder="Treatment description..." rows={4} />
        <Textarea label="SELF CARE (one per line)" value={form.selfcare} onChange={f("selfcare")} placeholder={"විවේකය\nජලය බොන්න"} />
        <Textarea label="PREVENTION (one per line)" value={form.prevention} onChange={f("prevention")} placeholder={"මදුරු දැල\nජල ගොවිතැන"} />
        <Textarea label="WHEN TO SEE DOCTOR" value={form.see_doctor} onChange={f("see_doctor")} rows={2} placeholder="Conditions requiring urgent care..." />
        <Input label="REVIEWER NAME & TITLE" value={form.reviewer} onChange={f("reviewer")} placeholder="Dr. Name, MBBS, Hospital" />
        <Input label="REVIEWED DATE" value={form.reviewed_date} onChange={f("reviewed_date")} type="date" />
        <SaveBtn onClick={save} saving={saving} />
        {editing !== "new" && <DeleteBtn onClick={() => del(editing)} />}
      </SectionCard>
      <Toast {...toast} />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>Articles ({articles.length})</div>
        <button onClick={startNew} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ New Article</button>
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {articles.map(a => (
            <button key={a.id} onClick={() => startEdit(a)} style={{
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
              padding: "12px 16px", display: "flex", justifyContent: "space-between",
              alignItems: "center", cursor: "pointer", textAlign: "left",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 2 }}>{a.title_si}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{a.title_en} · {a.category}</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {a.featured && <span style={{ fontSize: 11, background: T.tealLight, color: T.teal, borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>Featured</span>}
                <span style={{ color: T.teal, fontSize: 18 }}>›</span>
              </div>
            </button>
          ))}
          {articles.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.muted }}>No articles yet. Click "+ New Article" to start.</div>}
        </div>
      )}
      <Toast {...toast} />
    </div>
  );
}

// ─── SPECIALISTS TAB ──────────────────────────────────────────────────────────
const BLANK_SPECIALIST = {
  name: "", qualification: "", specialty: "", type: "රාජ්‍ය",
  hospital: "", district: "", phone: "", availability: "",
};

function SpecialistsTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_SPECIALIST);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "" }), 3000); }
  function load() { setLoading(true); dbGet("specialists").then(d => { setList(Array.isArray(d) ? d : []); setLoading(false); }); }
  useEffect(() => { load(); }, []);
  function f(key) { return val => setForm(prev => ({ ...prev, [key]: val })); }

  async function save() {
    if (!form.name.trim()) { showToast("Name is required", "error"); return; }
    setSaving(true);
    try {
      if (editing === "new") { const r = { ...form }; delete r.id; await dbInsert("specialists", r); showToast("✅ Saved!"); }
      else { await dbUpdate("specialists", editing, form); showToast("✅ Updated!"); }
      load(); setEditing(null);
    } catch { showToast("Error saving", "error"); }
    setSaving(false);
  }

  async function del(id) {
    if (!window.confirm("Delete this specialist?")) return;
    await dbDelete("specialists", id); showToast("Deleted."); load(); setEditing(null);
  }

  if (editing !== null) return (
    <div>
      <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, fontSize: 15, padding: "4px 0 16px", cursor: "pointer" }}>← Back to list</button>
      <SectionCard title={editing === "new" ? "➕ New Specialist" : "✏️ Edit Specialist"}>
        <Input label="FULL NAME *" value={form.name} onChange={f("name")} placeholder="Dr. Nalaka Perera" />
        <Input label="QUALIFICATIONS" value={form.qualification} onChange={f("qualification")} placeholder="MBBS, MD (Internal Medicine)" />
        <Input label="SPECIALTY" value={form.specialty} onChange={f("specialty")} placeholder="Internal Medicine" />
        <Select label="TYPE" value={form.type} onChange={f("type")} options={["රාජ්‍ය", "පෞද්ගලික"]} />
        <Input label="HOSPITAL" value={form.hospital} onChange={f("hospital")} placeholder="Teaching Hospital Colombo" />
        <Input label="DISTRICT" value={form.district} onChange={f("district")} placeholder="කොළඹ" />
        <Input label="PHONE" value={form.phone} onChange={f("phone")} placeholder="0112345678" />
        <Input label="AVAILABILITY / CLINIC TIMES" value={form.availability} onChange={f("availability")} placeholder="Mon, Wed, Fri 9am–1pm" />
        <SaveBtn onClick={save} saving={saving} />
        {editing !== "new" && <DeleteBtn onClick={() => del(editing)} />}
      </SectionCard>
      <Toast {...toast} />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>Specialists ({list.length})</div>
        <button onClick={() => { setForm(BLANK_SPECIALIST); setEditing("new"); }} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add Specialist</button>
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map(s => (
            <button key={s.id} onClick={() => { setForm({ ...BLANK_SPECIALIST, ...s }); setEditing(s.id); }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{s.specialty} · {s.district} · {s.type}</div>
              </div>
              <span style={{ color: T.teal, fontSize: 18 }}>›</span>
            </button>
          ))}
          {list.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.muted }}>No specialists yet.</div>}
        </div>
      )}
      <Toast {...toast} />
    </div>
  );
}

// ─── HOSPITALS/PHARMACIES/LABS/CENTRES TAB ────────────────────────────────────
const MEDICAL_SUBTABS = [
  { id: "hospitals",       label: "🏥 Hospitals",       fields: ["name","type","district","address","phone","services"] },
  { id: "pharmacies",      label: "💊 Pharmacies",      fields: ["name","type","district","address","phone","hours"] },
  { id: "labs",            label: "🔬 Labs",            fields: ["name","district","address","phone","hours","home_service"] },
  { id: "medical_centres", label: "🏨 Medical Centres", fields: ["name","district","address","phone","hours"] },
];

const BLANK_MEDICAL = { name: "", type: "රාජ්‍ය", district: "", address: "", phone: "", hours: "", services: "", home_service: false };

function MedicalTab() {
  const [subtab, setSubtab] = useState("hospitals");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_MEDICAL);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "" }), 3000); }
  function load() { setLoading(true); dbGet(subtab).then(d => { setList(Array.isArray(d) ? d : []); setLoading(false); }); }
  useEffect(() => { load(); }, [subtab]);
  function f(key) { return val => setForm(prev => ({ ...prev, [key]: val })); }

  const currentSubtab = MEDICAL_SUBTABS.find(s => s.id === subtab);

  async function save() {
    if (!form.name.trim()) { showToast("Name is required", "error"); return; }
    setSaving(true);
    const row = {
      ...form,
      services: subtab === "hospitals" ? form.services.split("\n").map(s => s.trim()).filter(Boolean) : undefined,
    };
    if (subtab !== "hospitals") delete row.services;
    try {
      if (editing === "new") { const r = { ...row }; delete r.id; await dbInsert(subtab, r); showToast("✅ Saved!"); }
      else { await dbUpdate(subtab, editing, row); showToast("✅ Updated!"); }
      load(); setEditing(null);
    } catch { showToast("Error saving", "error"); }
    setSaving(false);
  }

  async function del(id) {
    if (!window.confirm("Delete?")) return;
    await dbDelete(subtab, id); showToast("Deleted."); load(); setEditing(null);
  }

  const hasField = f => currentSubtab?.fields.includes(f);

  if (editing !== null) return (
    <div>
      <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, fontSize: 15, padding: "4px 0 16px", cursor: "pointer" }}>← Back to list</button>
      <SectionCard title={editing === "new" ? `➕ Add to ${currentSubtab?.label}` : `✏️ Edit ${currentSubtab?.label}`}>
        <Input label="NAME *" value={form.name} onChange={f("name")} placeholder="Facility name" />
        {hasField("type") && <Select label="TYPE" value={form.type || "රාජ්‍ය"} onChange={f("type")} options={["රාජ්‍ය", "පෞද්ගලික"]} />}
        <Input label="DISTRICT (Sinhala)" value={form.district} onChange={f("district")} placeholder="කොළඹ" />
        <Input label="ADDRESS" value={form.address} onChange={f("address")} placeholder="Street, City" />
        <Input label="PHONE" value={form.phone} onChange={f("phone")} placeholder="0112345678" />
        {hasField("hours") && <Input label="OPENING HOURS" value={form.hours || ""} onChange={f("hours")} placeholder="24 පැය / 8:00–20:00" />}
        {hasField("services") && <Textarea label="SERVICES (one per line)" value={form.services || ""} onChange={f("services")} placeholder={"ICU\nශල්‍යකර්ම\nළමා රෝග"} />}
        {hasField("home_service") && (
          <div style={{ marginBottom: 12 }}>
            <Label>HOME SERVICE?</Label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={!!form.home_service} onChange={e => setForm(p => ({ ...p, home_service: e.target.checked }))} />
              <span style={{ fontSize: 14, color: T.text }}>Offers home sample collection</span>
            </label>
          </div>
        )}
        <SaveBtn onClick={save} saving={saving} />
        {editing !== "new" && <DeleteBtn onClick={() => del(editing)} />}
      </SectionCard>
      <Toast {...toast} />
    </div>
  );

  return (
    <div>
      {/* subtab bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 16 }}>
        {MEDICAL_SUBTABS.map(s => (
          <button key={s.id} onClick={() => { setSubtab(s.id); setEditing(null); }} style={{
            padding: "8px 4px", borderRadius: 8, border: `2px solid ${subtab === s.id ? T.teal : T.border}`,
            background: subtab === s.id ? T.tealLight : T.surface, cursor: "pointer",
            fontSize: 11, fontWeight: 700, color: subtab === s.id ? T.teal : T.muted,
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>{currentSubtab?.label} ({list.length})</div>
        <button onClick={() => { setForm(BLANK_MEDICAL); setEditing("new"); }} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add</button>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map(item => (
            <button key={item.id} onClick={() => {
              setForm({ ...BLANK_MEDICAL, ...item, services: Array.isArray(item.services) ? item.services.join("\n") : item.services || "" });
              setEditing(item.id);
            }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{item.district}{item.type ? ` · ${item.type}` : ""}{item.hours ? ` · ${item.hours}` : ""}</div>
              </div>
              <span style={{ color: T.teal, fontSize: 18 }}>›</span>
            </button>
          ))}
          {list.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Nothing added yet. Click "+ Add" to start.</div>}
        </div>
      )}
      <Toast {...toast} />
    </div>
  );
}

// ─── ROOT ADMIN ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "articles",    label: "📄 Articles" },
  { id: "specialists", label: "👨‍⚕️ Specialists" },
  { id: "medical",     label: "🏥 Medical Services" },
];

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("articles");

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui,sans-serif" }}>
      {/* header */}
      <div style={{ background: T.tealDark, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>🌿 සෞඛ්‍ය ශ්‍රී Admin</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Content Management</div>
        </div>
        <button onClick={() => setLoggedIn(false)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>Logout</button>
      </div>

      {/* tab nav */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "14px 8px", border: "none", background: "none",
            cursor: "pointer", fontSize: 13, fontWeight: 700,
            color: tab === t.id ? T.teal : T.muted,
            borderBottom: `3px solid ${tab === t.id ? T.teal : "transparent"}`,
          }}>{t.label}</button>
        ))}
      </div>

      {/* content */}
      <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>
        {tab === "articles" && <ArticlesTab />}
        {tab === "specialists" && <SpecialistsTab />}
        {tab === "medical" && <MedicalTab />}
      </div>
    </div>
  );
}
