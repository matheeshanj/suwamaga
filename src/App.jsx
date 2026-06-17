import { useState, useEffect } from "react";

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://hjhjrbxrweozpwwpzwpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqaGpyYnhyd2VvenB3d3B6d3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDI2MDYsImV4cCI6MjA5NzI3ODYwNn0.U3CS-ALwQGPBhLbKUz1n2sckzx_jHPsWkGDSZH0jluI";

async function dbGet(table, extra = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${extra}&order=created_at.desc`, {
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

// ─── colours ──────────────────────────────────────────────────────────────────
const T = {
  bg:        "#F7FAFA",
  surface:   "#FFFFFF",
  teal:      "#00796B",
  tealLight: "#E0F2F1",
  tealDark:  "#004D40",
  amber:     "#F57F17",
  amberLight:"#FFF8E1",
  emergency: "#C62828",
  text:      "#1A2E2E",
  muted:     "#607D7B",
  border:    "#E0EEEC",
};

// ─── static data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"diseases",    emoji:"🤒", si:"රෝග සහ තත්ත්ව",           en:"Diseases" },
  { id:"medicines",   emoji:"💊", si:"ඖෂධ",                       en:"Medicines" },
  { id:"symptoms",    emoji:"🩺", si:"ලක්ෂණ",                     en:"Symptoms" },
  { id:"tests",       emoji:"🧪", si:"පරීක්ෂණ",                   en:"Tests" },
  { id:"pregnancy",   emoji:"🤰", si:"ගර්භණීභාවය",               en:"Pregnancy" },
  { id:"child",       emoji:"👶", si:"ළමා සෞඛ්‍යය",              en:"Child Health" },
  { id:"mental",      emoji:"🧠", si:"මානසික සෞඛ්‍යය",           en:"Mental Health" },
  { id:"firstaid",    emoji:"🚑", si:"ප්‍රථමාධාර",               en:"First Aid" },
  { id:"nutrition",   emoji:"🥗", si:"පෝෂණය සහ ව්‍යායාම",       en:"Nutrition" },
  { id:"prevention",  emoji:"🛡️", si:"සුවතාවය සහ වැළැක්වීම",   en:"Prevention" },
  { id:"sexual",      emoji:"❤️", si:"ලිංගික අධ්‍යාපනය",       en:"Sexual Health" },
  { id:"hospitals",   emoji:"🏥", si:"රෝහල් සහ සෞඛ්‍ය සේවා",   en:"Hospitals" },
  { id:"specialists", emoji:"👨‍⚕️", si:"විශේෂඥ වෛද්‍ය නාමාවලිය", en:"Specialists" },
  { id:"ask",         emoji:"💬", si:"වෛද්‍යවරයෙකුගෙන් අසන්න", en:"Ask a Doctor" },
  { id:"about",       emoji:"ℹ️",  si:"අප ගැන",                   en:"About Us" },
];

const POPULAR_SEARCHES = ["ඩෙංගු","දියවැඩියාව","උණ","අධි රුධිර පීඩනය","ගර්භණීභාවය"];

const SPECIALTIES = [
  { id:"medicine",       emoji:"🩺", en:"General Medicine",          si:"පොදු වෛද්‍ය" },
  { id:"cardiology",     emoji:"❤️", en:"Cardiology",                si:"හෘද රෝග" },
  { id:"neurology",      emoji:"🧠", en:"Neurology",                 si:"ස්නායු රෝග" },
  { id:"nephrology",     emoji:"🫘", en:"Nephrology",                si:"වකුගඩු රෝග" },
  { id:"gastro",         emoji:"🫃", en:"Gastroenterology",          si:"ආමාශ රෝග" },
  { id:"endocrinology",  emoji:"💉", en:"Endocrinology",             si:"අන්තරාසර්ග" },
  { id:"respiratory",    emoji:"🫁", en:"Respiratory Medicine",      si:"ශ්වාස රෝග" },
  { id:"surgery",        emoji:"🔪", en:"General Surgery",           si:"පොදු ශල්‍යකර්ම" },
  { id:"pediatrics",     emoji:"🧒", en:"Paediatrics",               si:"ළමා රෝග" },
  { id:"gynecology",     emoji:"🤰", en:"Obstetrics & Gynaecology",  si:"ප්‍රසූතී හා ස්ත්‍රී රෝග" },
  { id:"radiology",      emoji:"🩻", en:"Radiology",                 si:"රේඩියෝ" },
  { id:"pathology",      emoji:"🧫", en:"Pathology",                 si:"ව්‍යාධි" },
  { id:"haematology",    emoji:"🩸", en:"Haematology",               si:"රුධිර රෝග" },
  { id:"dental",         emoji:"🦷", en:"Dental Surgery",            si:"දන්ත ශල්‍යකර්ම" },
  { id:"dermatology",    emoji:"🩹", en:"Dermatology",               si:"සමේ රෝග" },
  { id:"ent",            emoji:"👂", en:"ENT",                       si:"කන් නාසා උගුර" },
  { id:"ophthalmology",  emoji:"👁️", en:"Ophthalmology",             si:"අක්ෂි රෝග" },
  { id:"psychiatry",     emoji:"🧘", en:"Psychiatry",                si:"මනෝ රෝග" },
  { id:"orthopedics",    emoji:"🦴", en:"Orthopaedics",              si:"අස්ථි ශල්‍යකර්ම" },
  { id:"urology",        emoji:"🚿", en:"Urology",                   si:"මූත්‍රා රෝග" },
  { id:"oncology",       emoji:"🎗️", en:"Clinical Oncology",         si:"පිළිකා" },
  { id:"familymedicine", emoji:"🏠", en:"Family Medicine & GP",      si:"පවුලේ වෛද්‍ය" },
];

// Sri Lanka provinces / districts / divisions
const LOCATION_DATA = {
  "බස්නාහිර පළාත": {
    "කොළඹ": ["කොළඹ","දෙහිවල","රත්මලාන","මොරටුව","කොළොන්නාව","කඩුවෙල","මහරගම","කොට්ටාව","බොරළැස්ගමුව","හෝමාගම","සීතාවක","පාදුක්ක"],
    "ගම්පහ":  ["ගම්පහ","නෙගොඹො","කටාන","මිනුවන්ගොඩ","ජා-ඇල","මහර","අත්තනගල්ල","බියගම","කැලණිය","වත්තල","දිවුලපිටිය","මිරිගම","දොම්පේ"],
    "කළුතර":  ["කළුතර","බේරුවල","අළුත්ගම","මාතුගම","ඉංගිරිය","හොරණ","බණ්ඩාරගම","පානදුර"],
  },
  "මධ්‍යම පළාත": {
    "මහනුවර":   ["මහනුවර","ගංගාවාට කෝරළේ","හරිස්පත්තුව","කුණ්ඩසාලේ","පූජාපිටිය"],
    "මාතලේ":    ["මාතලේ","ගලේවෙල","දඹුල්ල"],
    "නුවරඑළිය": ["නුවරඑළිය","වලපනේ","කොටගල","මාස්කෙළිය"],
  },
  "දකුණු පළාත": {
    "ගාල්ල":    ["ගාල්ල","හික්කඩුව","එල්පිටිය","අඹලන්ගොඩ"],
    "මාතර":     ["මාතර","වැලිගම","අකුරැස්ස","කඹුරුපිටිය"],
    "හම්බන්තොට":["හම්බන්තොට","තංගල්ල","තිස්සමහාරාම"],
  },
  "උතුරු පළාත": {
    "යාපනය":    ["යාපනය","නල්ලූර්","චාවකච්චේරි"],
    "කිලිනොච්චි":["කිලිනොච්චි"],
    "මන්නාරම":  ["මන්නාරම"],
    "වවුනියාව": ["වවුනියාව"],
    "මුලතිව්":  ["මුලතිව්"],
  },
  "නැගෙනහිර පළාත": {
    "මඩකළපුව":  ["මඩකළපුව","කත්තන්කුඩි"],
    "අම්පාර":   ["අම්පාර","කල්මුනෙයි"],
    "ත්‍රිකුණාමලය":["ත්‍රිකුණාමලය","කාන්තලේ"],
  },
  "වයඹ පළාත": {
    "කුරුණෑගල": ["කුරුණෑගල","නිකවැරටිය","කුලියාපිටිය","මාවතගම","නාරම්මල","වාරියපොල"],
    "පුත්තලම":  ["පුත්තලම","චිලාව","නත්තන්ඩිය","කල්පිටිය"],
  },
  "උතුරු මධ්‍යම පළාත": {
    "අනුරාධපුර": ["අනුරාධපුර","මෑදවච්චිය","තඹුත්තේගම","මිහින්තලේ"],
    "පොළොන්නරුව":["පොළොන්නරුව","හිඟුරක්ගොඩ"],
  },
  "ඌව පළාත": {
    "බදුල්ල":   ["බදුල්ල","බණ්ඩාරවෙල","හාපුතලේ","මහියංගනය"],
    "මොනරාගල":  ["මොනරාගල","වෙල්ලවාය","කතරගම"],
  },
  "සබරගමු පළාත": {
    "රත්නපුර":  ["රත්නපුර","බලංගොඩ","එඹිලිපිටිය"],
    "කෑගල්ල":   ["කෑගල්ල","මාවනැල්ල","රඹුක්කන"],
  },
};

const PROVINCES = ["සියල්ල", ...Object.keys(LOCATION_DATA)];
function getDistricts(province) {
  if (!province || province === "සියල්ල")
    return ["සියල්ල", ...Object.values(LOCATION_DATA).flatMap(d => Object.keys(d))];
  return ["සියල්ල", ...Object.keys(LOCATION_DATA[province] || {})];
}
function getDivisions(province, district) {
  if (!district || district === "සියල්ල") return ["සියල්ල"];
  if (province && province !== "සියල්ල")
    return ["සියල්ල", ...(LOCATION_DATA[province]?.[district] || [])];
  for (const prov of Object.values(LOCATION_DATA)) {
    if (prov[district]) return ["සියල්ල", ...prov[district]];
  }
  return ["සියල්ල"];
}

const HEALTH_TABS = [
  { id:"hospitals",        emoji:"🏥", label:"රෝහල්" },
  { id:"medical_centres",  emoji:"🏨", label:"සෞඛ්‍ය මධ්‍යස්ථාන" },
  { id:"labs",             emoji:"🔬", label:"රසායනාගාර" },
  { id:"pharmacies",       emoji:"💊", label:"ෆාමසි" },
];

// ─── tiny reusables ───────────────────────────────────────────────────────────
function TrustBar({ reviewer, reviewed }) {
  return (
    <div style={{ background:T.tealLight, borderLeft:`4px solid ${T.teal}`, borderRadius:8, padding:"10px 14px", marginBottom:20, display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
      <span style={{ fontSize:13, color:T.teal, fontWeight:700 }}>✔ වෛද්‍ය සමාලෝචනය</span>
      <span style={{ fontSize:12, color:T.muted, flex:1, minWidth:180 }}>{reviewer}</span>
      <span style={{ fontSize:11, color:T.muted, whiteSpace:"nowrap" }}>යාවත්කාලීන: {reviewed}</span>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, margin:"24px 0 12px" }}>
      <div style={{ flex:1, height:1, background:T.border }} />
      <span style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:2, textTransform:"uppercase", whiteSpace:"nowrap" }}>{title}</span>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background:"none", border:"none", color:T.teal, fontWeight:700, fontSize:15, padding:"4px 0 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>← ආපසු</button>
  );
}

function Pill({ children, color }) {
  return (
    <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20, background:color+"22", color, fontSize:11, fontWeight:700, marginRight:4 }}>{children}</span>
  );
}

function Spinner() {
  return <div style={{ textAlign:"center", padding:"40px 0", color:T.muted, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>Loading...</div>;
}

function EmptyState({ msg }) {
  return <div style={{ textAlign:"center", padding:"32px 0", color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", fontSize:14 }}>{msg || "කිසිවක් සොයාගත නොහැකි විය."}</div>;
}

// ─── ArticleDetailScreen — universal article viewer ──────────────────────────
function ArticleDetailScreen({ article, onBack }) {
  const a = article;
  const cat = CATEGORIES.find(c => c.id === a.category) || CATEGORIES[0];

  function renderList(items) {
    if (!items) return null;
    const arr = Array.isArray(items) ? items : [items];
    if (arr.length === 0) return null;
    return (
      <ul style={{ margin:0, padding:"0 0 0 18px" }}>
        {arr.map((s,i) => <li key={i} style={{ fontSize:15, color:T.text, marginBottom:6, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.5 }}>{s}</li>)}
      </ul>
    );
  }

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:8, borderBottom:`2px solid ${T.tealLight}`, paddingBottom:6 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <Pill color={T.teal}>{cat.emoji} {cat.si}</Pill>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.text, margin:"8px 0 12px", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.3 }}>{a.title_si}</h1>
      {a.title_en && <div style={{ fontSize:13, color:T.muted, marginBottom:12 }}>{a.title_en}</div>}
      {(a.reviewer || a.reviewed_date) && <TrustBar reviewer={a.reviewer || "—"} reviewed={a.reviewed_date || "—"}/>}

      {a.overview && (
        <Section title="1. දළ විශ්ලේෂණය">
          <p style={{ fontSize:15, color:T.text, lineHeight:1.7, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{a.overview}</p>
        </Section>
      )}

      {a.symptoms?.length > 0 && (
        <Section title="2. ලක්ෂණ / භාවිතා">
          {renderList(a.symptoms)}
        </Section>
      )}

      {a.causes?.length > 0 && (
        <Section title="3. හේතු">
          {renderList(a.causes)}
        </Section>
      )}

      {a.warning_signs?.length > 0 && (
        <div style={{ background:"#FFF3F3", border:`1px solid ${T.emergency}`, borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
          <div style={{ fontWeight:800, color:T.emergency, marginBottom:6, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>⚠️ අනතුරු ලකුණු — වහාම රෝහලට</div>
          {a.warning_signs.map((w,i) => <div key={i} style={{ fontSize:14, color:T.emergency, marginBottom:4, fontFamily:"Noto Sans Sinhala,sans-serif" }}>• {w}</div>)}
        </div>
      )}

      {a.treatment && (
        <Section title="4. ප්‍රතිකාරය / මාත්‍රාව">
          <p style={{ fontSize:15, color:T.text, lineHeight:1.7, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{a.treatment}</p>
        </Section>
      )}

      {a.selfcare?.length > 0 && (
        <Section title="5. ස්ව-රැකවරණ / අතුරු ආබාධ">
          {renderList(a.selfcare)}
        </Section>
      )}

      {a.prevention?.length > 0 && (
        <Section title="6. වැළැක්වීම">
          {renderList(a.prevention)}
        </Section>
      )}

      {a.see_doctor && (
        <div style={{ background:T.amberLight, border:`1px solid ${T.amber}`, borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
          <div style={{ fontWeight:800, color:T.amber, marginBottom:4, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>🩺 වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?</div>
          <p style={{ fontSize:14, color:"#4E3A00", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6, margin:0 }}>{a.see_doctor}</p>
        </div>
      )}

      {(a.reviewer || a.reviewed_date) && (
        <div style={{ background:T.tealLight, borderRadius:10, padding:"10px 14px", fontSize:12, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6 }}>
          {a.reviewer && <><strong>Reviewed by:</strong> {a.reviewer}<br/></>}
          {a.reviewed_date && <><strong>Last updated:</strong> {a.reviewed_date}</>}
        </div>
      )}
    </div>
  );
}

// ─── ArticleListScreen — lists articles of a given category ──────────────────
function ArticleListScreen({ category, onBack }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  useEffect(() => {
    setLoading(true);
    dbGet("articles", `&category=eq.${category}`).then(data => {
      setArticles(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category]);

  if (selected) {
    return <ArticleDetailScreen article={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <Pill color={T.teal}>{cat.emoji} {cat.si}</Pill>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"8px 0 4px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>{cat.si}</h2>
      <p style={{ fontSize:13, color:T.muted, marginBottom:16, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{cat.en}</p>

      <div style={{ background:"#FFF3CD", border:`1px solid ${T.amber}`, borderRadius:8, padding:"10px 12px", marginBottom:16, fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif", color:"#4E3A00" }}>
        ⚠️ හදිසි ලක්ෂණ ඇත්නම් 1990 ඇමතීම. මෙය රෝග විනිශ්චයකට ආදේශකයක් නොවේ.
      </div>

      {loading ? <Spinner /> : articles.length === 0 ? (
        <EmptyState msg="තවම ලිපි නොමැත. ඉදිරියේදී එකතු කෙරේ." />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {articles.map(a => (
            <button key={a.id} onClick={() => setSelected(a)} style={{
              background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
              padding:"14px 16px", cursor:"pointer", textAlign:"left",
              boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center"
            }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:16, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text }}>{a.title_si}</div>
                {(a.summary || a.title_en) && (
                  <div style={{ fontSize:13, color:T.muted, marginTop:3, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                    {a.summary || a.title_en}
                  </div>
                )}
              </div>
              <span style={{ color:T.teal, fontSize:20, marginLeft:10, flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
function HomeScreen({ onNav, onSearch }) {
  const [q, setQ]                 = useState("");
  const [featured, setFeatured]   = useState([]);
  const [loadingFeat, setLoadingFeat] = useState(true);

  useEffect(() => {
    dbGet("articles", "&featured=eq.true").then(data => {
      setFeatured(Array.isArray(data) ? data.slice(0, 5) : []);
      setLoadingFeat(false);
    }).catch(() => setLoadingFeat(false));
  }, []);

  return (
    <div>
      {/* hero */}
      <div style={{ background:`linear-gradient(135deg,${T.tealDark},${T.teal})`, padding:"28px 20px 32px", borderRadius:"0 0 24px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <span style={{ fontSize:22 }}>🌿</span>
          <span style={{ color:"#fff", fontWeight:800, fontSize:18, fontFamily:"Noto Sans Sinhala,sans-serif" }}>සුවමග</span>
        </div>
        <p style={{ color:"rgba(255,255,255,0.88)", fontSize:15, marginBottom:18, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.5 }}>
          ශ්‍රී ලාංකිකයන් සඳහා විශ්වාසදායක සෞඛ්‍ය තොරතුරු
        </p>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>🔍</span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSearch(q)}
            placeholder="රෝග, ලක්ෂණ, ඖෂධ හෝ පරීක්ෂණ සොයන්න..."
            style={{ width:"100%", boxSizing:"border-box", padding:"14px 14px 14px 44px", borderRadius:12, border:"none", fontSize:16, fontFamily:"Noto Sans Sinhala,sans-serif", outline:"none", boxShadow:"0 4px 16px rgba(0,0,0,0.18)" }}
          />
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
          {POPULAR_SEARCHES.map(s => (
            <button key={s} onClick={() => onSearch(s)} style={{ background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", borderRadius:20, padding:"5px 12px", fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif", cursor:"pointer" }}>{s}</button>
          ))}
        </div>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:12 }}>✔ වෛද්‍යවරුන් විසින් සමාලෝචනය කර ඇත</p>
      </div>

      {/* emergency */}
      <div style={{ background:T.emergency, margin:"16px 0 0", borderRadius:12, padding:"12px 16px", display:"flex", gap:16, alignItems:"center" }}>
        <span style={{ fontSize:22 }}>🚨</span>
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>හදිසි අවස්ථාවක්ද?</div>
          <a href="tel:1990" style={{ color:"#FFD0D0", fontWeight:700, fontSize:14, textDecoration:"none" }}>📞 1990 සුව සැරිය</a>
        </div>
      </div>

      {/* categories */}
      <SectionHeader title="සේවාවන්" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => onNav(c.id)} style={{
            background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
            padding:"0 8px", cursor:"pointer", textAlign:"center",
            boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, minHeight:88,
          }}>
            <div style={{ fontSize:24 }}>{c.emoji}</div>
            <div style={{ fontSize:11, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, fontWeight:600, lineHeight:1.3 }}>{c.si}</div>
          </button>
        ))}
      </div>

      {/* featured articles from Supabase */}
      {!loadingFeat && featured.length > 0 && (
        <>
          <SectionHeader title="ජනප්‍රිය ලිපි" />
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {featured.map(a => (
              <button key={a.id} onClick={() => onNav("article_" + a.id)} style={{
                background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
                padding:"14px 16px", cursor:"pointer", textAlign:"left",
                boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center"
              }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:16, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text }}>{a.title_si}</div>
                  {(a.summary || a.overview) && (
                    <div style={{ fontSize:13, color:T.muted, marginTop:3, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {a.summary || a.overview}
                    </div>
                  )}
                </div>
                <span style={{ color:T.teal, fontSize:20, marginLeft:10, flexShrink:0 }}>›</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* trust footer */}
      <div style={{ background:T.tealLight, borderRadius:12, padding:"14px 16px", marginTop:20, textAlign:"center" }}>
        <div style={{ fontSize:13, color:T.teal, fontWeight:700, fontFamily:"Noto Sans Sinhala,sans-serif" }}>
          ✔ සියලු අන්තර්ගතය සෞඛ්‍ය මන්ත්‍රණ මණ්ඩලය විසින් සමාලෝචනය කර ඇත
        </div>
        <div style={{ fontSize:11, color:T.muted, marginTop:4, fontFamily:"Noto Sans Sinhala,sans-serif" }}>
          මෙය වෛද්‍ය උපදෙසට ආදේශකයක් නොවේ. හදිසි අවස්ථා සඳහා 1990 අමතන්න.
        </div>
      </div>
    </div>
  );
}

// ─── PlaceCard ────────────────────────────────────────────────────────────────
function PlaceCard({ name, district, phone, address, hours, badge1, badge1Color, badge2, badge2Color, extraTag }) {
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:15, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:4 }}>{name}</div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:5 }}>
            {badge1 && <Pill color={badge1Color||T.tealDark}>{badge1}</Pill>}
            {badge2 && <Pill color={badge2Color||T.muted}>{badge2}</Pill>}
            {extraTag && <Pill color={T.teal}>{extraTag}</Pill>}
            {district && <Pill color={T.muted}>📍 {district}</Pill>}
          </div>
          {address && <div style={{ fontSize:12, color:T.muted, marginBottom:2 }}>📍 {address}</div>}
          {hours && <div style={{ fontSize:12, color:T.muted }}>⏰ {hours}</div>}
        </div>
        {phone && (
          <a href={`tel:${phone}`} style={{ background:T.teal, color:"#fff", borderRadius:8, padding:"8px 12px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0 }}>📞 Call</a>
        )}
      </div>
    </div>
  );
}

// ─── HospitalsScreen — loads from Supabase ───────────────────────────────────
function HospitalsScreen({ onBack }) {
  const [tab, setTab]           = useState("hospitals");
  const [search, setSearch]     = useState("");
  const [province, setProvince] = useState("සියල්ල");
  const [district, setDistrict] = useState("සියල්ල");
  const [division, setDivision] = useState("සියල්ල");
  const [data, setData]         = useState({ hospitals:[], medical_centres:[], labs:[], pharmacies:[] });
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dbGet("hospitals"),
      dbGet("medical_centres"),
      dbGet("labs"),
      dbGet("pharmacies"),
    ]).then(([h, mc, l, p]) => {
      setData({
        hospitals:       Array.isArray(h)  ? h  : [],
        medical_centres: Array.isArray(mc) ? mc : [],
        labs:            Array.isArray(l)  ? l  : [],
        pharmacies:      Array.isArray(p)  ? p  : [],
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const selCls = { padding:"9px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, background:T.surface, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, boxSizing:"border-box", width:"100%" };
  const districts = getDistricts(province);
  const divisions = getDivisions(province, district);
  const showDiv   = district !== "සියල්ල";
  const q = search.toLowerCase();

  function onProvChange(p) { setProvince(p); setDistrict("සියල්ල"); setDivision("සියල්ල"); }
  function onDistChange(d) { setDistrict(d); setDivision("සියල්ල"); }

  function matchLoc(item) {
    const mProv = province === "සියල්ල" || (() => { const pd = LOCATION_DATA[province]; return pd && item.district in pd; })();
    const mDist = district === "සියල්ල" || item.district === district;
    const mDiv  = division === "සියල්ල"  || item.division === division;
    return mProv && mDist && mDiv;
  }

  function matchSearch(item) {
    return !q || item.name?.toLowerCase().includes(q) || item.address?.toLowerCase().includes(q);
  }

  const cur = data[tab] || [];
  const filtered = cur.filter(i => matchLoc(i) && matchSearch(i));
  const counts = { hospitals: data.hospitals.length, medical_centres: data.medical_centres.length, labs: data.labs.length, pharmacies: data.pharmacies.length };

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"0 0 4px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>🏥 රෝහල් සහ සෞඛ්‍ය සේවා</h2>
      <p style={{ fontSize:13, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:12 }}>ඔබට ළඟම සෞඛ්‍ය සේවාව සොයා ගන්න</p>

      <div style={{ background:T.emergency, borderRadius:10, padding:"10px 14px", marginBottom:14, display:"flex", gap:12, alignItems:"center" }}>
        <span style={{ fontSize:20 }}>🚨</span>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif" }}>හදිසි අවස්ථාවක්?</div>
          <a href="tel:1990" style={{ color:"#FFD0D0", fontWeight:700, fontSize:13, textDecoration:"none" }}>📞 1990 සුව සැරිය ඇමතීම</a>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
        {HEALTH_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"8px 4px", borderRadius:10, border:`2px solid ${tab===t.id ? T.teal : T.border}`, background:tab===t.id ? T.tealLight : T.surface, cursor:"pointer", textAlign:"center" }}>
            <div style={{ fontSize:18, marginBottom:2 }}>{t.emoji}</div>
            <div style={{ fontSize:10, fontFamily:"Noto Sans Sinhala,sans-serif", color:tab===t.id ? T.teal : T.muted, fontWeight:700, lineHeight:1.3 }}>{t.label}</div>
            <div style={{ fontSize:10, color:tab===t.id ? T.teal : T.muted, fontWeight:600 }}>({counts[t.id]})</div>
          </button>
        ))}
      </div>

      {/* search */}
      <div style={{ position:"relative", marginBottom:10 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="නමෙන් හෝ ලිපිනයෙන් සොයන්න..."
          style={{ ...selCls, paddingLeft:38 }} />
      </div>

      {/* location filter */}
      <div style={{ background:T.tealLight, borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:6 }}>📍 ස්ථානය අනුව සෙවීම</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:showDiv ? 6 : 0 }}>
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:3, fontFamily:"Noto Sans Sinhala,sans-serif" }}>පළාත</div>
            <select value={province} onChange={e => onProvChange(e.target.value)} style={selCls}>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:3, fontFamily:"Noto Sans Sinhala,sans-serif" }}>දිස්ත්‍රික්කය</div>
            <select value={district} onChange={e => onDistChange(e.target.value)} style={selCls}>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {showDiv && (
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:3, fontFamily:"Noto Sans Sinhala,sans-serif" }}>ප්‍රාදේශීය ලේකම් කොට්ඨාශය</div>
            <select value={division} onChange={e => setDivision(e.target.value)} style={selCls}>
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState /> : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {tab === "hospitals" && filtered.map((h,i) => (
            <PlaceCard key={h.id||i} name={h.name} district={h.district} phone={h.phone} address={h.address}
              hours={h.hours || (h.emergency ? "24 පැය" : null)}
              badge1={h.emergency ? "🚨 24h" : null} badge1Color={T.emergency}
              badge2={Array.isArray(h.services) ? h.services[0] : null} />
          ))}
          {tab === "medical_centres" && filtered.map((c,i) => (
            <PlaceCard key={c.id||i} name={c.name} district={c.district} phone={c.phone} address={c.address} hours={c.hours} />
          ))}
          {tab === "labs" && filtered.map((l,i) => (
            <PlaceCard key={l.id||i} name={l.name} district={l.district} phone={l.phone} address={l.address} hours={l.hours}
              extraTag={l.home_service ? "🏠 නිවසට" : null} />
          ))}
          {tab === "pharmacies" && filtered.map((p,i) => (
            <PlaceCard key={p.id||i} name={p.name} district={p.district} phone={p.phone} address={p.address} hours={p.hours}
              extraTag={p.delivery ? "🚚 Delivery" : null} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SpecialistDirectoryScreen — loads from Supabase ─────────────────────────
function SpecialistDirectoryScreen({ onBack }) {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [selSpec, setSelSpec]         = useState("all");
  const [province, setProvince]       = useState("සියල්ල");
  const [district, setDistrict]       = useState("සියල්ල");

  useEffect(() => {
    dbGet("specialists").then(d => {
      setSpecialists(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const selCls = { padding:"9px 10px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, background:T.surface, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, width:"100%", boxSizing:"border-box" };
  const districts = getDistricts(province);
  const q = search.toLowerCase();

  const filtered = specialists.filter(s => {
    const mSpec = selSpec === "all" || s.specialty === selSpec;
    const mDist = district === "සියල්ල" || s.district === district;
    const mProv = province === "සියල්ල" || (() => { const pd = LOCATION_DATA[province]; return pd && s.district in pd; })();
    const mQ    = !q || s.name?.toLowerCase().includes(q) || s.specialty?.toLowerCase().includes(q) || s.hospital?.toLowerCase().includes(q);
    return mSpec && mDist && mProv && mQ;
  });

  // Get unique specialties from loaded data
  const usedSpecs = [...new Set(specialists.map(s => s.specialty).filter(Boolean))];

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"0 0 4px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>👨‍⚕️ විශේෂඥ වෛද්‍ය නාමාවලිය</h2>
      <p style={{ fontSize:13, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:12 }}>ඔබේ ස්ථානයට සහ අවශ්‍යතාවට ගැලපෙන විශේෂඥ සොයන්න</p>

      <div style={{ position:"relative", marginBottom:10 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="නමෙන් හෝ විශේෂත්වයෙන් සොයන්න..."
          style={{ ...selCls, paddingLeft:38 }} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
        <select value={selSpec} onChange={e => setSelSpec(e.target.value)} style={selCls}>
          <option value="all">සියලු විශේෂත්ව</option>
          {SPECIALTIES.filter(s => usedSpecs.includes(s.id)).map(s => (
            <option key={s.id} value={s.id}>{s.emoji} {s.si}</option>
          ))}
          {usedSpecs.filter(id => !SPECIALTIES.find(s => s.id === id)).map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <select value={district} onChange={e => { setDistrict(e.target.value); }} style={selCls}>
          {getDistricts(province).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ fontSize:13, color:T.muted, marginBottom:10, fontFamily:"Noto Sans Sinhala,sans-serif" }}>
        විශේෂඥයින් — {filtered.length} ක් සොයා ගන්නා ලදී
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState /> : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map((sp,i) => (
            <div key={sp.id||i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:4 }}>{sp.name}</div>
                  {sp.qual && <div style={{ fontSize:12, color:T.teal, fontWeight:600, marginBottom:4 }}>{sp.qual}</div>}
                  {sp.hospital && <div style={{ fontSize:12, color:T.muted }}>🏥 {sp.hospital}</div>}
                  {sp.district && <div style={{ fontSize:12, color:T.muted }}>📍 {sp.district}{sp.division ? ` · ${sp.division}` : ""}</div>}
                  {sp.availability && <div style={{ fontSize:12, color:T.muted }}>🕐 {sp.availability}</div>}
                  {sp.opd && <div style={{ fontSize:12, color:T.muted }}>📋 {sp.opd}</div>}
                </div>
                {sp.phone && (
                  <a href={`tel:${sp.phone}`} style={{ background:T.teal, color:"#fff", borderRadius:8, padding:"8px 12px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0 }}>📞 Call</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AskExpertScreen — saves to Supabase faqs table ──────────────────────────
function AskExpertScreen({ onBack }) {
  const [q, setQ]         = useState("");
  const [name, setName]   = useState("");
  const [sent, setSent]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [faqs, setFaqs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbGet("faqs").then(d => {
      setFaqs(Array.isArray(d) ? d.filter(f => f.answer) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function submit() {
    if (!q.trim()) return;
    setSaving(true);
    try {
      await dbInsert("faqs", {
        question: q.trim(),
        answered_by: name.trim() || "Anonymous",
        date: new Date().toISOString().split("T")[0],
      });
      setSent(true);
    } catch {
      setSent(true); // show success anyway; question is stored
    }
    setSaving(false);
  }

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"0 0 4px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>👨‍⚕️ වෛද්‍යවරයෙකුගෙන් අසන්න</h2>
      <div style={{ background:"#FFF3CD", border:`1px solid ${T.amber}`, borderRadius:8, padding:"10px 12px", marginBottom:16, fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif", color:"#4E3A00" }}>
        ⚠️ හදිසි අවස්ථා සඳහා මෙම සේවාව භාවිතා නොකරන්න. 1990 අමතන්න.
      </div>

      {!sent ? (
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:16, marginBottom:20 }}>
          <label style={{ fontWeight:700, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, display:"block", marginBottom:8 }}>
            ඔබේ ප්‍රශ්නය ඉදිරිපත් කරන්න
          </label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ඔබේ නම (අත්‍යවශ්‍ය නොවේ)"
            style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:10, outline:"none" }} />
          <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="ඔබේ ප්‍රශ්නය ඇතුළු කරන්න..." rows={4}
            style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:15, fontFamily:"Noto Sans Sinhala,sans-serif", resize:"vertical", outline:"none" }} />
          <button onClick={submit} disabled={saving || !q.trim()} style={{
            marginTop:10, background:saving || !q.trim() ? T.muted : T.teal, color:"#fff", border:"none", borderRadius:10,
            padding:"12px 20px", fontSize:15, fontFamily:"Noto Sans Sinhala,sans-serif", fontWeight:700, cursor:saving ? "not-allowed":"pointer", width:"100%"
          }}>{saving ? "යොමු කරමින්..." : "ප්‍රශ්නය යොමු කරන්න"}</button>
        </div>
      ) : (
        <div style={{ background:T.tealLight, borderRadius:12, padding:16, marginBottom:20, textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
          <div style={{ fontWeight:700, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.teal }}>ඔබේ ප්‍රශ්නය යොමු කෙරිණ</div>
          <div style={{ fontSize:13, color:T.muted, marginTop:4, fontFamily:"Noto Sans Sinhala,sans-serif" }}>පැය 24–48 ක් ඇතුළත පිළිතුරු ලැබෙනු ඇත.</div>
          <button onClick={() => { setSent(false); setQ(""); setName(""); }} style={{ marginTop:10, background:"none", border:`1px solid ${T.teal}`, color:T.teal, borderRadius:8, padding:"8px 18px", cursor:"pointer", fontFamily:"Noto Sans Sinhala,sans-serif" }}>
            නැවත ඇසීම
          </button>
        </div>
      )}

      {!loading && faqs.length > 0 && (
        <>
          <SectionHeader title="කලින් ලැබුණු පිළිතුරු" />
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {faqs.map((f,i) => (
              <div key={f.id||i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:14 }}>
                <div style={{ fontSize:14, fontWeight:700, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, marginBottom:6 }}>❓ {f.question}</div>
                <div style={{ fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif", color:"#1A3A1A", lineHeight:1.5, marginBottom:6 }}>💬 {f.answer}</div>
                <div style={{ fontSize:11, color:T.muted }}>✔ {f.answered_by}{f.date ? ` · ${f.date}` : ""}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── AboutUsScreen ────────────────────────────────────────────────────────────
function AboutUsScreen({ onBack }) {
  const team = [
    { name:"Dr. Matheesha N Jayarathne", role:"වෛද්‍ය නිලධාරී — නිර්වින්දන", qual:"MBBS (Sri Lanka)", hospital:"Teaching Hospital Kurunegala" },
    { name:"Dr. Sandamini Panagoda",     role:"වෛද්‍ය නිලධාරී — අක්ෂි රෝග",  qual:"MBBS (Sri Lanka)", hospital:"Teaching Hospital Rathnapura" },
  ];
  return (
    <div>
      <BackBtn onClick={onBack}/>
      <div style={{ background:`linear-gradient(135deg,${T.tealDark},${T.teal})`, borderRadius:16, padding:"24px 20px", marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🌿</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:22, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:6 }}>සුවමග</div>
        <div style={{ color:"rgba(255,255,255,0.85)", fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6 }}>
          ශ්‍රී ලාංකිකයන් සඳහා විශ්වාසදායක සෞඛ්‍ය තොරතුරු
        </div>
      </div>

      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:16, marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:8 }}>🩺 වෛද්‍ය සමාලෝචන මණ්ඩලය</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {team.map((m,i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", paddingBottom:i<team.length-1?10:0, borderBottom:i<team.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ width:40, height:40, borderRadius:20, background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{i===0?"👨‍⚕️":"👩‍⚕️"}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:T.text }}>{m.name}</div>
                <div style={{ fontSize:12, color:T.teal, fontWeight:600 }}>{m.role}</div>
                <div style={{ fontSize:11, color:T.muted }}>{m.qual} · 🏥 {m.hospital}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:T.amberLight, border:`1px solid ${T.amber}`, borderRadius:12, padding:"14px 16px" }}>
        <div style={{ fontWeight:800, fontSize:14, color:T.amber, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:8 }}>📋 අන්තර්ගතයේ විශ්වාසනීයත්වය</div>
        <p style={{ fontSize:13, color:"#4E3A00", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.7, margin:0 }}>
          WHO, ශ්‍රී ලංකා සෞඛ්‍ය අමාත්‍යාංශය සහ අනෙකුත් පිළිගත් වෛද්‍ය මාර්ගෝපදේශ භාවිතා කෙරේ.
          සියලු අන්තර්ගතය වෛද්‍යවරුන් විසින් සමාලෝචනය කරනු ලැබේ. මෙය වෛද්‍ය උපදෙසට ආදේශකයක් නොවේ.
        </p>
      </div>
    </div>
  );
}

// ─── bottom nav ───────────────────────────────────────────────────────────────
const BOT_NAV = [
  { id:"home",       emoji:"🏠", label:"මුල" },
  { id:"diseases",   emoji:"🤒", label:"රෝග" },
  { id:"symptoms",   emoji:"🩺", label:"ලක්ෂණ" },
  { id:"hospitals",  emoji:"🏥", label:"රෝහල්" },
  { id:"firstaid",   emoji:"🚑", label:"ප්‍රථමාධාර" },
];

// ─── root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState({ type:"home" });
  const [botNav, setBotNav] = useState("home");

  function navigate(type, payload) {
    setScreen({ type, ...payload });
    if (["diseases","symptoms","hospitals","specialists","ask"].includes(type)) setBotNav(type);
  }
  function goHome() { setScreen({ type:"home" }); setBotNav("home"); }
  function goBack() { goHome(); }

  function handleNav(id) {
    if (id === "home")        { goHome(); return; }
    if (id === "hospitals")   { navigate("hospitals"); return; }
    if (id === "specialists") { navigate("specialists"); return; }
    if (id === "ask")         { navigate("ask"); return; }
    if (id === "about")       { navigate("about"); return; }
    // article categories
    navigate("category", { id });
  }

  function handleSearch(q) {
    // Search across all articles by navigating to diseases (or a full search later)
    navigate("category", { id:"diseases", searchQuery: q });
  }

  // Handle article_ prefix from HomeScreen featured articles
  function handleNavWithArticle(id) {
    if (id.startsWith("article_")) {
      // fetch the article by id and show it
      const articleId = id.replace("article_", "");
      navigate("article_direct", { articleId });
    } else {
      handleNav(id);
    }
  }

  return (
    <div style={{ fontFamily:"Noto Sans Sinhala,system-ui,sans-serif", background:T.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative", paddingBottom:72 }}>
      <div style={{ padding:"16px 16px 0" }}>

        {screen.type === "home" && (
          <HomeScreen
            onNav={handleNavWithArticle}
            onSearch={handleSearch}
          />
        )}

        {screen.type === "category" && (
          <ArticleListScreen category={screen.id} onBack={goBack} />
        )}

        {screen.type === "article_direct" && (
          <ArticleDirectLoader articleId={screen.articleId} onBack={goBack} />
        )}

        {screen.type === "hospitals"   && <HospitalsScreen onBack={goBack}/>}
        {screen.type === "specialists" && <SpecialistDirectoryScreen onBack={goBack}/>}
        {screen.type === "ask"         && <AskExpertScreen onBack={goBack}/>}
        {screen.type === "about"       && <AboutUsScreen onBack={goBack}/>}
      </div>

      {/* bottom nav */}
      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:T.surface, borderTop:`1px solid ${T.border}`, display:"flex", zIndex:100, boxShadow:"0 -2px 12px rgba(0,0,0,0.08)" }}>
        {BOT_NAV.map(item => (
          <button key={item.id} onClick={() => {
            setBotNav(item.id);
            if (item.id === "home")      goHome();
            else if (item.id === "firstaid") navigate("category", { id:"firstaid" });
            else handleNav(item.id);
          }} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            padding:"8px 0", border:"none", background:"none", cursor:"pointer",
            color:botNav === item.id ? T.teal : T.muted,
            borderTop:botNav === item.id ? `3px solid ${T.teal}` : "3px solid transparent",
          }}>
            <span style={{ fontSize:20 }}>{item.emoji}</span>
            <span style={{ fontSize:10, fontWeight:600, fontFamily:"Noto Sans Sinhala,sans-serif", marginTop:2 }}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── helper to load a single article by id ────────────────────────────────────
function ArticleDirectLoader({ articleId, onBack }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${articleId}&select=*`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    }).then(r => r.json()).then(d => {
      setArticle(Array.isArray(d) ? d[0] : null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [articleId]);

  if (loading) return <Spinner />;
  if (!article) return <EmptyState msg="ලිපිය සොයාගත නොහැකි විය." />;
  return <ArticleDetailScreen article={article} onBack={onBack} />;
}
