# Nürburgring Nordschleife — Interactive Map

A self-contained, browser-based interactive map of the Nürburgring Nordschleife
("the Green Hell"): accurate OSM-derived circuit geography, a corner-by-corner
guide to all 41 named sections, a real terrain elevation profile, lap records,
history — every factual claim cited to its source.

## Run it

No build step, no external services required:

```bash
python3 -m http.server 8080     # or any static file server
# open http://localhost:8080/
```

Everything (Leaflet, map data, elevation, content) is vendored/embedded, so the
app works fully offline. An optional OpenStreetMap tile layer can be enabled in
the Layers menu when online (it auto-reverts to the built-in basemap if tiles
can't load).

## Features

- **Explore** — the full 20.8 km lap rendered from OpenStreetMap centerline
  data, with numbered markers for all 41 named sections in track order. Click a
  corner (on the map, in the list, or on the elevation profile) for its story:
  corner type, driving character, name origin, famous incidents, terrain stats,
  and source links.
- **Elevation profile** — sampled every 10 m from Terrarium terrain tiles
  (EU-DEM); hover to scrub a synced position dot along the map; click to jump to
  the section at that point.
- **Drive a lap** — an animated tour that follows a marker around the circuit,
  updating the current section card, position, elevation and speed as it goes
  (adjustable speed, pause/resume; keyboard: `T` to start, `Space` to pause,
  `Esc` to exit, `←`/`→` to step through corners).
- **Records** — outright, production-car, EV, SUV, FWD, manual, motorcycle and
  race-condition lap records as of mid-2026, each with driver, vehicle, date,
  notes and source links.
- **History** — timeline from the 1925 construction decision to the 2026
  Nürburgring 24 Hours.
- **Layers** — village labels, GP circuit context, the disused 1927
  Steilstrecke (27 % concrete test ramp), km marks, optional OSM imagery.

## Data & methodology

| What | Source |
|---|---|
| Track & basemap geometry | © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL), via the [Protomaps](https://protomaps.com) daily planet build (v4 PMTiles, [Source Cooperative](https://source.coop) mirror), extracted at z15 |
| Section names/boundaries | Named `raceway` segments as mapped in OSM |
| Elevation | [Terrarium terrain tiles](https://registry.opendata.aws/terrain-tiles/) (AWS Open Data; EU-DEM-derived, ~25 m source resolution), bilinear-sampled every 10 m and lightly smoothed |
| Facts, records, history | Cited per-item in the app; full research notes with source URLs in [`research/`](research/) |

Notes on precision: the computed centerline length is 20.711 km against the
official 20.832 km lap (centerline vs. measured racing distance). Elevation
values are terrain samples, not trackside surveys — documented figures
(320 m at Breidscheid, ~617 m at Hohe Acht) come from the cited sources.
Kilometre positions are measured from the start of the T13 section and differ
from the historic trackside km posts by roughly 2 km.

## Testing

End-to-end validation drives the app in headless Chromium (Playwright):
load, data sanity, all 41 corner cards, search, keyboard navigation, elevation
hover/click, all tabs, layer toggles, the lap tour, zooming, a mobile
viewport, and a console-error check.

```bash
python3 -m http.server 8199 &
node test/e2e.mjs
```

## Repository layout

```
index.html            app shell
css/style.css         theme & layout
js/app.js             map, interactions, tour, elevation chart
js/data.js            curated, cited content (corners, records, history)
js/track.js           generated: ring geometry, sections, elevation, places
js/basemap.js         generated: surrounding landcover/roads/water
vendor/               Leaflet 1.9.4 (vendored)
research/             research notes with all source URLs
test/e2e.mjs          Playwright end-to-end suite
```
