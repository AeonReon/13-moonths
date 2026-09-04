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
  "rising-sun":    "/moonths/rising-sun.jpg",
  "morning-dew":   "/moonths/morning-dew.jpg",
  "waking-tree":   "/moonths/waking-tree.jpg",
  "open-door":     "/moonths/open-door.jpg",
  "the-hive":      "/moonths/the-hive.jpg",
  "pixie-tricks":  "/moonths/pixie-tricks.jpg",
  "high-heaven":   "/moonths/high-heaven.jpg",
  "golden-gate":   "/moonths/golden-gate.jpg",
  "falling-vine":  "/moonths/falling-vine.jpg",
  "dark-fen":      "/moonths/dark-fen.jpg",
  "forgiven":      "/moonths/forgiven.jpg",
  "wolves-delve":  "/moonths/wolves-delve.jpg",
  "winters-dream": "/moonths/winters-dream.jpg",
};

// Longer "about this moonth" copy for the pop-up cards (slug → paragraph).
const ABOUT = {
  "rising-sun":    "The year's first moonth, born just after the winter solstice as the light begins its slow return. Days are short and cold, but every sunrise now climbs a little higher than the last. A time for quiet beginnings and small intentions.",
  "morning-dew":   "Deep winter stillness. The world holds its breath under frost and mist, and the first moisture beads on the grass at dawn. The nights are long and dark — the best of the whole year for watching the stars.",
  "waking-tree":   "The sap begins to rise and buds swell on bare branches. Life is stirring underground long before it shows above. A moonth of patience, as the earth quietly prepares to wake.",
  "open-door":     "The spring equinox falls here, when day and night stand equal and the year swings open. From now until midsummer the light wins a little more each day. A threshold moonth — step through it.",
  "the-hive":      "Everything comes alive. Bees return to the flowers, the days stretch long, and the whole countryside hums with activity. A moonth of energy, growth and abundance.",
  "pixie-tricks":  "High, wild spring. Old folklore said this was when spirits and pixies were most at play — a gentle reminder to stay alert and keep your wits. The living world is at its greenest and most mischievous.",
  "high-heaven":   "The summer solstice — the longest day and the peak of the sun's power. The sky sits at its highest and brightest. For thousands of years this was a moonth of bonfires and celebration.",
  "golden-gate":   "The first harvest begins and the fields turn to gold. Abundance stands at the threshold, ready to be gathered in. A moonth of gratitude and gathering.",
  "falling-vine":  "The last sweetness of the year. Fruit ripens and drops, the vines hang heavy, and the light turns amber. Summer is beginning to let go.",
  "dark-fen":      "Mist settles over the marshes and the world begins to turn inward. The autumn equinox falls near here, tipping the balance toward the dark. A reflective, quieting moonth.",
  "forgiven":      "The trees stand bare against an open sky and the year asks to be released. A moonth of letting go, of forgiveness, and of clear, cold nights.",
  "wolves-delve":  "Deep autumn turning to winter. Creatures dig in and the earth seems to hold its breath. The nights grow long and the stars turn sharp and bright.",
  "winters-dream": "The final moonth, dreaming toward the year's end and the winter solstice. The world sleeps under frost, and the longest night waits — after which the light returns and the wheel turns again.",
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

// The one significant sky thing that headlines a moonth, if any.
function moonthSpecial(i) {
  const big = skyEventsForMoonth(i).sort((a,b)=>(SKY_PRIORITY[b.type]||0)-(SKY_PRIORITY[a.type]||0))[0];
  if (big) return big.title;
  const evs = astrosForMoonth(1, i);
  const solar = evs.find(e => SOLAR_EVENTS[e.type]);
  if (solar) return SOLAR_EVENTS[solar.type].label;
  const fulls = evs.filter(e => e.type === "full_moon").length;
  if (fulls >= 2) return "Two full moons";
  return null;
}

const TODAY_GREG = new Date();
const TODAY_CAL  = gregorianToCalendar(TODAY_GREG);

// ─── MOON PHASE (accurate to ~a day) ──────────────────────────────────────────
const SYNODIC = 29.530588853;                  // days, new moon → new moon
const NEW_MOON_REF = new Date(2026,0,18);       // a known new moon
function moonPhase(date) {
  const days = (date - NEW_MOON_REF) / 86400000;
  let frac = (days % SYNODIC) / SYNODIC;
  if (frac < 0) frac += 1;
  const illum = Math.round((1 - Math.cos(2*Math.PI*frac)) / 2 * 100);
  let name, emoji, invite;
  if      (frac < 0.03 || frac > 0.97) { name="New Moon";        emoji="🌑"; invite="The moon is dark tonight — the perfect night to leave the lights behind and let the stars come out."; }
  else if (frac < 0.22)                { name="Waxing Crescent"; emoji="🌒"; invite="A slim crescent follows the sun down. Catch it low in the west just after dark."; }
  else if (frac < 0.28)                { name="First Quarter";   emoji="🌓"; invite="A half-lit moon sits high in the evening — easy to find the moment it gets dark."; }
  else if (frac < 0.47)                { name="Waxing Gibbous";  emoji="🌔"; invite="The moon is filling out and bright in the evening sky, climbing higher each night."; }
  else if (frac < 0.53)                { name="Full Moon";       emoji="🌕"; invite="Full moon tonight — it rises around sunset and shines all night. The one night a month you can't miss it."; }
  else if (frac < 0.72)                { name="Waning Gibbous";  emoji="🌖"; invite="A bright moon rises later in the evening and lingers into the morning."; }
  else if (frac < 0.78)                { name="Last Quarter";    emoji="🌗"; invite="A half moon rises around midnight and greets the early risers."; }
  else                                 { name="Waning Crescent"; emoji="🌘"; invite="A thin crescent hangs in the east before dawn. Dark evenings make it a fine night to hunt for stars."; }
  return { frac, illum, name, emoji, invite };
}

// ─── DAILY SKY WISDOM (rotates by day; framed as perspective, never fact) ──────
const WISDOM = [
  "Vitruvius taught that an architect must understand astronomy and the sky — the built world was meant to answer to the heavens.",
  "For most of human history, the night sky was the first calendar, the first clock, and the first map.",
  "Sailors once crossed whole oceans with nothing but the stars to steer by. The sky knew the way home.",
  "Farmers read the moon to time the planting and the harvest. The ground listened to the sky.",
  "Every culture that ever lived looked up and told stories about the same handful of lights.",
  "The full moon has pulled the tides for longer than there have been eyes to watch it.",
  "Step outside tonight — the same moon your grandparents watched is still there, waiting.",
  "The starlight you see tonight set out on its journey long before you were born.",
  "A clear night sky has looked almost the same for ten thousand years.",
  "The word 'disaster' comes from old words meaning 'bad star.' We once believed the sky shaped our days.",
  "Before clocks, people knew the hour by the height of the sun and the turn of the stars.",
  "The moon takes about twenty-nine nights to go from dark to full and back — one moonth, the oldest measure of time.",
  "Ancient builders aligned their temples to the sunrise on the longest and shortest days of the year.",
  "You don't need a telescope to begin. You only need to step outside and look up.",
  "The sky is the one ceiling everyone on earth shares.",
  "Find where the moon rises tonight — by tomorrow it will have moved. Nothing up there stands still.",
  "Travellers found north by a single steady star while everything else wheeled around it.",
  "A shooting star is a speck of dust meeting the sky at enormous speed — a whole show from something smaller than a seed.",
  "The old festivals were tied to the sky: the solstices, the equinoxes, the first full moon after.",
  "On a truly dark night, far from town, the whole river of the galaxy returns.",
  "To look up at night is to look back in time — you are seeing the past, arriving now.",
  "Our ancestors had no more hours than us. They simply spent some of them looking up.",
  "The moon has no light of its own — every bit of moonlight is sunlight, taking the long way round.",
  "Whatever you believe about the sky, it starts the same way: go outside, and lift your head.",
];
function dailyWisdom(date) {
  const dayIndex = Math.floor(date / 86400000);
  return WISDOM[((dayIndex % WISDOM.length) + WISDOM.length) % WISDOM.length];
}

// Fixed-date sky traditions (safe, calendar-based) for the intrigue card.
const PORTAL_DAYS = [
  { m:1,  d:1,  title:"Imbolc",       line:"A cross-quarter day between winter and spring. Old traditions lit candles and fires to call back the light. Notice how the evenings are already lengthening." },
  { m:4,  d:1,  title:"Beltane",      line:"A cross-quarter day welcoming the summer half of the year. Traditionally a night of bonfires and celebration. A good evening to be outdoors." },
  { m:7,  d:1,  title:"Lughnasadh",   line:"A cross-quarter day marking the first harvest. For centuries it was a time of gathering and thanks. Notice the turn toward autumn." },
  { m:7,  d:8,  title:"The Lion's Gate", line:"The 8/8 portal. Many spiritual traditions treat today as a peak of bright, energising sky energy. Believe it or not, it's a good excuse to step out and look up tonight." },
  { m:9,  d:31, title:"Samhain",      line:"A cross-quarter day and the old new year — the turn into the dark half of the year. Traditionally a night to remember those who came before." },
];

function whatsStirring(date) {
  const near = (target, tol) => Math.abs((date - target)/86400000) <= tol;
  // 1. full / new moon within a day
  for (const ev of ASTRO_EVENTS) {
    if (ev.type==="full_moon" && near(ev.date,1))
      return { title:"Full Moon", line:"Traditions the world over link the full moon to restlessness, vivid dreams and heightened feeling. Whether or not that's you, it's the best night of the month to step out and watch it blaze — notice how you feel." };
    if (ev.type==="new_moon" && near(ev.date,1))
      return { title:"New Moon", line:"The sky's darkest night. Many traditions treat it as a moment to pause and set an intention for what you want to grow. With no moonlight, it's also the best night for stars." };
  }
  // 2. solstice / equinox within two days
  for (const ev of ASTRO_EVENTS) {
    if (SOLAR_EVENTS[ev.type] && near(ev.date,2)) {
      const se = SOLAR_EVENTS[ev.type];
      return { title:se.label, line:`${se.note} For thousands of years this turn of the year was marked with fire, feasting and gathering.` };
    }
  }
  // 3. fixed-date sky tradition within a day
  for (const p of PORTAL_DAYS) {
    const t = new Date(date.getFullYear(), p.m, p.d);
    if (near(t,1)) return { title:p.title, line:p.line };
  }
  // 4. quiet night
  return { title:"A Quiet Sky", line:"No big events tonight — which makes it perfect for the simplest thing. Go outside, let your eyes adjust for a few minutes, and just watch for a while." };
}

function nextSkyEvent(date) {
  const upcoming = ASTRO_EVENTS
    .filter(ev => ev.date > date)
    .sort((a,b) => a.date - b.date)[0];
  if (!upcoming) return null;
  const days = Math.ceil((upcoming.date - date)/86400000);
  return { label:upcoming.label, type:upcoming.type, icon:ASTRO_ICONS[upcoming.type], days };
}

// ─── MAJOR SKY EVENTS 2026 (verified: seasky.org, timeanddate, RMG Greenwich) ──
// The "sensations" sky-watchers track, beyond the routine moon phases.
const SKY_EVENTS = [
  { d:[2026,0,3],   type:"supermoon",     title:"Supermoon — Wolf Moon",           note:"The year's first full moon at its closest, looking a little larger and brighter than usual." },
  { d:[2026,0,10],  type:"opposition",    title:"Jupiter at Opposition",           note:"Jupiter stands opposite the Sun, at its biggest and brightest — up all night, unmistakable." },
  { d:[2026,1,17],  type:"eclipse_solar", title:"Annular Solar Eclipse",           note:"A 'ring of fire' eclipse, visible only from Antarctica and the far southern ocean.", region:"far" },
  { d:[2026,2,3],   type:"eclipse_lunar", title:"Total Lunar Eclipse",             note:"The Moon turns deep red — visible from eastern Asia, Australia, the Pacific and North America.", region:"far" },
  { d:[2026,4,31],  type:"blue_moon",     title:"Blue Moon",                       note:"The second full moon in a single Gregorian month — the original 'once in a blue moon'." },
  { d:[2026,5,8],   type:"conjunction",   title:"Venus meets Jupiter",             note:"The two brightest planets pair up close in the western evening sky — a stunning sight." },
  { d:[2026,7,12],  type:"eclipse_solar", title:"Solar Eclipse over Ireland",      note:"The first total eclipse over Europe since 1999 (total in Iceland & Spain). From Ireland it's a deep partial — up to about 96% of the Sun covered, best around 7pm, ending near 8pm. Never look at the Sun without certified eclipse glasses.", region:"ireland" },
  { d:[2026,7,15],  type:"elongation",    title:"Venus at its Evening Best",       note:"Venus reaches its greatest distance from the Sun (46°) — the brilliant 'evening star', shining high after sunset for weeks." },
  { d:[2026,7,28],  type:"eclipse_lunar", title:"Partial Lunar Eclipse",           note:"Part of the full Moon slips into Earth's shadow — visible from Europe, Africa and the Americas.", region:"europe" },
  { d:[2026,8,25],  type:"opposition",    title:"Neptune at Opposition",           note:"Distant Neptune is at its closest and brightest for the year — a telescope or binocular target." },
  { d:[2026,9,4],   type:"opposition",    title:"Saturn at Opposition",            note:"Saturn stands opposite the Sun, up all night at its brightest — the best night of the year for its rings." },
  { d:[2026,10,15], type:"conjunction",   title:"Mars meets Jupiter",              note:"Mars and Jupiter pass just 1° apart in the pre-dawn sky — a close, colourful pairing." },
  { d:[2026,10,24], type:"supermoon",     title:"Supermoon — Beaver Moon",         note:"A close, large full moon, brighter than average." },
  { d:[2026,10,25], type:"opposition",    title:"Uranus at Opposition",            note:"Uranus is at its closest — just visible to sharp eyes under a dark sky, easy in binoculars." },
  { d:[2026,11,23], type:"supermoon",     title:"Supermoon — Cold Moon",           note:"The closest, biggest, brightest full moon of the whole year, on Christmas Eve." },
];
const SKY_META = {
  eclipse_solar:{ icon:"🌘", color:"#e0714a", tag:"Eclipse" },
  eclipse_lunar:{ icon:"🌕", color:"#c0503a", tag:"Eclipse" },
  supermoon:    { icon:"🌝", color:"#e8b44c", tag:"Supermoon" },
  blue_moon:    { icon:"🌙", color:"#6ab8f0", tag:"Blue Moon" },
  opposition:   { icon:"🪐", color:"#7db6d8", tag:"Opposition" },
  conjunction:  { icon:"💫", color:"#a071c4", tag:"Conjunction" },
  elongation:   { icon:"✨", color:"#f0c541", tag:"Best viewing" },
};
const SKY_PRIORITY = { eclipse_solar:6, eclipse_lunar:6, supermoon:4, blue_moon:4, conjunction:3, opposition:2, elongation:1 };
const skyEventDate = e => new Date(e.d[0], e.d[1], e.d[2]);
const sameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
function skyEventsOn(date) { return SKY_EVENTS.filter(e => sameDay(skyEventDate(e), date)); }
function headlineEvent(date) {
  const on = skyEventsOn(date);
  if (!on.length) return null;
  on.sort((a,b) => (SKY_PRIORITY[b.type]||0)-(SKY_PRIORITY[a.type]||0));
  return on[0];
}
function skyEventsForMoonth(i) {
  return SKY_EVENTS.filter(e => { const c = gregorianToCalendar(skyEventDate(e)); return c && !c.isHollow && c.moonthIdx===i; });
}
// Next notable event = big SKY_EVENTS + solstices/equinoxes (skips routine moon phases).
function nextNotable(date) {
  const pool = [
    ...SKY_EVENTS.map(e => ({ date:skyEventDate(e), label:e.title, icon:SKY_META[e.type].icon })),
    ...ASTRO_EVENTS.filter(e => SOLAR_EVENTS[e.type]).map(e => ({ date:e.date, label:e.label, icon:ASTRO_ICONS[e.type] })),
  ];
  const up = pool.filter(e => e.date > date).sort((a,b) => a.date-b.date)[0];
  if (!up) return null;
  return { label:up.label, icon:up.icon, days:Math.ceil((up.date - startOfDay(date))/86400000) };
}

// ─── SUN & TWILIGHT TIMES (standard sunrise/sunset algorithm) ─────────────────
const d2r = d => d*Math.PI/180, r2d = r => r*180/Math.PI;
const norm = (v,max) => { v%=max; return v<0 ? v+max : v; };
// Returns a Date for the given solar event, or null (never rises/sets that day).
function sunEvent(date, lat, lng, zenith, rising) {
  const startUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const N = Math.floor((startUTC - Date.UTC(date.getFullYear(),0,0)) / 86400000);
  const lngHour = lng / 15;
  const t = N + ((rising ? 6 : 18) - lngHour) / 24;
  const M = 0.9856*t - 3.289;
  let L = norm(M + 1.916*Math.sin(d2r(M)) + 0.020*Math.sin(d2r(2*M)) + 282.634, 360);
  let RA = norm(r2d(Math.atan(0.91764*Math.tan(d2r(L)))), 360);
  RA += (Math.floor(L/90)*90) - (Math.floor(RA/90)*90);   // same quadrant as L
  RA /= 15;
  const sinDec = 0.39782*Math.sin(d2r(L));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(d2r(zenith)) - sinDec*Math.sin(d2r(lat))) / (cosDec*Math.cos(d2r(lat)));
  if (cosH > 1 || cosH < -1) return null;
  let H = (rising ? 360 - r2d(Math.acos(cosH)) : r2d(Math.acos(cosH))) / 15;
  const UT = norm(H + RA - 0.06571*t - 6.622 - lngHour, 24);
  return new Date(startUTC + UT*3600000);
}
function skyTimes(date, lat, lng) {
  const sunset  = sunEvent(date, lat, lng, 90.833, false);
  const sunrise = sunEvent(date, lat, lng, 90.833, true);
  let dark = null;                       // "stars out" ≈ nautical dusk, civil fallback in high summer
  for (const z of [102, 96]) { const d = sunEvent(date, lat, lng, z, false); if (d) { dark = d; break; } }
  return { sunrise, sunset, dark };
}
const hhmm = d => d ? d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) : null;

