import { useState, useEffect } from "react";

// Days Out typography — Poppins for display, Inter for body.
const DISPLAY = "'Poppins',system-ui,-apple-system,'Segoe UI',sans-serif";
const SANS    = "'Inter',system-ui,-apple-system,'Segoe UI',sans-serif";

const DAYS_FULL  = ["Moon Day","Air Day","Water Day","Earth Day","Fire Day","Star Day","Sun Day"];
const DAYS_SHORT = ["Moon","Air","Water","Earth","Fire","Star","Sun"];

// Each moonth: name, symbol, feeling, a per-card accent pair (gradient outline),
// and a placeholder gradient for the hero until its real photo is sourced.
const MOONTHS = [
  { num:1,  slug:"rising-sun",    name:"Rising Sun",    symbol:"🌄", desc:"Light returning after solstice",            accent:"#f2a33c", accent2:"#f6c33f", grad:"linear-gradient(160deg,#3a2c1e,#7a5326,#e0972e)" },
  { num:2,  slug:"morning-dew",   name:"Morning Dew",   symbol:"🌫️", desc:"Winter stillness, first moisture",          accent:"#7fa8c9", accent2:"#b8d4e6", grad:"linear-gradient(160deg,#25323f,#4a6474,#9db9c7)" },
  { num:3,  slug:"waking-tree",   name:"Waking Tree",   symbol:"🌳", desc:"Sap rising, buds beginning",                accent:"#6fae5a", accent2:"#a6d06f", grad:"linear-gradient(160deg,#213022,#3f6a3a,#8bbf63)" },
  { num:4,  slug:"open-door",     name:"Open Door",     symbol:"🌸", desc:"Spring equinox, the year swings open",      accent:"#e58fb0", accent2:"#f6c33f", grad:"linear-gradient(160deg,#3a2836,#8a5a6e,#f0a9c0)" },
  { num:5,  slug:"the-hive",      name:"The Hive",      symbol:"🐝", desc:"Bees return, everything alive",             accent:"#f0b93b", accent2:"#f6d873", grad:"linear-gradient(160deg,#3a2e12,#8a6a1e,#f0c541)" },
  { num:6,  slug:"pixie-tricks",  name:"Pixie Tricks",  symbol:"🍄", desc:"Stay alert — spirits play, wisdom needed",  accent:"#a071c4", accent2:"#d0a3e6", grad:"linear-gradient(160deg,#2c2140,#5a3a7a,#a074c6)" },
  { num:7,  slug:"high-heaven",   name:"High Heaven",   symbol:"☀️", desc:"Summer solstice, sun at its peak",          accent:"#f6c33f", accent2:"#ffe08a", grad:"linear-gradient(160deg,#3a3012,#9a7a1e,#f6cf4a)" },
  { num:8,  slug:"golden-gate",   name:"Golden Gate",   symbol:"🌾", desc:"Harvest begins, abundance at the threshold",accent:"#e0a54a", accent2:"#f2c877", grad:"linear-gradient(160deg,#3a2e18,#8a6a2a,#e6b256)" },
  { num:9,  slug:"falling-vine",  name:"Falling Vine",  symbol:"🍇", desc:"Last sweetness, fruit dropping",            accent:"#c07a4a", accent2:"#f2c877", grad:"linear-gradient(160deg,#33241a,#7a5230,#e0a54a)" },
  { num:10, slug:"dark-fen",      name:"Dark Fen",      symbol:"🌿", desc:"Mist, marshes, world going inward",         accent:"#5f8a6b", accent2:"#9bc3a1", grad:"linear-gradient(160deg,#1e2c26,#3a5a48,#7fa88a)" },
  { num:11, slug:"forgiven",      name:"Forgiven",      symbol:"🕊️", desc:"Release, forgiveness, bare sky",            accent:"#8fb4d6", accent2:"#d3e3ef", grad:"linear-gradient(160deg,#2a3644,#5a7488,#a9c4d6)" },
  { num:12, slug:"wolves-delve",  name:"Wolves Delve",  symbol:"🐺", desc:"Creatures dig deep, earth holds its breath",accent:"#6a6f9c", accent2:"#a0a4cc", grad:"linear-gradient(160deg,#232538,#44486e,#8488b4)" },
  { num:13, slug:"winters-dream", name:"Winters Dream", symbol:"❄️", desc:"The year dreaming toward its end",           accent:"#7db6d8", accent2:"#c7e6f2", grad:"linear-gradient(160deg,#22323f,#456678,#93bdd2)" },
];

// Real photos live in public/moonths/<slug>.jpg — sourced one at a time.
// Any moonth not listed here shows a celestial placeholder gradient.
const MOONTH_IMAGES = {
  "falling-vine": "/moonths/falling-vine.jpg",
};

