# The Sky Clock — Daily-Driver Roadmap

> **Renamed "The Sky Clock" (2026-08-09)** — the framing is "read the time from the sky";
> the 13×28 calendar is the clock's face. Folder/repo stay `13-moonths`. Front page ("Now"
> tab) leads with today's date in OUR calendar big + bold (DD/MM/YY = day/moonth/year, e.g.
> 04/09/01), the Gregorian date small beneath as the conversion reference, then a "Where we
> are in the sky" card: the **season** (named quarters — Kindling/Greening/Ripening/Resting,
> solstice→equinox), the **Sun's sign vs its real constellation** (computed — 12 tropical
> signs vs the 13 the Sun actually crosses incl. Ophiuchus; today Leo-by-sign / Cancer-by-sky),
> and the **Great Age** (Pisces→Aquarius, stated as belief).


The goal: turn the calendar from a reference chart into an app you *want to open every
day*. Same feeling as the Conscious Parenting app — beautiful, calm, a small daily draw.
It's a learning curve to live by a new calendar (that's the point of the rhyming names —
they train the memory), so the app's job is to make the rhythm feel natural and rewarding.

## Style (getting this right first makes everything else easier)
- **Fonts:** Poppins (display) + Inter (body) — same as Days Out. ✅ done
- **Photo-led cards** with per-moonth gradient outline + celestial overlay (grounded but
  magical). ✅ card + grid built; **13/13 real images in** (first-page-of-Google pass —
  "close is fine"). Rule learned: images must be **literal + cinematic** — recognisable
  with the text hidden (wolf, golden gateway, whole tree, open door, beehive, dove), sourced
  with "cinematic/wallpaper/4k" queries for hero quality. Still to refine later: Morning Dew
  (faint pngtree watermark) and Pixie Tricks (illustration, but on-theme).
- **Light + dark mode**, persisted. ✅ done
- **Grid view** — all 13 at a glance. ✅ done (default landing)
- **Bottom tab bar** (Calendar / Cards / Convert) replacing the old dumped legend. ✅ done
- Next: the daily-driver content layers below.

## Today / Tonight home screen — SHIPPED v1 (2026-08-09, default landing)
The mission: the win is getting someone to step outside and look up tonight — not app
engagement. Three cards built:
- **Tonight's sky** (hero, always a night gradient): computed moon phase + % lit + a
  phase-based invitation (when/where to look). Moon math = synodic cycle from a known new
  moon; accurate to ~a day. Plus a "coming up: X in N nights" line.
- **What's stirring** (intrigue): full/new moon → solstice/equinox → fixed-date traditions
  (Imbolc/Beltane/Lughnasadh/Lion's Gate 8-8/Samhain), framed "notice for yourself".
- **Sky wisdom**: 24 rotating lines (Vitruvius, ancestors, navigators, farmers), attributed
  or reflective, never metaphysics-as-fact.
v2 (2026-08-09) added: **location-aware sun times** (real sunset + "stars out"/nautical dusk
via the standard sunrise/sunset algorithm, validated vs Belfast; geolocation with graceful
fallback), the **"I looked up tonight" streak** (localStorage, consecutive-night counter),
a **next-event countdown card**, and a **share button**.

v3 (2026-08-09) added the real sky-watcher layer, all computed (not faked), validated in Node
(Sun cross-check exact; Saturn/Jupiter retrogrades match reality):
- **Planets tonight** — Schlyter ephemeris (Mercury→Saturn); scans sunset→sunrise, reports each
  naked-eye planet above the horizon with its best altitude, compass direction, time of night,
  and a computed **retrograde** flag (from day-over-day ecliptic longitude).
- **Meteor watch** — the 9 established annual showers with active windows + peaks + ZHR; shows
  the active one, nights-to-peak, and best viewing time. (Perseids live now.)

v4 (2026-08-12) added the **major sky-events layer** — verified from seasky.org / timeanddate /
RMG Greenwich (web-researched, not memory): the whole 2026 calendar of **eclipses** (incl. the
Aug 12 partial over Ireland, ~96%, with a look-at-the-Sun safety note), **supermoons**, a **blue
moon**, planetary **oppositions** (Jupiter/Saturn/Uranus/Neptune), **conjunctions** (Venus–Jupiter,
Mars–Jupiter), and **Venus's evening-star peak**. Wired in as: a loud **headline banner** at the
top of the Now page when one is today, priority-ranked; the **countdown** now shows the next
*notable* event (not routine moons); events appear in the **day pop-up**, **moonth pop-up**, and as
the **moonth "significant" chip**. Lesson: for a sky app, **web-research the real event calendar** —
the user rightly expected the eclipse to be caught. (Table currently 2026-only; refresh yearly or
compute.)

Still to add: roll the event table forward past 2026 (or compute eclipses/oppositions), accurate
**moonrise/set** (lunar rise/set routine), **ISS passes** (needs live TLE — likely skip offline),
and **aurora/geomagnetic** alerts for Ireland (needs a live feed). Planet magnitudes stay
qualitative (avoids fake precision).

## The daily-driver layers (build after style lands, one at a time)

1. **Sky awareness / get-outside** — each day shows what's happening in the sky tonight and
   a gentle nudge to go look. The app's real job: make people aware there's more going on
   above them.

2. **Big sky events** — eclipses, meteor showers, supermoons, blue moons, cross-quarter
   days (Imbolc/Beltane/Lughnasadh/Samhain), portal days (8/8 Lion's Gate). Marked clearly.

3. **Spiritual wisdom / quote of the day** — a rotating daily line (like Conscious
   Parenting's daily card). Sky energy, observations, perspective. Not stated as fact —
   "a tradition believes…", multiple perspectives on what the stars may mean and why sky
   events might affect people (e.g. why intensity/aggression is felt around a full moon).

4. **Protocols — fasting tied to the sky** (the lifestyle spine). Different events call for
   different practices, at graded intensity so newcomers aren't scared off:
   - **New moon** — a small ritual / intention / set-something-in-motion.
   - **Full moon** — a fast (release).
   - **Equinox** — deeper reset, up to a 3-day fast.
   - **Fasting levels** (let the user pick their depth):
     - Eating-window fast — narrow to a ~4-hour eating window.
     - Minimal-eating fast — very light food only.
     - Liquid fast — bone broth / liquids only.
     - (Full fast for the experienced.)
   - Framing: body repair + recharge; meet people where they are; never intense-by-default.

## Content rules (from workspace memory)
- Joyful, no-victim, grateful voice.
- Never assert contested/unknown things as fact — attribute or give multiple views.
- Concrete, literal language; no abstract English idioms.
- Local/real imagery where people appear.

## Open questions to settle with the user
- Do protocols live per-event (on the moon/equinox day) or as a always-visible "today" panel?
- Where does the quote-of-the-day sit — Grid header, a "Today" tab, or the moonth view?
- Source for the wisdom lines — curated file vs generated.