// ─── LOOK-UP STREAK (localStorage) ────────────────────────────────────────────
const dstr = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
function loadLookups() { try { return JSON.parse(localStorage.getItem("moonths-lookups") || "[]"); } catch { return []; } }
function streakOf(list) {
  const set = new Set(list); let n = 0; const d = new Date(TODAY_GREG);
  if (!set.has(dstr(d))) d.setDate(d.getDate()-1);       // allow today-not-yet-logged
  while (set.has(dstr(d))) { n++; d.setDate(d.getDate()-1); }
  return n;
}

// ─── PLANET POSITIONS (Schlyter's method — validated vs the Sun & known retrogrades) ─
const sind = x => Math.sin(d2r(x)), cosd = x => Math.cos(d2r(x));
const asind = x => r2d(Math.asin(x)), atan2d = (y,x) => r2d(Math.atan2(y,x));
const rev360 = x => { x%=360; return x<0 ? x+360 : x; };
function dayNumber(date) {
  const Y=date.getUTCFullYear(), M=date.getUTCMonth()+1, D=date.getUTCDate();
  const UT=date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600;
  return 367*Y - Math.floor(7*(Y+Math.floor((M+9)/12))/4) + Math.floor(275*M/9) + D - 730530 + UT/24;
}
function sunRect(d) {
  const w=282.9404+4.70935e-5*d, e=0.016709-1.151e-9*d, M=rev360(356.0470+0.9856002585*d);
  let E=M + r2d(1)*e*sind(M)*(1+e*cosd(M));
  for (let k=0;k<12;k++){ const dE=(E - r2d(1)*e*sind(E) - M)/(1 - e*cosd(E)); E-=dE; if(Math.abs(dE)<5e-4)break; }
  const xv=cosd(E)-e, yv=Math.sqrt(1-e*e)*sind(E);
  const v=atan2d(yv,xv), r=Math.sqrt(xv*xv+yv*yv), lon=rev360(v+w);
  return { xs:r*cosd(lon), ys:r*sind(lon), ecl:23.4393-3.563e-7*d, Ls:rev360(w+M) };
}
const PLANET_EL = {
  Mercury:d=>({N:48.3313+3.24587e-5*d,i:7.0047+5.0e-8*d,w:29.1241+1.01444e-5*d,a:0.387098,e:0.205635+5.59e-10*d,M:168.6562+4.0923344368*d}),
  Venus:  d=>({N:76.6799+2.4659e-5*d,i:3.3946+2.75e-8*d,w:54.8910+1.38374e-5*d,a:0.723330,e:0.006773-1.302e-9*d,M:48.0052+1.6021302244*d}),
  Mars:   d=>({N:49.5574+2.11081e-5*d,i:1.8497-1.78e-8*d,w:286.5016+2.92961e-5*d,a:1.523688,e:0.093405+2.516e-9*d,M:18.6021+0.5240207766*d}),
  Jupiter:d=>({N:100.4542+2.76854e-5*d,i:1.3030-1.557e-7*d,w:273.8777+1.64505e-5*d,a:5.20256,e:0.048498+4.469e-9*d,M:19.8950+0.0830853001*d}),
  Saturn: d=>({N:113.6634+2.3898e-5*d,i:2.4886-1.081e-7*d,w:339.3939+2.97661e-5*d,a:9.55475,e:0.055546-9.499e-9*d,M:316.9670+0.0334442282*d}),
};
function planetPos(name,d) {
  const {N,i,w,a,e,M}=PLANET_EL[name](d);
  let E=M + r2d(1)*e*sind(M)*(1+e*cosd(M));
  for (let k=0;k<12;k++){ const dE=(E - r2d(1)*e*sind(E) - M)/(1 - e*cosd(E)); E-=dE; if(Math.abs(dE)<5e-4)break; }
  const xv=a*(cosd(E)-e), yv=a*Math.sqrt(1-e*e)*sind(E);
  const v=atan2d(yv,xv), r=Math.sqrt(xv*xv+yv*yv);
  const xh=r*(cosd(N)*cosd(v+w)-sind(N)*sind(v+w)*cosd(i));
  const yh=r*(sind(N)*cosd(v+w)+cosd(N)*sind(v+w)*cosd(i));
  const zh=r*(sind(v+w)*sind(i));
  const s=sunRect(d), xg=xh+s.xs, yg=yh+s.ys, zg=zh, ecl=s.ecl;
  const xe=xg, ye=yg*cosd(ecl)-zg*sind(ecl), ze=yg*sind(ecl)+zg*cosd(ecl);
  return { RA:rev360(atan2d(ye,xe)), Dec:atan2d(ze,Math.sqrt(xe*xe+ye*ye)), lonEcl:rev360(atan2d(yg,xg)), Ls:s.Ls };
}
function altAzOf(RA,Dec,date,lat,lng,Ls) {
  const UT=date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600;
  const LST=rev360(Ls+180)/15 + UT + lng/15, HA=rev360(LST*15-RA);
  const x=cosd(HA)*cosd(Dec), z=sind(Dec), y=sind(HA)*cosd(Dec);
  const xhor=x*sind(lat)-z*cosd(lat), zhor=x*cosd(lat)+z*sind(lat);
  return { alt:asind(zhor), az:rev360(atan2d(y,xhor)+180) };
}
const PLANETS = {
  Mercury:{glyph:"☿", desc:"elusive and low", color:"#c9a86a"},
  Venus:  {glyph:"♀", desc:"brilliant", color:"#f0d9a0"},
  Mars:   {glyph:"♂", desc:"reddish", color:"#e0714a"},
  Jupiter:{glyph:"♃", desc:"brilliant white", color:"#e8d5a8"},
  Saturn: {glyph:"♄", desc:"golden and steady", color:"#d8c07a"},
};
const COMPASS = ["north","north-east","east","south-east","south","south-west","west","north-west"];
// Scan sunset→sunrise; return each naked-eye planet that climbs above the horizon, with its best moment.
function planetsTonight(date, lat, lng) {
  const sunset = sunEvent(date, lat, lng, 90.833, false);
  const sunrise = sunEvent(new Date(date.getTime()+86400000), lat, lng, 90.833, true);
  if (!sunset || !sunrise) return [];
  const out = [];
  for (const name of Object.keys(PLANETS)) {
    let best = { alt:-90 };
    for (let t=sunset.getTime()+1800000; t<sunrise.getTime(); t+=1800000) {
      const inst=new Date(t), dd=dayNumber(inst), pp=planetPos(name,dd), aa=altAzOf(pp.RA,pp.Dec,inst,lat,lng,pp.Ls);
      if (aa.alt>best.alt) best={ alt:aa.alt, az:aa.az, t:inst };
    }
    if (best.alt > 8) {
      const dd=dayNumber(date); let dl=planetPos(name,dd+2).lonEcl-planetPos(name,dd).lonEcl;
      if (dl>180) dl-=360; if (dl<-180) dl+=360;
      const h=best.t.getHours();
      const when = (h>=17&&h<23) ? "this evening" : (h>=4&&h<9) ? "before dawn" : "late at night";
      const height = best.alt<22 ? "low in the" : best.alt>62 ? "high in the" : "in the";
      out.push({ name, ...PLANETS[name], alt:Math.round(best.alt), where:`${height} ${COMPASS[Math.round(best.az/45)%8]}`, when, retro:dl<0 });
    }
  }
  return out.sort((a,b)=>b.alt-a.alt);
}

