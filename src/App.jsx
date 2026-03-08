import { useState } from "react";

const DAYS_FULL  = ["Moon Day","Air Day","Water Day","Earth Day","Fire Day","Star Day","Sun Day"];
const DAYS_SHORT = ["Moon","Air","Water","Earth","Fire","Star","Sun"];

// Each moonth gets a symbol that reflects its name/feeling
const MOONTHS = [
  { num:1,  name:"Rising Sun",    symbol:"🌄", desc:"Light returning after solstice" },
  { num:2,  name:"Morning Dew",   symbol:"🌫️", desc:"Winter stillness, first moisture" },
  { num:3,  name:"Waking Tree",   symbol:"🌳", desc:"Sap rising, buds beginning" },
  { num:4,  name:"Open Door",     symbol:"🚪", desc:"Spring equinox, the year swings open" },
  { num:5,  name:"The Hive",      symbol:"🐝", desc:"Bees return, everything alive" },
  { num:6,  name:"Pixie Tricks",  symbol:"🍄", desc:"Stay alert — spirits play, wisdom needed" },
  { num:7,  name:"High Heaven",   symbol:"☀️", desc:"Summer solstice, sun at its peak" },
  { num:8,  name:"Golden Gate",   symbol:"🌾", desc:"Harvest begins, abundance at the threshold" },
  { num:9,  name:"Falling Vine",  symbol:"🍇", desc:"Last sweetness, fruit dropping" },
  { num:10, name:"Dark Fen",      symbol:"🌿", desc:"Mist, marshes, world going inward" },
  { num:11, name:"Forgiven",      symbol:"🕊️", desc:"Release, forgiveness, bare sky" },
  { num:12, name:"Wolves Delve",  symbol:"🐺", desc:"Creatures dig deep, earth holds its breath" },
  { num:13, name:"Winters Dream", symbol:"❄️", desc:"The year dreaming toward its end" },
];

const SOLAR_EVENTS = {
  solstice_summer: { symbol:"☀️", label:"Summer Solstice", note:"The sun reaches its highest point. Peak of light.",  color:"#b85c00", bg:"linear-gradient(135deg,#ffe0a0,#ffd070)", border:"#d4880a" },
  solstice_winter: { symbol:"❄️", label:"Winter Solstice", note:"The longest night. From here the light returns.",    color:"#1a6090", bg:"linear-gradient(135deg,#c8e8f8,#a8d4ef)", border:"#2a80b0" },
  equinox_spring:  { symbol:"🌱", label:"Spring Equinox",  note:"Day and night held equal. The world reawakens.",     color:"#2a7040", bg:"linear-gradient(135deg,#d0eec8,#b8e0a8)", border:"#3a9050" },
  equinox_autumn:  { symbol:"🍂", label:"Autumn Equinox",  note:"Day and night balanced. The descent begins.",        color:"#904010", bg:"linear-gradient(135deg,#f8ddb0,#f0c880)", border:"#b05a18" },
};

const EPOCH = new Date(2024, 11, 25);

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
  { date:new Date(2025,0,13),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,0,29),  type:"new_moon",        label:"New Moon"  },
  { date:new Date(2025,1,12),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,2,14),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,2,20),  type:"equinox_spring",  label:"Spring Equinox" },
  { date:new Date(2025,3,13),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,4,12),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,5,11),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,5,21),  type:"solstice_summer", label:"Summer Solstice" },
  { date:new Date(2025,6,10),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,7,9),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,8,7),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,8,22),  type:"equinox_autumn",  label:"Autumn Equinox" },
  { date:new Date(2025,9,7),   type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,10,5),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,11,4),  type:"full_moon",       label:"Full Moon" },
  { date:new Date(2025,11,21), type:"solstice_winter", label:"Winter Solstice" },
];