const SOLAR_EVENTS = {
  solstice_summer: { symbol:"☀️", label:"Summer Solstice", note:"The sun reaches its highest point. Peak of light.",  color:"#b85c00", bg:"linear-gradient(135deg,#ffe0a0,#ffd070)", border:"#d4880a" },
  solstice_winter: { symbol:"❄️", label:"Winter Solstice", note:"The longest night. From here the light returns.",    color:"#1a6090", bg:"linear-gradient(135deg,#c8e8f8,#a8d4ef)", border:"#2a80b0" },
  equinox_spring:  { symbol:"🌸", label:"Spring Equinox",  note:"Day and night held equal. The world reawakens.",     color:"#2a7040", bg:"linear-gradient(135deg,#d0eec8,#b8e0a8)", border:"#3a9050" },
  equinox_autumn:  { symbol:"🍂", label:"Autumn Equinox",  note:"Day and night balanced. The descent begins.",        color:"#904010", bg:"linear-gradient(135deg,#f8ddb0,#f0c880)", border:"#b05a18" },
};

const EPOCH = new Date(2025, 11, 25);

function calendarToGregorian(calYear, moonthIdx, day) {
  const d = new Date(EPOCH);
  d.setFullYear(EPOCH.getFullYear() + (calYear - 1));
  d.setDate(d.getDate() + moonthIdx * 28 + (day - 1));
  return d;
}

function gregorianToCalendar(date) {
  const diff = Math.floor((date - EPOCH) / 86400000);
  if (diff < 0) return null;
  const calYear = Math.floor(diff / 365) + 1;
  const yearStart = new Date(EPOCH);
  yearStart.setFullYear(EPOCH.getFullYear() + (calYear - 1));
  const dayOfYear = Math.floor((date - yearStart) / 86400000);
  if (dayOfYear >= 364) return { calYear, moonthIdx:-1, day:1, isHollow:true };
  const moonthIdx = Math.floor(dayOfYear / 28);
  const day       = (dayOfYear % 28) + 1;
  const weekDay   = dayOfYear % 7;
  return { calYear, moonthIdx, day, weekDay, isHollow:false };
}

const ASTRO_EVENTS = [
  // ── 2026 ── Sources: rmg.co.uk, almanac.com, timeanddate.com, chani.com
  { date:new Date(2026,0,3),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,0,18),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,1,1),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,1,17),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,2,3),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,2,18),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,2,20),  type:"equinox_spring",  label:"Spring Equinox" },
  { date:new Date(2026,3,2),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,3,17),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,4,1),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,4,16),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,4,31),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,5,14),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,5,21),  type:"solstice_summer", label:"Summer Solstice" },
  { date:new Date(2026,5,29),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,6,14),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,6,29),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,7,12),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,7,28),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,8,10),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,8,22),  type:"equinox_autumn",  label:"Autumn Equinox" },
  { date:new Date(2026,8,26),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,9,10),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,9,26),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,10,9),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,10,24), type:"full_moon",       label:"Full Moon" },
  { date:new Date(2026,11,8),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2026,11,21), type:"solstice_winter", label:"Winter Solstice" },
  { date:new Date(2026,11,24), type:"full_moon",       label:"Full Moon" },
];

const ASTRO_ICONS  = { full_moon:"🌕", new_moon:"🌑", equinox_spring:"🌸", equinox_autumn:"🍂", solstice_summer:"☀️", solstice_winter:"❄️" };
const ASTRO_COLORS = { full_moon:"#c8a840", new_moon:"#6a7a8a", equinox_spring:"#2a7040", equinox_autumn:"#904010", solstice_summer:"#b85c00", solstice_winter:"#1a6090" };

function getAstroForDate(date) {
  return ASTRO_EVENTS.filter(e =>
    e.date.getFullYear()===date.getFullYear() &&
    e.date.getMonth()===date.getMonth() &&
    e.date.getDate()===date.getDate()
  );
}

function astrosForMoonth(calYear, i) {
  return ASTRO_EVENTS.filter(ev => { const c=gregorianToCalendar(ev.date); return c&&!c.isHollow&&c.moonthIdx===i; });
}