// ─── METEOR SHOWERS (well-established annual showers) ──────────────────────────
const METEOR_SHOWERS = [
  { name:"Quadrantids",    from:[11,28], to:[0,12],  peak:[0,3],   zhr:110, best:"before dawn" },
  { name:"Lyrids",         from:[3,16],  to:[3,25],  peak:[3,22],  zhr:18,  best:"before dawn" },
  { name:"Eta Aquariids",  from:[3,19],  to:[4,28],  peak:[4,6],   zhr:50,  best:"before dawn" },
  { name:"Delta Aquariids",from:[6,12],  to:[7,23],  peak:[6,30],  zhr:25,  best:"after midnight" },
  { name:"Perseids",       from:[6,17],  to:[7,24],  peak:[7,12],  zhr:100, best:"after midnight" },
  { name:"Orionids",       from:[9,2],   to:[10,7],  peak:[9,21],  zhr:20,  best:"before dawn" },
  { name:"Leonids",        from:[10,6],  to:[10,30], peak:[10,17], zhr:15,  best:"before dawn" },
  { name:"Geminids",       from:[11,4],  to:[11,20], peak:[11,14], zhr:120, best:"after 10pm" },
  { name:"Ursids",         from:[11,17], to:[11,26], peak:[11,22], zhr:10,  best:"before dawn" },
];
function activeShower(date) {
  const y=date.getFullYear();
  const inWin = s => {
    const from=new Date(y, s.from[0], s.from[1]);
    let to=new Date(y, s.to[0], s.to[1]);
    if (s.to[0] < s.from[0]) { // wraps year-end
      if (date >= from) to=new Date(y+1, s.to[0], s.to[1]);
      else return new Date(y-1, s.from[0], s.from[1]) <= date && date <= new Date(y, s.to[0], s.to[1]);
    }
    return date>=from && date<=to;
  };
  const active = METEOR_SHOWERS.filter(inWin);
  if (!active.length) return null;
  const withPeak = active.map(s => {
    let pk=new Date(y, s.peak[0], s.peak[1]);
    if (s.to[0] < s.from[0] && s.peak[0] <= s.to[0] && date.getMonth() >= s.from[0]) pk=new Date(y+1, s.peak[0], s.peak[1]);
    return { ...s, daysToPeak: Math.round((pk-new Date(date.getFullYear(),date.getMonth(),date.getDate()))/86400000) };
  });
  withPeak.sort((a,b)=>Math.abs(a.daysToPeak)-Math.abs(b.daysToPeak));
  return withPeak[0];
}

