import { useState, useEffect } from "react";

// ─── Supabase credentials ────────────────────────────────────────────────────
const SUPABASE_URL = "https://hjhjrbxrweozpwwpzwpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqaGpyYnhyd2VvenB3d3B6d3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDI2MDYsImV4cCI6MjA5NzI3ODYwNn0.U3CS-ALwQGPBhLbKUz1n2sckzx_jHPsWkGDSZH0jluI";
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

// Article categories — matches category ids used in App.jsx
const ARTICLE_CATEGORIES = [
  { value: "diseases",   label: "🤒 Diseases" },
  { value: "symptoms",   label: "🩺 Symptoms" },
  { value: "medicines",  label: "💊 Medicines" },
  { value: "tests",      label: "🧪 Tests" },
  { value: "pregnancy",  label: "🤰 Pregnancy" },
  { value: "child",      label: "👶 Child Health" },
  { value: "mental",     label: "🧠 Mental Health" },
  { value: "firstaid",   label: "🚑 First Aid" },
  { value: "nutrition",  label: "🥗 Nutrition" },
  { value: "prevention", label: "🛡️ Prevention" },
  { value: "sexual",     label: "❤️ Sexual Health" },
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

function Textarea({ label, value, onChange, placeholder, rows = 3, hint }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <Label>{label}</Label>}
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, resize: "vertical", outline: "none" }}
      />
      <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{hint || "Multiple items: one per line"}</div>
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

function CheckboxField({ label, checked, onChange, caption }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Label>{label}</Label>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} />
        <span style={{ fontSize: 14, color: T.text }}>{caption}</span>
      </label>
    </div>
  );
}

function SaveBtn({ onClick, saving }) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      background: T.teal, color: "#fff", border: "none", borderRadius: 10,
      padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
      opacity: saving ? 0.7 : 1, width: "100%", marginTop: 8,
    }}>
      {saving ? "Saving..." : "💾 Save"}
    </button>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: `1px solid ${T.red}`, color: T.red,
      borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", marginTop: 8, width: "100%",
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

function CategoryHint({ category }) {
  const hints = {
    diseases:   "Fields: Overview, Symptoms, Warning Signs, Treatment, Prevention, When to See Doctor",
    symptoms:   "Fields: Overview, Causes, Warning Signs, Self Care, When to See Doctor",
    medicines:  "Fields: Overview, Uses (symptoms field), Warning Signs, Treatment (dosage field), Self Care (side effects)",
    tests:      "Fields: Overview, Causes (why needed), Self Care (preparation), Treatment (what results mean)",
    pregnancy:  "Fields: Overview, Symptoms, Causes, Warning Signs, Self Care, Prevention, When to See Doctor",
    child:      "Fields: Overview, Symptoms, Causes, Warning Signs, Self Care, When to See Doctor",
    mental:     "Fields: Overview, Symptoms, Causes, Self Care, Prevention, When to See Doctor",
    firstaid:   "Fields: Overview, Symptoms (signs), Self Care (steps to take), Warning Signs, When to See Doctor",
    nutrition:  "Fields: Overview, Causes (why important), Self Care (tips), Prevention (habits)",
    prevention: "Fields: Overview, Causes (risk factors), Prevention (steps), Self Care (lifestyle tips)",
    sexual:     "Fields: Overview, Symptoms, Causes, Self Care, Prevention, When to See Doctor",
  };
  const hint = hints[category];
  if (!hint) return null;
  return (
    <div style={{ background: "#EFF8F7", border: `1px solid ${T.tealLight}`, borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 12, color: T.tealDark }}>
      💡 <strong>{ARTICLE_CATEGORIES.find(c=>c.value===category)?.label}</strong> — {hint}
    </div>
  );
}

// ─── ARTICLES TAB ─────────────────────────────────────────────────────────────
const BLANK_ARTICLE = {
  title_si: "", title_en: "", category: "diseases",
  summary: "", overview: "",
  symptoms: "", causes: "", warning_signs: "",
  treatment: "", selfcare: "", prevention: "", see_doctor: "",
  reviewer: "", reviewed_date: new Date().toISOString().split("T")[0],
  featured: false,
};

