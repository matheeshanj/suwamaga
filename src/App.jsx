import { useState } from "react";

// ─── Supabase client (replace with your own URL + anon key) ──────────────────
const SUPABASE_URL = "https://ccuwjdxydneocxomcej.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdXdqZHh5ZG5lb2NyeG9tY2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODU5MzEsImV4cCI6MjA5NzI2MTkzMX0.2UN2GhIie01vqZUFXCWnn8Pv83PpITernuPDYVkCha8";

async function supabase(table, filters = {}) {
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
  if (filters.eq) {
    Object.entries(filters.eq).forEach(([k, v]) => {
      url += `&${k}=eq.${encodeURIComponent(v)}`;
    });
  }
  if (filters.order) url += `&order=${filters.order}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  return res.json();
}

// ─── colour & type tokens ────────────────────────────────────────────────────
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

// ─── mock data ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"diseases",   emoji:"🤒", si:"රෝග සහ තත්ත්ව",       en:"Diseases" },
  { id:"medicines",  emoji:"💊", si:"ඖෂධ",                  en:"Medicines" },
  { id:"symptoms",   emoji:"🩺", si:"ලක්ෂණ",               en:"Symptoms" },
  { id:"tests",      emoji:"🧪", si:"පරීක්ෂණ",               en:"Tests" },
  { id:"pregnancy",  emoji:"🤰", si:"ගර්භණීභාවය",          en:"Pregnancy" },
  { id:"child",      emoji:"👶", si:"ළමා සෞඛ්‍යය",         en:"Child Health" },
  { id:"mental",     emoji:"🧠", si:"මානසික සෞඛ්‍යය",      en:"Mental Health" },
  { id:"firstaid",   emoji:"🚑", si:"ප්‍රථමාධාර",          en:"First Aid" },
  { id:"nutrition",  emoji:"🥗", si:"පෝෂණය සහ ව්‍යායාම",  en:"Nutrition" },
  { id:"prevention", emoji:"🛡️", si:"සුවතාවය සහ වැළැක්වීම", en:"Prevention" },
  { id:"sexual",     emoji:"❤️", si:"ලිංගික අධ්‍යාපනය",   en:"Sexual Health" },
  { id:"hospitals",  emoji:"🏥", si:"රෝහල් සහ සෞඛ්‍ය සේවා", en:"Hospitals & Medical Services" },
  { id:"specialists", emoji:"👨‍⚕️", si:"විශේෂඥ වෛද්‍ය නාමාවලිය", en:"Specialist Directory" },

  { id:"ask",        emoji:"👨‍⚕️", si:"වෛද්‍යවරයෙකුගෙන් අසන්න", en:"Ask a Doctor" },
  { id:"about",      emoji:"ℹ️",  si:"අප ගැන",                   en:"About Us" },
];

const POPULAR_SEARCHES = ["ඩෙංගු","දියවැඩියාව","උණ","අධි රුධිර පීඩනය","ගර්භණීභාවය"];

const POPULAR_DISEASES = [
  {
    id:"dengue", name:"ඩෙංගු (Dengue Fever)",
    overview:"ඩෙංගු යනු Aedes aegypti මදුරුවන් මගින් පැතිරෙන වෛරස් රෝගයකි. ශ්‍රී ලංකාවේ වර්ෂා සෘතුවේදී බහුලව දක්නට ලැබේ.",
    symptoms:["ඉහළ උෂ්ණත්වය (39–40°C)","දරුණු හිස්වේදනාව","ඇස් පිටිපස්සේ වේදනාව","මාංශ පේශි හා සන්ධි වේදනාව","සමේ කැසීම","ඔක්කාරය"],
    warning:["වමනය නොනවතින ලෙස සිදුවීම","කළු හෝ රතු මළ","හදිසි උදර වේදනාව","ලේ ගැලීම (නාස, විය, මළ)","දරුණු ලෙස නිදිමත හෝ නිහස්සිලිව සිටීම"],
    treatment:"ප්‍රතිකාරයක් නොමැත — රෝග ලක්ෂණ පාලනය. ජලය බොන්න. Paracetamol ගන්න. Ibuprofen/Aspirin නිසා ලේ ගැලීමේ අවදානම වැඩිවේ — ඒවා ගැනීම නවත්වන්න.",
    prevention:["ජලය ගොඩ නොකරන්න","මදුරු දැල් භාවිතා කරන්න","දිගු ඇඳුම් ඇදගන්න","Mosquito repellent භාවිතා කරන්න"],
    seeDoctor:"දරා ගත නොහැකි උෂ්ණත්වය, වමනය, ලේ ගැලීම, හෝ දරුණු ලෙස හිස් ඉකිලීමේ ලක්ෂණ ඇත්නම් වහාම රෝහලට යන්න.",
    reviewer:"Dr. Nalaka Perera, MBBS, MD (Internal Medicine), Teaching Hospital Colombo",
    reviewed:"2026-05-10",
  },
  {
    id:"diabetes", name:"දියවැඩියාව (Diabetes Mellitus)",
    overview:"දියවැඩියාව යනු රුධිරයේ සීනි (glucose) ප්‍රමාණය සාමාන්‍ය මට්ටමට වඩා ඉහළ යාමෙන් ඇතිවන රෝගයකි. ශ්‍රී ලංකාවේ ජනගහනයෙන් 10%කට අධිකව දිරිගන්නා රෝගයකි.",
    symptoms:["නිතර මුත්‍රා කිරීම","දරුණු පිපාසය","නොබෙදෙන තෙහෙට්ටුව","බඩ ගිනි ගැනීම","අකීකරු තුවාල නොනැසී සිටීම","අකීකරු දෘෂ්ටිය"],
    warning:["රුධිරයේ සීනි 70 mg/dL ට අඩු වීම (Hypoglycemia)","අසාමාන්‍ය ලෙස ඉහළ රුධිර සීනි (300+)"],
    treatment:"Type 1: Insulin injection. Type 2: ආහාර, ව්‍යායාම, Metformin, Insulin. HbA1c 7% ට අඩු ලෙස පවත්වා ගන්න.",
    prevention:["සීනි හා සැකසූ ආහාර අඩු කරන්න","දිනකට මිනිත්තු 30ක ව්‍යායාම කරන්න","සෞඛ්‍ය සම්පන්න බර පවත්වා ගන්න","වාර්ෂිකව HbA1c පරීක්ෂා කරන්න"],
    seeDoctor:"නිරන්තර පිපාසය, ඉතා ඉහළ හෝ අඩු රුධිර සීනි, නොනැසෙන තුවාල, හෝ දෘෂ්ටිය අඩු වීම ඇත්නම් වෛද්‍යවරයෙකු හමුවන්න.",
    reviewer:"Dr. Chamila Rodrigo, MBBS, MD (Endocrinology), National Hospital Colombo",
    reviewed:"2026-04-22",
  },
  {
    id:"hbp", name:"අධි රුධිර පීඩනය (High Blood Pressure)",
    overview:"රුධිර පීඩනය 140/90 mmHg ට වැඩිනම් අධි රුධිර පීඩනය (Hypertension) ලෙස හඳුනා ගනී. 'නිහඬ ඝාතකයා' ලෙස හඳුන්වන රෝගයකි — බොහෝ අයට ලක්ෂණ නොමැත.",
    symptoms:["බොහෝ අය ලක්ෂණ රහිතව සිටිති","පපුවේ රිදෙනවා / හිස්වේදනාව","පපුවේ කෙට්ටෙනවා","ඇස් ඉදිරිපිට අඳුර"],
    warning:["180/120 ට වැඩි නම් හදිසි BP crisis — වහාම රෝහලට","පපු රිදෙනවා + BP ඉහළ නම් හදිසි"],
    treatment:"Amlodipine, Losartan, Hydrochlorothiazide — වෛද්‍යවරයා නියම කළ පරිදි. ලුණු අඩු ආහාර. ව්‍යායාම. Alcohol සහ දුම්කොළ නවත්වන්න.",
    prevention:["ලුණු g 5ට අඩු දිනකට","DASH ආහාර රටාව","දිනකට 30 min ව්‍යායාම","ආතතිය අඩු කරන්න","BP නිතරම මිනුම් ගන්න"],
    seeDoctor:"BP 140/90+ නිරන්තරව ඇත්නම් හෝ පපු රිදෙනවා, ශ්වාස ගැනීමේ අපහසුව ඇත්නම් වහාම රෝහලට.",
    reviewer:"Dr. Suresh Jayawardena, MBBS, MD (Cardiology), Colombo South Teaching Hospital",
    reviewed:"2026-03-15",
  },
];

const SYMPTOM_ARTICLES = [
  {
    id:"fever",
    name:"උෂ්ණත්වය / උණ (Fever)",
    overview:"ශරීර උෂ්ණත්වය 38°C (100.4°F) ට වැඩි වූ විට 'උණ' ලෙස සැලකේ. ශ්‍රී ලංකාවේ ඩෙංගු, මලේරියා, සහ වෛරස් ආසාදන හේතුවෙන් සාමාන්‍යෙන් දක්නට ලැබෙන ලක්ෂණයකි.",
    causes:["ඩෙංගු උණ","වෛරස් ශ්වාස රෝග (Flu, COVID-19)","මලේරියා","Leptospirosis","බැක්ටීරියා ආසාදන","එන්නත් දීමෙන් පසු"],
    warning:["40°C (104°F) ට වැඩි උෂ්ණත්වය","ළදරුවන්ගේ 38°C+ උෂ්ණත්වය","දින 3ට වැඩි කාලයක් පවතින උණ","ළදරුවකු නිහඬ හෝ ලෙයිනා ලෙස සිටීම","ලේ ගැලීම හෝ ශරීරයේ කැකෑරුම්"],
    selfcare:["Paracetamol 500mg–1g (දිනකට 4 වාරයක් නොඉකිවිය)","ඕනෑ තරම් ජලය, ORS, හෝ කිරිපෙති ජලය","සිරුර හිස් සිනිදු රෙද්දකින් පිස දමන්න","ඇඳ විවේකය ගන්න","Ibuprofen හෝ Aspirin නිසා ලේ ගැලීම ඇතිවිය හැකිය — ගැනීම නවත්වන්න"],
    seeDoctor:"දින 2ට වැඩිනම්, 40°C+ නම්, ළදරුවකු නම්, හෝ ලේ ගැලීම / ශ්වාස අපහසුව ඇත්නම් වහාම රෝහලට.",
    reviewer:"Dr. Nalaka Perera, MBBS, MD (Internal Medicine), Teaching Hospital Colombo",
    reviewed:"2026-05-12",
  },
  {
    id:"headache",
    name:"හිස්වේදනාව (Headache)",
    overview:"හිස්වේදනාව ශ්‍රී ලංකාවේ ඉතා බහුලව දක්නට ලැබෙන ලක්ෂණයකි. බොහෝ විට tension headache හෝ migraine නිසා ඇතිවේ. නමුත් ඇතැම් හිස්වේදනා දරුණු රෝගවල ලකුණු විය හැකිය.",
    causes:["Tension headache (ආතතිය, දෘෂ්ටිය දුර්වලතාව)","Migraine","ඩෙංගු / උණ","අධි රුධිර පීඩනය","නිදාගැනීමේ අඩුව","ජලය අඩු ශරීරය (Dehydration)","Sinusitis"],
    warning:["හදිසි දරුණු හිස්වේදනාව (thunderclap)","ගෙල තද ගතිය + උෂ්ණත්වය","ඇස් ඉදිරිපිට අඳුර හෝ දෙකට පෙනීම","ශ්වාස අපහසුව / ව්‍යාකූල ගතිය","හිස් ගැටීමකින් පසු ඇතිවූ හිස්වේදනාව"],
    selfcare:["Paracetamol 500mg–1g ගන්න","ඕනෑ තරම් ජලය බොන්න","අඳුරු, නිශ්ශබ්ද ස්ථානයක විවේකය ගන්න","ප්‍රේරක ආහාර (කෝපි, චොකලට්, රතු වයින්) ගැනීම අඩු කරන්න","නිරන්තර නම් දෘෂ්ටිය පරීක්ෂා කරන්න"],
    seeDoctor:"හදිසි දරුණු හිස්වේදනාව, ගෙල තද ගතිය + උෂ්ණත්වය, දෘෂ්ටි ලක්ෂණ, හෝ සතියකට 3+ වාරයක් හිස්වේදනාව ඇත්නම් වෛද්‍යවරයෙකු හමුවන්න.",
    reviewer:"Dr. Suresh Fernando, MBBS, MD (Neurology), National Hospital Colombo",
    reviewed:"2026-04-28",
  },
  {
    id:"chest-pain",
    name:"පපු රිදීම (Chest Pain)",
    overview:"පපු රිදීම සාමාන්‍ය අජීර්ණයෙන් හෝ හෘදයාබාධ දක්වා විවිධ හේතු ඇති ලක්ෂණයකි. හදිසි හෝ දරුණු පපු රිදීම සෑමවිටම හදිසි ලෙස සැලකිය යුතුය.",
    causes:["හෘදයාබාධ (Heart Attack)","Angina (හෘද රුධිර ප්‍රවාහ අඩුව)","Acid reflux / GERD","Costochondritis (පපු ඇට රිදීම)","ශ්වාස රෝග (Pneumonia, Pleuritis)","ආතතිය / කාංසාව"],
    warning:["පපු රිදීම + ව්‍යාප්ත වන වේදනාව — දෑතට, ගෙලට, හකු ඇළට","ශ්වාස ගැනීමේ දරුණු අපහසුව","දහදිය + ඔක්කාරය + පපු රිදීම","ශ්වාස ගත නොහැකිව පපු පිම්බෙනවා","රිදීම විනාඩි 15ට වැඩි නම්"],
    selfcare:["පපු රිදීම හදිසි නම් — 1990 ඇමතීම, ස්වයං ප්‍රතිකාරය කිසිසේ ප්‍රමාද නොකරන්න","Antacid / Gaviscon — අජීර්ණ නම් (රෝගය ස්ථිර නම් පමණි)","ශ්‍රීර ආතතිය අඩු ලෙස සිටීමෙන් යම් පපු රිදීම් අඩු විය හැකිය"],
    seeDoctor:"පපු රිදීම ඇත්නම් — හදිසි නොවේ යයි සිතූ ද — රෝහලට ගොස් ECG පරීක්ෂාවක් ගන්න. හදිසි ලකුණු ඇත්නම් 1990 ඇමතීම.",
    reviewer:"Dr. Lasith Rajapaksa, MBBS, MD (Cardiology), Asiri Surgical Hospital",
    reviewed:"2026-05-20",
  },
  {
    id:"breathlessness",
    name:"ශ්වාස ගැනීමේ අපහසුව (Breathlessness)",
    overview:"ශ්වාස ගැනීමේ අපහසුව (Dyspnoea) — ව්‍යායාමයෙන් ඇතිවීම සාමාන්‍ය නමුත් විවේකයේදී ඇතිවීම රෝගයේ ලකුණකි.",
    causes:["ඇදුම (Asthma)","COPD (දිගුකාලීන ශ්වාස රෝගය)","Pneumonia","Heart failure","කාංසාව / Panic attack","රක්තහීනතාව (Anaemia)","COVID-19"],
    warning:["විවේකයේදී හෝ කතා කරන විට ශ්වාස ගත නොහැකිව","තොල් / ඇඟිලි නිල් (Cyanosis)","පපු රිදීම + ශ්වාස අපහසුව","රාත්‍රියේ ශ්වාස ගත නොහැකිව ළිය ගනිනවා","දරුවකු හෝ වැඩිහිටියකු ශ්වාස ගතහැකිව 1990 ඇමතීම"],
    selfcare:["ඇදුම ඇත්නම් — නියමිත inhaler ගන්න","ඉදිරිරළු ඉරියව්ව — ඉදිරිරළු ආසනය ගෙන සිටීම","ළිය ගත නොහැකිව ශ්වාස ගත නොහැකිව — 1990","දුම්කොළ — ඉවත් කරන්න","ට්‍රිගර් (දූවිලි, සුවඳ, සත්ව රෝම) — ඉවත් කරන්න"],
    seeDoctor:"හදිසි ශ්වාස අපහසුව, නිල් තොල්, හෝ පපු රිදීම ඇත්නම් 1990 ඇමතීම. නිරන්තර ශ්වාස අපහසුව ඇත්නම් රෝහලට.",
    reviewer:"Dr. Amara Silva, MBBS, MD (Paediatrics), Lady Ridgeway Hospital",
    reviewed:"2026-04-15",
  },
  {
    id:"nausea",
    name:"ඔක්කාරය / වමනය (Nausea & Vomiting)",
    overview:"ඔක්කාරය සහ වමනය බොහෝ රෝගවල ලක්ෂණ ලෙස ඇතිවේ. බොහෝ විට ආහාර විෂ වීම, ගැස්ට්‍රෝ, හෝ ඩෙංගු නිසා ඇතිවේ.",
    causes:["ආහාර විෂ වීම (Food poisoning)","Gastroenteritis (ආමාශ කුපිතකාරක)","ගර්භණී (Morning sickness)","ඩෙංගු / උණ","Migraine","ඖෂධ අතුරු ආබාධ","Appendicitis"],
    warning:["දිනකට 6+ වාරයක් වමනය","ලේ සහිත වමනය (රතු / කළු)","දරුණු ලෙස ජලය ශරීරයෙන් අඩුවීම (වියලීම)","ළදරුවකු නිරන්තර වමනය","ගාල් රිදීම සහිත වමනය"],
    selfcare:["ඔරල් රිහයිඩ්‍රේෂන් (ORS) — ජලය, ලුණු, සීනි","කුඩා ප්‍රමාණ ආහාර නිතිනිතර — BRAT ආහාර (Banana, Rice, Apple, Toast)","තෙල් / කුළු ආහාර ගැනීම නවත්වන්න","Metoclopramide — වෛද්‍ය නිර්දේශය ඇතිව පමණි"],
    seeDoctor:"ලේ සහිත වමනය, දරුණු ශරීර වේදනාව, ජලය ශරීරයෙන් අඩුවීමේ ලකුණු (වියළි මුඛය, නොමුත්‍රා), ළදරු වමනය — රෝහලට.",
    reviewer:"Dr. Anura Bandara, MBBS, MD (Gastro), Colombo South Teaching Hospital",
    reviewed:"2026-05-05",
  },
  {
    id:"skin-rash",
    name:"සමේ කැකෑරුම් / කැසීම (Skin Rash)",
    overview:"සමේ කැකෑරුම් (Rash) බොහෝ හේතු නිසා ඇතිවිය හැකිය — ආසාදන, අලර්ජිය, ඖෂධ, හෝ නිදන්ගත සමේ රෝග.",
    causes:["ඩෙංගු (Dengue rash)","Chickenpox (ඇළෙල)","Measles (සරම්ප)","Allergic reaction","Eczema / Psoriasis","Scabies (කුරුළු)","ඖෂධ අතුරු ආබාධ"],
    warning:["හදිසි මුළු ශරීරය පුරා කැකෑරුම් + ශ්වාස අපහසුව (Anaphylaxis)","ඔරෝකාරය + කැකෑරුම් + ලේ ගැලීම","ළදරුවකු / ගර්භනී කාන්තාවකගේ කැකෑරුම්","ඔලිඳ / බිත්තර ආකාරයේ කැකෑරුම් (Chickenpox ලකුණ)"],
    selfcare:["කාලිනේ / සිනිඳු ඇඳුම් ඇදගන්න","Calamine lotion — කැකෑරුම් සහිත ස්ථානවල","ස්නානය — සිනිඳු ජලයෙන්","Antihistamine (Chlorpheniramine) — කැසීමට","ප්‍රේරක — සබන්, සුවඳ, ශාකාහාර — ඉවත් කරන්න"],
    seeDoctor:"සම්පූර්ණ ශරීරය ආවරණය, ශ්වාස ගැනීමේ අපහසුව, ළදරුවකු, ගර්භනී, හෝ ලේ ගැලීමේ ලකුණු ඇත්නම් වහාම රෝහලට.",
    reviewer:"Dr. Dilani Perera, MBBS, MD (Dermatology), Asiri Medical Hospital",
    reviewed:"2026-03-30",
  },
];

const NEWS_ITEMS = [
  { date:"2026-06-14", title:"ශ්‍රී ලංකාවේ ඩෙංගු රෝගීන් ගණන 10,000 ඉක්මවයි — සෞඛ්‍ය අමාත්‍යාංශය අනතුරු අඟවයි", tag:"🚨 දැනුම්දීම" },
  { date:"2026-06-10", title:"නව Dengue Vaccine — WHO අනුමොදනය ගැන ශ්‍රී ලංකාව සලකා බලයි", tag:"📋 යාවත්කාලීන" },
  { date:"2026-06-05", title:"ළදරු නිර්දේශිත එන්නත් වේලාතාලිකාව 2026 — ජාතික ළමා රෝගී සේවා", tag:"👶 ළමා සෞඛ්‍යය" },
];



// ─── tiny reusable components ─────────────────────────────────────────────────

function TrustBar({ reviewer, reviewed }) {
  return (
    <div style={{
      background: T.tealLight, borderLeft:`4px solid ${T.teal}`,
      borderRadius:8, padding:"10px 14px", marginBottom:20,
      display:"flex", flexWrap:"wrap", gap:6, alignItems:"center"
    }}>
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
    <button onClick={onClick} style={{
      background:"none", border:"none", color:T.teal, fontWeight:700,
      fontSize:15, padding:"4px 0 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:4
    }}>← ආපසු</button>
  );
}

function Pill({ children, color }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 10px", borderRadius:20,
      background: color+"22", color, fontSize:11, fontWeight:700, marginRight:4
    }}>{children}</span>
  );
}

// ─── screens ──────────────────────────────────────────────────────────────────

function HomeScreen({ onNav, onDisease, onSearch }) {
  const [q, setQ] = useState("");
  return (
    <div>
      {/* hero search */}
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
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && onSearch(q)}
            placeholder="රෝග, ලක්ෂණ, ඖෂධ හෝ පරීක්ෂණ සොයන්න..."
            style={{
              width:"100%", boxSizing:"border-box",
              padding:"14px 14px 14px 44px", borderRadius:12, border:"none",
              fontSize:16, fontFamily:"Noto Sans Sinhala,sans-serif", outline:"none",
              boxShadow:"0 4px 16px rgba(0,0,0,0.18)"
            }}
          />
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
          {POPULAR_SEARCHES.map(s=>(
            <button key={s} onClick={()=>onSearch(s)} style={{
              background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.35)",
              color:"#fff", borderRadius:20, padding:"5px 12px", fontSize:13,
              fontFamily:"Noto Sans Sinhala,sans-serif", cursor:"pointer"
            }}>{s}</button>
          ))}
        </div>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:12 }}>✔ වෛද්‍යවරුන් විසින් සමාලෝචනය කර ඇත</p>
      </div>

      {/* emergency */}
      <div style={{ background:T.emergency, margin:"16px 0 0", borderRadius:12, padding:"12px 16px", display:"flex", gap:16, alignItems:"center" }}>
        <span style={{ fontSize:22 }}>🚨</span>
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>හදිසි අවස්ථාවක්ද?</div>
          <div style={{ display:"flex", gap:10, marginTop:4, flexWrap:"wrap" }}>
            <a href="tel:1990" style={{ color:"#FFD0D0", fontWeight:700, fontSize:14, textDecoration:"none" }}>📞 1990 සුව සැරිය</a>
          </div>
        </div>
      </div>

      {/* categories — 15 items = 5 × 3 perfect grid */}
      <SectionHeader title="සේවාවන්" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>onNav(c.id)} style={{
            background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
            padding:"0 8px", cursor:"pointer", textAlign:"center",
            boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:4, minHeight:88,
          }}
          onTouchStart={e=>e.currentTarget.style.transform="scale(0.96)"}
          onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{ fontSize:24 }}>{c.emoji}</div>
            <div style={{ fontSize:11, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, fontWeight:600, lineHeight:1.3 }}>{c.si}</div>
          </button>
        ))}
      </div>

      {/* popular diseases */}
      <SectionHeader title="ජනප්‍රිය රෝග" />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {POPULAR_DISEASES.map(d=>(
          <button key={d.id} onClick={()=>onDisease(d.id)} style={{
            background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
            padding:"14px 16px", cursor:"pointer", textAlign:"left",
            boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center"
          }}>
            <div>
              <div style={{ fontWeight:700, fontSize:16, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text }}>{d.name}</div>
              <div style={{ fontSize:13, color:T.muted, marginTop:3, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.4,
                overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{d.overview}</div>
            </div>
            <span style={{ color:T.teal, fontSize:20, marginLeft:10 }}>›</span>
          </button>
        ))}
      </div>

      {/* news */}
      <SectionHeader title="සෞඛ්‍ය පුවත්" />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {NEWS_ITEMS.map((n,i)=>(
          <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <span style={{ fontSize:11, background:T.amberLight, color:T.amber, borderRadius:6, padding:"2px 8px", fontWeight:700, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{n.tag}</span>
              <span style={{ fontSize:11, color:T.muted }}>{n.date}</span>
            </div>
            <div style={{ fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, fontWeight:600, lineHeight:1.5 }}>{n.title}</div>
          </div>
        ))}
      </div>

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

function DiseaseScreen({ id, onBack }) {
  const d = POPULAR_DISEASES.find(x=>x.id===id) || POPULAR_DISEASES[0];
  const Section = ({title, children})=>(
    <div style={{ marginBottom:20 }}>
      <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:8,
        borderBottom:`2px solid ${T.tealLight}`, paddingBottom:6 }}>{title}</div>
      {children}
    </div>
  );
  return (
    <div>
      <BackBtn onClick={onBack}/>
      <Pill color={T.teal}>🤒 රෝග</Pill>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.text, margin:"8px 0 12px", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.3 }}>{d.name}</h1>
      <TrustBar reviewer={d.reviewer} reviewed={d.reviewed}/>

      <Section title="1. දළ විශ්ලේෂණය">
        <p style={{ fontSize:15, color:T.text, lineHeight:1.7, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{d.overview}</p>
      </Section>

      <Section title="2. ලක්ෂණ">
        <ul style={{ margin:0, padding:"0 0 0 18px" }}>
          {d.symptoms.map((s,i)=><li key={i} style={{ fontSize:15, color:T.text, marginBottom:6, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.5 }}>{s}</li>)}
        </ul>
      </Section>

      <div style={{ background:"#FFF3F3", border:`1px solid ${T.emergency}`, borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
        <div style={{ fontWeight:800, color:T.emergency, marginBottom:6, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>⚠️ අනතුරු ලකුණු — වහාම රෝහලට</div>
        {d.warning.map((w,i)=><div key={i} style={{ fontSize:14, color:T.emergency, marginBottom:4, fontFamily:"Noto Sans Sinhala,sans-serif" }}>• {w}</div>)}
      </div>

      <Section title="3. ප්‍රතිකාරය">
        <p style={{ fontSize:15, color:T.text, lineHeight:1.7, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{d.treatment}</p>
      </Section>

      <Section title="4. වැළැක්වීම">
        <ul style={{ margin:0, padding:"0 0 0 18px" }}>
          {d.prevention.map((p,i)=><li key={i} style={{ fontSize:15, color:T.text, marginBottom:6, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.5 }}>{p}</li>)}
        </ul>
      </Section>

      <div style={{ background:T.amberLight, border:`1px solid ${T.amber}`, borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
        <div style={{ fontWeight:800, color:T.amber, marginBottom:4, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>🩺 වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?</div>
        <p style={{ fontSize:14, color:"#4E3A00", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6, margin:0 }}>{d.seeDoctor}</p>
      </div>

      <div style={{ background:T.tealLight, borderRadius:10, padding:"10px 14px", fontSize:12, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6 }}>
        <strong>References:</strong> Sri Lanka Ministry of Health Epidemiology Unit · WHO Dengue Guidelines 2024 · National Dengue Control Unit Sri Lanka<br/>
        <strong>Reviewed by:</strong> {d.reviewer}<br/>
        <strong>Last updated:</strong> {d.reviewed}
      </div>
    </div>
  );
}

function SymptomDetailScreen({ id, onBack }) {
  const s = SYMPTOM_ARTICLES.find(x=>x.id===id) || SYMPTOM_ARTICLES[0];
  const Section = ({title, children})=>(
    <div style={{ marginBottom:20 }}>
      <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:8,
        borderBottom:`2px solid ${T.tealLight}`, paddingBottom:6 }}>{title}</div>
      {children}
    </div>
  );
  return (
    <div>
      <BackBtn onClick={onBack}/>
      <Pill color={T.teal}>🩺 ලක්ෂණ</Pill>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.text, margin:"8px 0 12px", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.3 }}>{s.name}</h1>
      <TrustBar reviewer={s.reviewer} reviewed={s.reviewed}/>

      <Section title="1. දළ විශ්ලේෂණය">
        <p style={{ fontSize:15, color:T.text, lineHeight:1.7, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{s.overview}</p>
      </Section>

      <Section title="2. හේතු">
        <ul style={{ margin:0, padding:"0 0 0 18px" }}>
          {s.causes.map((c,i)=><li key={i} style={{ fontSize:15, color:T.text, marginBottom:6, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.5 }}>{c}</li>)}
        </ul>
      </Section>

      <div style={{ background:"#FFF3F3", border:`1px solid ${T.emergency}`, borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
        <div style={{ fontWeight:800, color:T.emergency, marginBottom:6, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>⚠️ අනතුරු ලකුණු — වහාම රෝහලට</div>
        {s.warning.map((w,i)=><div key={i} style={{ fontSize:14, color:T.emergency, marginBottom:4, fontFamily:"Noto Sans Sinhala,sans-serif" }}>• {w}</div>)}
      </div>

      <Section title="3. ස්ව-රැකවරණ">
        <ul style={{ margin:0, padding:"0 0 0 18px" }}>
          {s.selfcare.map((c,i)=><li key={i} style={{ fontSize:15, color:T.text, marginBottom:6, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.5 }}>{c}</li>)}
        </ul>
      </Section>

      <div style={{ background:T.amberLight, border:`1px solid ${T.amber}`, borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
        <div style={{ fontWeight:800, color:T.amber, marginBottom:4, fontSize:14, fontFamily:"Noto Sans Sinhala,sans-serif" }}>🩺 වෛද්‍යවරයෙකු හමුවිය යුත්තේ කවදාද?</div>
        <p style={{ fontSize:14, color:"#4E3A00", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6, margin:0 }}>{s.seeDoctor}</p>
      </div>

      <div style={{ background:T.tealLight, borderRadius:10, padding:"10px 14px", fontSize:12, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6 }}>
        <strong>Reviewed by:</strong> {s.reviewer}<br/>
        <strong>Last updated:</strong> {s.reviewed}
      </div>
    </div>
  );
}

function SymptomsScreen({ onBack }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <SymptomDetailScreen id={selected} onBack={()=>setSelected(null)}/>;
  }

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <Pill color={T.teal}>🩺 ලක්ෂණ</Pill>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"8px 0 4px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>ලක්ෂණ</h2>
      <p style={{ fontSize:13, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:16 }}>
        ශ්‍රී ලාංකිකයන් බහුලව අත්විඳින ලක්ෂණ — හේතු, ස්ව-රැකවරණ, සහ රෝහලට යා යුත්තේ කවදාද යන්න ගැන ලිපි.
      </p>
      <div style={{ background:"#FFF3CD", border:`1px solid ${T.amber}`, borderRadius:8, padding:"10px 12px", marginBottom:16, fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif", color:"#4E3A00" }}>
        ⚠️ හදිසි ලක්ෂණ ඇත්නම් 1990 ඇමතීම. මෙය රෝග විනිශ්චයකට ආදේශකයක් නොවේ.
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {SYMPTOM_ARTICLES.map(s=>(
          <button key={s.id} onClick={()=>setSelected(s.id)} style={{
            background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
            padding:"14px 16px", cursor:"pointer", textAlign:"left",
            boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center"
          }}>
            <div>
              <div style={{ fontWeight:700, fontSize:16, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text }}>{s.name}</div>
              <div style={{ fontSize:13, color:T.muted, marginTop:3, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.4,
                overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{s.overview}</div>
            </div>
            <span style={{ color:T.teal, fontSize:20, marginLeft:10 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const SPECIALTIES = [
  // ── Internal Medicine & Subspecialties ──
  { id:"medicine",          emoji:"🩺", en:"General Medicine",             si:"පොදු වෛද්‍ය (General Medicine)" },
  { id:"cardiology",        emoji:"❤️", en:"Cardiology",                   si:"හෘද රෝග (Cardiology)" },
  { id:"cardioelectro",     emoji:"⚡", en:"Cardiac Electrophysiology",    si:"හෘද විද්‍යුත් (Cardiac Electrophysiology)" },
  { id:"neurology",         emoji:"🧠", en:"Neurology",                    si:"ස්නායු රෝග (Neurology)" },
  { id:"clinicalneurophysio",emoji:"🔌",en:"Clinical Neurophysiology",     si:"ස්නායු ශාරීරික (Clinical Neurophysiology)" },
  { id:"nephrology",        emoji:"🫘", en:"Nephrology",                   si:"වකුගඩු රෝග (Nephrology)" },
  { id:"gastro",            emoji:"🫃", en:"Gastroenterology",             si:"ආමාශ රෝග (Gastroenterology)" },
  { id:"endocrinology",     emoji:"💉", en:"Endocrinology & Metabolic",    si:"අන්තරාසර්ග (Endocrinology)" },
  { id:"respiratory",       emoji:"🫁", en:"Respiratory Medicine",         si:"ශ්වාස රෝග (Respiratory Medicine)" },
  { id:"rheumatology",      emoji:"🦵", en:"Rheumatology & Rehabilitation",si:"රූමැටික් (Rheumatology)" },
  // ── Surgery & Subspecialties ──
  { id:"surgery",           emoji:"🔪", en:"General Surgery",              si:"පොදු ශල්‍යකර්ම (General Surgery)" },
  { id:"cardiothoracic",    emoji:"🫀", en:"Cardiothoracic Surgery",       si:"හෘද-පපු ශල්‍යකර්ම (Cardiothoracic Surgery)" },
  { id:"neurosurgery",      emoji:"🧬", en:"Neurosurgery",                 si:"ස්නායු ශල්‍යකර්ම (Neurosurgery)" },
  { id:"pediatricsurgery",  emoji:"👶", en:"Paediatric Surgery",           si:"ළමා ශල්‍යකර්ම (Paediatric Surgery)" },
  { id:"plasticsurgery",    emoji:"🩹", en:"Plastic & Reconstructive Surgery", si:"ප්ලාස්ටික් ශල්‍යකර්ම" },
  { id:"urology",           emoji:"🚿", en:"Urology",                      si:"මූත්‍රා රෝග (Urology)" },
  { id:"vascularsurgery",   emoji:"🩸", en:"Vascular Surgery",             si:"නාල ශල්‍යකර්ම (Vascular Surgery)" },
  { id:"orthopedics",       emoji:"🦴", en:"Orthopaedic Surgery",          si:"අස්ථි ශල්‍යකර්ම (Orthopaedics)" },
  { id:"omfsurgery",        emoji:"🦷", en:"OMF Surgery",                  si:"මුඛ ශල්‍යකර්ම (OMF Surgery)" },
  // ── Paediatrics & Subspecialties ──
  { id:"pediatrics",        emoji:"🧒", en:"Paediatrics",                  si:"ළමා රෝග (Paediatrics)" },
  { id:"neonatology",       emoji:"🍼", en:"Neonatology",                  si:"නවජ ළදරු (Neonatology)" },
  { id:"pediatriccardio",   emoji:"💗", en:"Paediatric Cardiology",        si:"ළමා හෘද රෝග (Paediatric Cardiology)" },
  { id:"pediatricneuro",    emoji:"🧠", en:"Paediatric Neurology",         si:"ළමා ස්නායු රෝග (Paediatric Neurology)" },
  // ── Obs & Gynae & Subspecialties ──
  { id:"gynecology",        emoji:"🤰", en:"Obstetrics & Gynaecology",     si:"ප්‍රසූතී හා ස්ත්‍රී රෝග" },
  { id:"reproductivemed",   emoji:"🧬", en:"Reproductive Medicine",        si:"ප්‍රජනක වෛද්‍ය (Reproductive Medicine)" },
  { id:"maternalfetal",     emoji:"👶", en:"Maternal Fetal Medicine",      si:"මාතෘ-කලල (Maternal Fetal Medicine)" },
  // ── Radiology & Subspecialties ──
  { id:"radiology",         emoji:"🩻", en:"Radiology",                    si:"රේඩියෝ (Radiology)" },
  { id:"interventionalradio",emoji:"🔬",en:"Interventional Radiology",     si:"ඇතුළාන්ත රේඩියෝ (Interventional Radiology)" },
  { id:"nuclearmedicine",   emoji:"☢️", en:"Nuclear Medicine",             si:"න්‍යෂ්ටික වෛද්‍ය (Nuclear Medicine)" },
  // ── Pathology & Subspecialties ──
  { id:"pathology",         emoji:"🧫", en:"Pathology",                    si:"ව්‍යාධි (Pathology)" },
  { id:"histopathology",    emoji:"🔭", en:"Histopathology",               si:"පටක ව්‍යාධි (Histopathology)" },
  { id:"haematology",       emoji:"🩸", en:"Haematology",                  si:"රුධිර රෝග (Haematology)" },
  { id:"chemicalpathology", emoji:"🧪", en:"Chemical Pathology",           si:"රසායනික ව්‍යාධි (Chemical Pathology)" },
  { id:"immunology",        emoji:"🛡️", en:"Immunology",                   si:"ප්‍රතිශක්ති (Immunology)" },
  // ── Dental & Subspecialties ──
  { id:"dental",            emoji:"🦷", en:"Dental Surgery",               si:"දන්ත ශල්‍යකර්ම (Dental Surgery)" },
  { id:"oralmedicine",      emoji:"👄", en:"Oral Medicine",                si:"මුඛ වෛද්‍ය (Oral Medicine)" },
  { id:"periodontics",      emoji:"🦷", en:"Periodontics",                 si:"දන්ත මාංශ (Periodontics)" },
  { id:"prosthodontics",    emoji:"😁", en:"Prosthodontics",               si:"කෘත්‍රිම දත් (Prosthodontics)" },
  { id:"orthodontics",      emoji:"😬", en:"Orthodontics",                 si:"දත් රාමුව (Orthodontics)" },
  { id:"pediatricdentistry",emoji:"🧒", en:"Paediatric Dentistry",         si:"ළමා දන්ත (Paediatric Dentistry)" },
  // ── Standalone Specialties ──
  { id:"anaesthesiology",   emoji:"😴", en:"Anaesthesiology",              si:"නිර්වින්දන (Anaesthesiology)" },
  { id:"dermatology",       emoji:"🩹", en:"Dermatology",                  si:"සමේ රෝග (Dermatology)" },
  { id:"ent",               emoji:"👂", en:"ENT (Otorhinolaryngology)",     si:"කන් නාසා උගුර (ENT)" },
  { id:"ophthalmology",     emoji:"👁️", en:"Ophthalmology",                si:"අක්ෂි රෝග (Ophthalmology)" },
  { id:"psychiatry",        emoji:"🧘", en:"Psychiatry",                   si:"මනෝ රෝග (Psychiatry)" },
  { id:"familymedicine",    emoji:"🏠", en:"Family Medicine & GP",         si:"පවුලේ වෛද්‍ය (Family Medicine)" },
  { id:"communitymedicine", emoji:"🏘️", en:"Community Medicine",           si:"ප්‍රජා වෛද්‍ය (Community Medicine)" },
  { id:"forensicmedicine",  emoji:"⚖️", en:"Forensic Medicine",            si:"නීත්‍යානුකූල වෛද්‍ය (Forensic Medicine)" },
  { id:"microbiology",      emoji:"🦠", en:"Microbiology",                 si:"ක්ෂුද්‍ර ජීව (Microbiology)" },
  { id:"venereology",       emoji:"🔴", en:"Venereology",                  si:"ලිංගික රෝග (Venereology)" },
  { id:"oncology",          emoji:"🎗️", en:"Clinical Oncology",            si:"පිළිකා (Clinical Oncology)" },
  { id:"sportsmedicine",    emoji:"🏃", en:"Sports Medicine",              si:"ක්‍රීඩා වෛද්‍ය (Sports Medicine)" },
  { id:"geriatrics",        emoji:"👴", en:"Geriatric Medicine",           si:"වෘද්ධ වෛද්‍ය (Geriatric Medicine)" },
  { id:"medicaladmin",      emoji:"📋", en:"Medical Administration",       si:"වෛද්‍ය පරිපාලන (Medical Administration)" },
];

const SPECIALISTS = [
  { name:"Dr. Nalaka Perera", specialty:"cardiology",    hospital:"National Hospital Colombo",         district:"කොළඹ",  qual:"MBBS, MD (Cardiology), MRCP",     phone:"0112691111", type:"රාජ්‍ය" },
  { name:"Dr. Chamila Rodrigo",specialty:"endocrinology",hospital:"Colombo South Teaching Hospital",   district:"කොළඹ",  qual:"MBBS, MD (Endocrinology)",        phone:"0112345678", type:"රාජ්‍ය" },
  { name:"Dr. Amara Silva",    specialty:"pediatrics",   hospital:"Lady Ridgeway Hospital",            district:"කොළඹ",  qual:"MBBS, MD (Paediatrics), DCH",     phone:"0112635911", type:"රාජ්‍ය" },
  { name:"Dr. Suresh Fernando",specialty:"neurology",    hospital:"National Hospital Colombo",         district:"කොළඹ",  qual:"MBBS, MD (Neurology), FRCP",      phone:"0112691111", type:"රාජ්‍ය" },
  { name:"Dr. Priya Jayawardena",specialty:"gynecology", hospital:"De Soysa Maternity Hospital",      district:"කොළඹ",  qual:"MBBS, MS (Obs & Gyn), FCOG",     phone:"0112695011", type:"රාජ්‍ය" },
  { name:"Dr. Kasun Wickrama", specialty:"orthopedics",  hospital:"Nawaloka Hospital",                district:"කොළඹ",  qual:"MBBS, MS (Ortho), FRCS",          phone:"0115577111", type:"පෞද්ගලික" },
  { name:"Dr. Dilani Perera",  specialty:"dermatology",  hospital:"Asiri Medical Hospital",           district:"කොළඹ",  qual:"MBBS, MD (Dermatology)",          phone:"0115521500", type:"පෞද්ගලික" },
  { name:"Dr. Rohan Mendis",   specialty:"ent",          hospital:"Kandy Teaching Hospital",          district:"මහනුවර",qual:"MBBS, MS (ENT), DLO",             phone:"0812223337", type:"රාජ්‍ය" },
  { name:"Dr. Nirmala Gunaratne",specialty:"ophthalmology",hospital:"National Eye Hospital",         district:"කොළඹ",  qual:"MBBS, DO, FRCS (Ophth)",          phone:"0112691111", type:"රාජ්‍ය" },
  { name:"Dr. Samantha Dissanayake",specialty:"psychiatry",hospital:"National Institute of Mental Health",district:"කොළඹ",qual:"MBBS, MD (Psychiatry), MRCPsych",phone:"0112578234", type:"රාජ්‍ය" },
  { name:"Dr. Anura Bandara",  specialty:"gastro",       hospital:"Colombo South Teaching Hospital",  district:"කොළඹ",  qual:"MBBS, MD (Gastro), MRCP",         phone:"0112345678", type:"රාජ්‍ය" },
  { name:"Dr. Kumari Rathnayake",specialty:"gynecology", hospital:"Teaching Hospital Kandy",          district:"මහනුවර",qual:"MBBS, MS (Obs & Gyn)",            phone:"0812223337", type:"රාජ්‍ය" },
  { name:"Dr. Lasith Rajapaksa",specialty:"cardiology",  hospital:"Asiri Surgical Hospital",         district:"කොළඹ",  qual:"MBBS, MD (Cardiology), FACC",     phone:"0114523000", type:"පෞද්ගලික" },
  { name:"Dr. Thilini Wijesekara",specialty:"dental",    hospital:"National Dental Hospital",         district:"කොළඹ",  qual:"BDS, MDS (Prosthodontics)",       phone:"0112691111", type:"රාජ්‍ය" },
  { name:"Dr. Mahesh Siriwardena",specialty:"oncology",  hospital:"Apeksha Hospital Maharagama",     district:"කොළඹ",  qual:"MBBS, MD (Oncology), FRCR",       phone:"0112851199", type:"රාජ්‍ය" },
  { name:"Dr. Pradeep Kumara", specialty:"urology",      hospital:"Teaching Hospital Karapitiya",     district:"ගාල්ල", qual:"MBBS, MS (Urology), FRCS",        phone:"0912234567", type:"රාජ්‍ය" },
];

// ─── Sri Lanka: 9 Provinces → 25 Districts → 331 DS Divisions ────────────────
const LOCATION_DATA = {
  "බස්නාහිර පළාත": {
    "කොළඹ": ["කොළඹ","දෙහිවල","රත්මලාන","මොරටුව","කොළොන්නාව","කඩුවෙල","මහරගම","කොට්ටාව","බොරළැස්ගමුව","කේස්බෑව","හෝමාගම","සීතාවක","පාදුක්ක"],
    "ගම්පහ":  ["ගම්පහ","නෙගොඹො","කටාන","මිනුවන්ගොඩ","ජා-ඇල","මහර","අත්තනගල්ල","බියගම","කැලණිය","වත්තල","දිවුලපිටිය","මිරිගම","දොම්පේ"],
    "කළුතර":  ["කළුතර","බේරුවල","අළුත්ගම","මාතුගම","ඉංගිරිය","හොරණ","මිල්ලනිය","බණ්ඩාරගම","පානදුර","දොඩංගොඩ","වලල්ලාවිට","බුලත්සිංහල","පාලින්දනුවර","අගලවත්ත"],
  },
  "මධ්‍යම පළාත": {
    "මහනුවර":   ["මහනුවර","ගංගාවාට කෝරළේ","උඩුනුවර","යතිනුවර","හරිස්පත්තුව","පාතහේවාහැට","කුණ්ඩසාලේ","තුම්පනේ","පූජාපිටිය","උඩදුඹර","පාස්බාගේ කෝරළේ","මෙදදුඹර","දොළුව","අකුරණ","මිනිපේ","පාතදුඹර","හතරලියද්ද","පන්විල","දෙල්තොට","ගඟ ඉහළ කෝරළේ"],
    "මාතලේ":    ["මාතලේ","උකුවෙල","රත්තොට","යටවත්ත","නාඋල","රත්තොට","විල්ගමුව","අඹගමු කෝරළේ","පල්ලේපොළ","ගලේවෙල","දඹුල්ල"],
    "නුවරඑළිය": ["නුවරඑළිය","වලපනේ","කොටගල","මාස්කෙළිය","නෝර්වුඩ්","අඹගමුව","ආගරපතන","හංගුරන්කෙත","උඩදුඹර","කොතලාවල","නුවරඑළිය MC"],
  },
  "දකුණු පළාත": {
    "ගාල්ල":    ["ගාල්ල","අක්මීමන","බද්දේගම","බෙන්තොට","බොපේ-පොද්දල","එල්පිටිය","ගොනාපිනුවල","හික්කඩුව","ඉමදුව","කරන්දෙණිය","නාගොඩ","නියාගම","රත්ගම","තාවලාම","වෙලිවිටිය-දිවිතුර","යක්කලම්බ","අඹලන්ගොඩ","හබරාදුව","නෙලුව"],
    "මාතර":     ["මාතර","හකුමාන","අකුරැස්ස","මාලිම්බඩ","වැලිගම","දේවිනුවර","කඹුරුපිටිය","කොටපොල","මුලටියාන","පාස්ගොඩ","පිටාබෑද්ද","තිහගොඩ","වෙලිපිටිය","අතුරලිය","කිරින්ද-පුහුල්වෙල","දික්වෙල"],
    "හම්බන්තොට":["හම්බන්තොට","තංගල්ල","තිස්සමහාරාම","අඹලන්තොට","වීරකැටිය","බෙලිඅත්ත","කටුවාන","ලුණුගම්වෙහෙර","ඔකෙවෙල","සූරියවැව","අංගුණකොළපෑලැස්ස","වලස්මුල්ල"],
  },
  "උතුරු පළාත": {
    "යාපනය":    ["යාපනය","නල්ලූර්","වද්දුකොඩ්ඩේ","පොයින්ට් පේදරු","කයිට්ස්","කරෙයිනගර්","වේලනෙයි","ඩෙල්ෆ්ට්","දූපත් උතුර","දූපත් දකුණ","චාවකච්චේරි","සදිලිපේ","තෙන්මරච්චි","වාලිකාමම් බස්නාහිර","වාලිකාමම් නැගෙනහිර"],
    "කිලිනොච්චි":["කිලිනොච්චි","කාන්ඩවලෙයි","පූනකාරි","පච්චිලෙයිපල්ලි"],
    "මන්නාරම":  ["මන්නාරම","මුසලි","මන්ත‍ෛ බස්නාහිර","නාන්ඩේ","මඩු"],
    "වවුනියාව": ["වවුනියාව","වවුනියාව උතුර","චෙඩ්ඩිකුලම","වෙංගලච්චෙඩ්ඩිකුලම"],
    "මුලතිව්":  ["මුලතිව්","මාරිටිම්පත්තු","පුතුකුඩියිරුප්පු","ඔඩ්ඩුසූඩ්ඩාන්","තුනුක්කායි","මන්ත‍ෛ නැගෙනහිර"],
  },
  "නැගෙනහිර පළාත": {
    "මඩකළපුව":  ["මඩකළපුව","කෝරලේ පත්තු","කෝරලේ පත්තු උතුර","කෝරලේ පත්තු දකුණ","කෝරලේ පත්තු බස්නාහිර","මන්මුණෙයි බස්නාහිර","මන්මුණෙයි උතුර","මන්මුණෙයි දකුණ & ඉරුවිල් පත්තු","මන්මුණෙයි පත්තු","පොරතිව් පත්තු","ඇරවූර් පත්තු","ඇරවූර් නගරය","කත්තන්කුඩි","ඔඩ්ඩමාවඩි"],
    "අම්පාර":   ["අම්පාර","උහාන","දාමන","ලාහුගල","පොත්තුවිල","අඩ්ඩාලේචේනෙයි","ආලෙයාඩිවෙඹු","සෙයින්ත‍ෙමරූදු","සම්මන්තුරෙයි","කල්මුනෙයි","කල්මුනෙයි මුස්ලිම්","ඉරක්කාමම්","කරෛතිව්","නාවිතන්වේලි","නින්ත‍ාවූර්","අක්කරෙයිපත්තු","දෙහිඅත්තකන්ඩිය","පඩියතලාව","මහඔය","තිරුකොවිල්"],
    "ත්‍රිකුණාමලය":["ත්‍රිකුණාමලය","කින්නිය","මුතූර්","සේරුවිල","තඹලගමුව","මොරවැව","පඩවිසිරිපුර","කුච්චවේලි","ගොමරන්කඩවල","වේරුගල","කාන්තලේ"],
  },
  "වයඹ පළාත": {
    "කුරුණෑගල": ["කුරුණෑගල","අලව්ව","ගල්ගමුව","ගනේවත්ත","ගිරිබාව","ඉබ්බාගමුව","කොබේගනේ","කොටවේහෙර","කුලියාපිටිය නැගෙනහිර","කුලියාපිටිය බස්නාහිර","මාහෝ","මල්ලවාපිටිය","මාස්පොත","මාවතගම","නාරම්මල","නිකවැරටිය","නොරොච්චෝලෙයි","පඬුවස්නුවර","පන්නල","පොල්පිතිගම","රාස්නායකපුර","රිදේගම","උඩුබද්දාව","වාරියපොල","වීරඹූගේදර","බාමුණකොටුව","ඇහේතුවැව","බිංගිරිය","මහව","දොඩංගස්ලන්ද"],
    "පුත්තලම":  ["පුත්තලම","චිලාව","නත්තන්ඩිය","ආරච්චිකත්තුව","මුන්ඩල්","වෙන්නප්පුව","මහකුඹුක්කඩාවල","නාවගත්තේගම","පල්ලම","වනතාවිල්ලුව","කරුවලගස්වැව","දංකොටුව","කල්පිටිය"],
  },
  "උතුරු මධ්‍යම පළාත": {
    "අනුරාධපුර": ["අනුරාධපුර","කැකිරාව","මෑදවච්චිය","නුවරගම් පාළාත මධ්‍යම","නුවරගම් පාළාත නැගෙනහිර","තිරප්පනේ","තලාව","තඹුත්තේගම","ගලෙන්බිඳුනූවෙව","කාහාතගස්දිගිලිය","ඉපාලෝගම","හොරොව්පතාන","පදවිය","රඹෑව","මිහින්තලේ","නාලන්ද","ගල්නෑව","එප්පාවල","මහාවිලාච්චිය","නොච්චියාගම","රාජාංගනය","කෙබිතිගොල්ලෑව"],
    "පොළොන්නරුව":["පොළොන්නරුව","ලංකාපුර","මැදිරිගිරිය","දිඹුලාගල","තාමන්කඩුව","වැලිකන්ද","හිඟුරක්ගොඩ"],
  },
  "ඌව පළාත": {
    "බදුල්ල":   ["බදුල්ල","බණ්ඩාරවෙල","හාපුතලේ","වෙලිමඩ","ඇල්ල","හාලිඇල","කඳෙකේටිය","ලූනුගල","මහියංගනය","මීගහකිවුල","පස්සර","සොරණාතොට","ඌව පාරණගම","රිදීමාලියද්ද","දියතලාව"],
    "මොනරාගල":  ["මොනරාගල","බිබිල","බුත්තල","සියඹලාන්ඩුව","මෙදාගම","වෙල්ලවාය","කතරගම","සේවනගල","බදල්කුඹුර","ථනමල්විල","මඩුල්ල"],
  },
  "සබරගමු පළාත": {
    "රත්නපුර":  ["රත්නපුර","බලංගොඩ","එඹිලිපිටිය","ඇහැළියගොඩ","පෑල්මඩුල්ල","කහවත්ත","කිරිඇල්ල","කොළොන්න","නිවිතිගල","අයගම","කලවාන","වෙලිගෙපොල","ඉඹුල්පේ","ඔපනායක","ගොඩකවෙල","පාල්මඩුල්ල","කුරුවිට"],
    "කෑගල්ල":   ["කෑගල්ල","මාවනැල්ල","රඹුක්කන","වරකාපොල","යටියන්තොට","දෙහිඕවිට","අරණායක","රුවන්වැල්ල","බුලත්කොහුපිටිය","ගාලිගමුව","දෙරණියගල"],
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

const DISTRICTS_SI = ["සියල්ල", ...Object.values(LOCATION_DATA).flatMap(d => Object.keys(d))];

const HOSPITALS = [
  { name:"National Hospital Colombo",            type:"රාජ්‍ය",    district:"කොළඹ",   division:"කොළඹ",       phone:"0112691111", services:["හදිසි ප්‍රතිකාර","ශල්‍යකර්ම","ICU","රසායනාගාර"], address:"Regent St, Colombo 08" },
  { name:"Colombo South Teaching Hospital",      type:"රාජ්‍ය",    district:"කොළඹ",   division:"දෙහිවල",     phone:"0112345678", services:["හදිසි","ළමා රෝග","හෘද රෝග","අන්තරාසර්ග"],      address:"Kalubowila, Dehiwala" },
  { name:"Lady Ridgeway Children's Hospital",    type:"රාජ්‍ය",    district:"කොළඹ",   division:"කොළඹ",       phone:"0112635911", services:["ළමා රෝග","ළදරු රෝග","ළමා ශල්‍යකර්ම"],          address:"Baseline Rd, Colombo 08" },
  { name:"De Soysa Maternity Hospital",          type:"රාජ්‍ය",    district:"කොළඹ",   division:"කොළඹ",       phone:"0112695011", services:["ප්‍රසූතිය","ස්ත්‍රී රෝග","නවජ ළදරු රැකවරණය"],   address:"Kynsey Rd, Colombo 08" },
  { name:"National Eye Hospital",                type:"රාජ්‍ය",    district:"කොළඹ",   division:"කොළඹ",       phone:"0112691111", services:["අක්ෂි රෝග","ශල්‍යකර්ම","දෘෂ්ටි පරීක්ෂාව"],      address:"Deans Rd, Colombo 10" },
  { name:"National Institute of Mental Health",  type:"රාජ්‍ය",    district:"කොළඹ",   division:"කොළඹ",       phone:"0112578234", services:["මනෝ රෝග","මත්ද්‍රව්‍ය ප්‍රතිකාර","උපදේශනය"],   address:"Angoda, Colombo" },
  { name:"Apeksha Hospital Maharagama",          type:"රාජ්‍ය",    district:"කොළඹ",   division:"මහරගම",      phone:"0112851199", services:["පිළිකා ප්‍රතිකාර","රේඩියෝතෙරපි","Chemotherapy"], address:"Maharagama" },
  { name:"Teaching Hospital Kandy",              type:"රාජ්‍ය",    district:"මහනුවර", division:"මහනුවර",     phone:"0812223337", services:["හදිසි","ශල්‍යකර්ම","ICU","සියලු විශේෂත්ව"],       address:"Kandy" },
  { name:"Teaching Hospital Karapitiya",         type:"රාජ්‍ය",    district:"ගාල්ල",  division:"ගාල්ල",      phone:"0912234567", services:["හදිසි","ශල්‍යකර්ම","ICU","සියලු විශේෂත්ව"],       address:"Karapitiya, Galle" },
  { name:"Nawaloka Hospital",                    type:"පෞද්ගලික", district:"කොළඹ",   division:"කොළඹ",       phone:"0115577111", services:["හදිසි","ශල්‍යකර්ම","ICU","සියලු විශේෂත්ව"],       address:"23 Deshamanya H.K. Dharmadasa Mawatha, Colombo 02" },
  { name:"Asiri Medical Hospital",               type:"පෞද්ගලික", district:"කොළඹ",   division:"කොළඹ",       phone:"0115521500", services:["හදිසි","ශල්‍යකර්ම","සමේ රෝග","රසායනාගාර"],       address:"181 Kirula Rd, Colombo 05" },
  { name:"Asiri Surgical Hospital",              type:"පෞද්ගලික", district:"කොළඹ",   division:"කොළඹ",       phone:"0114523000", services:["ශල්‍යකර්ම","හෘද රෝග","ICU"],                       address:"21 Kirimandala Mawatha, Colombo 05" },
  { name:"National Dental Hospital",             type:"රාජ්‍ය",    district:"කොළඹ",   division:"කොළඹ",       phone:"0112691111", services:["දන්ත ප්‍රතිකාර","ශල්‍යකර්ම","ළමා දන්ත"],         address:"Ward Place, Colombo 07" },
];

const MEDICAL_CENTRES = [
  { name:"Narahenpita Medical Centre",       district:"කොළඹ",     division:"කොළඹ",      phone:"0112368888", address:"Narahenpita, Colombo 05",         hours:"සදුදා–සෙනසු 7:00–21:00" },
  { name:"Nugegoda Medical Centre",          district:"කොළඹ",     division:"මහරගම",     phone:"0112852222", address:"High Level Rd, Nugegoda",         hours:"දිනපතා 7:00–22:00" },
  { name:"Wattala Medical Centre",           district:"ගම්පහ",    division:"වත්තල",     phone:"0112939393", address:"Wattala",                         hours:"දිනපතා 7:30–20:00" },
  { name:"Kandy City Medical Centre",        district:"මහනුවර",   division:"මහනුවර",    phone:"0812224455", address:"Kandy City Centre, Kandy",        hours:"දිනපතා 8:00–20:00" },
  { name:"Galle Medical Centre",             district:"ගාල්ල",    division:"ගාල්ල",     phone:"0912246600", address:"Galle Fort Rd, Galle",            hours:"සදුදා–සිකු 8:00–18:00" },
  { name:"Kurunegala District Medical Ctr",  district:"කුරුණෑගල", division:"කුරුණෑගල",  phone:"0372222333", address:"Kurunegala Town",                 hours:"දිනපතා 8:00–20:00" },
  { name:"Maharagama Day Care Centre",       district:"කොළඹ",     division:"මහරගම",     phone:"0112843211", address:"Maharagama",                      hours:"සදුදා–සිකු 8:00–16:00" },
  { name:"Borella Medical Centre",           district:"කොළඹ",     division:"කොළඹ",      phone:"0112695555", address:"Borella, Colombo 08",             hours:"දිනපතා 7:00–21:00" },
];

const LABS = [
  { name:"Asiri Laboratory Services",     district:"කොළඹ",   division:"කොළඹ",   phone:"0115521500", address:"181 Kirula Rd, Colombo 05",       hours:"දිනපතා 6:00–20:00",  home:true },
  { name:"Nawaloka Hospitals Lab",        district:"කොළඹ",   division:"කොළඹ",   phone:"0115577111", address:"Colombo 02",                      hours:"24 පැය",              home:true },
  { name:"Durdans Hospital Lab",          district:"කොළඹ",   division:"කොළඹ",   phone:"0115360000", address:"3 Alfred Place, Colombo 03",      hours:"24 පැය",              home:false },
  { name:"Lanka Hospitals Lab",           district:"කොළඹ",   division:"කොළඹ",   phone:"0115430000", address:"578 Elvitigala Mawatha, Col 05",  hours:"24 පැය",              home:true },
  { name:"Kandy Teaching Hospital Lab",   district:"මහනුවර", division:"මහනුවර", phone:"0812223337", address:"Kandy",                           hours:"24 පැය",              home:false },
  { name:"Hemas Hospital Lab – Wattala",  district:"ගම්පහ",  division:"වත්තල",  phone:"0114790000", address:"Wattala",                         hours:"දිනපතා 6:30–21:00",  home:true },
  { name:"MediLab Galle",                 district:"ගාල්ල",  division:"ගාල්ල",  phone:"0912234000", address:"Galle",                           hours:"දිනපතා 7:00–19:00",  home:false },
  { name:"Suwamedura Laboratory",         district:"කොළඹ",   division:"මහරගම", phone:"0112556677", address:"Nugegoda",                        hours:"දිනපතා 6:00–18:00",  home:true },
];

const PHARMACIES = [
  { name:"Osu Sala — National Hospital",        district:"කොළඹ",   division:"කොළඹ",   phone:"0112691111", address:"Regent St, Colombo 08",           hours:"24 පැය",    type:"රාජ්‍ය" },
  { name:"Osusala — Kandy Teaching Hosp",       district:"මහනුවර", division:"මහනුවර", phone:"0812223337", address:"Kandy",                           hours:"24 පැය",    type:"රාජ්‍ය" },
  { name:"Cargills Pharmacy — Colombo",         district:"කොළඹ",   division:"කොළඹ",   phone:"0115437000", address:"Liberty Plaza, Colombo 03",       hours:"8:00–22:00", type:"පෞද්ගලික" },
  { name:"Keels Pharmacy — Nugegoda",           district:"කොළඹ",   division:"මහරගම", phone:"0112852233", address:"Nugegoda",                        hours:"8:00–22:00", type:"පෞද්ගලික" },
  { name:"MedoPharma — Borella",                district:"කොළඹ",   division:"කොළඹ",   phone:"0112695800", address:"Borella, Colombo 08",             hours:"7:00–23:00", type:"පෞද්ගලික" },
  { name:"Asiri Pharmacy",                      district:"කොළඹ",   division:"කොළඹ",   phone:"0115521500", address:"181 Kirula Rd, Colombo 05",       hours:"8:00–22:00", type:"පෞද්ගලික" },
  { name:"District Hospital Pharmacy — Galle",  district:"ගාල්ල",  division:"ගාල්ල",  phone:"0912234567", address:"Karapitiya, Galle",               hours:"24 පැය",    type:"රාජ්‍ය" },
  { name:"Nawaloka Pharmacy",                   district:"කොළඹ",   division:"කොළඹ",   phone:"0115577111", address:"Colombo 02",                      hours:"24 පැය",    type:"පෞද්ගලික" },
];

const HEALTH_TABS = [
  { id:"hospitals",  emoji:"🏥", label:"රෝහල්" },
  { id:"centres",    emoji:"🏨", label:"සෞඛ්‍ය මධ්‍යස්ථාන" },
  { id:"labs",       emoji:"🔬", label:"රසායනාගාර" },
  { id:"pharmacies", emoji:"💊", label:"ෆාමසි" },
];

function PlaceCard({ name, district, phone, address, hours, badge1, badge2, badge1Color, badge2Color, extraTag }) {
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:15, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:4 }}>{name}</div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:5 }}>
            {badge1 && <Pill color={badge1Color||T.tealDark}>{badge1}</Pill>}
            {badge2 && <Pill color={badge2Color||T.muted}>{badge2}</Pill>}
            {extraTag && <Pill color={T.teal}>{extraTag}</Pill>}
            <Pill color={T.muted}>📍 {district}</Pill>
          </div>
          <div style={{ fontSize:12, color:T.muted, marginBottom:2 }}>📍 {address}</div>
          <div style={{ fontSize:12, color:T.muted }}>⏰ {hours}</div>
        </div>
        <a href={`tel:${phone}`} style={{
          background:T.teal, color:"#fff", borderRadius:8, padding:"8px 12px",
          fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0
        }}>📞 Call</a>
      </div>
    </div>
  );
}

function HospitalsScreen({ onBack }) {
  const [tab, setTab]           = useState("hospitals");
  const [search, setSearch]     = useState("");
  const [province, setProvince] = useState("සියල්ල");
  const [district, setDistrict] = useState("සියල්ල");
  const [division, setDivision] = useState("සියල්ල");

  const selCls = {
    padding:"9px 10px", borderRadius:8, border:`1px solid ${T.border}`,
    fontSize:12, background:T.surface, fontFamily:"Noto Sans Sinhala,sans-serif",
    color:T.text, boxSizing:"border-box", width:"100%",
  };

  function onProvChange(p) { setProvince(p); setDistrict("සියල්ල"); setDivision("සියල්ල"); }
  function onDistChange(d) { setDistrict(d); setDivision("සියල්ල"); }

  const districts = getDistricts(province);
  const divisions = getDivisions(province, district);
  const showDiv   = district !== "සියල්ල";

  const q = search.toLowerCase();

  function matchLoc(item) {
    const mProv = province === "සියල්ල" || (() => {
      const pd = LOCATION_DATA[province];
      return pd && item.district in pd;
    })();
    const mDist = district === "සියල්ල" || item.district === district;
    const mDiv  = division === "සියල්ල"  || item.division === division;
    return mProv && mDist && mDiv;
  }

  const filteredHospitals  = HOSPITALS.filter(h  => matchLoc(h)  && (!q||h.name.toLowerCase().includes(q)||h.address?.toLowerCase().includes(q)));
  const filteredCentres    = MEDICAL_CENTRES.filter(c => matchLoc(c) && (!q||c.name.toLowerCase().includes(q)||c.address?.toLowerCase().includes(q)));
  const filteredLabs       = LABS.filter(l       => matchLoc(l)  && (!q||l.name.toLowerCase().includes(q)||l.address?.toLowerCase().includes(q)));
  const filteredPharmacies = PHARMACIES.filter(p => matchLoc(p)  && (!q||p.name.toLowerCase().includes(q)||p.address?.toLowerCase().includes(q)));

  const counts = { hospitals:filteredHospitals.length, centres:filteredCentres.length, labs:filteredLabs.length, pharmacies:filteredPharmacies.length };

  function renderEmpty() {
    return <div style={{ textAlign:"center", padding:"32px 0", color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", fontSize:14 }}>කිසිවක් සොයාගත නොහැකි විය. වෙනත් ෆිල්ටරයක් උත්සාහ කරන්න.</div>;
  }

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"0 0 4px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>
        🏥 රෝහල් සහ සෞඛ්‍ය සේවා
      </h2>
      <p style={{ fontSize:13, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:12 }}>
        ඔබට ළඟම සෞඛ්‍ය සේවාව සොයා ගන්න
      </p>

      {/* emergency strip */}
      <div style={{ background:T.emergency, borderRadius:10, padding:"10px 14px", marginBottom:14, display:"flex", gap:12, alignItems:"center" }}>
        <span style={{ fontSize:20 }}>🚨</span>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif" }}>හදිසි අවස්ථාවක්?</div>
          <a href="tel:1990" style={{ color:"#FFD0D0", fontWeight:700, fontSize:13, textDecoration:"none" }}>📞 1990 සුව සැරිය ඇමතීම</a>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
        {HEALTH_TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"8px 4px", borderRadius:10, border:`2px solid ${tab===t.id ? T.teal : T.border}`,
            background: tab===t.id ? T.tealLight : T.surface,
            cursor:"pointer", textAlign:"center",
          }}>
            <div style={{ fontSize:18, marginBottom:2 }}>{t.emoji}</div>
            <div style={{ fontSize:10, fontFamily:"Noto Sans Sinhala,sans-serif", color: tab===t.id ? T.teal : T.muted, fontWeight:700, lineHeight:1.3 }}>{t.label}</div>
            <div style={{ fontSize:10, color: tab===t.id ? T.teal : T.muted, fontWeight:600 }}>({counts[t.id]})</div>
          </button>
        ))}
      </div>

      {/* search */}
      <div style={{ position:"relative", marginBottom:10 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🔍</span>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="නමෙන් හෝ ලිපිනයෙන් සොයන්න..."
          style={{ ...selCls, paddingLeft:38 }}
        />
      </div>

      {/* 3-level location filter */}
      <div style={{ background:T.tealLight, borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:6 }}>📍 ස්ථානය අනුව සෙවීම</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom: showDiv ? 6 : 0 }}>
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:3, fontFamily:"Noto Sans Sinhala,sans-serif" }}>පළාත</div>
            <select value={province} onChange={e=>onProvChange(e.target.value)} style={selCls}>
              {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:3, fontFamily:"Noto Sans Sinhala,sans-serif" }}>දිස්ත්‍රික්කය</div>
            <select value={district} onChange={e=>onDistChange(e.target.value)} style={selCls}>
              {districts.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {showDiv && (
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:3, fontFamily:"Noto Sans Sinhala,sans-serif" }}>ප්‍රාදේශීය ලේකම් කොට්ඨාශය</div>
            <select value={division} onChange={e=>setDivision(e.target.value)} style={selCls}>
              {divisions.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}
      </div>


      {/* --- HOSPITALS --- */}
      {tab==="hospitals" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filteredHospitals.length===0 ? renderEmpty() : filteredHospitals.map((h,i)=>(
            <PlaceCard key={i}
              name={h.name} district={h.district} phone={h.phone} address={h.address}
              hours="හදිසි සේවා 24 පැය"
              badge1={h.type} badge1Color={h.type==="රාජ්‍ය" ? T.tealDark : T.amber}
              badge2={h.services[0]}
            />
          ))}
        </div>
      )}

      {/* --- MEDICAL CENTRES --- */}
      {tab==="centres" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filteredCentres.length===0 ? renderEmpty() : filteredCentres.map((c,i)=>(
            <PlaceCard key={i}
              name={c.name} district={c.district} phone={c.phone} address={c.address} hours={c.hours}
            />
          ))}
        </div>
      )}

      {/* --- LABS --- */}
      {tab==="labs" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filteredLabs.length===0 ? renderEmpty() : filteredLabs.map((l,i)=>(
            <PlaceCard key={i}
              name={l.name} district={l.district} phone={l.phone} address={l.address} hours={l.hours}
              extraTag={l.home ? "🏠 නිවසට" : null}
            />
          ))}
        </div>
      )}

      {/* --- PHARMACIES --- */}
      {tab==="pharmacies" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filteredPharmacies.length===0 ? renderEmpty() : filteredPharmacies.map((p,i)=>(
            <PlaceCard key={i}
              name={p.name} district={p.district} phone={p.phone} address={p.address} hours={p.hours}
              badge1={p.type} badge1Color={p.type==="රාජ්‍ය" ? T.tealDark : T.amber}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AskExpertScreen({ onBack }) {
  const [q, setQ] = useState("");
  const [sent, setSent] = useState(false);
  const prev = [
    { q:"ඩෙංගු රෝගයේදී Paracetamol කොපමණ ප්‍රමාණයක් ගත හැකිද?", a:"වැඩිහිටි අයෙකුට දිනකට Paracetamol 500mg – 1g, වාර 4 ගත හැකිය. නමුත් Ibuprofen හෝ Aspirin ගැනීමෙන් ලේ ගැලීමේ අවදානම වැඩිවේ.", answered:"Dr. K. Perera · 2026-06-10" },
    { q:"ගර්භනී කාලයේ HbA1c ඉලක්කය කොපමණ විය යුතුද?", a:"ගර්භනී කාලයේ HbA1c 6% ට අඩු ලෙස පවත්වා ගැනීම නිර්දේශ කෙරේ. නිරන්තර monitoring අවශ්‍ය.", answered:"Dr. M. Silva · 2026-06-08" },
  ];
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
            ඔබේ ප්‍රශ්නය නිර්නාමිකව ඉදිරිපත් කරන්න
          </label>
          <textarea
            value={q} onChange={e=>setQ(e.target.value)}
            placeholder="ඔබේ ප්‍රශ්නය ඇතුළු කරන්න..."
            rows={4}
            style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:15, fontFamily:"Noto Sans Sinhala,sans-serif", resize:"vertical" }}
          />
          <button onClick={()=>q.trim()&&setSent(true)} style={{
            marginTop:10, background:T.teal, color:"#fff", border:"none", borderRadius:10,
            padding:"12px 20px", fontSize:15, fontFamily:"Noto Sans Sinhala,sans-serif", fontWeight:700, cursor:"pointer", width:"100%"
          }}>ප්‍රශ්නය යොමු කරන්න</button>
        </div>
      ) : (
        <div style={{ background:T.tealLight, borderRadius:12, padding:16, marginBottom:20, textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
          <div style={{ fontWeight:700, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.teal }}>ඔබේ ප්‍රශ්නය යොමු කෙරිණ</div>
          <div style={{ fontSize:13, color:T.muted, marginTop:4, fontFamily:"Noto Sans Sinhala,sans-serif" }}>පැය 24–48 ක් ඇතුළත පිළිතුරු ලැබෙනු ඇත.</div>
          <button onClick={()=>{setSent(false);setQ("");}} style={{ marginTop:10, background:"none", border:`1px solid ${T.teal}`, color:T.teal, borderRadius:8, padding:"8px 18px", cursor:"pointer", fontFamily:"Noto Sans Sinhala,sans-serif" }}>
            නැවත ඇසීම
          </button>
        </div>
      )}
      <SectionHeader title="කලින් ලැබුණු පිළිතුරු" />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {prev.map((p,i)=>(
          <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:14 }}>
            <div style={{ fontSize:14, fontWeight:700, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, marginBottom:6 }}>❓ {p.q}</div>
            <div style={{ fontSize:13, fontFamily:"Noto Sans Sinhala,sans-serif", color:"#1A3A1A", lineHeight:1.5, marginBottom:6 }}>💬 {p.a}</div>
            <div style={{ fontSize:11, color:T.muted }}>✔ {p.answered}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutUsScreen({ onBack }) {
  const team = [
    { name:"Dr. Matheesha N Jayarathne", role:"වෛද්‍ය නිලධාරී — නිර්වින්දන", qual:"MBBS (Sri Lanka)", hospital:"Teaching Hospital Kurunegala" },
    { name:"Dr. Sandamini Panagoda", role:"වෛද්‍ය නිලධාරී — අක්ෂි රෝග", qual:"MBBS (Sri Lanka)", hospital:"Teaching Hospital Rathnapura" },
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

      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px", marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:8 }}>
          🎯 අපගේ මෙහෙවර
        </div>
        <p style={{ fontSize:14, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.7, margin:"0 0 10px" }}>
          ශ්‍රී ලාංකිකයන්ට තම සෞඛ්‍යය පිළිබඳ නිවැරදි, සරල හා විශ්වාසදායක තොරතුරු සිංහල භාෂාවෙන් ලබාදීම අපගේ අරමුණයි.
        </p>
        <p style={{ fontSize:14, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.7, margin:0 }}>
          ග්‍රාමීය ප්‍රදේශවල සිට නගර දක්වා, අන්තර්ජාල පහසුකම් සීමිත පුද්ගලයන්ට පවා පහසුවෙන් භාවිත කළ හැකි සෞඛ්‍ය තොරතුරු වේදිකාවක් නිර්මාණය කිරීම අපගේ අභිප්‍රායයි.
        </p>
      </div>

      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px", marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:12 }}>
          💡 අපගේ විශේෂතා
        </div>
        {[
          { emoji:"🌿", title:"සිංහලෙන් සෞඛ්‍ය තොරතුරු", desc:"සියලු සෞඛ්‍ය කරුණු සරල හා පැහැදිලි සිංහලෙන් ඉදිරිපත් කරයි." },
          { emoji:"📱", title:"ජංගම දුරකථන හිතකාමී", desc:"Android සහ iPhone ඇතුළු සියලු උපාංගවලින් පහසුවෙන් භාවිත කළ හැකිය." },
          { emoji:"✔️", title:"වෛද්‍ය විශේෂඥයන්ගේ සමාලෝචනය", desc:"සියලු තොරතුරු වෛද්‍යවරුන් සහ සෞඛ්‍ය විශේෂඥයන් විසින් සමාලෝචනය කරනු ලැබේ." },
          { emoji:"🔒", title:"ඔබේ පෞද්ගලිකත්වය සුරක්ෂිතයි", desc:"ඔබ ලබාදෙන තොරතුරු ආරක්ෂිතව හා රහසිගතව පවත්වාගෙන යයි." },
        ].map((v,i)=>(
          <div key={i} style={{ display:"flex", gap:12, marginBottom:i<3?12:0 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{v.emoji}</span>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{v.title}</div>
              <div style={{ fontSize:13, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.5, marginTop:2 }}>{v.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px", marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:12 }}>
          🩺 වෛද්‍ය සමාලෝචන මණ්ඩලය
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {team.map((m,i)=>(
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", paddingBottom:i<team.length-1?10:0, borderBottom:i<team.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ width:40, height:40, borderRadius:20, background:T.tealLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{i===0?"👨‍⚕️":"👩‍⚕️"}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{m.name}</div>
                <div style={{ fontSize:12, color:T.teal, fontWeight:600, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{m.role}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{m.qual}</div>
                <div style={{ fontSize:11, color:T.muted }}>🏥 {m.hospital}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:T.amberLight, border:`1px solid ${T.amber}`, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:14, color:T.amber, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:8 }}>
          📋 අන්තර්ගතයේ විශ්වාසනීයත්වය
        </div>
        <p style={{ fontSize:13, color:"#4E3A00", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.7, margin:"0 0 8px" }}>
          මෙම වේදිකාවේ අන්තර්ගතය සකස් කිරීමේදී ලෝක සෞඛ්‍ය සංවිධානය (WHO), ශ්‍රී ලංකා සෞඛ්‍ය අමාත්‍යාංශය සහ අනෙකුත් පිළිගත් වෛද්‍ය මාර්ගෝපදේශ හා පර්යේෂණ මූලාශ්‍ර භාවිත කරනු ලැබේ.
        </p>
        <p style={{ fontSize:13, color:"#4E3A00", fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.7, margin:0 }}>
          සියලුම තොරතුරු වෛද්‍යවරුන් විසින් සමාලෝචනය කරනු ලැබේ.
        </p>
      </div>

      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px", marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:15, color:T.tealDark, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:10 }}>
          📬 අප හා සම්බන්ධ වන්න
        </div>
        {[
          { label:"විද්‍යුත් තැපෑල", value:"info@sauwkhasri.lk", href:"mailto:info@sauwkhasri.lk" },
          { label:"දුරකථනය", value:"+94 11 234 5678", href:"tel:+94112345678" },
          { label:"වෙබ් අඩවිය", value:"www.sauwkhasri.lk", href:"https://sauwkhasri.lk" },
        ].map((c,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:i<2?8:0, marginBottom:i<2?8:0, borderBottom:i<2?`1px solid ${T.border}`:"none" }}>
            <span style={{ fontSize:13, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif" }}>{c.label}</span>
            <a href={c.href} style={{ fontSize:13, color:T.teal, fontWeight:700, textDecoration:"none" }}>{c.value}</a>
          </div>
        ))}
      </div>

      <div style={{ background:T.tealLight, borderRadius:10, padding:"12px 14px", fontSize:12, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", lineHeight:1.6, textAlign:"center", marginBottom:8 }}>
        © 2026 සුවමග · සියලු හිමිකම් ඇවිරිණි
      </div>
    </div>
  );
}

// ─── SpecialistDirectoryScreen ────────────────────────────────────────────────
function SpecialistDirectoryScreen({ onBack }) {
  const [specialty, setSpecialty] = useState("all");

  const filtered = SPECIALISTS.filter(s =>
    specialty === "all" || s.specialty === specialty
  );

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"0 0 4px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>
        👨‍⚕️ විශේෂඥ වෛද්‍ය නාමාවලිය
      </h2>
      <p style={{ fontSize:13, color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:14 }}>
        ශ්‍රී ලංකාවේ විශේෂඥ වෛද්‍යවරුන් සොයා ගන්න
      </p>

      {/* specialty dropdown filter */}
      <select
        value={specialty}
        onChange={e => setSpecialty(e.target.value)}
        style={{
          width:"100%", padding:"11px 14px", borderRadius:10,
          border:`1px solid ${T.border}`, fontSize:14,
          fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text,
          background:T.surface, marginBottom:14, boxSizing:"border-box",
          appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23607D7B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center",
        }}
      >
        <option value="all">🔍 සියලු විශේෂතා — All Specialties</option>
        {SPECIALTIES.map(sp => (
          <option key={sp.id} value={sp.id}>{sp.emoji} {sp.si}</option>
        ))}
      </select>
      <SectionHeader title={`විශේෂඥයින් — ${filtered.length} ක් සොයා ගන්නා ලදී`} />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"32px 0", color:T.muted, fontFamily:"Noto Sans Sinhala,sans-serif", fontSize:14 }}>
            කිසිවක් සොයාගත නොහැකි විය. වෙනත් ෆිල්ටරයක් උත්සාහ කරන්න.
          </div>
        )}
        {filtered.map((sp,i)=>(
          <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:15, color:T.text, fontFamily:"Noto Sans Sinhala,sans-serif", marginBottom:4 }}>{sp.name}</div>
                <div style={{ fontSize:12, color:T.teal, fontWeight:600, marginBottom:4 }}>{sp.qual}</div>
                <div style={{ fontSize:12, color:T.muted }}>🏥 {sp.hospital}</div>
              </div>
              <a href={`tel:${sp.phone}`} style={{
                background:T.teal, color:"#fff", borderRadius:8, padding:"8px 12px",
                fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0
              }}>📞 Call</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GenericSection — was missing/truncated in original ──────────────────────
function GenericSection({ cat, onBack }) {
  const topics = {
    pregnancy:["ගර්භණීභාවයේ මුල් ලක්ෂණ","සතිය-දක්වා මාර්ගෝපදේශය","පෝෂණය","ස්කෑන් සහ පරීක්ෂණ","ප්‍රසූතිය සූදානම"],
    child:["නවජ ළදරු රැකවරණය","එන්නත් කාලසටහන","ළමයින්ගේ උණ","වර්ධනය","ළදරු පෝෂණය"],
    mental:["ආතතිය","කාංසාව","නිදාගැනීමේ ගැටළු","හැඟීම් සෞඛ්‍යය"],
    firstaid:["පිළිස්සීම්","කැපෙනවා","උණ","සර්ප දෂ්ට","අස්ථි බිඳීම"],
    nutrition:["සෞඛ්‍ය සම්පන්න ආහාර","බර කළමනාකරණය","ව්‍යායාම","ජලය බීම"],
    prevention:["එන්නත්","සෞඛ්‍ය පරීක්ෂා","රෝග වැළැක්වීම","දුම්කොළ නතර කිරීම"],
    sexual:["වැඩිවිය","සම්බන්ධතා","ප්‍රතිංධිසරණ","STI","මිත්‍යා vs සත්‍ය"],
    medicines:["Paracetamol","Amoxicillin","Metformin","Amlodipine","Omeprazole"],
    tests:["CBC (රුධිර ගණනය)","HbA1c","ගර්භාෂ පරීක්ෂාව","ECG","Ultrasound"],
    diseases:["ඩෙංගු","දියවැඩියාව","අධි රුධිර පීඩනය","ඇදුම","අම්ලපිත්ත"],
    news:["MOH යාවත්කාලීන","සෞඛ්‍ය දැනුම්දීම්","රෝග පැතිරීම"],
  };
  const list = topics[cat.id] || ["දළ විශ්ලේෂණය","ලක්ෂණ","ප්‍රතිකාරය","වැළැක්වීම"];

  return (
    <div>
      <BackBtn onClick={onBack}/>
      <div style={{ fontSize:36, marginBottom:6 }}>{cat.emoji}</div>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"0 0 14px", fontFamily:"Noto Sans Sinhala,sans-serif" }}>{cat.si}</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {list.map((item,i)=>(
          <button key={i} style={{
            background:T.surface, border:`1px solid ${T.border}`, borderRadius:10,
            padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center",
            fontSize:15, fontFamily:"Noto Sans Sinhala,sans-serif", color:T.text, fontWeight:600, cursor:"pointer", textAlign:"left"
          }}>
            {item}
            <span style={{ color:T.teal, fontSize:18 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── bottom nav ───────────────────────────────────────────────────────────────
const BOT_NAV = [
  { id:"home",        emoji:"🏠", label:"මුල" },
  { id:"diseases",    emoji:"🤒", label:"රෝග" },
  { id:"symptoms",    emoji:"🩺", label:"ලක්ෂණ" },
  { id:"hospitals",   emoji:"🏥", label:"රෝහල්" },
  { id:"firstaid",   emoji:"🚑", label:"ප්‍රථමාධාර" },
];

// ─── root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState({ type:"home" });
  const [botNav, setBotNav] = useState("home");

  function navigate(type, id) {
    setScreen({ type, id });
    if (["diseases","symptoms","hospitals","specialists","ask"].includes(type)) setBotNav(type);
  }
  function goHome() { setScreen({ type:"home" }); setBotNav("home"); }
  function goBack() { goHome(); }

  function handleBotNav(id) {
    setBotNav(id);
    if (id==="home")       { setScreen({type:"home"}); }
    else if (id==="symptoms")  { setScreen({type:"symptoms"}); }
    else if (id==="hospitals") { setScreen({type:"hospitals"}); }
    else if (id==="firstaid")  { setScreen({type:"category", id:"firstaid"}); }
    else if (id==="about")     { setScreen({type:"about"}); }
    else                       { setScreen({type:"category", id}); }
  }

  return (
    <div style={{ fontFamily:"Noto Sans Sinhala,system-ui,sans-serif", background:T.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", position:"relative", paddingBottom:72 }}>
      <div style={{ padding:"16px 16px 0" }}>
        {screen.type==="home" && (
          <HomeScreen
            onNav={id=>{
              if (id==="symptoms") navigate("symptoms");
              else if (id==="hospitals") navigate("hospitals");
              else if (id==="specialists") navigate("specialists");
              else if (id==="ask") navigate("ask");
              else if (id==="about") navigate("about");
              else navigate("category", id);
            }}
            onDisease={id=>navigate("disease",id)}
            onSearch={q=>{
              const hit = POPULAR_DISEASES.find(d=>d.name.includes(q)||d.id===q.toLowerCase());
              if (hit) navigate("disease", hit.id);
              else navigate("symptoms");
            }}
          />
        )}
        {screen.type==="disease" && <DiseaseScreen id={screen.id} onBack={goBack}/>}
        {screen.type==="symptoms" && <SymptomsScreen onBack={goBack}/>}
        {screen.type==="hospitals" && <HospitalsScreen onBack={goBack}/>}
        {screen.type==="specialists" && <SpecialistDirectoryScreen onBack={goBack}/>}
        {screen.type==="ask" && <AskExpertScreen onBack={goBack}/>}
        {screen.type==="about" && <AboutUsScreen onBack={goBack}/>}
        {screen.type==="category" && (
          <GenericSection cat={CATEGORIES.find(c=>c.id===screen.id)||CATEGORIES[0]} onBack={goBack}/>
        )}
      </div>

      {/* bottom nav */}
      <nav style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, background:T.surface,
        borderTop:`1px solid ${T.border}`, display:"flex", zIndex:100,
        boxShadow:"0 -2px 12px rgba(0,0,0,0.08)"
      }}>
        {BOT_NAV.map(item=>(
          <button key={item.id} onClick={()=>handleBotNav(item.id)} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            padding:"8px 0", border:"none", background:"none", cursor:"pointer",
            color: botNav===item.id ? T.teal : T.muted,
            borderTop: botNav===item.id ? `3px solid ${T.teal}` : "3px solid transparent",
          }}>
            <span style={{ fontSize:20 }}>{item.emoji}</span>
            <span style={{ fontSize:10, fontWeight:600, fontFamily:"Noto Sans Sinhala,sans-serif", marginTop:2 }}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