// ─── WHERE WE ARE IN THE SKY (sun sign vs real constellation, season, great age) ─
function sunEclLon(date) { const s = sunRect(dayNumber(date)); return rev360(atan2d(s.ys, s.xs)); }
const ZODIAC = [["Aries","♈"],["Taurus","♉"],["Gemini","♊"],["Cancer","♋"],["Leo","♌"],["Virgo","♍"],["Libra","♎"],["Scorpio","♏"],["Sagittarius","♐"],["Capricorn","♑"],["Aquarius","♒"],["Pisces","♓"]];
function tropicalSign(date) { return ZODIAC[Math.floor(sunEclLon(date)/30)%12]; }
// The 13 constellations the Sun actually crosses (standard IAU date ranges, incl. Ophiuchus).
const SUN_CONST = [
  {name:"Capricornus",m:0,d:20},{name:"Aquarius",m:1,d:16},{name:"Pisces",m:2,d:11},
  {name:"Aries",m:3,d:18},{name:"Taurus",m:4,d:13},{name:"Gemini",m:5,d:21},
  {name:"Cancer",m:6,d:20},{name:"Leo",m:7,d:10},{name:"Virgo",m:8,d:16},
  {name:"Libra",m:9,d:30},{name:"Scorpius",m:10,d:23},{name:"Ophiuchus",m:10,d:29},
  {name:"Sagittarius",m:11,d:17},
];
function sunConstellation(date) {
  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let cur = SUN_CONST[SUN_CONST.length-1];   // Sagittarius wraps across the new year
  for (const c of SUN_CONST) { if (t >= new Date(date.getFullYear(), c.m, c.d)) cur = c; }
  return cur.name;
}
const SEASON_BY_TYPE = {
  solstice_winter:{ name:"The Kindling", span:"Winter Solstice → Spring Equinox", glyph:"❄️" },
  equinox_spring: { name:"The Greening", span:"Spring Equinox → Summer Solstice", glyph:"🌱" },
  solstice_summer:{ name:"The Ripening", span:"Summer Solstice → Autumn Equinox", glyph:"🌻" },
  equinox_autumn: { name:"The Resting",  span:"Autumn Equinox → Winter Solstice", glyph:"🍂" },
};
function currentSeason(date) {
  const past = ASTRO_EVENTS.filter(e => SOLAR_EVENTS[e.type] && e.date <= date).sort((a,b)=>b.date-a.date);
  return SEASON_BY_TYPE[past[0] ? past[0].type : "solstice_winter"];
}
// The precessional "great age" — presented as belief, never as fact.
const GREAT_AGE = { glyph:"♒", text:"Many hold that we are leaving the Age of Pisces and moving into the Age of Aquarius." };

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
          READ THE TIME FROM THE SKY
        </div>
        <h1 style={{
          margin:0, fontFamily:DISPLAY, fontSize:"clamp(1.8rem,5vw,3rem)", fontWeight:800, letterSpacing:"-0.01em",
          background:`linear-gradient(120deg, ${T.sky} 0%, ${T.gold} 55%, #e08040 100%)`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>The Sky Clock</h1>
        <div style={{ fontFamily:SANS, fontSize:"0.66rem", fontWeight:500, color:T.textSoft, marginTop:"0.35rem", letterSpacing:"0.12em" }}>
          13 moonths · 28 days · aligned to sun, moon &amp; stars
        </div>
      </header>

      <main style={{ padding:"1.5rem 1rem 5rem", maxWidth:1040, margin:"0 auto", position:"relative", zIndex:1 }}>
        {view==="today"     && <TodayView T={T} onOpenMoonth={openMoonth} />}
        {view==="grid"      && <GridView T={T} calYear={calYear} onSelectMoonth={openMoonth} onOpenToday={()=>setView("today")} />}
        {view==="year"      && <YearView T={T} calYear={calYear} onSelectMoonth={openMoonth} />}
        {view==="moonth"    && <MoonthView T={T} calYear={calYear} moonthIdx={selectedMoonth} onPrev={()=>setSelectedMoonth(m=>Math.max(0,m-1))} onNext={()=>setSelectedMoonth(m=>Math.min(12,m+1))} onBack={()=>setView("grid")} />}
        {view==="converter" && <ConverterView T={T} input={converterInput} setInput={setConverterInput} result={converterResult} onConvert={handleConverter} />}
      </main>

      {/* ── Bottom tab bar ── */}
      <BottomNav T={T} mode={mode} view={view} setView={setView} />
    </div>
  );
}