function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_ARTICLE);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [filterCat, setFilterCat] = useState("all");

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  function load() {
    setLoading(true);
    dbGet("articles").then(data => {
      setArticles(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => { setLoading(false); showToast("Failed to load. Check Supabase credentials.", "error"); });
  }

  useEffect(() => { load(); }, []);

  function f(key) { return val => setForm(prev => ({ ...prev, [key]: val })); }

  function arrToStr(val) {
    if (!val) return "";
    if (Array.isArray(val)) return val.join("\n");
    return val;
  }

  function startNew() { setForm({ ...BLANK_ARTICLE, reviewed_date: new Date().toISOString().split("T")[0] }); setEditing("new"); }
  function startEdit(a) {
    setForm({
      ...BLANK_ARTICLE, ...a,
      symptoms:     arrToStr(a.symptoms),
      causes:       arrToStr(a.causes),
      warning_signs:arrToStr(a.warning_signs),
      selfcare:     arrToStr(a.selfcare),
      prevention:   arrToStr(a.prevention),
    });
    setEditing(a.id);
  }

  function toArray(str) {
    return str ? str.split("\n").map(s => s.trim()).filter(Boolean) : [];
  }

  async function save() {
    if (!form.title_si.trim()) { showToast("Sinhala title is required", "error"); return; }
    setSaving(true);
    const row = {
      title_si:      form.title_si.trim(),
      title_en:      form.title_en.trim(),
      category:      form.category,
      summary:       form.summary.trim(),
      overview:      form.overview.trim(),
      symptoms:      toArray(form.symptoms),
      causes:        toArray(form.causes),
      warning_signs: toArray(form.warning_signs),
      treatment:     form.treatment.trim(),
      selfcare:      toArray(form.selfcare),
      prevention:    toArray(form.prevention),
      see_doctor:    form.see_doctor.trim(),
      reviewer:      form.reviewer.trim(),
      reviewed_date: form.reviewed_date || null,
      featured:      form.featured,
    };
    try {
      if (editing === "new") {
        const result = await dbInsert("articles", row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Article saved!");
      } else {
        const result = await dbUpdate("articles", editing, row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Article updated!");
      }
      load();
      setEditing(null);
    } catch (e) {
      showToast("Error: " + (e.message || "Check Supabase."), "error");
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

  const filtered = filterCat === "all" ? articles : articles.filter(a => a.category === filterCat);

  if (editing !== null) return (
    <div>
      <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, fontSize: 15, padding: "4px 0 16px", cursor: "pointer" }}>← Back to list</button>
      <SectionCard title={editing === "new" ? "✏️ New Article" : "✏️ Edit Article"}>
        <Select label="CATEGORY *" value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))}
          options={ARTICLE_CATEGORIES} />
        <CategoryHint category={form.category} />

{(() => {
  const c = form.category;

  const show = {
    symptoms:      ["diseases","medicines","pregnancy","child","sexual","firstaid"].includes(c),
    causes:        ["diseases","symptoms","tests","pregnancy","child","mental","sexual"].includes(c),
    warning_signs: ["diseases","symptoms","medicines","pregnancy","child","sexual","firstaid"].includes(c),
    treatment:     ["diseases","medicines","tests"].includes(c),
    selfcare:      ["diseases","symptoms","medicines","tests","pregnancy","child","mental","firstaid"].includes(c),
    prevention:    ["diseases","pregnancy","mental","nutrition","prevention","sexual"].includes(c),
    see_doctor:    ["diseases","symptoms","medicines","tests","pregnancy","child","mental","firstaid","sexual"].includes(c),
  };

  const labels = {
    symptoms: {
      diseases:"ලක්ෂණ (Symptoms) — one per line",
      medicines:"ඖෂධය භාවිතා කරන ප්‍රධාන රෝගී තත්ත්වයන් (Approved Uses & Indications) — one per line",
      pregnancy:"ලක්ෂණ (Symptoms) — one per line",
      child:"ලක්ෂණ (Symptoms) — one per line",
      sexual:"ලක්ෂණ (Symptoms) — one per line",
      firstaid:"ලකුණු හඳුනා ගන්නේ කෙසේද? — one per line",
    },
    causes: {
      diseases:"හේතු (Causes) — one per line",
      symptoms:"හේතු (Causes) — one per line",
      tests:"අවශ්‍ය වන්නේ කවදාද? (Why needed) — one per line",
      pregnancy:"හේතු / අවදානම් සාධක — one per line",
      child:"හේතු (Causes) — one per line",
      mental:"හේතු / අවදානම් සාධක — one per line",
      sexual:"හේතු (Causes) — one per line",
      nutrition:"වැදගත්කම (Why important) — one per line",
      prevention:"අවදානම් සාධක (Risk factors) — one per line",
    },
    warning_signs: {
      diseases:"⚠️ අනතුරු ලකුණු (Warning Signs) — one per line",
      symptoms:"⚠️ අනතුරු ලකුණු (Warning Signs) — one per line",
      medicines:"අනතුරු ඇඟවීම් සහ වෙනත් ද්‍රව්‍ය සමඟ අන්තර්ක්‍රියා (Warnings & Interactions) — one per line",
      pregnancy:"⚠️ අනතුරු ලකුණු (Warning Signs) — one per line",
      child:"⚠️ අනතුරු ලකුණු (Warning Signs) — one per line",
      sexual:"⚠️ අනතුරු ලකුණු (Warning Signs) — one per line",
      firstaid:"⚠️ අනතුරු ලකුණු (Warning Signs) — one per line",
    },
    treatment: {
      diseases:"ප්‍රතිකාරය (Treatment)",
      medicines:"ඖෂධය භාවිතා කළ යුතු මාත්‍රාවන් සහ ක්‍රමවේද (Dosage & Administration)",
      tests:"ප්‍රතිඵල තේරුම (What results mean)",
    },
    selfcare: {
      diseases:"ස්ව-රැකවරණ (Self Care) — one per line",
      symptoms:"ස්ව-රැකවරණ (Self Care) — one per line",
      medicines:"ඇතිවිය හැකි අතුරු ආබාධ (Side Effects: What to Expect) — one per line",
      tests:"සූදානම (How to prepare) — one per line",
      pregnancy:"ස්ව-රැකවරණ (Self Care) — one per line",
      child:"ස්ව-රැකවරණ / ගෙදර ප්‍රතිකාරය — one per line",
      mental:"ස්ව-රැකවරණ / Coping tips — one per line",
      firstaid:"ප්‍රථමාධාර පියවර (Steps) — one per line",
    },
    prevention: {
      diseases:"වැළැක්වීම (Prevention) — one per line",
      pregnancy:"ඉඟි (Tips) — one per line",
      mental:"වැළැක්වීම (Prevention) — one per line",
      nutrition:"සෞඛ්‍යසම්පන්න පුරුදු (Healthy habits) — one per line",
      prevention:"වැළැක්වීමේ පියවර (Prevention steps) — one per line",
      sexual:"වැළැක්වීම (Prevention) — one per line",
    },
    see_doctor: {
      diseases:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
      symptoms:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
      medicines:"වෛද්‍ය උපදෙස් සහ පසු විපරම් (Monitoring & Clinical Pearls)",
      tests:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
      pregnancy:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
      child:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
      mental:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
      firstaid:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
      sexual:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?",
    },
  };

  return (<>
    <Input label="TITLE (SINHALA) *" value={form.title_si} onChange={f("title_si")} placeholder="රෝගයේ නම සිංහලෙන්" />
    <Input label="TITLE (ENGLISH)" value={form.title_en} onChange={f("title_en")} placeholder="Name in English" />
    <Textarea label="SUMMARY (1–2 lines for list view)" value={form.summary} onChange={f("summary")} rows={2}
      placeholder="Short description shown in category list..." hint="Shown under title in article list" />
    <Textarea label={c === "medicines" ? "මේ ඖෂධය ශරීරය තුළ ක්‍රියා කරන්නේ කෙසේද? (What it is & How it Works)" : "OVERVIEW"} value={form.overview} onChange={f("overview")} rows={4}
      placeholder="Main explanation paragraph..." hint="First thing the reader sees" />

    {show.symptoms && (
      <Textarea label={labels.symptoms[c] || "ලක්ෂණ — one per line"} value={form.symptoms} onChange={f("symptoms")}
        placeholder={"item 1\nitem 2\nitem 3"} />
    )}

    {show.causes && (
      <Textarea label={labels.causes[c] || "හේතු — one per line"} value={form.causes} onChange={f("causes")}
        placeholder={"item 1\nitem 2\nitem 3"} />
    )}

    {show.warning_signs && (
      <Textarea label={labels.warning_signs[c] || "⚠️ අනතුරු ලකුණු — one per line"} value={form.warning_signs} onChange={f("warning_signs")}
        placeholder={"warning 1\nwarning 2"} />
    )}

    {show.treatment && (
      <Textarea label={labels.treatment[c] || "ප්‍රතිකාරය"} value={form.treatment} onChange={f("treatment")} rows={4}
        placeholder="Free text paragraph..." hint="Free text — not a list" />
    )}

    {show.selfcare && (
      <Textarea label={labels.selfcare[c] || "ස්ව-රැකවරණ — one per line"} value={form.selfcare} onChange={f("selfcare")}
        placeholder={"item 1\nitem 2\nitem 3"} />
    )}

    {show.prevention && (
      <Textarea label={labels.prevention[c] || "වැළැක්වීම — one per line"} value={form.prevention} onChange={f("prevention")}
        placeholder={"item 1\nitem 2\nitem 3"} />
    )}

    {show.see_doctor && (
      <Textarea label={labels.see_doctor[c] || "වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?"} value={form.see_doctor} onChange={f("see_doctor")} rows={2}
        placeholder="Describe when to seek urgent care..." hint="Free text — not a list" />
    )}

    <Input label="REVIEWER NAME & TITLE" value={form.reviewer} onChange={f("reviewer")} placeholder="Dr. Name, MBBS, MD, Hospital" />
    <Input label="REVIEWED DATE" value={form.reviewed_date} onChange={f("reviewed_date")} type="date" />
  </>);
})()}
        <SaveBtn onClick={save} saving={saving} />
        {editing !== "new" && <DeleteBtn onClick={() => del(editing)} />}
      </SectionCard>
      <Toast {...toast} />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>Articles ({articles.length})</div>
        <button onClick={startNew} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ New</button>
      </div>

      {/* category filter */}
      <div style={{ marginBottom: 14 }}>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface }}>
          <option value="all">All categories ({articles.length})</option>
          {ARTICLE_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>
              {c.label} ({articles.filter(a => a.category === c.value).length})
            </option>
          ))}
        </select>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(a => (
            <button key={a.id} onClick={() => startEdit(a)} style={{
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
              padding: "12px 16px", display: "flex", justifyContent: "space-between",
              alignItems: "center", cursor: "pointer", textAlign: "left",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title_si}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{a.title_en || "—"} · {a.category}</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 8, flexShrink: 0 }}>
                {a.featured && <span style={{ fontSize: 11, background: T.tealLight, color: T.teal, borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>⭐</span>}
                <span style={{ color: T.teal, fontSize: 18 }}>›</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.muted }}>No articles yet. Click "+ New" to start.</div>}
        </div>
      )}
      <Toast {...toast} />
    </div>
  );
}