const ASTRO_ICONS  = { full_moon:"○", new_moon:"●", equinox_spring:"🌱", equinox_autumn:"🍂", solstice_summer:"☀️", solstice_winter:"❄️" };
const ASTRO_COLORS = { full_moon:"#5a7a9a", new_moon:"#7a8fa0", equinox_spring:"#2a7040", equinox_autumn:"#904010", solstice_summer:"#b85c00", solstice_winter:"#1a6090" };

function getAstroForDate(date) {
  return ASTRO_EVENTS.filter(e =>
    e.date.getFullYear()===date.getFullYear() &&
    e.date.getMonth()===date.getMonth() &&
    e.date.getDate()===date.getDate()
  );
}

const TODAY_GREG = new Date();
const TODAY_CAL  = gregorianToCalendar(TODAY_GREG);

// ─── SUNRISE PALETTE ──────────────────────────────────────────────────────────
const T = {
  bg:          "#f0f7ff",        // pale dawn sky
  surface:     "#ffffff",
  surfaceAlt:  "#e4f0fb",
  card:        "#fafdff",
  border:      "#b8d4ec",
  borderSoft:  "#cfe4f5",
  text:        "#0e2030",
  textMid:     "#3a5a78",
  textSoft:    "#7090b0",
  gold:        "#c87800",        // warm sunrise gold
  goldBg:      "#fff4d8",
  goldBorder:  "#e8a830",
  orange:      "#d05000",        // sunrise orange
  orangeBg:    "#fff0e4",
  sky:         "#1a78c0",        // clear sky blue
  skyBg:       "#e0f0ff",
  skyBorder:   "#6ab0e0",
  shadow:      "rgba(20,60,100,0.08)",
  shadowMd:    "rgba(20,60,100,0.14)",
};