// ─── BOTTOM TAB BAR ───────────────────────────────────────────────────────────
function BottomNav({ T, mode, view, setView }) {
  const items = [
    { v:"grid",      label:"Calendar",  icon:"🗓️", match:["grid","moonth"] },
    { v:"year",      label:"Cards",     icon:"🖼️", match:["year"] },
    { v:"today",     label:"Now",       icon:"✨", match:["today"] },
    { v:"converter", label:"Convert",   icon:"🔄", match:["converter"] },
  ];
  return (
    <div style={{ position:"fixed", left:0, right:0, bottom:0, display:"flex", justifyContent:"center", padding:"0 0.75rem calc(0.6rem + env(safe-area-inset-bottom))", pointerEvents:"none", zIndex:20 }}>
      <nav style={{
        pointerEvents:"auto", display:"flex", gap:"0.25rem",
        background:mode==="dark"?"rgba(23,38,63,0.86)":"rgba(255,255,255,0.9)",
        backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
        border:`1px solid ${T.border}`, borderRadius:"2rem",
        padding:"0.35rem 0.4rem", boxShadow:T.shadow,
      }}>
        {items.map(it => {
          const active = it.match.includes(view);
          return (
            <button key={it.v} onClick={()=>setView(it.v)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:"0.1rem",
              background:active ? T.goldSoft : "transparent",
              border:`1px solid ${active ? T.gold : "transparent"}`,
              color:active ? T.gold : T.textMid,
              borderRadius:"1.5rem", padding:"0.4rem 1.1rem", cursor:"pointer",
              fontFamily:DISPLAY, fontWeight:600, fontSize:"0.62rem", letterSpacing:"0.02em",
              transition:"all 0.18s",
            }}>
              <span style={{ fontSize:"1.05rem", lineHeight:1, filter:active?"none":"grayscale(0.2)" }}>{it.icon}</span>
              {it.label}
            </button>
          );
        })}
      </nav>
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

// ─── TODAY / TONIGHT VIEW (the daily driver) ──────────────────────────────────
function TodayView({ T, onOpenMoonth }) {
  const cal    = TODAY_CAL;
  const m       = cal && !cal.isHollow ? MOONTHS[cal.moonthIdx] : null;
  const phase   = moonPhase(TODAY_GREG);
  const wisdom  = dailyWisdom(TODAY_GREG);
  const stir    = whatsStirring(TODAY_GREG);
  const next     = nextNotable(TODAY_GREG);
  const headline = headlineEvent(TODAY_GREG);
  const weekday  = DAYS_FULL[cal && !cal.isHollow ? (cal.weekDay ?? 0) : 0];

  // Location → sunset / darkness times
  const [loc, setLoc]           = useState(() => { try { const s=localStorage.getItem("moonths-loc"); return s?JSON.parse(s):null; } catch { return null; } });
  const [locState, setLocState] = useState(loc ? "ok" : "idle");
  function askLocation() {
    if (!navigator.geolocation) { setLocState("denied"); return; }
    setLocState("asking");
    navigator.geolocation.getCurrentPosition(
      p => { const l={lat:p.coords.latitude,lng:p.coords.longitude}; setLoc(l); setLocState("ok"); try{localStorage.setItem("moonths-loc",JSON.stringify(l));}catch{} },
      () => setLocState("denied"),
      { timeout:8000, maximumAge:3600000 }
    );
  }
  useEffect(() => { if (!loc && locState==="idle") askLocation(); }, []);
  const times   = loc ? skyTimes(TODAY_GREG, loc.lat, loc.lng) : null;
  const planets = loc ? planetsTonight(TODAY_GREG, loc.lat, loc.lng) : [];
  const shower  = activeShower(TODAY_GREG);
  const ourDate = m ? `${String(cal.day).padStart(2,"0")}/${String(cal.moonthIdx+1).padStart(2,"0")}/${String(cal.calYear).padStart(2,"0")}` : "—";
  const season  = currentSeason(TODAY_GREG);
  const sign    = tropicalSign(TODAY_GREG);
  const constel = sunConstellation(TODAY_GREG);

  // Look-up streak
  const [lookups, setLookups] = useState(loadLookups);
  const todayStr    = dstr(TODAY_GREG);
  const loggedToday = lookups.includes(todayStr);
  const streak      = streakOf(lookups);
  function logLookup() {
    if (loggedToday) return;
    const nextList = [...lookups, todayStr];
    setLookups(nextList);
    try { localStorage.setItem("moonths-lookups", JSON.stringify(nextList)); } catch {}
  }

  function shareTonight() {
    const txt = `Tonight: ${phase.name}, ${phase.illum}% lit. ${phase.invite}`;
    if (navigator.share) navigator.share({ title:"13 Moonths — Tonight", text:txt }).catch(()=>{});
    else { try { navigator.clipboard.writeText(txt); } catch {} }
  }

  const CardShell = ({ children, grad }) => (
    <div style={{ borderRadius:"20px", padding:"1.5px", background:grad||`linear-gradient(140deg, ${T.gold}, ${T.sky})`, boxShadow:T.shadowSm, marginBottom:"1rem" }}>
      <div style={{ background:T.card, borderRadius:"18.5px", padding:"1.1rem 1.2rem" }}>{children}</div>
    </div>
  );
  const Label = ({ children }) => (
    <div style={{ fontFamily:DISPLAY, fontSize:"0.58rem", fontWeight:600, letterSpacing:"0.16em", color:T.textSoft, marginBottom:"0.5rem" }}>{children}</div>
  );

  return (
    <div style={{ maxWidth:600, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>

      {/* Headline sky event today (eclipse, supermoon, opposition…) */}
      {headline && (
        <div style={{ borderRadius:"20px", padding:"1.8px", background:`linear-gradient(140deg, ${SKY_META[headline.type].color}, #f6c33f)`, boxShadow:T.shadow, marginBottom:"1rem", animation:"solarPulse 3s ease infinite" }}>
          <div style={{ background:"linear-gradient(165deg,#1a1020,#2a1626)", borderRadius:"18.2px", padding:"1.2rem 1.3rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.8rem" }}>
              <div style={{ fontSize:"2.4rem", filter:"drop-shadow(0 0 10px rgba(255,200,140,0.5))" }}>{SKY_META[headline.type].icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"0.56rem", fontWeight:700, letterSpacing:"0.18em", color:SKY_META[headline.type].color }}>{SKY_META[headline.type].tag.toUpperCase()} · TODAY</div>
                <div style={{ fontFamily:DISPLAY, fontSize:"1.1rem", fontWeight:700, color:"#fff", lineHeight:1.15 }}>{headline.title}</div>
              </div>
            </div>
            <div style={{ fontFamily:SANS, fontSize:"0.82rem", lineHeight:1.55, color:"rgba(240,232,236,0.92)", marginTop:"0.7rem" }}>{headline.note}</div>
          </div>
        </div>
      )}

      {/* The Sky Clock — today's date, ours big, Gregorian small */}
      <div style={{ borderRadius:"22px", padding:"1.6px", background:`linear-gradient(140deg, ${T.gold}, ${T.sky})`, boxShadow:T.shadow, marginBottom:"1rem" }}>
        <div style={{ background:T.card, borderRadius:"20.5px", padding:"1.3rem 1.2rem 1.2rem", textAlign:"center" }}>
          <div style={{ fontFamily:DISPLAY, fontSize:"0.56rem", fontWeight:600, letterSpacing:"0.2em", color:T.textSoft }}>THE SKY CLOCK · TODAY</div>
          <div style={{ fontFamily:DISPLAY, fontSize:"clamp(2.6rem,13vw,3.6rem)", fontWeight:800, letterSpacing:"0.01em", lineHeight:1.05, margin:"0.35rem 0 0.1rem",
            background:`linear-gradient(120deg, ${T.sky}, ${T.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{ourDate}</div>
          {m && (
            <button onClick={()=>onOpenMoonth(cal.moonthIdx)} style={{ background:"transparent", border:"none", cursor:"pointer", padding:0 }}>
              <span style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:700, color:T.text }}>Day {cal.day} · {m.name} · Year {cal.calYear}</span>
            </button>
          )}
          <div style={{ fontFamily:SANS, fontSize:"0.62rem", fontWeight:500, color:T.textSoft, marginTop:"0.45rem", letterSpacing:"0.03em" }}>
            {weekday} &nbsp;·&nbsp; {TODAY_GREG.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})} <span style={{ opacity:0.6 }}>(Gregorian)</span>
          </div>
        </div>
      </div>

      {/* Where we are in the sky */}
      <CardShell grad={`linear-gradient(140deg, #6ab8f0, #a071c4)`}>
        <Label>WHERE WE ARE IN THE SKY</Label>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"0.6rem", padding:"0.35rem 0", borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:"1.1rem", width:22, textAlign:"center" }}>{season.glyph}</span>
          <div style={{ flex:1 }}>
            <span style={{ fontFamily:DISPLAY, fontSize:"0.82rem", fontWeight:700, color:T.text }}>Season · {season.name}</span>
            <div style={{ fontFamily:SANS, fontSize:"0.7rem", color:T.textMid }}>{season.span}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"0.6rem", padding:"0.5rem 0", borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:"1.1rem", width:22, textAlign:"center" }}>☉</span>
          <div style={{ flex:1 }}>
            <span style={{ fontFamily:DISPLAY, fontSize:"0.82rem", fontWeight:700, color:T.text }}>The Sun · {sign[0]} {sign[1]}</span>
            <div style={{ fontFamily:SANS, fontSize:"0.7rem", color:T.textMid }}>In {sign[0]} by the old 12 signs — but sitting in <b>{constel}</b>, one of the 13 constellations the Sun truly crosses.</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"flex-start", gap:"0.6rem", padding:"0.5rem 0 0.2rem" }}>
          <span style={{ fontSize:"1.1rem", width:22, textAlign:"center" }}>{GREAT_AGE.glyph}</span>
          <div style={{ flex:1 }}>
            <span style={{ fontFamily:DISPLAY, fontSize:"0.82rem", fontWeight:700, color:T.text }}>The Great Age</span>
            <div style={{ fontFamily:SANS, fontSize:"0.7rem", color:T.textMid }}>{GREAT_AGE.text}</div>
          </div>
        </div>
      </CardShell>

      {/* Tonight hero — always a night sky */}
      <div style={{ borderRadius:"22px", padding:"1.6px", background:`linear-gradient(140deg, #f0c541, #6ab8f0)`, boxShadow:T.shadow, marginBottom:"1rem" }}>
        <div style={{ position:"relative", borderRadius:"20.5px", overflow:"hidden", background:"linear-gradient(165deg,#0b1836 0%,#132a52 55%,#1b1c3a 100%)", padding:"1.5rem 1.3rem 1.4rem" }}>
          <div style={{ position:"absolute", inset:0, background:CELESTIAL, mixBlendMode:"screen", pointerEvents:"none" }} />
          <button onClick={shareTonight} aria-label="Share tonight" style={{ position:"absolute", top:"1rem", right:"1rem", zIndex:2, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:"0.85rem" }}>↗</button>
          <div style={{ position:"relative" }}>
            <div style={{ fontFamily:DISPLAY, fontSize:"0.58rem", fontWeight:600, letterSpacing:"0.18em", color:"rgba(220,230,250,0.7)", marginBottom:"0.6rem" }}>TONIGHT'S SKY</div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.9rem" }}>
              <div style={{ fontSize:"3.2rem", lineHeight:1, filter:"drop-shadow(0 0 12px rgba(255,240,200,0.5))", animation:"symbolFloat 5s ease-in-out infinite" }}>{phase.emoji}</div>
              <div>
                <div style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:700, color:"#fff", lineHeight:1.1 }}>{phase.name}</div>
                <div style={{ fontFamily:SANS, fontSize:"0.74rem", color:"rgba(200,215,245,0.85)", marginTop:"0.1rem" }}>{phase.illum}% lit</div>
              </div>
            </div>
            <div style={{ fontFamily:SANS, fontSize:"0.9rem", lineHeight:1.55, color:"rgba(226,236,252,0.95)", marginTop:"0.9rem" }}>{phase.invite}</div>

            {/* Sun / darkness times */}
            {times && times.sunset && (
              <div style={{ display:"flex", gap:"1.4rem", marginTop:"0.95rem", paddingTop:"0.8rem", borderTop:"1px solid rgba(255,255,255,0.12)" }}>
                <div>
                  <div style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.06em", color:"rgba(190,206,238,0.65)" }}>SUN SETS</div>
                  <div style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:700, color:"#fff" }}>🌇 {hhmm(times.sunset)}</div>
                </div>
                {times.dark && (
                  <div>
                    <div style={{ fontFamily:SANS, fontSize:"0.58rem", letterSpacing:"0.06em", color:"rgba(190,206,238,0.65)" }}>STARS OUT</div>
                    <div style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:700, color:"#fff" }}>✨ {hhmm(times.dark)}</div>
                  </div>
                )}
              </div>
            )}
            {locState==="asking" && <div style={{ fontFamily:SANS, fontSize:"0.66rem", color:"rgba(190,206,238,0.6)", marginTop:"0.9rem" }}>Finding your sky times…</div>}
            {locState==="denied" && (
              <button onClick={askLocation} style={{ marginTop:"0.9rem", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", fontFamily:SANS, fontSize:"0.66rem", padding:"0.35rem 0.8rem", borderRadius:"2rem", cursor:"pointer" }}>Enable location for exact sunset &amp; dark-sky times</button>
            )}
          </div>
        </div>
      </div>

      {/* Meteor watch */}
      {shower && (
        <CardShell grad={`linear-gradient(140deg, #6ab8f0, #a071c4)`}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.9rem" }}>
            <div style={{ fontSize:"2rem" }}>☄️</div>
            <div style={{ flex:1 }}>
              <Label>METEOR WATCH</Label>
              <div style={{ fontFamily:DISPLAY, fontSize:"1.02rem", fontWeight:700, color:T.text }}>{shower.name}
                <span style={{ fontFamily:SANS, fontSize:"0.66rem", fontWeight:600, color:T.textSoft, marginLeft:"0.5rem" }}>
                  {shower.daysToPeak>1 ? `peak in ${shower.daysToPeak} nights` : shower.daysToPeak===1 ? "peaks tomorrow" : shower.daysToPeak===0 ? "peaks tonight" : "just past peak"}
                </span>
              </div>
            </div>
          </div>
          <div style={{ fontFamily:SANS, fontSize:"0.84rem", lineHeight:1.55, color:T.textMid, marginTop:"0.5rem" }}>
            Up to about {shower.zhr} meteors an hour at its peak under a dark sky, best {shower.best}. Find a spot away from the lights, let your eyes adjust for ten minutes, and just watch.
          </div>
        </CardShell>
      )}

      {/* Planets tonight */}
      {loc && (
        <CardShell grad={`linear-gradient(140deg, #e0a54a, #6ab8f0)`}>
          <Label>PLANETS TONIGHT</Label>
          {planets.length===0 ? (
            <div style={{ fontFamily:SANS, fontSize:"0.84rem", lineHeight:1.5, color:T.textMid }}>No bright planets are above the horizon tonight — the Moon and the stars have the sky to themselves.</div>
          ) : planets.map(p => (
            <div key={p.name} style={{ display:"flex", alignItems:"center", gap:"0.7rem", padding:"0.4rem 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:"1.3rem", color:p.color, width:24, textAlign:"center", textShadow:"0 0 8px rgba(0,0,0,0.15)" }}>{p.glyph}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"0.86rem", fontWeight:700, color:T.text }}>
                  {p.name}
                  {p.retro && <span style={{ fontFamily:SANS, fontSize:"0.54rem", fontWeight:600, color:"#a071c4", background:"rgba(160,113,196,0.14)", border:"1px solid rgba(160,113,196,0.4)", borderRadius:"2rem", padding:"0.06rem 0.4rem", marginLeft:"0.4rem" }}>retrograde</span>}
                </div>
                <div style={{ fontFamily:SANS, fontSize:"0.7rem", color:T.textMid }}>{p.desc} · {p.where}, {p.when}</div>
              </div>
            </div>
          ))}
        </CardShell>
      )}

      {/* Look-up streak */}
      <CardShell grad={`linear-gradient(140deg, #e0a54a, #f6c33f)`}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.9rem" }}>
          <div style={{ textAlign:"center", minWidth:52 }}>
            <div style={{ fontSize:"1.6rem", lineHeight:1 }}>🔭</div>
            <div style={{ fontFamily:DISPLAY, fontSize:"1.15rem", fontWeight:800, color:T.gold, lineHeight:1.1 }}>{streak}</div>
            <div style={{ fontFamily:SANS, fontSize:"0.52rem", color:T.textSoft, letterSpacing:"0.05em" }}>NIGHT{streak===1?"":"S"}</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:DISPLAY, fontSize:"0.95rem", fontWeight:700, color:T.text, marginBottom:"0.2rem" }}>{loggedToday ? "You looked up tonight ✨" : "Did you look up tonight?"}</div>
            <div style={{ fontFamily:SANS, fontSize:"0.72rem", color:T.textMid, lineHeight:1.45 }}>
              {loggedToday ? "Beautiful. The streak is what matters — not the app, the sky." : "Step outside, find the moon or a star, then tap to keep your streak."}
            </div>
          </div>
          {!loggedToday && (
            <button onClick={logLookup} style={{ flexShrink:0, background:`linear-gradient(135deg,${T.gold},#e08040)`, border:"none", color:"#fff", fontFamily:DISPLAY, fontWeight:700, fontSize:"0.72rem", padding:"0.6rem 0.9rem", borderRadius:"1.5rem", cursor:"pointer", boxShadow:T.shadowSm }}>I looked up</button>
          )}
        </div>
      </CardShell>

      {/* Next big event countdown */}
      {next && (
        <CardShell grad={`linear-gradient(140deg, ${T.sky}, #4a98d4)`}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.9rem" }}>
            <div style={{ fontSize:"2rem" }}>{next.icon}</div>
            <div style={{ flex:1 }}>
              <Label>COMING UP</Label>
              <div style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:700, color:T.text }}>{next.label}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:DISPLAY, fontSize:"1.6rem", fontWeight:800, color:T.sky, lineHeight:1 }}>{next.days}</div>
              <div style={{ fontFamily:SANS, fontSize:"0.55rem", color:T.textSoft, letterSpacing:"0.05em" }}>{next.days===1?"NIGHT":"NIGHTS"}</div>
            </div>
          </div>
        </CardShell>
      )}

      {/* What's stirring */}
      <CardShell grad={`linear-gradient(140deg, #a071c4, #6ab8f0)`}>
        <Label>WHAT'S STIRRING</Label>
        <div style={{ fontFamily:DISPLAY, fontSize:"1.02rem", fontWeight:700, color:T.text, marginBottom:"0.3rem" }}>{stir.title}</div>
        <div style={{ fontFamily:SANS, fontSize:"0.86rem", lineHeight:1.55, color:T.textMid }}>{stir.line}</div>
      </CardShell>

      {/* Sky wisdom */}
      <CardShell grad={`linear-gradient(140deg, ${T.gold}, #e08040)`}>
        <Label>SKY WISDOM</Label>
        <div style={{ fontFamily:"Georgia,serif", fontSize:"1rem", lineHeight:1.6, color:T.text, fontStyle:"italic" }}>“{wisdom}”</div>
      </CardShell>

    </div>
  );
}

