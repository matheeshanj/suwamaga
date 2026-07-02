import React, { useState, useEffect } from "react";
import LOCATION_DATA, { getAdminDistricts, getAdminDivisions } from "./locationData";

// ─── location helpers ─────────────────────────────────────────────────────────
const PROVINCES = ["", ...Object.keys(LOCATION_DATA)];

function getDistricts(province) {
  if (!province) return [""];
  return ["", ...getAdminDistricts(province)];
}

function getDivisions(province, district) {
  if (!province || !district) return [""];
  return ["", ...getAdminDivisions(province, district)];
}

// ─── LocationPicker — cascading province → district → division ────────────────
function LocationPicker({ district, division, onChange }) {
  const [province, setProvince] = useState("");

  const districts = getDistricts(province);
  const divisions = getDivisions(province, district);

  const selCls = {
    width: "100%", boxSizing: "border-box", padding: "10px 12px",
    borderRadius: 8, border: "1px solid #E0EEEC", fontSize: 14,
    color: "#1A2E2E", background: "#FFFFFF", outline: "none", marginBottom: 8,
  };

  function onProvChange(p) {
    setProvince(p);
    onChange("district", "");
    onChange("division", "");
  }

  function onDistChange(d) {
    onChange("district", d);
    onChange("division", "");
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#607D7B", marginBottom: 4, letterSpacing: 0.5 }}>PROVINCE</div>
      <select value={province} onChange={e => onProvChange(e.target.value)} style={selCls}>
        {PROVINCES.map(p => <option key={p} value={p}>{p || "— Select Province —"}</option>)}
      </select>

      <div style={{ fontSize: 12, fontWeight: 700, color: "#607D7B", marginBottom: 4, letterSpacing: 0.5 }}>DISTRICT (Sinhala)</div>
      <select value={district} onChange={e => onDistChange(e.target.value)} style={selCls} disabled={!province}>
        {getDistricts(province).map(d => <option key={d} value={d}>{d || "— Select District —"}</option>)}
      </select>

      <div style={{ fontSize: 12, fontWeight: 700, color: "#607D7B", marginBottom: 4, letterSpacing: 0.5 }}>DIVISION (ප්‍රාදේශීය ලේකම් කොට්ඨාශය)</div>
      <select value={division} onChange={e => onChange("division", e.target.value)} style={selCls} disabled={!district}>
        {getDivisions(province, district).map(d => <option key={d} value={d}>{d || "— Select Division —"}</option>)}
      </select>
    </div>
  );
}

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

async function saveHospitalCoords(hospitalId, lat, lng) {
  if (lat === "" && lng === "") return; // nothing entered, skip silently
  const latNum = lat !== "" && lat !== null ? parseFloat(lat) : null;
  const lngNum = lng !== "" && lng !== null ? parseFloat(lng) : null;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/hospital_coordinates?hospital_id=eq.${hospitalId}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ lat: latNum, lng: lngNum }),
  });
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    await dbInsert("hospital_coordinates", { hospital_id: hospitalId, lat: latNum, lng: lngNum });
  }
}


// ─── colours ──────────────────────────────────────────────────────────────────
const T = {
  bg: "#F7FAFA", surface: "#FFFFFF", teal: "#00796B", tealLight: "#E0F2F1",
  tealDark: "#004D40", amber: "#F57F17", emergency: "#C62828",
  text: "#1A2E2E", muted: "#607D7B", border: "#E0EEEC", red: "#C62828",
};