export default function App() {
  const [view, setView]                     = useState("year");
  const [selectedMoonth, setSelectedMoonth] = useState(TODAY_CAL?.moonthIdx ?? 0);
  const [calYear]                           = useState(1);
  const [converterInput, setConverterInput] = useState("");
  const [converterResult, setConverterResult] = useState(null);

  function handleConverter() {
    const d = new Date(converterInput);
    if (isNaN(d)) { setConverterResult("Invalid date"); return; }
    const cal = gregorianToCalendar(d);
    if (!cal) { setConverterResult("Date is before the calendar begins (Dec 25, 2024)"); return; }
    if (cal.isHollow) { setConverterResult(`The Hollow Day of Year ${cal.calYear} — outside all moonths`); return; }
    const m = MOONTHS[cal.moonthIdx];
    setConverterResult(`${DAYS_FULL[cal.weekDay ?? 0]}  ·  ${m.name}  ·  Day ${cal.day}  ·  Year ${cal.calYear}`);
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif" }}>
      <style>{`
        @keyframes fadeUp     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes todayRing  { 0%,100%{box-shadow:0 0 0 2px rgba(200,120,0,0.3)} 50%{box-shadow:0 0 0 5px rgba(200,120,0,0.5)} }
        @keyframes solarPulse { 0%,100%{opacity:0.9} 50%{opacity:1} }
        @keyframes symbolFloat{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        .mcard:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(20,60,100,0.13) !important; }
        .dcard:hover { background:${T.skyBg} !important; border-color:${T.skyBorder} !important; }
        .nbtn:hover  { background:${T.skyBg} !important; color:${T.sky} !important; border-color:${T.sky} !important; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background:`linear-gradient(160deg, #fff8ee 0%, #e8f4ff 100%)`,
        borderBottom:`1px solid ${T.border}`,
        padding:"2rem 1.5rem 1.3rem",
        textAlign:"center",
        boxShadow:`0 2px 12px ${T.shadow}`,
      }}>
        <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", color:T.textSoft, marginBottom:"0.3rem" }}>
          THE LIVING CALENDAR · YEAR {calYear}
        </div>
        <h1 style={{
          margin:0,
          fontSize:"clamp(1.7rem,4.5vw,2.8rem)",
          fontWeight:400,
          letterSpacing:"0.07em",
          background:`linear-gradient(120deg, ${T.orange} 0%, ${T.gold} 50%, ${T.sky} 100%)`,
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
        }}>13 Moonths</h1>
        <div style={{ fontSize:"0.66rem", color:T.textSoft, marginTop:"0.25rem", letterSpacing:"0.14em" }}>
          Moon · Air · Water · Earth · Fire · Star · Sun
        </div>
        <nav style={{ display:"flex", justifyContent:"center", gap:"0.5rem", marginTop:"1.3rem" }}>
          {[["year","Year View"],["moonth","Moonth View"],["converter","Converter"]].map(([v,lbl]) => (
            <button key={v} className="nbtn" onClick={()=>setView(v)} style={{
              background:view===v ? T.skyBg : "transparent",
              border:`1px solid ${view===v ? T.sky : T.border}`,
              color:view===v ? T.sky : T.textMid,
              padding:"0.35rem 1rem", borderRadius:"2rem", cursor:"pointer",
              fontSize:"0.7rem", letterSpacing:"0.07em", fontFamily:"inherit", transition:"all 0.17s",
            }}>{lbl}</button>
          ))}
        </nav>
      </header>

      <main style={{ padding:"1.5rem 1rem 5rem", maxWidth:980, margin:"0 auto" }}>
        {view==="year"      && <YearView calYear={calYear} onSelectMoonth={i=>{setSelectedMoonth(i);setView("moonth");}} />}
        {view==="moonth"    && <MoonthView calYear={calYear} moonthIdx={selectedMoonth} onPrev={()=>setSelectedMoonth(m=>Math.max(0,m-1))} onNext={()=>setSelectedMoonth(m=>Math.min(12,m+1))} />}
        {view==="converter" && <ConverterView input={converterInput} setInput={setConverterInput} result={converterResult} onConvert={handleConverter} />}
      </main>

      {/* ── Footer legend ── */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(8px)", borderTop:`1px solid ${T.border}`, padding:"0.55rem 1rem", display:"flex", justifyContent:"center", gap:"1.2rem", flexWrap:"wrap", zIndex:10 }}>
        {Object.entries(ASTRO_ICONS).map(([type,icon]) => (
          <span key={type} style={{ fontSize:"0.62rem", color:ASTRO_COLORS[type], letterSpacing:"0.04em" }}>
            {icon} {type.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── YEAR VIEW ────────────────────────────────────────────────────────────────
function YearView({ calYear, onSelectMoonth }) {
  return (
    <div style={{ animation:"fadeUp 0.35s ease" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))", gap:"0.75rem", marginBottom:"0.75rem" }}>
        {MOONTHS.map((m,i) => {
          const isCurrent = TODAY_CAL && !TODAY_CAL.isHollow && TODAY_CAL.moonthIdx===i;
          const s      = calendarToGregorian(calYear,i,1);
          const e      = calendarToGregorian(calYear,i,28);
          const dr     = `${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`;
          const astros = ASTRO_EVENTS.filter(ev => { const c=gregorianToCalendar(ev.date); return c&&!c.isHollow&&c.moonthIdx===i; });
          const solar  = astros.filter(ev => SOLAR_EVENTS[ev.type]);

          return (
            <div key={i} className="mcard" onClick={()=>onSelectMoonth(i)} style={{
              background: isCurrent
                ? `linear-gradient(135deg, ${T.goldBg}, ${T.skyBg})`
                : T.card,
              border:`1px solid ${isCurrent ? T.goldBorder : T.borderSoft}`,
              borderRadius:"14px",
              padding:"0.9rem 1rem",
              cursor:"pointer",
              transition:"all 0.2s",
              position:"relative",
              overflow:"hidden",
              boxShadow: isCurrent ? `0 4px 16px ${T.shadowMd}` : `0 1px 5px ${T.shadow}`,
              display:"flex",
              alignItems:"stretch",
              gap:"0",
            }}>
              {/* Left: text content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.52rem", color:T.textSoft, letterSpacing:"0.13em", marginBottom:"0.15rem" }}>MOONTH {m.num}</div>
                <div style={{ fontSize:"0.95rem", color:isCurrent?T.gold:T.text, fontWeight:600, marginBottom:"0.15rem" }}>{m.name}</div>
                <div style={{ fontSize:"0.6rem", color:T.textSoft, marginBottom:"0.35rem" }}>{dr}</div>
                <div style={{ fontSize:"0.6rem", color:T.textMid, fontStyle:"italic", lineHeight:1.45, marginBottom:"0.5rem" }}>{m.desc}</div>

                {/* Solar badge */}
                {solar.map((ev,j) => {
                  const se = SOLAR_EVENTS[ev.type];
                  return (
                    <div key={j} style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:se.bg, border:`1px solid ${se.border}`, borderRadius:"6px", padding:"0.2rem 0.45rem", marginBottom:"0.35rem" }}>
                      <span style={{ fontSize:"0.85rem" }}>{se.symbol}</span>
                      <span style={{ fontSize:"0.56rem", color:se.color, fontWeight:500 }}>{se.label}</span>
                    </div>
                  );
                })}

                {/* Moon phase icons */}
                <div style={{ display:"flex", gap:"0.3rem", alignItems:"center" }}>
                  {astros.filter(ev=>!SOLAR_EVENTS[ev.type]).map((ev,j) => (
                    <span key={j} style={{ fontSize:"0.75rem", color:ASTRO_COLORS[ev.type] }} title={ev.label}>{ASTRO_ICONS[ev.type]}</span>
                  ))}
                </div>
              </div>

              {/* Right: big decorative symbol */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                paddingLeft:"0.6rem",
                fontSize:"2.8rem",
                opacity: isCurrent ? 1 : 0.18,
                animation: isCurrent ? "symbolFloat 4s ease-in-out infinite" : "none",
                transition:"opacity 0.2s",
                flexShrink:0,
                userSelect:"none",
              }}>
                {m.symbol}
              </div>

              {isCurrent && (
                <div style={{ position:"absolute", top:"0.55rem", right:"0.55rem", fontSize:"0.48rem", letterSpacing:"0.1em", background:T.goldBg, color:T.gold, border:`1px solid ${T.goldBorder}`, borderRadius:"2rem", padding:"0.08rem 0.4rem" }}>NOW</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hollow Day */}
      <div style={{ background:"rgba(255,255,255,0.6)", border:`1px dashed ${T.border}`, borderRadius:"10px", padding:"0.75rem", textAlign:"center", color:T.textSoft, fontSize:"0.62rem", letterSpacing:"0.1em" }}>
        ✦ &nbsp; THE HOLLOW DAY · Dec 24 · Outside all moonths · The breath between years &nbsp; ✦
      </div>
    </div>
  );
}

// ─── MOONTH VIEW ──────────────────────────────────────────────────────────────
function MoonthView({ calYear, moonthIdx, onPrev, onNext }) {
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

  const Arr = ({onClick,disabled,ch}) => (
    <button onClick={onClick} disabled={disabled} style={{
      background:"transparent", border:`1px solid ${disabled?T.borderSoft:T.border}`,
      color:disabled?T.borderSoft:T.textMid, width:38,height:38,borderRadius:"50%",
      cursor:disabled?"default":"pointer", fontSize:"1.2rem", fontFamily:"inherit", transition:"all 0.15s",
    }}>{ch}</button>
  );

  return (
    <div style={{ maxWidth:700, margin:"0 auto", animation:"fadeUp 0.35s ease" }}>

      {/* Solar event banner */}
      {solarThisMoonth.map((ev,i) => {
        const se = SOLAR_EVENTS[ev.type];
        return (
          <div key={i} style={{ background:se.bg, border:`2px solid ${se.border}`, borderRadius:"16px", padding:"1.5rem 1.5rem 1.2rem", marginBottom:"1.5rem", textAlign:"center", animation:"solarPulse 3s ease infinite", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize:"3.5rem", lineHeight:1, marginBottom:"0.45rem" }}>{se.symbol}</div>
            <div style={{ fontSize:"1.05rem", fontWeight:500, color:se.color, letterSpacing:"0.06em", marginBottom:"0.3rem" }}>{se.label}</div>
            <div style={{ fontSize:"0.7rem", color:se.color, opacity:0.8, fontStyle:"italic", marginBottom:"0.4rem" }}>{se.note}</div>
            <div style={{ fontSize:"0.6rem", color:se.color, opacity:0.65, letterSpacing:"0.05em" }}>
              Day {ev.dayNum} · {ev.greg.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
        );
      })}

      {/* Moonth header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.2rem" }}>
        <Arr onClick={onPrev} disabled={moonthIdx===0}  ch="‹" />
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"0.52rem", letterSpacing:"0.2em", color:T.textSoft, marginBottom:"0.2rem" }}>MOONTH {m.num}</div>
          <div style={{ fontSize:"2rem", marginBottom:"0.1rem" }}>{m.symbol}</div>
          <div style={{ fontSize:"clamp(1.3rem,4vw,1.9rem)", color:T.gold, fontWeight:400, letterSpacing:"0.04em" }}>{m.name}</div>
          <div style={{ fontSize:"0.66rem", color:T.textMid, fontStyle:"italic", marginTop:"0.15rem" }}>{m.desc}</div>
        </div>
        <Arr onClick={onNext} disabled={moonthIdx===12} ch="›" />
      </div>

      {/* Day column headers — Moon Day highlighted */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.2rem", marginBottom:"0.2rem" }}>
        {DAYS_SHORT.map((d,i) => (
          <div key={d} style={{
            textAlign:"center", fontSize:"0.5rem", padding:"0.2rem 0",
            color: i===0 ? T.gold : T.textSoft,
            fontWeight: i===0 ? 700 : 400,
            letterSpacing:"0.04em",
            borderBottom: i===0 ? `2px solid ${T.goldBorder}` : `1px solid transparent`,
          }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.2rem" }}>
        {days.map(({dayNum,greg,astro,weekDay,isToday}) => {
          const hasSolar  = astro.some(ev=>SOLAR_EVENTS[ev.type]);
          const solarEv   = astro.find(ev=>SOLAR_EVENTS[ev.type]);
          const se        = solarEv ? SOLAR_EVENTS[solarEv.type] : null;
          const isMoonDay = weekDay===0;

          return (
            <div key={dayNum} className="dcard" style={{
              background: hasSolar ? se.bg : isToday ? T.goldBg : T.surface,
              border:`1px solid ${hasSolar ? se.border : isToday ? T.goldBorder : isMoonDay ? T.skyBorder : T.borderSoft}`,
              borderRadius:"8px", padding:"0.4rem 0.1rem",
              textAlign:"center", minHeight:58,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.07rem",
              transition:"all 0.14s",
              animation:isToday?"todayRing 2.5s ease infinite":"none",
              boxShadow:hasSolar?"0 2px 10px rgba(0,0,0,0.08)":"none",
            }}>
              {hasSolar && <div style={{ fontSize:"1rem", lineHeight:1 }}>{se.symbol}</div>}
              <div style={{ fontSize:"0.85rem", color:hasSolar?se.color:isToday?T.gold:isMoonDay?T.sky:T.text, fontWeight:(hasSolar||isToday||isMoonDay)?600:400 }}>
                {dayNum}
              </div>
              <div style={{ fontSize:"0.44rem", color:hasSolar?se.color:T.textSoft, opacity:0.8 }}>
                {greg.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
              </div>
              {astro.filter(ev=>!SOLAR_EVENTS[ev.type]).map((ev,i) => (
                <span key={i} style={{ fontSize:"0.68rem", color:ASTRO_COLORS[ev.type] }} title={ev.label}>{ASTRO_ICONS[ev.type]}</span>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign:"center", fontSize:"0.54rem", color:T.textSoft, marginTop:"0.6rem", fontStyle:"italic" }}>
        Every moonth begins on Moon Day — the first column always marks the start of the week.
      </div>

      {/* Moon phases list */}
      {days.some(d=>d.astro.some(ev=>!SOLAR_EVENTS[ev.type])) && (
        <div style={{ marginTop:"1.3rem", background:T.surface, border:`1px solid ${T.border}`, borderRadius:"12px", padding:"1rem 1.2rem" }}>
          <div style={{ fontSize:"0.55rem", letterSpacing:"0.15em", color:T.textSoft, marginBottom:"0.7rem" }}>MOON PHASES THIS MOONTH</div>
          {days.filter(d=>d.astro.some(ev=>!SOLAR_EVENTS[ev.type])).map(({dayNum,greg,astro}) =>
            astro.filter(ev=>!SOLAR_EVENTS[ev.type]).map((ev,i) => (
              <div key={`${dayNum}-${i}`} style={{ display:"flex", alignItems:"center", gap:"0.7rem", padding:"0.4rem 0", borderBottom:`1px solid ${T.borderSoft}` }}>
                <span style={{ fontSize:"0.95rem", color:ASTRO_COLORS[ev.type], width:20, textAlign:"center" }}>{ASTRO_ICONS[ev.type]}</span>
                <span style={{ fontSize:"0.73rem", color:T.text }}>{ev.label}</span>
                <span style={{ fontSize:"0.6rem", color:T.textSoft, marginLeft:"auto" }}>Day {dayNum} · {greg.toLocaleDateString("en-GB",{day:"numeric",month:"long"})}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── CONVERTER ────────────────────────────────────────────────────────────────
function ConverterView({ input, setInput, result, onConvert }) {
  return (
    <div style={{ maxWidth:440, margin:"0 auto", animation:"fadeUp 0.35s ease" }}>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"16px", padding:"2rem", textAlign:"center", boxShadow:`0 2px 14px ${T.shadow}` }}>
        <div style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:T.textSoft, marginBottom:"1.5rem" }}>GREGORIAN → CALENDAR CONVERTER</div>
        <input type="date" value={input} onChange={e=>setInput(e.target.value)} style={{
          background:T.bg, border:`1px solid ${T.border}`, color:T.text,
          padding:"0.68rem 1rem", borderRadius:"8px", fontSize:"0.88rem",
          width:"100%", boxSizing:"border-box", marginBottom:"0.9rem", outline:"none", fontFamily:"inherit",
        }}/>
        <button onClick={onConvert} style={{
          background:T.goldBg, border:`1px solid ${T.goldBorder}`, color:T.gold,
          padding:"0.68rem 2rem", borderRadius:"2rem", cursor:"pointer",
          fontSize:"0.76rem", letterSpacing:"0.1em", fontFamily:"inherit", width:"100%", transition:"all 0.17s",
        }}>Convert Date</button>
        {result && (
          <div style={{ marginTop:"1.4rem", padding:"1rem", background:T.goldBg, border:`1px solid ${T.goldBorder}`, borderRadius:"10px", fontSize:"0.88rem", color:T.gold, letterSpacing:"0.04em", lineHeight:1.75 }}>
            {result}
          </div>
        )}
        <div style={{ marginTop:"1.75rem", fontSize:"0.58rem", color:T.textSoft, lineHeight:2 }}>
          The calendar begins on Dec 25, 2024<br/>
          13 moonths · 28 days each · 364 days<br/>
          The Hollow Day falls on Dec 24 each year
        </div>
      </div>
    </div>
  );
}