// ─── SPECIALISTS TAB ──────────────────────────────────────────────────────────
// DB schema: id, created_at, name, qual, specialty, hospital, district, division, phone, availability, opd
const BLANK_SPECIALIST = {
  name: "", qual: "", specialty: "", hospital: "",
  district: "", division: "", phone: "", availability: "", opd: "",
};

function SpecialistsTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_SPECIALIST);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "" }), 3000); }
  function load() {
    setLoading(true);
    dbGet("specialists").then(d => {
      setList(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => { setLoading(false); showToast("Failed to load", "error"); });
  }
  useEffect(() => { load(); }, []);
  function f(key) { return val => setForm(prev => ({ ...prev, [key]: val })); }

  async function save() {
    if (!form.name.trim()) { showToast("Name is required", "error"); return; }
    setSaving(true);
    const row = {
      name:         form.name.trim(),
      qual:         form.qual.trim(),
      specialty:    form.specialty.trim(),
      hospital:     form.hospital.trim(),
      district:     form.district.trim(),
      division:     form.division.trim(),
      phone:        form.phone.trim(),
      availability: form.availability.trim(),
      opd:          form.opd.trim(),
    };
    try {
      if (editing === "new") { const result = await dbInsert("specialists", row); if (result?.code) throw new Error(result.message); showToast("✅ Saved!"); }
      else { const result = await dbUpdate("specialists", editing, row); if (result?.code) throw new Error(result.message); showToast("✅ Updated!"); }
      load(); setEditing(null);
    } catch (e) { showToast("Error: " + (e.message || "Check Supabase"), "error"); }
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
        <Input label="QUALIFICATIONS (qual)" value={form.qual} onChange={f("qual")} placeholder="MBBS, MD (Internal Medicine), MRCP" />
        <Input label="SPECIALTY" value={form.specialty} onChange={f("specialty")} placeholder="cardiology" />
        <Input label="HOSPITAL" value={form.hospital} onChange={f("hospital")} placeholder="National Hospital Colombo" />
        <Input label="DISTRICT (Sinhala)" value={form.district} onChange={f("district")} placeholder="කොළඹ" />
        <Input label="DIVISION / TOWN" value={form.division} onChange={f("division")} placeholder="Colombo 08" />
        <Input label="PHONE" value={form.phone} onChange={f("phone")} placeholder="0112691111" />
        <Input label="AVAILABILITY / CLINIC TIMES" value={form.availability} onChange={f("availability")} placeholder="Mon, Wed, Fri 9am–1pm" />
        <Input label="OPD CHANNEL NUMBER / NOTES" value={form.opd} onChange={f("opd")} placeholder="Channel 3 / Walk-in" />
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
        <button onClick={() => { setForm(BLANK_SPECIALIST); setEditing("new"); }} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add</button>
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map(s => (
            <button key={s.id} onClick={() => { setForm({ ...BLANK_SPECIALIST, ...s }); setEditing(s.id); }}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{s.specialty} · {s.district}</div>
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

// ─── MEDICAL SERVICES TAB ─────────────────────────────────────────────────────
// Matches DB schema exactly for each table
const MEDICAL_SUBTABS = [
  { id: "hospitals",       label: "🏥 Hospitals" },
  { id: "pharmacies",      label: "💊 Pharmacies" },
  { id: "labs",            label: "🔬 Labs" },
  { id: "medical_centres", label: "🏨 Medical Centres" },
];

// Each table has different fields — blank forms per table
const BLANK_FORMS = {
  hospitals:       { name: "", address: "", district: "", division: "", phone: "", services: "", hours: "", emergency: false },
  pharmacies:      { name: "", address: "", district: "", division: "", phone: "", hours: "", delivery: false },
  labs:            { name: "", address: "", district: "", division: "", phone: "", hours: "", home_service: false, tests: "" },
  medical_centres: { name: "", address: "", district: "", division: "", phone: "", hours: "" },
};

function MedicalTab() {
  const [subtab, setSubtab] = useState("hospitals");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_FORMS.hospitals);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "" }), 3000); }

  function load() {
    setLoading(true);
    dbGet(subtab).then(d => {
      setList(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => { setLoading(false); showToast("Failed to load", "error"); });
  }
  useEffect(() => { load(); }, [subtab]);

  function f(key) { return val => setForm(prev => ({ ...prev, [key]: val })); }

  function arrToStr(val) {
    if (!val) return "";
    if (Array.isArray(val)) return val.join("\n");
    return val;
  }

  function startNew() {
    setForm({ ...BLANK_FORMS[subtab] });
    setEditing("new");
  }

  function startEdit(item) {
    const blank = BLANK_FORMS[subtab];
    setForm({
      ...blank, ...item,
      services: arrToStr(item.services),
      tests:    arrToStr(item.tests),
    });
    setEditing(item.id);
  }

  function toArray(str) {
    return str ? str.split("\n").map(s => s.trim()).filter(Boolean) : [];
  }

  async function save() {
    if (!form.name.trim()) { showToast("Name is required", "error"); return; }
    setSaving(true);

    // Build row matching the exact DB schema for each table
    let row = {};
    if (subtab === "hospitals") {
      row = {
        name:      form.name.trim(),
        address:   form.address.trim(),
        district:  form.district.trim(),
        division:  form.division.trim(),
        phone:     form.phone.trim(),
        services:  toArray(form.services),
        hours:     form.hours.trim(),
        emergency: !!form.emergency,
      };
    } else if (subtab === "pharmacies") {
      row = {
        name:     form.name.trim(),
        address:  form.address.trim(),
        district: form.district.trim(),
        division: form.division.trim(),
        phone:    form.phone.trim(),
        hours:    form.hours.trim(),
        delivery: !!form.delivery,
      };
    } else if (subtab === "labs") {
      row = {
        name:         form.name.trim(),
        address:      form.address.trim(),
        district:     form.district.trim(),
        division:     form.division.trim(),
        phone:        form.phone.trim(),
        hours:        form.hours.trim(),
        home_service: !!form.home_service,
        tests:        toArray(form.tests),
      };
    } else if (subtab === "medical_centres") {
      row = {
        name:     form.name.trim(),
        address:  form.address.trim(),
        district: form.district.trim(),
        division: form.division.trim(),
        phone:    form.phone.trim(),
        hours:    form.hours.trim(),
      };
    }

    try {
      if (editing === "new") {
        const result = await dbInsert(subtab, row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Saved!");
      } else {
        const result = await dbUpdate(subtab, editing, row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Updated!");
      }
      load(); setEditing(null);
    } catch (e) { showToast("Error: " + (e.message || "Check Supabase"), "error"); }
    setSaving(false);
  }

  async function del(id) {
    if (!window.confirm("Delete?")) return;
    await dbDelete(subtab, id); showToast("Deleted."); load(); setEditing(null);
  }

  const currentLabel = MEDICAL_SUBTABS.find(s => s.id === subtab)?.label;

  if (editing !== null) return (
    <div>
      <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, fontSize: 15, padding: "4px 0 16px", cursor: "pointer" }}>← Back to list</button>
      <SectionCard title={editing === "new" ? `➕ Add to ${currentLabel}` : `✏️ Edit ${currentLabel}`}>
        <Input label="NAME *" value={form.name} onChange={f("name")} placeholder="Facility name" />
        <Input label="ADDRESS" value={form.address} onChange={f("address")} placeholder="Street, City" />
        <Input label="DISTRICT (Sinhala)" value={form.district} onChange={f("district")} placeholder="කොළඹ" />
        <Input label="DIVISION / AREA" value={form.division} onChange={f("division")} placeholder="Colombo 08 / Dehiwala" />
        <Input label="PHONE" value={form.phone} onChange={f("phone")} placeholder="0112345678" />
        <Input label="OPENING HOURS" value={form.hours} onChange={f("hours")} placeholder="24 පැය / 8:00–20:00" />

       {subtab === "hospitals" && <>
          <Textarea label="SERVICES (one per line)" value={form.services} onChange={f("services")}
            placeholder={"හදිසි ප්‍රතිකාර\nශල්‍යකර්ම\nICU\nළමා රෝග"} />
          <CheckboxField label="24-HOUR EMERGENCY?" checked={form.emergency} onChange={v => setForm(p => ({ ...p, emergency: v }))} caption="Has 24-hour emergency service" />
          {editing !== "new" && <ClinicManager hospitalId={editing} />}
        </>}

        {subtab === "pharmacies" && (
          <CheckboxField label="DELIVERY SERVICE?" checked={form.delivery} onChange={v => setForm(p => ({ ...p, delivery: v }))} caption="Offers home delivery" />
        )}

        {subtab === "labs" && <>
          <Textarea label="TESTS OFFERED (one per line)" value={form.tests} onChange={f("tests")}
            placeholder={"CBC\nHbA1c\nLipid Profile\nUrine Full Report"} />
          <CheckboxField label="HOME SAMPLE COLLECTION?" checked={form.home_service} onChange={v => setForm(p => ({ ...p, home_service: v }))} caption="Offers home sample collection" />
        </>}

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
            fontSize: 10, fontWeight: 700, color: subtab === s.id ? T.teal : T.muted,
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>{currentLabel} ({list.length})</div>
        <button onClick={startNew} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add</button>
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map(item => (
            <button key={item.id} onClick={() => startEdit(item)}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>
                  {item.district}{item.division ? ` · ${item.division}` : ""}{item.hours ? ` · ${item.hours}` : ""}
                  {item.emergency ? " · 🚨 24h" : ""}
                  {item.home_service ? " · 🏠" : ""}
                  {item.delivery ? " · 🚚" : ""}
                </div>
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
        <div style={{ marginBottom: 12 }}>
          <Label>PASSWORD</Label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter admin password"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, outline: "none" }} />
        </div>
        {err && <div style={{ color: T.red, fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button onClick={attempt} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>
          Login →
        </button>
      </div>
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
      <div style={{ background: T.tealDark, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>🌿 සෞඛ්‍ය ශ්‍රී Admin</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Content Management</div>
        </div>
        <button onClick={() => setLoggedIn(false)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>Logout</button>
      </div>

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

      <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>
        {tab === "articles"    && <ArticlesTab />}
        {tab === "specialists" && <SpecialistsTab />}
        {tab === "medical"     && <MedicalTab />}
      </div>
    </div>
  );
}