// ─── Article categories ───────────────────────────────────────────────────────
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
function Label({ children, required }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, color: T.tealDark, marginBottom: 5, letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
      {children}
      {required && <span style={{ color: T.red, fontSize: 13 }}>*</span>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <Label required={required}>{label}</Label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box", padding: "11px 14px",
          borderRadius: 10, fontSize: 14, color: T.text, outline: "none",
          border: `2px solid ${focused ? T.teal : T.border}`,
          background: focused ? "#FAFFFF" : T.surface,
          transition: "border-color 0.15s, background 0.15s",
          fontFamily: "Noto Sans Sinhala, system-ui, sans-serif",
        }}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3, hint, required }) {
  const [focused, setFocused] = useState(false);
  const charCount = value ? value.length : 0;
  const lineCount = value ? value.split("\n").filter(l => l.trim()).length : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <Label required={required}>{label}</Label>}
      <div style={{ position: "relative" }}>
        <textarea
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box", padding: "11px 14px",
            borderRadius: 10, fontSize: 14, color: T.text, resize: "vertical", outline: "none",
            border: `2px solid ${focused ? T.teal : T.border}`,
            background: focused ? "#FAFFFF" : T.surface,
            transition: "border-color 0.15s, background 0.15s",
            fontFamily: "Noto Sans Sinhala, system-ui, sans-serif",
            lineHeight: 1.6,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <div style={{ fontSize: 11, color: T.muted }}>{hint || "Multiple items: one per line"}</div>
        {value && <div style={{ fontSize: 11, color: T.teal, fontWeight: 600 }}>{lineCount} {lineCount === 1 ? "item" : "items"}</div>}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <Label>{label}</Label>}
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "11px 14px", borderRadius: 10,
          border: `2px solid ${T.border}`, fontSize: 14, color: T.text,
          background: T.surface, outline: "none",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

function CheckboxField({ label, checked, onChange, caption }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <Label>{label}</Label>}
      <label style={{
        display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        background: checked ? T.tealLight : "#F8FAFA", border: `2px solid ${checked ? T.teal : T.border}`,
        borderRadius: 10, padding: "10px 14px", transition: "all 0.15s",
      }}>
        <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: T.teal }} />
        <span style={{ fontSize: 14, color: checked ? T.tealDark : T.text, fontWeight: checked ? 700 : 400 }}>{caption}</span>
      </label>
    </div>
  );
}

