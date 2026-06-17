import { useState } from "react";

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
          {d.
