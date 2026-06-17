# සුවමග — Quick Start Guide
## 5 Steps to Go Live

---

## STEP 1 — Supabase Database (15 min)

1. Go to **https://supabase.com** → Sign up free
2. Click **New Project** → name it `suwamaga` → set a password → Create
3. Wait ~2 minutes for it to initialize
4. Go to **SQL Editor** → New Query
5. Open `supabase_setup.sql` → copy everything → paste → click **Run**
6. Go to **Settings → API** → copy:
   - `Project URL` (e.g. https://xxxx.supabase.co)
   - `anon public` key (long string starting with eyJ...)

---

## STEP 2 — Add Your Supabase Keys (2 min)

Open **src/App.jsx** — find line 1 area:
```js
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```
Replace with your actual values from Step 1.

Open **src/Admin.jsx** — same lines at top, plus:
```js
const ADMIN_PASSWORD = "your-secret-password";
```
Set a strong password you will remember.

---

## STEP 3 — GitHub (5 min)

1. Go to **https://github.com** → Sign up → New Repository
2. Name: `suwamaga` → Public → Create
3. Download **GitHub Desktop** → https://desktop.github.com
4. Clone the repo → copy ALL files from the `suwamaga/` folder into it
5. Commit message: "Initial deploy" → **Push to origin**

Your folder should look like:
```
suwamaga/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── supabase_setup.sql   ← don't delete, keep for reference
└── src/
    ├── main.jsx
    ├── App.jsx          ← public app
    └── Admin.jsx        ← your admin panel
```

---

## STEP 4 — Vercel Deploy (5 min)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **Add New Project** → import `suwamaga`
3. Framework: **Vite** (auto-detected)
4. Click **Deploy**
5. Done! Live at `https://suwamaga.vercel.app` ✅

---

## STEP 5 — Start Adding Content

Go to `https://suwamaga.vercel.app/admin`

Login with your password → you will see 3 tabs:

| Tab | What you add |
|-----|-------------|
| 📄 Articles | Diseases, Symptoms, Medicines, etc. |
| 👨‍⚕️ Specialists | Doctor directory |
| 🏥 Medical Services | Hospitals, Pharmacies, Labs, Centres |

Add content → Save → instantly live on the public app ✅

---

## UPDATING THE APP LATER

When you want to change the design or fix something:
1. Edit `src/App.jsx` or `src/Admin.jsx`
2. Save → GitHub Desktop → Commit → Push
3. Vercel auto-deploys in ~60 seconds
4. **Your database content is never affected by code changes** ✅

---

## COSTS

| Service | Cost |
|---------|------|
| Supabase | Free (up to 500MB) |
| Vercel | Free |
| GitHub | Free |
| Custom domain (optional) | ~$10/year |
| **Total** | **$0** |