const TODAY_GREG = new Date();
const TODAY_CAL  = gregorianToCalendar(TODAY_GREG);

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    mode:"dark",
    bg:"#0f1b2e",
    bgWash:"radial-gradient(1200px 700px at 50% -10%, rgba(106,184,240,0.10), transparent 60%), radial-gradient(900px 600px at 90% 20%, rgba(236,192,97,0.07), transparent 60%)",
    surface:"#17263f",
    card:"#16233b",
    headerGrad:"linear-gradient(160deg,#122038 0%,#182848 50%,#101d30 100%)",
    text:"#e6edf7",
    textMid:"#9db3ce",
    textSoft:"#6d88a8",
    border:"rgba(255,255,255,0.09)",
    gold:"#ecc061",
    goldSoft:"rgba(236,192,97,0.14)",
    sky:"#6ab8f0",
    skySoft:"rgba(106,184,240,0.12)",
    shadow:"0 10px 30px rgba(0,0,0,0.45)",
    shadowSm:"0 2px 10px rgba(0,0,0,0.35)",
    stars:true,
  },
  light: {
    mode:"light",
    bg:"#fbf5e9",
    bgWash:"radial-gradient(1100px 640px at 50% -12%, rgba(240,197,74,0.22), transparent 60%), radial-gradient(800px 520px at 88% 12%, rgba(122,180,220,0.16), transparent 62%)",
    surface:"#ffffff",
    card:"#ffffff",
    headerGrad:"linear-gradient(160deg,#fff7e6 0%,#ffeecb 55%,#fde6c8 100%)",
    text:"#2e2620",
    textMid:"#6f6152",
    textSoft:"#a2917d",
    border:"rgba(60,44,20,0.10)",
    gold:"#c98a12",
    goldSoft:"rgba(224,160,32,0.14)",
    sky:"#3f8fbf",
    skySoft:"rgba(63,143,191,0.12)",
    shadow:"0 12px 30px rgba(120,90,40,0.16)",
    shadowSm:"0 3px 12px rgba(120,90,40,0.12)",
    stars:false,
  },
};

// Reusable celestial overlay layered over every hero (grounded photo + magic).
const CELESTIAL =
  "radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.9), transparent 60%)," +
  "radial-gradient(1.5px 1.5px at 28% 12%, rgba(255,255,255,0.7), transparent 60%)," +
  "radial-gradient(1px 1px at 46% 30%, rgba(255,255,255,0.7), transparent 60%)," +
  "radial-gradient(1.5px 1.5px at 68% 16%, rgba(255,255,255,0.8), transparent 60%)," +
  "radial-gradient(1px 1px at 82% 34%, rgba(255,255,255,0.6), transparent 60%)," +
  "radial-gradient(1px 1px at 58% 8%, rgba(255,255,255,0.6), transparent 60%)," +
  "radial-gradient(circle at 84% 22%, rgba(255,248,224,0.45), transparent 34%)";

const SCRIM = "linear-gradient(to top, rgba(6,10,20,0.80) 0%, rgba(6,10,20,0.32) 44%, rgba(6,10,20,0) 70%)";

