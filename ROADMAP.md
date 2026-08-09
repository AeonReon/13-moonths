# 13 Moonths — Daily-Driver Roadmap

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

Still to add (honest data required — don't fabricate; fetch/verify first): **Mercury
retrograde, eclipses, meteor-shower peaks** as verified date tables, and **tonight's visible
planets** (needs a real ephemeris — skipped rather than faked). Also possible: accurate
**moonrise/set** times (harder than sunset; needs a lunar position routine).

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