function SaveBtn({ onClick, saving }) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      background: saving ? T.muted : `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`,
      color: "#fff", border: "none", borderRadius: 12,
      padding: "14px 28px", fontSize: 15, fontWeight: 800,
      cursor: saving ? "not-allowed" : "pointer",
      width: "100%", marginTop: 8,
      boxShadow: saving ? "none" : "0 4px 12px rgba(0,121,107,0.3)",
      letterSpacing: 0.5,
    }}>
      {saving ? "⏳ Saving..." : "💾 Save"}
    </button>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: `2px solid ${T.red}`, color: T.red,
      borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700,
      cursor: "pointer", marginTop: 8, width: "100%",
    }}>🗑 Delete</button>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? T.red : T.tealDark, color: "#fff",
      borderRadius: 12, padding: "14px 28px", fontWeight: 700, fontSize: 14,
      zIndex: 9999, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", whiteSpace: "nowrap",
      display: "flex", alignItems: "center", gap: 8,
    }}>{msg}</div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ fontWeight: 800, fontSize: 17, color: T.tealDark, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${T.tealLight}` }}>{title}</div>
      {children}
    </div>
  );
}

function FieldGroup({ children, title }) {
  return (
    <div style={{ background: "#F7FAFA", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: `1px solid ${T.border}` }}>
      {title && <div style={{ fontSize: 11, fontWeight: 800, color: T.teal, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>{title}</div>}
      {children}
    </div>
  );
}

function CategoryHint({ category }) {
  const hints = {
    diseases:   "Overview · Symptoms · Causes · Warning Signs · Treatment · Prevention · When to See Doctor",
    symptoms:   "Overview · Causes · Warning Signs · Self Care · When to See Doctor",
    medicines:  "Overview · How it Works · Approved Uses · Dosage · Side Effects · Warnings · Clinical Notes",
    tests:      "Overview · Why Needed · Preparation · What Results Mean · When to See Doctor",
    pregnancy:  "Overview · Symptoms · Warning Signs · Self Care · Tips · When to See Doctor",
    child:      "Overview · Symptoms · Causes · Warning Signs · Self Care · When to See Doctor",
    mental:     "Overview · Symptoms · Causes · Self Care · Prevention · When to See Doctor",
    firstaid:   "Overview · Signs · First Aid Steps · Warning Signs · When to See Doctor",
    nutrition:  "Overview · Why Important · Tips · Healthy Habits",
    prevention: "Overview · Risk Factors · Prevention Steps · Healthy Lifestyle",
    sexual:     "Overview · Symptoms · Causes · Warning Signs · Self Care · Prevention · When to See Doctor",
  };
  const hint = hints[category];
  const cat = ARTICLE_CATEGORIES.find(c => c.value === category);
  if (!hint) return null;
  return (
    <div style={{ background: T.tealLight, borderRadius: 10, padding: "10px 14px", marginBottom: 4 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: T.tealDark, marginBottom: 3 }}>{cat?.label} — Sections to fill:</div>
      <div style={{ fontSize: 12, color: T.teal }}>{hint}</div>
    </div>
  );
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────
const FREE_FORM_CATEGORIES = ["pregnancy","child","mental","firstaid","nutrition","prevention","sexual","tests"];

function RichTextEditor({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const editorRef = React.useRef(null);

  // Sync value into contenteditable on first load only
  React.useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = value;
    }
  }, []);

  function exec(cmd, val = null) {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
  }

  function handleInput() {
    onChange(editorRef.current.innerHTML);
  }

  const btnStyle = (active) => ({
    padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.border}`,
    background: active ? T.tealLight : T.surface, color: active ? T.teal : T.text,
    cursor: "pointer", fontSize: 13, fontWeight: 700, lineHeight: 1,
  });

  return (
    <div style={{ marginBottom: 14 }}>
      <Label>Main Content</Label>
      {/* Toolbar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 5, padding: "8px 10px",
        background: "#F0F7F6", borderRadius: "10px 10px 0 0",
        border: `2px solid ${focused ? T.teal : T.border}`,
        borderBottom: "none",
      }}>
        <button type="button" style={btnStyle(false)} onClick={() => exec("bold")}><b>B</b></button>
        <button type="button" style={btnStyle(false)} onClick={() => exec("italic")}><i>I</i></button>
        <button type="button" style={btnStyle(false)} onClick={() => exec("underline")}><u>U</u></button>
        <div style={{ width: 1, background: T.border, margin: "0 2px" }} />
        <button type="button" style={btnStyle(false)} onClick={() => exec("insertUnorderedList")}>• List</button>
        <button type="button" style={btnStyle(false)} onClick={() => exec("insertOrderedList")}>1. List</button>
        <div style={{ width: 1, background: T.border, margin: "0 2px" }} />
        <button type="button" style={btnStyle(false)} onClick={() => exec("formatBlock", "h3")}>Heading</button>
        <button type="button" style={btnStyle(false)} onClick={() => exec("formatBlock", "p")}>Text</button>
        <div style={{ width: 1, background: T.border, margin: "0 2px" }} />
        <button type="button" style={{ ...btnStyle(false), color: T.red }} onClick={() => exec("removeFormat")}>Clear</button>
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          minHeight: 220, padding: "14px 16px",
          border: `2px solid ${focused ? T.teal : T.border}`,
          borderTop: "none", borderRadius: "0 0 10px 10px",
          fontSize: 15, color: T.text, outline: "none",
          background: focused ? "#FAFFFF" : T.surface,
          fontFamily: "Noto Sans Sinhala, system-ui, sans-serif",
          lineHeight: 1.7, overflowY: "auto",
        }}
      />
      <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
        Use heading for section titles (e.g. "ලක්ෂණ", "හේතු"). Use bullet list for lists.
      </div>
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
  rich_content: "",
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
      symptoms:      arrToStr(a.symptoms),
      causes:        arrToStr(a.causes),
      warning_signs: arrToStr(a.warning_signs),
      selfcare:      arrToStr(a.selfcare),
      prevention:    arrToStr(a.prevention),
      rich_content:  a.rich_content || "",
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
      rich_content:  form.rich_content || "",
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

  if (editing !== null) {
    const c = form.category;
    const show = {
      symptoms:      ["diseases","medicines","pregnancy","child","sexual","firstaid"].includes(c),
      causes:        ["diseases","symptoms","tests","pregnancy","child","mental","sexual","nutrition","prevention"].includes(c),
      warning_signs: ["diseases","symptoms","medicines","pregnancy","child","sexual","firstaid"].includes(c),
      treatment:     ["diseases","medicines","tests"].includes(c),
      selfcare:      ["diseases","symptoms","medicines","tests","pregnancy","child","mental","firstaid","nutrition","prevention"].includes(c),
      prevention:    ["diseases","pregnancy","mental","nutrition","prevention","sexual"].includes(c),
      see_doctor:    ["diseases","symptoms","medicines","tests","pregnancy","child","mental","firstaid","sexual"].includes(c),
    };
    const labels = {
      symptoms: { diseases:"ලක්ෂණ (Symptoms) — one per line", medicines:"ඖෂධය භාවිතා කරන ප්‍රධාන රෝගී තත්ත්වයන් — one per line", pregnancy:"ලක්ෂණ (Symptoms) — one per line", child:"ලක්ෂණ (Symptoms) — one per line", sexual:"ලක්ෂණ (Symptoms) — one per line", firstaid:"ලකුණු හඳුනා ගන්නේ කෙසේද? — one per line" },
      causes: { diseases:"හේතු (Causes) — one per line", symptoms:"හේතු (Causes) — one per line", tests:"අවශ්‍ය වන්නේ කවදාද? — one per line", pregnancy:"හේතු / අවදානම් සාධක — one per line", child:"හේතු (Causes) — one per line", mental:"හේතු / අවදානම් සාධක — one per line", sexual:"හේතු (Causes) — one per line", nutrition:"වැදගත්කම (Why important) — one per line", prevention:"අවදානම් සාධක (Risk factors) — one per line" },
      warning_signs: { diseases:"⚠️ අනතුරු ලකුණු — one per line", symptoms:"⚠️ අනතුරු ලකුණු — one per line", medicines:"අනතුරු ඇඟවීම් සහ අන්තර්ක්‍රියා — one per line", pregnancy:"⚠️ අනතුරු ලකුණු — one per line", child:"⚠️ අනතුරු ලකුණු — one per line", sexual:"⚠️ අනතුරු ලකුණු — one per line", firstaid:"⚠️ අනතුරු ලකුණු — one per line" },
      treatment: { diseases:"ප්‍රතිකාරය (Treatment)", medicines:"මාත්‍රාවන් සහ ක්‍රමවේද (Dosage & Administration)", tests:"ප්‍රතිඵල තේරුම (What results mean)" },
      selfcare: { diseases:"ස්ව-රැකවරණ — one per line", symptoms:"ස්ව-රැකවරණ — one per line", medicines:"ඇතිවිය හැකි අතුරු ආබාධ — one per line", tests:"සූදානම (How to prepare) — one per line", pregnancy:"ස්ව-රැකවරණ — one per line", child:"ස්ව-රැකවරණ / ගෙදර ප්‍රතිකාරය — one per line", mental:"ස්ව-රැකවරණ / Coping tips — one per line", firstaid:"ප්‍රථමාධාර පියවර (Steps) — one per line", nutrition:"ඉඟි සහ සූදානම — one per line", prevention:"සෞඛ්‍ය සම්පන්න ජීවන රටාව — one per line" },
      prevention: { diseases:"වැළැක්වීම — one per line", pregnancy:"ඉඟි (Tips) — one per line", mental:"වැළැක්වීම — one per line", nutrition:"සෞඛ්‍යසම්පන්න පුරුදු — one per line", prevention:"වැළැක්වීමේ පියවර — one per line", sexual:"වැළැක්වීම — one per line" },
      see_doctor: { diseases:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?", symptoms:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?", medicines:"වෛද්‍ය උපදෙස් සහ පසු විපරම්", tests:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?", pregnancy:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?", child:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?", mental:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?", firstaid:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?", sexual:"වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?" },
    };

    return (
      <div>
        <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, fontSize: 15, padding: "4px 0 16px", cursor: "pointer" }}>← Back to list</button>
        <SectionCard title={editing === "new" ? "✏️ New Article" : "✏️ Edit Article"}>
          <FieldGroup title="📋 Article Type">
            <Select label="CATEGORY" value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} options={ARTICLE_CATEGORIES} />
            <CategoryHint category={form.category} />
          </FieldGroup>

          <FieldGroup title="🏷️ Title & Summary">
            <Input label="Title in Sinhala" required value={form.title_si} onChange={f("title_si")} placeholder="රෝගයේ නම සිංහලෙන්" />
            <Input label="Title in English" value={form.title_en} onChange={f("title_en")} placeholder="Name in English" />
            <Textarea label="Summary" value={form.summary} onChange={f("summary")} rows={2} placeholder="Short description shown in category list..." hint="1–2 lines shown under title in article list" />
          </FieldGroup>

          <FieldGroup title="📝 Main Content">
            {FREE_FORM_CATEGORIES.includes(c) ? (
              <RichTextEditor
                key={editing}
                value={form.rich_content}
                onChange={v => setForm(p => ({ ...p, rich_content: v }))}
              />
            ) : (
              <>
                <Textarea label={c === "medicines" ? "How it works" : "Overview"} value={form.overview} onChange={f("overview")} rows={5} placeholder="Main explanation paragraph..." hint="First paragraph the reader sees" />
                {show.symptoms && <Textarea label={labels.symptoms[c] || "ලක්ෂණ"} value={form.symptoms} onChange={f("symptoms")} rows={4} placeholder={"item 1\nitem 2\nitem 3"} />}
                {show.causes && <Textarea label={labels.causes[c] || "හේතු"} value={form.causes} onChange={f("causes")} rows={4} placeholder={"item 1\nitem 2\nitem 3"} />}
                {show.treatment && <Textarea label={labels.treatment[c] || "ප්‍රතිකාරය"} value={form.treatment} onChange={f("treatment")} rows={4} placeholder="Free text paragraph..." hint="Free text — not a list" />}
                {show.selfcare && <Textarea label={labels.selfcare[c] || "ස්ව-රැකවරණ"} value={form.selfcare} onChange={f("selfcare")} rows={4} placeholder={"item 1\nitem 2\nitem 3"} />}
                {show.prevention && <Textarea label={labels.prevention[c] || "වැළැක්වීම"} value={form.prevention} onChange={f("prevention")} rows={4} placeholder={"item 1\nitem 2\nitem 3"} />}
              </>
            )}
          </FieldGroup>

          {(show.warning_signs || show.see_doctor) && (
            <FieldGroup title="⚠️ Warnings & When to See Doctor">
              {show.warning_signs && <Textarea label={labels.warning_signs[c] || "අනතුරු ලකුණු"} value={form.warning_signs} onChange={f("warning_signs")} rows={3} placeholder={"warning 1\nwarning 2"} />}
              {show.see_doctor && <Textarea label={labels.see_doctor[c] || "වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?"} value={form.see_doctor} onChange={f("see_doctor")} rows={3} placeholder="Describe when to seek urgent care..." hint="Free text — not a list" />}
            </FieldGroup>
          )}

          <FieldGroup title="✅ Review & Publishing">
            <Input label="Reviewer Name & Title" value={form.reviewer} onChange={f("reviewer")} placeholder="Dr. Name, MBBS, MD, Hospital" />
            <Input label="Reviewed Date" value={form.reviewed_date} onChange={f("reviewed_date")} type="date" />
            <CheckboxField label="Featured?" checked={form.featured} onChange={v => setForm(p => ({ ...p, featured: v }))} caption="⭐ Show on home screen as featured article" />
          </FieldGroup>
          <SaveBtn onClick={save} saving={saving} />
          {editing !== "new" && <DeleteBtn onClick={() => del(editing)} />}
        </SectionCard>
        <Toast {...toast} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>Articles ({articles.length})</div>
        <button onClick={startNew} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ New</button>
      </div>
      <div style={{ marginBottom: 14 }}>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface }}>
          <option value="all">All categories ({articles.length})</option>
          {ARTICLE_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label} ({articles.filter(a => a.category === c.value).length})</option>
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
      if (editing === "new") {
        const result = await dbInsert("specialists", row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Saved!");
      } else {
        const result = await dbUpdate("specialists", editing, row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Updated!");
      }
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
        <Input label="QUALIFICATIONS" value={form.qual} onChange={f("qual")} placeholder="MBBS, MD (Internal Medicine), MRCP" />
        <Input label="SPECIALTY" value={form.specialty} onChange={f("specialty")} placeholder="cardiology" />
        <Input label="HOSPITAL" value={form.hospital} onChange={f("hospital")} placeholder="National Hospital Colombo" />
        <LocationPicker
          district={form.district}
          division={form.division}
          onChange={(key, val) => setForm(p => ({ ...p, [key]: val }))}
        />
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
const MEDICAL_SUBTABS = [
  { id: "hospitals",       label: "🏥 Hospitals" },
  { id: "pharmacies",      label: "💊 Pharmacies" },
  { id: "labs",            label: "🔬 Labs" },
  { id: "medical_centres", label: "🏨 Medical Centres" },
];

const BLANK_FORMS = {
  hospitals:       { name: "", address: "", district: "", division: "", phone: "", services: "", hours: "", emergency: false, lat: "", lng: "" },
  pharmacies:      { name: "", address: "", district: "", division: "", phone: "", hours: "", delivery: false },
  labs:            { name: "", address: "", district: "", division: "", phone: "", hours: "", home_service: false, tests: "" },
  medical_centres: { name: "", address: "", district: "", division: "", phone: "", hours: "" },
};

// ─── CLINIC MANAGER ───────────────────────────────────────────────────────────
const BLANK_CLINIC = { clinic_name: "", doctor: "", room: "", days: "", time_start: "", time_end: "" };

function ClinicManager({ hospitalId }) {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK_CLINIC);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  function load() {
    setLoading(true);
    fetch(`${SUPABASE_URL}/rest/v1/clinics?hospital_id=eq.${hospitalId}&select=*&order=created_at.asc`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    }).then(r => r.json()).then(d => {
      setClinics(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => { setLoading(false); showToast("Failed to load clinics", "error"); });
  }

  useEffect(() => { load(); }, [hospitalId]);

  function f(key) { return val => setForm(prev => ({ ...prev, [key]: val })); }

  async function save() {
    if (!form.clinic_name.trim()) { showToast("Clinic name is required", "error"); return; }
    setSaving(true);
    const row = {
      hospital_id: hospitalId,
      clinic_name: form.clinic_name.trim(),
      doctor:      form.doctor.trim(),
      room:        form.room.trim(),
      days:        form.days.trim(),
      time_start:  form.time_start.trim(),
      time_end:    form.time_end.trim(),
    };
    try {
      if (editingId === "new") {
        const result = await dbInsert("clinics", row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Clinic added!");
      } else {
        const result = await dbUpdate("clinics", editingId, row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Clinic updated!");
      }
      load();
      setEditingId(null);
    } catch (e) {
      showToast("Error: " + (e.message || "Check Supabase"), "error");
    }
    setSaving(false);
  }

  async function del(id) {
    if (!window.confirm("Delete this clinic session?")) return;
    await dbDelete("clinics", id);
    showToast("Deleted.");
    load();
    setEditingId(null);
  }

  return (
    <div style={{ marginTop: 16, borderTop: `2px dashed ${T.border}`, paddingTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: T.tealDark }}>🏥 Clinic Sessions</div>
        <button onClick={() => { setForm(BLANK_CLINIC); setEditingId("new"); }}
          style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Add Clinic
        </button>
      </div>

      {editingId !== null && (
        <div style={{ background: T.tealLight, borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.tealDark, marginBottom: 10 }}>
            {editingId === "new" ? "➕ New Clinic Session" : "✏️ Edit Clinic Session"}
          </div>
          <Input label="CLINIC NAME *" value={form.clinic_name} onChange={f("clinic_name")} placeholder="Cardiology Clinic / OPD" />
          <Input label="DOCTOR NAME" value={form.doctor} onChange={f("doctor")} placeholder="Dr. Nalaka Perera" />
          <Input label="ROOM / WARD NO." value={form.room} onChange={f("room")} placeholder="Room 04 / Ward B" />
          <div style={{ marginBottom: 12 }}>
            <Label>AVAILABLE DAYS</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => {
                const selected = (form.days || "").split(",").map(d => d.trim()).includes(day);
                return (
                  <button key={day} type="button" onClick={() => {
                    const current = (form.days || "").split(",").map(d => d.trim()).filter(Boolean);
                    const updated = selected ? current.filter(d => d !== day) : [...current, day];
                    setForm(p => ({ ...p, days: updated.join(", ") }));
                  }} style={{
                    padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
                    border: `2px solid ${selected ? T.teal : T.border}`,
                    background: selected ? T.teal : T.surface,
                    color: selected ? "#fff" : T.muted,
                  }}>{day}</button>
                );
              })}
            </div>
            {form.days ? <div style={{ fontSize: 12, color: T.teal, marginTop: 6 }}>Selected: {form.days}</div> : null}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="START TIME" value={form.time_start} onChange={f("time_start")} placeholder="8:00 AM" />
            <Input label="END TIME" value={form.time_end} onChange={f("time_end")} placeholder="12:00 PM" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={save} disabled={saving} style={{ flex: 1, background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "💾 Save"}
            </button>
            <button onClick={() => setEditingId(null)} style={{ flex: 1, background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px", fontSize: 14, cursor: "pointer", color: T.muted }}>
              Cancel
            </button>
          </div>
          {editingId !== "new" && (
            <button onClick={() => del(editingId)} style={{ marginTop: 8, width: "100%", background: "none", border: `1px solid ${T.red}`, color: T.red, borderRadius: 8, padding: "8px", fontSize: 13, cursor: "pointer" }}>
              🗑 Delete Session
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: 13, color: T.muted, padding: "8px 0" }}>Loading clinics...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {clinics.length === 0 && <div style={{ fontSize: 13, color: T.muted, textAlign: "center", padding: 12 }}>No clinic sessions added yet.</div>}
          {clinics.map(c => (
            <button key={c.id} onClick={() => {
              setForm({ clinic_name: c.clinic_name, doctor: c.doctor || "", room: c.room || "", days: c.days || "", time_start: c.time_start || "", time_end: c.time_end || "" });
              setEditingId(c.id);
            }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{c.clinic_name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>
                  {c.doctor && `${c.doctor} · `}{c.room && `${c.room} · `}{c.days}{c.time_start && ` · ${c.time_start}${c.time_end ? `–${c.time_end}` : ""}`}
                </div>
              </div>
              <span style={{ color: T.teal, fontSize: 16 }}>✏️</span>
            </button>
          ))}
        </div>
      )}
      <Toast {...toast} />
    </div>
  );
}

function MedicalTab() {
  const [subtab, setSubtab] = useState("hospitals");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_FORMS.hospitals);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [sortAsc, setSortAsc] = useState(true);

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

  function startNew() { setForm({ ...BLANK_FORMS[subtab] }); setEditing("new"); }

  async function startEdit(item) {
    setForm({ ...BLANK_FORMS[subtab], ...item, services: arrToStr(item.services), tests: arrToStr(item.tests), lat: "", lng: "" });
    setEditing(item.id);

    if (subtab === "hospitals") {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/hospital_coordinates?hospital_id=eq.${item.id}&select=*`, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        });
        const data = await res.json();
        const coord = Array.isArray(data) && data[0] ? data[0] : null;
        setForm(p => ({ ...p, lat: coord?.lat != null ? String(coord.lat) : "", lng: coord?.lng != null ? String(coord.lng) : "" }));
      } catch {
        // silently leave lat/lng blank if this fails
      }
    }
  }

  function toArray(str) {
    return str ? str.split("\n").map(s => s.trim()).filter(Boolean) : [];
  }

  async function save() {
    if (!form.name.trim()) { showToast("Name is required", "error"); return; }
    setSaving(true);
    let row = {};
    if (subtab === "hospitals") {
      row = { name: form.name.trim(), address: form.address.trim(), district: form.district.trim(), division: form.division.trim(), phone: form.phone.trim(), services: toArray(form.services), hours: form.hours.trim(), emergency: !!form.emergency };
    } else if (subtab === "pharmacies") {
      row = { name: form.name.trim(), address: form.address.trim(), district: form.district.trim(), division: form.division.trim(), phone: form.phone.trim(), hours: form.hours.trim(), delivery: !!form.delivery };
    } else if (subtab === "labs") {
      row = { name: form.name.trim(), address: form.address.trim(), district: form.district.trim(), division: form.division.trim(), phone: form.phone.trim(), hours: form.hours.trim(), home_service: !!form.home_service, tests: toArray(form.tests) };
    } else if (subtab === "medical_centres") {
      row = { name: form.name.trim(), address: form.address.trim(), district: form.district.trim(), division: form.division.trim(), phone: form.phone.trim(), hours: form.hours.trim() };
    }
    try {
      let hospitalId = editing;
      if (editing === "new") {
        const result = await dbInsert(subtab, row);
        if (result?.code) throw new Error(result.message);
        if (subtab === "hospitals" && Array.isArray(result) && result[0]) hospitalId = result[0].id;
        showToast("✅ Saved!");
      } else {
        const result = await dbUpdate(subtab, editing, row);
        if (result?.code) throw new Error(result.message);
        showToast("✅ Updated!");
      }
      if (subtab === "hospitals" && hospitalId && hospitalId !== "new") {
        await saveHospitalCoords(hospitalId, form.lat, form.lng);
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

  const sortedList = [...list].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  if (editing !== null) return (
    <div>
      <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, fontSize: 15, padding: "4px 0 16px", cursor: "pointer" }}>← Back to list</button>
      <SectionCard title={editing === "new" ? `➕ Add to ${currentLabel}` : `✏️ Edit ${currentLabel}`}>
        <Input label="NAME *" value={form.name} onChange={f("name")} placeholder="Facility name" />
        <Input label="ADDRESS" value={form.address} onChange={f("address")} placeholder="Street, City" />
        <LocationPicker
          district={form.district}
          division={form.division}
          onChange={(key, val) => setForm(p => ({ ...p, [key]: val }))}
        />
        <Input label="PHONE" value={form.phone} onChange={f("phone")} placeholder="0112345678" />
        <Input label="OPENING HOURS" value={form.hours} onChange={f("hours")} placeholder="24 පැය / 8:00–20:00" />
        {subtab === "hospitals" && <>
          <Textarea label="SERVICES (one per line)" value={form.services} onChange={f("services")} placeholder={"හදිසි ප්‍රතිකාර\nශල්‍යකර්ම\nICU\nළමා රෝග"} />
          <CheckboxField label="24-HOUR EMERGENCY?" checked={form.emergency} onChange={v => setForm(p => ({ ...p, emergency: v }))} caption="Has 24-hour emergency service" />
          <FieldGroup title="📍 Map Coordinates">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="LATITUDE" value={form.lat} onChange={f("lat")} placeholder="7.8731" />
              <Input label="LONGITUDE" value={form.lng} onChange={f("lng")} placeholder="80.7718" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: -6 }}>Leave both blank if unknown — the hospital just won't show a map marker yet.</div>
          </FieldGroup>
          {editing !== "new" && <ClinicManager hospitalId={editing} />}
        </>}
        {subtab === "pharmacies" && (
          <CheckboxField label="DELIVERY SERVICE?" checked={form.delivery} onChange={v => setForm(p => ({ ...p, delivery: v }))} caption="Offers home delivery" />
        )}
        {subtab === "labs" && <>
          <Textarea label="TESTS OFFERED (one per line)" value={form.tests} onChange={f("tests")} placeholder={"CBC\nHbA1c\nLipid Profile\nUrine Full Report"} />
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 16 }}>
        {MEDICAL_SUBTABS.map(s => (
          <button key={s.id} onClick={() => { setSubtab(s.id); setEditing(null); }} style={{
            padding: "8px 4px", borderRadius: 8, border: `2px solid ${subtab === s.id ? T.teal : T.border}`,
            background: subtab === s.id ? T.tealLight : T.surface, cursor: "pointer",
            fontSize: 10, fontWeight: 700, color: subtab === s.id ? T.teal : T.muted,
          }}>{s.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>{currentLabel} ({list.length})</div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => setSortAsc(s => !s)} title="Toggle A-Z / Z-A sort" style={{ background: T.surface, border: `2px solid ${T.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, fontWeight: 700, color: T.teal, cursor: "pointer" }}>
            {sortAsc ? "A→Z" : "Z→A"}
          </button>
          <button onClick={startNew} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ Add</button>
        </div>
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sortedList.map(item => (
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
          {sortedList.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.muted }}>Nothing added yet. Click "+ Add" to start.</div>}
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