// ─── GRID VIEW (all 13 at a glance) ───────────────────────────────────────────
function GridView({ T, calYear, onSelectMoonth, onOpenToday }) {
  const cal     = TODAY_CAL;
  const m       = cal && !cal.isHollow ? MOONTHS[cal.moonthIdx] : null;
  const ourDate = cal && !cal.isHollow
    ? `${String(cal.day).padStart(2,"0")}/${String(cal.moonthIdx+1).padStart(2,"0")}/${String(cal.calYear).padStart(2,"0")}`
    : "Hollow Day";
  const phase   = moonPhase(TODAY_GREG);
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>

      {/* Slim today strip — the date, then straight into the year */}
      <div style={{ borderRadius:"18px", padding:"1.4px", background:`linear-gradient(140deg, ${T.gold}, ${T.sky})`, boxShadow:T.shadowSm, marginBottom:"0.9rem" }}>
        <div style={{ background:T.card, borderRadius:"16.6px", padding:"0.75rem 0.95rem", display:"flex", alignItems:"center", gap:"0.8rem" }}>
          <div style={{ fontFamily:DISPLAY, fontSize:"1.5rem", fontWeight:800, lineHeight:1,
            background:`linear-gradient(120deg, ${T.sky}, ${T.gold})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{ourDate}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:DISPLAY, fontSize:"0.78rem", fontWeight:700, color:T.text, lineHeight:1.15 }}>
              {m ? `Day ${cal.day} · ${m.name}` : "Outside all moonths"}
            </div>
            <div style={{ fontFamily:SANS, fontSize:"0.6rem", color:T.textSoft, marginTop:"0.12rem" }}>
              {TODAY_GREG.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
          <button onClick={onOpenToday} style={{
            display:"flex", alignItems:"center", gap:"0.35rem",
            background:T.goldSoft, border:`1px solid ${T.gold}`, color:T.gold,
            borderRadius:"1.5rem", padding:"0.35rem 0.7rem", cursor:"pointer",
            fontFamily:DISPLAY, fontWeight:700, fontSize:"0.6rem", whiteSpace:"nowrap",
          }}>
            <span style={{ fontSize:"0.85rem" }}>{phase.emoji}</span> Tonight
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:"0.5rem" }}>
        {MOONTHS.map((m,i) => {
          const isCurrent = TODAY_CAL && !TODAY_CAL.isHollow && TODAY_CAL.moonthIdx===i;
          const astros = astrosForMoonth(calYear,i);
          const src = MOONTH_IMAGES[m.slug];
          return (
            <div key={i} className="gtile" onClick={()=>onSelectMoonth(i)} style={{
              cursor:"pointer", borderRadius:"13px", padding:"1.2px",
              background:`linear-gradient(140deg, ${m.accent}, ${m.accent2})`,
              boxShadow: isCurrent ? `0 0 0 2px ${T.gold}, ${T.shadowSm}` : T.shadowSm,
              position:"relative",
            }}>
              <div style={{ position:"relative", borderRadius:"11.8px", overflow:"hidden", aspectRatio:"1 / 1", background:m.grad }}>
                {src
                  ? <img src={src} alt={m.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", opacity:0.9 }}>{m.symbol}</div>}
                <div style={{ position:"absolute", inset:0, background:CELESTIAL, mixBlendMode:"screen" }} />
                <div style={{ position:"absolute", inset:0, background:SCRIM }} />
                {/* event dots */}
                <div style={{ position:"absolute", top:"0.28rem", left:"0.32rem", display:"flex", gap:"0.12rem" }}>
                  {astros.slice(0,4).map((ev,j) => <span key={j} style={{ fontSize:"0.6rem", filter:"drop-shadow(0 1px 1px rgba(0,0,0,0.5))" }}>{ASTRO_ICONS[ev.type]}</span>)}
                </div>
                {/* number + name */}
                <div style={{ position:"absolute", left:"0.4rem", right:"0.35rem", bottom:"0.35rem" }}>
                  <div style={{ fontFamily:DISPLAY, fontSize:"1.15rem", fontWeight:800, color:"#fff", opacity:0.6, lineHeight:0.85, textShadow:"0 2px 6px rgba(0,0,0,0.5)" }}>{String(m.num).padStart(2,"0")}</div>
                  <div style={{ fontFamily:DISPLAY, fontSize:"0.66rem", fontWeight:700, color:"#fff", lineHeight:1.05, textShadow:"0 1px 6px rgba(0,0,0,0.75)" }}>{m.name}</div>
                </div>
              </div>
              {isCurrent && (
                <div style={{ position:"absolute", top:"0.3rem", right:"0.3rem", fontFamily:DISPLAY, fontSize:"0.42rem", fontWeight:700, letterSpacing:"0.1em", background:T.gold, color:"#1a1206", borderRadius:"2rem", padding:"0.12rem 0.4rem", boxShadow:"0 2px 6px rgba(0,0,0,0.35)" }}>NOW</div>
              )}
            </div>
          );
        })}
        {/* Hollow Day tile */}
        <div style={{ borderRadius:"13px", border:`1.2px dashed ${T.border}`, aspectRatio:"1 / 1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.15rem", color:T.textSoft, background:T.surface, boxShadow:T.shadowSm }}>
          <div style={{ fontSize:"1.1rem" }}>✦</div>
          <div style={{ fontFamily:DISPLAY, fontWeight:700, fontSize:"0.6rem", color:T.textMid }}>Hollow Day</div>
          <div style={{ fontSize:"0.46rem", textAlign:"center", lineHeight:1.35, padding:"0 0.3rem" }}>Dec 24</div>
        </div>
      </div>
      <div style={{ textAlign:"center", fontSize:"0.6rem", color:T.textSoft, marginTop:"0.8rem", fontFamily:SANS }}>Tap a moonth to open it</div>
    </div>
  );
}

// ─── CARDS VIEW (Days Out events style — image left, text right, tap for more) ─
function YearView({ T, calYear, onSelectMoonth }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div style={{ maxWidth:640, margin:"0 auto", animation:"fadeUp 0.4s ease" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem", marginBottom:"1rem" }}>
        {MOONTHS.map((m,i) => {
          const isCurrent = TODAY_CAL && !TODAY_CAL.isHollow && TODAY_CAL.moonthIdx===i;
          const s   = calendarToGregorian(calYear,i,1);
          const e   = calendarToGregorian(calYear,i,28);
          const dr  = `${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`;
          const special = moonthSpecial(i);
          const src = MOONTH_IMAGES[m.slug];
          return (
            <div key={i} className="mcard" onClick={()=>setOpenIdx(i)} style={{
              cursor:"pointer", borderRadius:"18px", padding:"1.5px",
              background:`linear-gradient(140deg, ${m.accent}, ${m.accent2})`,
              boxShadow: isCurrent ? `0 0 0 2px ${T.gold}, ${T.shadow}` : T.shadowSm,
              position:"relative",
            }}>
              <div style={{ display:"flex", background:T.card, borderRadius:"16.5px", overflow:"hidden", minHeight:118 }}>
                {/* image left */}
                <div style={{ position:"relative", width:118, flexShrink:0, background:m.grad }}>
                  {src
                    ? <img src={src} alt={m.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
                    : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem" }}>{m.symbol}</div>}
                  <div style={{ position:"absolute", inset:0, background:CELESTIAL, mixBlendMode:"screen" }} />
                  <div style={{ position:"absolute", top:"0.4rem", left:"0.45rem", fontFamily:DISPLAY, fontSize:"1.1rem", fontWeight:800, color:"#fff", opacity:0.85, textShadow:"0 2px 6px rgba(0,0,0,0.6)" }}>{String(m.num).padStart(2,"0")}</div>
                </div>
                {/* text right */}
                <div style={{ flex:1, minWidth:0, padding:"0.7rem 0.85rem", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                  <div style={{ fontFamily:DISPLAY, fontSize:"1.05rem", fontWeight:700, color:T.text, lineHeight:1.1 }}>{m.name}</div>
                  <div style={{ fontFamily:SANS, fontSize:"0.6rem", fontWeight:600, color:T.textSoft, letterSpacing:"0.02em", margin:"0.15rem 0 0.35rem" }}>{dr}</div>
                  <div style={{ fontFamily:SANS, fontSize:"0.74rem", color:T.textMid, lineHeight:1.45, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{m.desc}.</div>
                  {special && (
                    <div style={{ display:"inline-flex", alignSelf:"flex-start", alignItems:"center", gap:"0.25rem", marginTop:"0.4rem", background:T.goldSoft, border:`1px solid ${T.gold}`, borderRadius:"2rem", padding:"0.14rem 0.5rem" }}>
                      <span style={{ fontSize:"0.7rem" }}>✦</span>
                      <span style={{ fontFamily:DISPLAY, fontSize:"0.54rem", fontWeight:600, color:T.gold, letterSpacing:"0.02em" }}>{special}</span>
                    </div>
                  )}
                </div>
              </div>
              {isCurrent && (
                <div style={{ position:"absolute", top:"0.55rem", right:"0.55rem", fontFamily:DISPLAY, fontSize:"0.48rem", letterSpacing:"0.12em", fontWeight:700, background:T.gold, color:"#1a1206", borderRadius:"2rem", padding:"0.16rem 0.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>NOW</div>
              )}
            </div>
          );
        })}
      </div>

      {openIdx!==null && (
        <MoonthModal T={T} i={openIdx} calYear={calYear} onClose={()=>setOpenIdx(null)}
          onOpenMoonth={(idx)=>{ setOpenIdx(null); onSelectMoonth(idx); }} />
      )}
    </div>
  );
}

// ─── Modal shell (shared) ─────────────────────────────────────────────────────
function Modal({ T, onClose, children, maxWidth=460 }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:60, background:"rgba(6,10,20,0.55)",
      backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem",
      animation:"fadeUp 0.2s ease",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        position:"relative", width:"100%", maxWidth, maxHeight:"86vh", overflowY:"auto",
        borderRadius:"22px", background:T.card, boxShadow:T.shadow,
        border:`1px solid ${T.border}`,
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position:"absolute", top:"0.7rem", right:"0.7rem", zIndex:2,
          width:34, height:34, borderRadius:"50%", cursor:"pointer",
          background:"rgba(0,0,0,0.4)", color:"#fff", border:"1px solid rgba(255,255,255,0.25)",
          fontSize:"1rem", lineHeight:1, backdropFilter:"blur(4px)",
        }}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ─── MOONTH POP-UP CARD ───────────────────────────────────────────────────────
function MoonthModal({ T, i, calYear, onClose, onOpenMoonth }) {
  const m = MOONTHS[i];
  const s = calendarToGregorian(calYear,i,1);
  const e = calendarToGregorian(calYear,i,28);
  const dr = `${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}`;
  const astros = astrosForMoonth(calYear,i);
  const moonIcons = astros.filter(ev=>!SOLAR_EVENTS[ev.type]).map(ev=>ASTRO_ICONS[ev.type]);
  const special = moonthSpecial(i);
  const about = ABOUT[m.slug] || m.desc;
  const merged = [
    ...astros.map(ev => ({ icon:ASTRO_ICONS[ev.type], label:ev.label, date:ev.date, color:T.textSoft })),
    ...skyEventsForMoonth(i).map(e => ({ icon:SKY_META[e.type].icon, label:e.title, date:skyEventDate(e), color:SKY_META[e.type].color, big:true })),
  ].sort((a,b) => a.date - b.date);

  return (
    <Modal T={T} onClose={onClose}>
      <div style={{ borderRadius:"22px 22px 0 0", overflow:"hidden" }}>
        <Hero m={m} moonIcons={moonIcons} tall={true} />
      </div>
      <div style={{ padding:"1.1rem 1.3rem 1.4rem" }}>
        <div style={{ fontFamily:SANS, fontSize:"0.64rem", fontWeight:600, color:T.textSoft, letterSpacing:"0.03em" }}>MOONTH {m.num} · {dr}</div>
        {special && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", marginTop:"0.6rem", background:T.goldSoft, border:`1px solid ${T.gold}`, borderRadius:"2rem", padding:"0.2rem 0.6rem" }}>
            <span style={{ fontSize:"0.8rem" }}>✦</span>
            <span style={{ fontFamily:DISPLAY, fontSize:"0.6rem", fontWeight:600, color:T.gold }}>{special}</span>
          </div>
        )}
        <p style={{ fontFamily:SANS, fontSize:"0.92rem", lineHeight:1.6, color:T.text, marginTop:"0.9rem", marginBottom:0 }}>{about}</p>

        {merged.length>0 && (
          <div style={{ marginTop:"1.1rem", borderTop:`1px solid ${T.border}`, paddingTop:"0.9rem" }}>
            <div style={{ fontFamily:DISPLAY, fontSize:"0.58rem", fontWeight:600, letterSpacing:"0.14em", color:T.textSoft, marginBottom:"0.6rem" }}>SKY THIS MOONTH</div>
            {merged.map((ev,j) => (
              <div key={j} style={{ display:"flex", alignItems:"center", gap:"0.6rem", padding:"0.35rem 0" }}>
                <span style={{ fontSize:"1.1rem", width:22, textAlign:"center" }}>{ev.icon}</span>
                <span style={{ fontFamily:SANS, fontSize:"0.78rem", fontWeight: ev.big?700:400, color: ev.big?ev.color:T.text }}>{ev.label}</span>
                <span style={{ fontFamily:SANS, fontSize:"0.64rem", color:T.textSoft, marginLeft:"auto" }}>{ev.date.toLocaleDateString("en-GB",{day:"numeric",month:"long"})}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={()=>onOpenMoonth(i)} style={{
          marginTop:"1.2rem", width:"100%", padding:"0.72rem", borderRadius:"2rem", cursor:"pointer",
          background:`linear-gradient(135deg,${m.accent},${m.accent2})`, border:"none", color:"#fff",
          fontFamily:DISPLAY, fontWeight:600, fontSize:"0.8rem", letterSpacing:"0.02em", boxShadow:T.shadowSm,
        }}>Open the full moonth →</button>
      </div>
    </Modal>
  );
}

// ─── MOONTH VIEW ──────────────────────────────────────────────────────────────
function MoonthView({ T, calYear, moonthIdx, onPrev, onNext, onBack }) {
  const m = MOONTHS[moonthIdx];
  const [dayModal, setDayModal] = useState(null);

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
            <div key={dayNum} className="gtile" onClick={()=>setDayModal({dayNum,greg,astro,weekDay,isToday})} style={{
              cursor:"pointer",
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

      {dayModal && (
        <DayModal T={T} m={m} day={dayModal} onClose={()=>setDayModal(null)} />
      )}
    </div>
  );
}

// ─── DAY POP-UP ───────────────────────────────────────────────────────────────
function DayModal({ T, m, day, onClose }) {
  const { dayNum, greg, astro, weekDay, isToday } = day;
  const phase = moonPhase(greg);
  const cal   = gregorianToCalendar(greg);
  const sky   = skyEventsOn(greg);
  return (
    <Modal T={T} onClose={onClose} maxWidth={380}>
      <div style={{ padding:"1.6rem 1.4rem 1.5rem", textAlign:"center" }}>
        <div style={{ fontFamily:DISPLAY, fontSize:"0.6rem", fontWeight:600, letterSpacing:"0.14em", color:m.accent, marginBottom:"0.5rem" }}>{DAYS_FULL[weekDay]?.toUpperCase()}</div>
        <div style={{ fontFamily:DISPLAY, fontSize:"2.6rem", fontWeight:800, color:T.text, lineHeight:1 }}>Day {dayNum}</div>
        <div style={{ fontFamily:SANS, fontSize:"0.82rem", color:T.textMid, marginTop:"0.4rem" }}>{m.name} · Year {cal?.calYear ?? 1}</div>
        <div style={{ fontFamily:SANS, fontSize:"0.72rem", color:T.textSoft, marginTop:"0.15rem" }}>{greg.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
        {isToday && <div style={{ display:"inline-block", marginTop:"0.7rem", fontFamily:DISPLAY, fontSize:"0.55rem", fontWeight:700, letterSpacing:"0.12em", background:T.gold, color:"#1a1206", borderRadius:"2rem", padding:"0.18rem 0.7rem" }}>TODAY</div>}

        {/* moon phase for the night */}
        <div style={{ marginTop:"1.2rem", borderTop:`1px solid ${T.border}`, paddingTop:"1rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.7rem" }}>
          <span style={{ fontSize:"2rem", filter:"drop-shadow(0 0 8px rgba(255,240,200,0.4))" }}>{phase.emoji}</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:DISPLAY, fontSize:"0.9rem", fontWeight:700, color:T.text }}>{phase.name}</div>
            <div style={{ fontFamily:SANS, fontSize:"0.68rem", color:T.textSoft }}>{phase.illum}% lit</div>
          </div>
        </div>

        {(astro.length>0 || sky.length>0) && (
          <div style={{ marginTop:"1rem", display:"flex", flexWrap:"wrap", gap:"0.4rem", justifyContent:"center" }}>
            {astro.map((ev,i) => (
              <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:T.goldSoft, border:`1px solid ${T.gold}`, borderRadius:"2rem", padding:"0.2rem 0.65rem" }}>
                <span style={{ fontSize:"0.85rem" }}>{ASTRO_ICONS[ev.type]}</span>
                <span style={{ fontFamily:DISPLAY, fontSize:"0.6rem", fontWeight:600, color:T.gold }}>{ev.label}</span>
              </span>
            ))}
            {sky.map((ev,i) => (
              <span key={`s${i}`} style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", background:"rgba(224,113,74,0.12)", border:`1px solid ${SKY_META[ev.type].color}`, borderRadius:"2rem", padding:"0.2rem 0.65rem" }}>
                <span style={{ fontSize:"0.85rem" }}>{SKY_META[ev.type].icon}</span>
                <span style={{ fontFamily:DISPLAY, fontSize:"0.6rem", fontWeight:600, color:SKY_META[ev.type].color }}>{ev.title}</span>
              </span>
            ))}
          </div>
        )}
        {sky.length>0 && (
          <div style={{ marginTop:"0.8rem", fontFamily:SANS, fontSize:"0.72rem", lineHeight:1.5, color:T.textMid, textAlign:"left" }}>{sky[0].note}</div>
        )}
      </div>
    </Modal>
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