export default function App() {
  const [mode, setMode] = useState(() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("moonths-theme"))
      return localStorage.getItem("moonths-theme");
    return "light";
  });
  const T = THEMES[mode] || THEMES.light;
  useEffect(() => { try { localStorage.setItem("moonths-theme", mode); } catch {} }, [mode]);

  const [view, setView]                       = useState("grid");
  const [selectedMoonth, setSelectedMoonth]   = useState(TODAY_CAL?.moonthIdx ?? 0);
  const [calYear]                             = useState(TODAY_CAL?.calYear ?? 1);
  const [converterInput, setConverterInput]   = useState("");
  const [converterResult, setConverterResult] = useState(null);

  function handleConverter() {
    const d = new Date(converterInput);
    if (isNaN(d)) { setConverterResult("Invalid date"); return; }
    const cal = gregorianToCalendar(d);
    if (!cal) { setConverterResult("Date is before the calendar begins (Dec 25, 2025)"); return; }
    if (cal.isHollow) { setConverterResult(`The Hollow Day of Year ${cal.calYear} — outside all moonths`); return; }
    const m = MOONTHS[cal.moonthIdx];
    setConverterResult(`${DAYS_FULL[cal.weekDay ?? 0]}  ·  ${m.name}  ·  Day ${cal.day}  ·  Year ${cal.calYear}`);
  }

  function openMoonth(i) { setSelectedMoonth(i); setView("moonth"); }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:SANS, transition:"background 0.3s, color 0.3s" }}>
      <style>{`
        @keyframes fadeUp     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes todayRing  { 0%,100%{box-shadow:0 0 0 2px rgba(92,172,238,0.30)} 50%{box-shadow:0 0 0 5px rgba(92,172,238,0.50)} }
        @keyframes solarPulse { 0%,100%{opacity:0.92} 50%{opacity:1} }
        @keyframes symbolFloat{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes twinkle    { 0%,100%{opacity:0.25} 50%{opacity:1} }
        @keyframes glow       { 0%,100%{filter:drop-shadow(0 0 3px rgba(255,240,200,0.5))} 50%{filter:drop-shadow(0 0 9px rgba(255,240,200,0.85))} }
        .mcard { transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s; }
        .mcard:hover { transform:translateY(-4px); }
        .mcard:hover .hero-img { transform:scale(1.05); }
        .gtile { transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .gtile:hover { transform:translateY(-3px) scale(1.02); }
        .nbtn { transition:all 0.17s; }
        .nbtn:hover { transform:translateY(-1px); }
        .stars-bg { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
        .star { position:absolute; background:#dbe6fb; border-radius:50%; }
      `}</style>

      {/* Ambient background wash + (dark only) starfield */}
      <div style={{ position:"fixed", inset:0, background:T.bgWash, pointerEvents:"none", zIndex:0, transition:"background 0.3s" }} />
      {T.stars && (
        <div className="stars-bg">
          {Array.from({length:80},(_,i) => (
            <div key={i} className="star" style={{
              left:`${(i*37)%100}%`, top:`${(i*53)%100}%`,
              width: i%7===0 ? 3 : i%3===0 ? 2 : 1.5,
              height: i%7===0 ? 3 : i%3===0 ? 2 : 1.5,
              opacity: 0.2 + ((i%5)/6),
              animation:`twinkle ${2+(i%4)}s ease-in-out ${(i%6)*0.4}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* ── Header ── */}
      <header style={{
        background:T.headerGrad,
        borderBottom:`1px solid ${T.border}`,
        padding:"1.7rem 1.5rem 1.2rem",
        textAlign:"center",
        boxShadow:T.shadowSm,
        position:"relative",
        zIndex:1,
      }}>
        {/* Theme toggle */}
        <button onClick={()=>setMode(mode==="dark"?"light":"dark")} aria-label="Toggle light and dark" style={{
          position:"absolute", top:"1.1rem", right:"1.1rem",
          background:T.card, border:`1px solid ${T.border}`, color:T.text,
          width:40, height:40, borderRadius:"50%", cursor:"pointer",
          fontSize:"1.1rem", lineHeight:1, boxShadow:T.shadowSm, transition:"all 0.2s",
        }}>{mode==="dark" ? "☀️" : "🌙"}</button>

        <div style={{ fontFamily:SANS, fontSize:"0.6rem", fontWeight:600, letterSpacing:"0.28em", color:T.textSoft, marginBottom:"0.4rem" }}>
          THE LIVING CALENDAR · YEAR {calYear}
        </div>
        <h1 style={{
          margin:0, fontFamily:DISPLAY, fontSize:"clamp(1.8rem,5vw,3rem)", fontWeight:800, letterSpacing:"-0.01em",
          background:`linear-gradient(120deg, ${T.sky} 0%, ${T.gold} 55%, #e08040 100%)`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>13 Moonths</h1>
        <div style={{ fontFamily:SANS, fontSize:"0.66rem", fontWeight:500, color:T.textSoft, marginTop:"0.35rem", letterSpacing:"0.12em" }}>
          Moon · Air · Water · Earth · Fire · Star · Sun
        </div>
        <nav style={{ display:"flex", justifyContent:"center", gap:"0.5rem", marginTop:"1.2rem" }}>
          {[["grid","Grid"],["year","Cards"],["converter","Converter"]].map(([v,lbl]) => (
            <button key={v} className="nbtn" onClick={()=>setView(v)} style={{
              background:view===v ? T.goldSoft : "transparent",
              border:`1px solid ${view===v ? T.gold : T.border}`,
              color:view===v ? T.gold : T.textMid,
              padding:"0.42rem 1.15rem", borderRadius:"2rem", cursor:"pointer",
              fontFamily:DISPLAY, fontWeight:600, fontSize:"0.74rem", letterSpacing:"0.02em",
            }}>{lbl}</button>
          ))}
        </nav>
      </header>

      <main style={{ padding:"1.5rem 1rem 5rem", maxWidth:1040, margin:"0 auto", position:"relative", zIndex:1 }}>
        {view==="grid"      && <GridView T={T} calYear={calYear} onSelectMoonth={openMoonth} />}
        {view==="year"      && <YearView T={T} calYear={calYear} onSelectMoonth={openMoonth} />}
        {view==="moonth"    && <MoonthView T={T} calYear={calYear} moonthIdx={selectedMoonth} onPrev={()=>setSelectedMoonth(m=>Math.max(0,m-1))} onNext={()=>setSelectedMoonth(m=>Math.min(12,m+1))} onBack={()=>setView("grid")} />}
        {view==="converter" && <ConverterView T={T} input={converterInput} setInput={setConverterInput} result={converterResult} onConvert={handleConverter} />}
      </main>

      {/* ── Footer legend ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:mode==="dark"?"rgba(15,27,46,0.94)":"rgba(251,245,233,0.94)", backdropFilter:"blur(8px)", borderTop:`1px solid ${T.border}`, padding:"0.55rem 1rem", display:"flex", justifyContent:"center", gap:"1.2rem", flexWrap:"wrap", zIndex:10 }}>
        {Object.entries(ASTRO_ICONS).map(([type,icon]) => (
          <span key={type} style={{ fontFamily:SANS, fontSize:"0.64rem", fontWeight:500, color:T.textMid, letterSpacing:"0.02em", display:"inline-flex", alignItems:"center", gap:"0.28rem" }}>
            <span style={{ fontSize:"0.85rem" }}>{icon}</span> {type.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero (photo or celestial placeholder + overlay) ──────────────────────────
function Hero({ m, moonIcons, tall }) {
  const src = MOONTH_IMAGES[m.slug];
  return (
    <div style={{ position:"relative", width:"100%", aspectRatio: tall ? "3 / 2" : "16 / 10", overflow:"hidden", background:m.grad }}>
      {src ? (
        <img className="hero-img" src={src} alt={m.name} style={{
          width:"100%", height:"100%", objectFit:"cover", display:"block",
          transition:"transform 0.5s cubic-bezier(0.34,1.1,0.64,1)",
        }}/>
      ) : (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3.6rem", opacity:0.85, animation:"symbolFloat 5s ease-in-out infinite" }}>{m.symbol}</div>
      )}
      <div style={{ position:"absolute", inset:0, background:CELESTIAL, mixBlendMode:"screen", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, background:SCRIM, pointerEvents:"none" }} />
      {moonIcons.length>0 && (
        <div style={{ position:"absolute", top:"0.6rem", left:"0.7rem", display:"flex", gap:"0.35rem" }}>
          {moonIcons.map((ic,j) => (
            <span key={j} style={{ fontSize:"1.15rem", animation:"glow 3.5s ease-in-out infinite", filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>{ic}</span>
          ))}
        </div>
      )}
      <div style={{ position:"absolute", left:"0.95rem", bottom:"0.75rem", right:"0.95rem" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:"0.55rem" }}>
          <span style={{ fontFamily:DISPLAY, fontSize:"1.45rem", fontWeight:800, color:"#fff", opacity:0.7, lineHeight:1, textShadow:"0 2px 8px rgba(0,0,0,0.5)" }}>{String(m.num).padStart(2,"0")}</span>
          <span style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:700, color:"#fff", letterSpacing:"0.005em", textShadow:"0 2px 10px rgba(0,0,0,0.6)" }}>{m.name}</span>
        </div>
      </div>
    </div>
  );
}

// ─── GRID VIEW (all 13 at a glance) ───────────────────────────────────────────
function GridView({ T, calYear, onSelectMoonth }) {
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:"0.7rem", marginBottom:"1rem" }}>
        {MOONTHS.map((m,i) => {
          const isCurrent = TODAY_CAL && !TODAY_CAL.isHollow && TODAY_CAL.moonthIdx===i;
          const astros = astrosForMoonth(calYear,i);
          const src = MOONTH_IMAGES[m.slug];
          return (
            <div key={i} className="gtile" onClick={()=>onSelectMoonth(i)} style={{
              cursor:"pointer", borderRadius:"15px", padding:"1.4px",
              background:`linear-gradient(140deg, ${m.accent}, ${m.accent2})`,
              boxShadow: isCurrent ? `0 0 0 2px ${T.gold}, ${T.shadowSm}` : T.shadowSm,
              position:"relative",
            }}>
              <div style={{ position:"relative", borderRadius:"13.6px", overflow:"hidden", aspectRatio:"4 / 5", background:m.grad }}>
                {src
                  ? <img src={src} alt={m.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.4rem", opacity:0.9 }}>{m.symbol}</div>}
                <div style={{ position:"absolute", inset:0, background:CELESTIAL, mixBlendMode:"screen" }} />
                <div style={{ position:"absolute", inset:0, background:SCRIM }} />
                {/* event dots */}
                <div style={{ position:"absolute", top:"0.4rem", left:"0.45rem", display:"flex", gap:"0.2rem" }}>
                  {astros.slice(0,4).map((ev,j) => <span key={j} style={{ fontSize:"0.72rem", filter:"drop-shadow(0 1px 1px rgba(0,0,0,0.5))" }}>{ASTRO_ICONS[ev.type]}</span>)}
                </div>
                {/* number + name */}
                <div style={{ position:"absolute", left:"0.55rem", right:"0.5rem", bottom:"0.5rem" }}>
                  <div style={{ fontFamily:DISPLAY, fontSize:"1.55rem", fontWeight:800, color:"#fff", opacity:0.62, lineHeight:0.9, textShadow:"0 2px 6px rgba(0,0,0,0.5)" }}>{String(m.num).padStart(2,"0")}</div>
                  <div style={{ fontFamily:DISPLAY, fontSize:"0.82rem", fontWeight:700, color:"#fff", lineHeight:1.1, textShadow:"0 1px 6px rgba(0,0,0,0.7)" }}>{m.name}</div>
                </div>
              </div>
              {isCurrent && (
                <div style={{ position:"absolute", top:"0.45rem", right:"0.45rem", fontFamily:DISPLAY, fontSize:"0.46rem", fontWeight:700, letterSpacing:"0.1em", background:T.gold, color:"#1a1206", borderRadius:"2rem", padding:"0.14rem 0.45rem", boxShadow:"0 2px 6px rgba(0,0,0,0.35)" }}>NOW</div>
              )}
            </div>
          );
        })}
        {/* Hollow Day tile */}
        <div style={{ borderRadius:"15px", border:`1.4px dashed ${T.border}`, aspectRatio:"4 / 5", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.3rem", color:T.textSoft, background:T.surface, boxShadow:T.shadowSm }}>
          <div style={{ fontSize:"1.4rem" }}>✦</div>
          <div style={{ fontFamily:DISPLAY, fontWeight:700, fontSize:"0.74rem", color:T.textMid }}>Hollow Day</div>
          <div style={{ fontSize:"0.56rem", textAlign:"center", lineHeight:1.4, padding:"0 0.5rem" }}>Dec 24 · the breath between years</div>
        </div>
      </div>
    </div>
  );
}

// ─── CARDS VIEW ───────────────────────────────────────────────────────────────
function YearView({ T, calYear, onSelectMoonth }) {
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:"1.1rem", marginBottom:"1.1rem" }}>
        {MOONTHS.map((m,i) => {
          const isCurrent = TODAY_CAL && !TODAY_CAL.isHollow && TODAY_CAL.moonthIdx===i;
          const s      = calendarToGregorian(calYear,i,1);
          const e      = calendarToGregorian(calYear,i,28);
          const dr     = `${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`;
          const astros = astrosForMoonth(calYear,i);
          const solar  = astros.filter(ev => SOLAR_EVENTS[ev.type]);
          const moons  = astros.filter(ev => !SOLAR_EVENTS[ev.type]).map(ev => ASTRO_ICONS[ev.type]);

          return (
            <div key={i} className="mcard" onClick={()=>onSelectMoonth(i)} style={{
              cursor:"pointer", borderRadius:"20px", padding:"1.6px",
              background:`linear-gradient(140deg, ${m.accent}, ${m.accent2})`,
              boxShadow: isCurrent ? `0 0 0 2px ${T.gold}, ${T.shadow}` : T.shadowSm,
              position:"relative",
            }}>
              <div style={{ background:T.card, borderRadius:"18.5px", overflow:"hidden" }}>
                <Hero m={m} moonIcons={moons} tall={false} />
                <div style={{ padding:"0.75rem 0.95rem 0.95rem" }}>
                  <div style={{ fontSize:"0.62rem", fontWeight:600, color:T.textSoft, letterSpacing:"0.02em", marginBottom:"0.35rem" }}>{dr}</div>
                  <div style={{ fontSize:"0.76rem", color:T.textMid, lineHeight:1.5, marginBottom: (solar.length||moons.length) ? "0.6rem" : 0 }}>{m.desc}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.35rem" }}>
                    {solar.map((ev,j) => {
                      const se = SOLAR_EVENTS[ev.type];
                      return (
                        <span key={j} style={{ display:"inline-flex", alignItems:"center", gap:"0.28rem", background:se.bg, border:`1px solid ${se.border}`, borderRadius:"2rem", padding:"0.18rem 0.5rem" }}>
                          <span style={{ fontSize:"0.8rem" }}>{se.symbol}</span>
                          <span style={{ fontFamily:DISPLAY, fontSize:"0.56rem", color:se.color, fontWeight:600 }}>{se.label}</span>
                        </span>
                      );
                    })}
                    {moons.length>0 && (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:T.goldSoft, border:`1px solid ${T.border}`, borderRadius:"2rem", padding:"0.18rem 0.55rem" }}>
                        {moons.map((ic,j)=><span key={j} style={{ fontSize:"0.78rem" }}>{ic}</span>)}
                        <span style={{ fontFamily:DISPLAY, fontSize:"0.56rem", color:T.textMid, fontWeight:600 }}>{moons.length} moon{moons.length>1?"s":""}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {isCurrent && (
                <div style={{ position:"absolute", top:"0.7rem", right:"0.7rem", fontFamily:DISPLAY, fontSize:"0.5rem", letterSpacing:"0.12em", fontWeight:700, background:T.gold, color:"#1a1206", borderRadius:"2rem", padding:"0.18rem 0.55rem", boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>NOW</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background:T.surface, border:`1px dashed ${T.border}`, borderRadius:"14px", padding:"0.85rem", textAlign:"center", color:T.textSoft, fontSize:"0.64rem", letterSpacing:"0.06em", boxShadow:T.shadowSm }}>
        ✦ &nbsp; THE HOLLOW DAY · Dec 24 · Outside all moonths · The breath between years &nbsp; ✦
      </div>
    </div>
  );
}

// ─── MOONTH VIEW ──────────────────────────────────────────────────────────────
function MoonthView({ T, calYear, moonthIdx, onPrev, onNext, onBack }) {
  const m = MOONTHS[moonthIdx];

  const days = Array.from({length:28},(_,i) => {
    const dayNum  = i+1;
    const greg    = calendarToGregorian(calYear,moonthIdx,dayNum);
    const astro   = getAstroForDate(greg);
    const weekDay = i % 7;
    const isToday = TODAY_CAL&&!TODAY_CAL.isHollow&&TODAY_CAL.moonthIdx===moonthIdx&&TODAY_CAL.day===dayNum;
    return { dayNum, greg, astro, weekDay, isToday };
  });

  const solarThisMoonth = days.flatMap(d => d.astro.filter(ev=>SOLAR_EVENTS[ev.type]).map(ev=>({...ev,dayNum:d.dayNum,greg:d.greg})));
  const moonIcons = days.flatMap(d => d.astro.filter(ev=>!SOLAR_EVENTS[ev.type]).map(ev=>ASTRO_ICONS[ev.type]));

  const Arr = ({onClick,disabled,ch}) => (
    <button onClick={onClick} disabled={disabled} style={{
      background:T.card, border:`1px solid ${disabled?T.border:T.gold}`,
      color:disabled?T.textSoft:T.gold, width:42,height:42,borderRadius:"50%",
      cursor:disabled?"default":"pointer", fontSize:"1.3rem", fontFamily:DISPLAY, boxShadow:disabled?"none":T.shadowSm,
      flexShrink:0,
    }}>{ch}</button>
  );

  return (
    <div style={{ maxWidth:720, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>

      <button onClick={onBack} style={{ background:"transparent", border:"none", color:T.textMid, fontFamily:DISPLAY, fontWeight:600, fontSize:"0.72rem", cursor:"pointer", padding:"0 0 0.6rem", display:"inline-flex", alignItems:"center", gap:"0.3rem" }}>‹ All moonths</button>

      {/* Hero header card */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"1.3rem" }}>
        <Arr onClick={onPrev} disabled={moonthIdx===0}  ch="‹" />
        <div style={{ flex:1, borderRadius:"22px", padding:"1.6px", background:`linear-gradient(140deg, ${m.accent}, ${m.accent2})`, boxShadow:T.shadow }}>
          <div style={{ background:T.card, borderRadius:"20.5px", overflow:"hidden" }}>
            <Hero m={m} moonIcons={moonIcons} tall={true} />
            <div style={{ padding:"0.85rem 1.1rem 1rem", textAlign:"center" }}>
              <div style={{ fontSize:"0.8rem", color:T.textMid }}>{m.desc}</div>
            </div>
          </div>
        </div>
        <Arr onClick={onNext} disabled={moonthIdx===12} ch="›" />
      </div>

      {/* Solar event banner */}
      {solarThisMoonth.map((ev,i) => {
        const se = SOLAR_EVENTS[ev.type];
        return (
          <div key={i} style={{ background:se.bg, border:`2px solid ${se.border}`, borderRadius:"18px", padding:"1.4rem 1.5rem 1.1rem", marginBottom:"1.3rem", textAlign:"center", animation:"solarPulse 3s ease infinite", boxShadow:T.shadowSm }}>
            <div style={{ fontSize:"3rem", lineHeight:1, marginBottom:"0.4rem" }}>{se.symbol}</div>
            <div style={{ fontFamily:DISPLAY, fontSize:"1.05rem", fontWeight:700, color:se.color, letterSpacing:"0.02em", marginBottom:"0.3rem" }}>{se.label}</div>
            <div style={{ fontSize:"0.74rem", color:se.color, opacity:0.85, marginBottom:"0.4rem" }}>{se.note}</div>
            <div style={{ fontFamily:DISPLAY, fontSize:"0.6rem", fontWeight:600, color:se.color, opacity:0.7, letterSpacing:"0.03em" }}>
              Day {ev.dayNum} · {ev.greg.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
        );
      })}

      {/* Day column headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.3rem", marginBottom:"0.3rem" }}>
        {DAYS_SHORT.map((d,i) => (
          <div key={d} style={{
            fontFamily:DISPLAY, textAlign:"center", fontSize:"0.56rem", padding:"0.2rem 0",
            color: i===0 ? T.gold : T.textSoft, fontWeight: i===0 ? 700 : 500, letterSpacing:"0.02em",
            borderBottom: i===0 ? `2px solid ${T.gold}` : `1px solid transparent`,
          }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.3rem" }}>
        {days.map(({dayNum,greg,astro,weekDay,isToday}) => {
          const hasSolar  = astro.some(ev=>SOLAR_EVENTS[ev.type]);
          const solarEv   = astro.find(ev=>SOLAR_EVENTS[ev.type]);
          const se        = solarEv ? SOLAR_EVENTS[solarEv.type] : null;
          const isMoonDay = weekDay===0;

          return (
            <div key={dayNum} style={{
              background: hasSolar ? se.bg : isToday ? T.goldSoft : T.surface,
              border:`1px solid ${hasSolar ? se.border : isToday ? T.gold : isMoonDay ? T.sky : T.border}`,
              borderRadius:"10px", padding:"0.4rem 0.1rem", textAlign:"center", minHeight:60,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.08rem",
              animation:isToday?"todayRing 2.5s ease infinite":"none", boxShadow:hasSolar?T.shadowSm:"none",
            }}>
              {hasSolar && <div style={{ fontSize:"1rem", lineHeight:1 }}>{se.symbol}</div>}
              <div style={{ fontFamily:DISPLAY, fontSize:"0.9rem", color:hasSolar?se.color:isToday?T.gold:isMoonDay?T.sky:T.text, fontWeight:(hasSolar||isToday||isMoonDay)?700:500 }}>
                {dayNum}
              </div>
              <div style={{ fontSize:"0.46rem", color:hasSolar?se.color:T.textSoft, opacity:0.85 }}>
                {greg.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
              </div>
              {astro.filter(ev=>!SOLAR_EVENTS[ev.type]).map((ev,i) => (
                <span key={i} style={{ fontSize:"0.9rem" }} title={ev.label}>{ASTRO_ICONS[ev.type]}</span>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign:"center", fontSize:"0.6rem", color:T.textSoft, marginTop:"0.7rem" }}>
        Every moonth begins on Moon Day — the first column always marks the start of the week.
      </div>

      {/* Moon phases list */}
      {days.some(d=>d.astro.some(ev=>!SOLAR_EVENTS[ev.type])) && (
        <div style={{ marginTop:"1.4rem", background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", padding:"1rem 1.2rem", boxShadow:T.shadowSm }}>
          <div style={{ fontFamily:DISPLAY, fontSize:"0.58rem", fontWeight:600, letterSpacing:"0.12em", color:T.textSoft, marginBottom:"0.7rem" }}>MOON PHASES THIS MOONTH</div>
          {days.filter(d=>d.astro.some(ev=>!SOLAR_EVENTS[ev.type])).map(({dayNum,greg,astro}) =>
            astro.filter(ev=>!SOLAR_EVENTS[ev.type]).map((ev,i) => (
              <div key={`${dayNum}-${i}`} style={{ display:"flex", alignItems:"center", gap:"0.7rem", padding:"0.45rem 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:"1.15rem", width:24, textAlign:"center" }}>{ASTRO_ICONS[ev.type]}</span>
                <span style={{ fontSize:"0.78rem", color:T.text }}>{ev.label}</span>
                <span style={{ fontFamily:DISPLAY, fontSize:"0.62rem", fontWeight:500, color:T.textSoft, marginLeft:"auto" }}>Day {dayNum} · {greg.toLocaleDateString("en-GB",{day:"numeric",month:"long"})}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── CONVERTER ────────────────────────────────────────────────────────────────
function ConverterView({ T, input, setInput, result, onConvert }) {
  return (
    <div style={{ maxWidth:460, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div style={{ borderRadius:"20px", padding:"1.6px", background:"linear-gradient(140deg,#f0c541,#6ab8f0)", boxShadow:T.shadow }}>
        <div style={{ background:T.surface, borderRadius:"18.5px", padding:"2rem", textAlign:"center" }}>
          <div style={{ fontFamily:DISPLAY, fontSize:"0.62rem", fontWeight:600, letterSpacing:"0.15em", color:T.textSoft, marginBottom:"1.5rem" }}>GREGORIAN → CALENDAR CONVERTER</div>
          <input type="date" value={input} onChange={e=>setInput(e.target.value)} style={{
            background:T.bg, border:`1px solid ${T.border}`, color:T.text,
            padding:"0.7rem 1rem", borderRadius:"10px", fontSize:"0.9rem", fontFamily:SANS,
            width:"100%", boxSizing:"border-box", marginBottom:"0.9rem", outline:"none",
          }}/>
          <button onClick={onConvert} style={{
            background:`linear-gradient(135deg,${T.gold},#e08040)`, border:"none", color:"#fff",
            padding:"0.72rem 2rem", borderRadius:"2rem", cursor:"pointer", fontWeight:600,
            fontFamily:DISPLAY, fontSize:"0.8rem", letterSpacing:"0.02em", width:"100%", boxShadow:T.shadowSm,
          }}>Convert Date</button>
          {result && (
            <div style={{ marginTop:"1.4rem", padding:"1rem", background:T.goldSoft, border:`1px solid ${T.gold}`, borderRadius:"12px", fontSize:"0.9rem", color:T.gold, letterSpacing:"0.01em", lineHeight:1.75 }}>
              {result}
            </div>
          )}
          <div style={{ marginTop:"1.75rem", fontSize:"0.64rem", color:T.textSoft, lineHeight:2 }}>
            The calendar begins on Dec 25, 2025<br/>
            13 moonths · 28 days each · 364 days<br/>
            The Hollow Day falls on Dec 24 each year
          </div>
        </div>
      </div>
    </div>
  );
}
